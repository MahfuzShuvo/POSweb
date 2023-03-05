import { CustomerFormComponent } from '../../components/forms/customer-form/customer-form.component';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { CustomerService } from './../../services/customer.service';
import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';
import { HeaderService } from 'src/app/common/service/header.service';
import { Customer } from 'src/app/models/customer';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { ResponseStatus } from 'src/app/common/enums/appEnums';

@Component({
	selector: 'app-customers',
	templateUrl: './customers.component.html',
	styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('customerForm', { read: ViewContainerRef }) customerForm: ViewContainerRef;
	@ViewChild('deleteModal', { read: TemplateRef }) deleteModal: TemplateRef<any>;
	lstCustomer: Customer[] = [];
	objCustomer: Customer = new Customer();
	totalCount: number = 0;
	modalRef?: BsModalRef;
	lstAllCustomer: Customer[] = [];

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private modalService: BsModalService,
		private customerService: CustomerService,
		private messageHelper: MessageHelper
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		Promise.resolve().then(() => this.headerService.setTitle(headerTitle!.toString()));
	}

	ngOnInit() {
		this.getAllCustomer();
	}

	createCustomer(data: any) {
		// Clear the container
		this.customerForm.clear();
		// Create component.
		const customerRef = this.customerForm.createComponent(CustomerFormComponent);
		if (data!.CustomerID > 0) {
			customerRef.instance.headerText = 'Edit Customer';
			customerRef.instance.buttonText = 'Update';
			customerRef.instance.objCustomer = JSON.parse(JSON.stringify(data));
		} else {
			customerRef.instance.headerText = 'Add Customer';
			customerRef.instance.buttonText = 'Save';
		}
		// destroy component
		let isShowInstance = customerRef.instance.isShow;
		if (isShowInstance) {
			isShowInstance.emit(true);
			isShowInstance.subscribe((isShow: boolean) => {
				if (!isShow) {
					customerRef.destroy();
					this.customerForm.clear();
				}
			});
		}

		customerRef.instance.newCustomer.subscribe((data: Customer) => {
			var index = this.lstCustomer.findIndex(x => x.CustomerID == data.CustomerID);
			if (index > -1) {
				this.lstCustomer.splice(index, 1, data);
				this.lstAllCustomer.splice(index, 1, data);
			} else {
				this.lstCustomer.push(data)
				this.lstAllCustomer.push(data)
			}
		})
	}

	getAllCustomer() {
		this.customerService.getAllCustomer()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstCustomer = response.ResponseObj;
					this.lstAllCustomer = JSON.parse(JSON.stringify(this.lstCustomer));
					this.totalCount = response.TotalCount
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})
	}

	searchCustomer(searchText: string) {
		var str = searchText!.replace(/\s/g, '').toLowerCase();		// remove spaces

		if (str == '') {
			this.lstCustomer = JSON.parse(JSON.stringify(this.lstAllCustomer));
		} else {
			this.lstCustomer = this.lstAllCustomer.filter(x =>
				x.CustomerName.replace(/\s/g, '').toLowerCase().includes(str)
				|| x.PhoneNumber.replace(/\s/g, '').toLowerCase().includes(str)
				|| x.Email.replace(/\s/g, '').toLowerCase().includes(str)
			);
		}
		this.totalCount = this.lstCustomer.length;
	}

	deleteCustomer(customer: Customer) {
		this.objCustomer = new Customer();
		this.objCustomer = JSON.parse(JSON.stringify(customer));

		this.modalRef = this.modalService.show(this.deleteModal);
	}

	confirmDelete() {
		if (this.objCustomer.CustomerID > 0) {
			this.customerService.deleteCustomer(this.objCustomer.CustomerID)
				.pipe(takeUntil(this.destroy))
				.subscribe((response: ResponseMessage) => {
					if (response.ResponseCode == ResponseStatus.success) {
						var index = this.lstCustomer.findIndex(x => x.CustomerID == this.objCustomer.CustomerID);
						if (index > -1) {
							this.lstCustomer.splice(index, 1);
							this.lstAllCustomer.splice(index, 1);
							this.objCustomer = new Customer();
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
