import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { HeaderService } from 'src/app/common/service/header.service';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { Purchase } from 'src/app/models/purchase';
import { PurchaseService } from 'src/app/services/purchase.service';

@Component({
	selector: 'app-purchase',
	templateUrl: './purchase.component.html',
	styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('deleteModal', { read: TemplateRef }) deleteModal: TemplateRef<any>;
	lstPurchase: Purchase[] = [];
	lstAllPurchase: Purchase[] = [];
	objPurchase: Purchase = new Purchase();
	totalCount: number = 0;
	modalRef?: BsModalRef;

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private messageHelper: MessageHelper,
		private modalService: BsModalService,
		private purchaseService: PurchaseService
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		Promise.resolve().then(() => this.headerService.setTitle(headerTitle!.toString()));
	}

	ngOnInit() {
		this.getAllPurchase();
	}

	getAllPurchase() {
		this.purchaseService.getAllPurchase()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstPurchase = response.ResponseObj;
					this.lstAllPurchase = JSON.parse(JSON.stringify(this.lstPurchase));
					this.totalCount = response.TotalCount
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})

	}

	searchPurchase(searchText: string) {
		var str = searchText!.replace(/\s/g, '').toLowerCase();		// remove spaces

		if (str == '') {
			this.lstPurchase = JSON.parse(JSON.stringify(this.lstAllPurchase));
		} else {
			this.lstPurchase = this.lstAllPurchase.filter(x => x.PurchaseCode.replace(/\s/g, '').toLowerCase().includes(str));
		}
		this.totalCount = this.lstPurchase.length;
	}

	deletePurchase(purchase: Purchase) {
		this.objPurchase = new Purchase();
		this.objPurchase = JSON.parse(JSON.stringify(purchase));

		this.modalRef = this.modalService.show(this.deleteModal);
	}

	confirmDelete() {
		if (this.objPurchase.PurchaseCode != '') {

			this.purchaseService.deletePurchase(this.objPurchase)
				.pipe(takeUntil(this.destroy))
				.subscribe((response: ResponseMessage) => {
					if (response.ResponseCode == ResponseStatus.success) {
						var index = this.lstPurchase.findIndex(x => x.PurchaseCode == this.objPurchase.PurchaseCode);
						if (index > -1) {
							this.lstPurchase.splice(index, 1);
							this.lstAllPurchase.splice(index, 1);
							this.objPurchase = new Purchase();
							this.modalRef?.hide()
						}
					}
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				})
		}
	}

	addPurchase() {
		this.router.navigate(['purchase/add']);
	}

	editPurchase(purchaseCode: string) {
		this.router.navigate(['purchase/edit', purchaseCode])
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
