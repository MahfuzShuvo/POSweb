import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { HeaderService } from 'src/app/common/service/header.service';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { VMSales } from 'src/app/models/VM/vmSales';
import { SalesService } from 'src/app/services/sales.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('deleteModal', { read: TemplateRef }) deleteModal: TemplateRef<any>;
	lstSales: VMSales[] = [];
	lstAllSales: VMSales[] = [];
	objSales: VMSales = new VMSales();
	totalCount: number = 0;
	modalRef?: BsModalRef;

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private messageHelper: MessageHelper,
		private modalService: BsModalService,
		private salesService: SalesService
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		Promise.resolve().then(() => this.headerService.setTitle(headerTitle!.toString()));
	}

	ngOnInit() {
		this.getAllSales();
	}

	getAllSales() {
		this.salesService.getAllSales()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstSales = response.ResponseObj;
					this.lstAllSales = JSON.parse(JSON.stringify(this.lstSales));
					this.totalCount = response.TotalCount
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})

	}

	searchSales(searchText: string) {
		var str = searchText!.replace(/\s/g, '').toLowerCase();		// remove spaces

		if (str == '') {
			this.lstSales = JSON.parse(JSON.stringify(this.lstAllSales));
		} else {
			this.lstSales = this.lstAllSales.filter(x => x.SalesCode.replace(/\s/g, '').toLowerCase().includes(str));
		}
		this.totalCount = this.lstSales.length;
	}

	deleteSales(sales: VMSales) {
		this.objSales = new VMSales();
		this.objSales = JSON.parse(JSON.stringify(sales));

		this.modalRef = this.modalService.show(this.deleteModal);
	}

	confirmDelete() {
		if (this.objSales.SalesCode != '') {

			this.salesService.deleteSales(this.objSales)
				.pipe(takeUntil(this.destroy))
				.subscribe((response: ResponseMessage) => {
					if (response.ResponseCode == ResponseStatus.success) {
						var index = this.lstSales.findIndex(x => x.SalesCode == this.objSales.SalesCode);
						if (index > -1) {
							this.lstSales.splice(index, 1);
							this.lstAllSales.splice(index, 1);
							this.objSales = new VMSales();
							this.modalRef?.hide()
						}
					}
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				})
		}
	}

	addSales() {
		this.router.navigate(['pos']);
	}

	editSales(salesCode: string) {
		this.router.navigate(['pos/edit', salesCode])
	}

	viewSales(salesCode: string) {
		this.router.navigate(['sales/view', salesCode])
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}

}
