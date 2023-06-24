import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { DataService } from 'src/app/common/service/data.service';
import { Customer } from 'src/app/models/customer';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
	selector: 'app-customer-form',
	templateUrl: './customer-form.component.html',
	styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@Output() isShow: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() buttonText: string = '';
	@Output() headerText: string = '';
	newCustomer: Subject<Customer> = new Subject<Customer>();
	isPasswordShow: boolean = false;
	@Output() objCustomer: Customer = new Customer();

	constructor(
		public dataService: DataService,
		private customerService: CustomerService,
		private messageHelper: MessageHelper
	) { }

	ngOnInit() {
	}

	toggleStatus(event: any) {
		this.objCustomer.Status = (event.target.checked) ? 1 : 2;
	}

	//Phone number formatting 
	numbersOnlyValidator(event: any) {
		const pattern = /^[0-9\-]*$/;
		if (!pattern.test(event.target.value)) {
			event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
		}
	}

	closeSidebar() {
		this.objCustomer = new Customer();
		this.isShow.emit(false);
	}

	saveCustomer() {
		this.dataService.isFormSubmitting.next(true);
		this.customerService.saveCustomer(this.objCustomer)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.newCustomer.next(response.ResponseObj);

					this.closeSidebar()
				}
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
			})
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}

}
