import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { SupplierService } from '../../../services/supplier.service';
import { DataService } from '../../../common/service/data.service';
import { Supplier } from '../../../models/supplier';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';

@Component({
	selector: 'app-supplier-form',
	templateUrl: './supplier-form.component.html',
	styleUrls: ['./supplier-form.component.css']
})
export class SupplierFormComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@Output() isShow: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() buttonText: string = '';
	@Output() headerText: string = '';
	newSupplier: Subject<Supplier> = new Subject<Supplier>();
	isPasswordShow: boolean = false;
	@Output() objSupplier: Supplier = new Supplier();

	constructor(
		public dataService: DataService,
		private supplierService: SupplierService,
		private messageHelper: MessageHelper
	) { }

	ngOnInit() {
	}

	toggleStatus(event: any) {
		this.objSupplier.Status = (event.target.checked) ? 1 : 2;
	}

	//Phone number formatting 
	numbersOnlyValidator(event: any) {
		const pattern = /^[0-9\-]*$/;
		if (!pattern.test(event.target.value)) {
			event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
		}
	}

	closeSidebar() {
		this.objSupplier = new Supplier();
		this.isShow.emit(false);
	}

	saveSupplier() {
		this.dataService.isFormSubmitting.next(true);
		this.supplierService.saveSupplier(this.objSupplier)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.newSupplier.next(response.ResponseObj);

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
