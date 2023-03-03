import { SupplierService } from './../../services/supplier.service';
import { SupplierFormComponent } from 'src/app/components/supplier-form/supplier-form.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Supplier } from './../../models/supplier';
import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from 'src/app/common/service/header.service';
import { Subject, takeUntil } from 'rxjs';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';

@Component({
	selector: 'app-suppliers',
	templateUrl: './suppliers.component.html',
	styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('supplierForm', { read: ViewContainerRef }) supplierForm: ViewContainerRef;
	@ViewChild('deleteModal', { read: TemplateRef }) deleteModal: TemplateRef<any>;
	lstSupplier: Supplier[] = [];
	objSupplier: Supplier = new Supplier();
	totalCount: number = 0;
	modalRef?: BsModalRef;
	lstAllSupplier: Supplier[] = [];

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private modalService: BsModalService,
		private supplierService: SupplierService,
		private messageHelper: MessageHelper,
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		Promise.resolve().then(() => this.headerService.setTitle(headerTitle!.toString()));
	}

	ngOnInit() {
		this.getAllSupplier();
	}

	createSupplier(data: any) {
		// Clear the container
		this.supplierForm.clear();
		// Create component.
		const suppleirRef = this.supplierForm.createComponent(SupplierFormComponent);
		if (data!.SupplierID > 0) {
			suppleirRef.instance.headerText = 'Edit Supplier';
			suppleirRef.instance.buttonText = 'Update';
			suppleirRef.instance.objSupplier = JSON.parse(JSON.stringify(data));
		} else {
			suppleirRef.instance.headerText = 'Add Supplier';
			suppleirRef.instance.buttonText = 'Save';
		}
		// destroy component
		let isShowInstance = suppleirRef.instance.isShow;
		if (isShowInstance) {
			isShowInstance.emit(true);
			isShowInstance.subscribe((isShow: boolean) => {
				if (!isShow) {
					suppleirRef.destroy();
					this.supplierForm.clear();
				}
			});
		}

		suppleirRef.instance.newSupplier.subscribe((data: Supplier) => {
			var index = this.lstSupplier.findIndex(x => x.SupplierID == data.SupplierID);
			if (index > -1) {
				this.lstSupplier.splice(index, 1, data);
				this.lstAllSupplier.splice(index, 1, data);
			} else {
				this.lstSupplier.push(data)
				this.lstAllSupplier.push(data)
			}
		})
	}

	getAllSupplier() {
		this.supplierService.getAllSupplier()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstSupplier = response.ResponseObj;
					this.lstAllSupplier = JSON.parse(JSON.stringify(this.lstSupplier));
					this.totalCount = response.TotalCount
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})
	}

	deleteSupplier(supplier: Supplier) {
		this.objSupplier = new Supplier();
		this.objSupplier = JSON.parse(JSON.stringify(supplier));

		this.modalRef = this.modalService.show(this.deleteModal);
	}

	searchSupplier(searchText: string) {

	}

	confirmDelete() {
		if (this.objSupplier.SupplierID > 0) {
			this.supplierService.deleteSupplier(this.objSupplier.SupplierID)
				.pipe(takeUntil(this.destroy))
				.subscribe((response: ResponseMessage) => {
					if (response.ResponseCode == ResponseStatus.success) {
						var index = this.lstSupplier.findIndex(x => x.SupplierID == this.objSupplier.SupplierID);
						if (index > -1) {
							this.lstSupplier.splice(index, 1);
							this.lstAllSupplier.splice(index, 1);
							this.objSupplier = new Supplier();
							this.modalRef?.hide()
						}
					}
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				})
		}
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
