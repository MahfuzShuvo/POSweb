import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { DataService } from 'src/app/common/service/data.service';
import { HeaderService } from 'src/app/common/service/header.service';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { Unit } from 'src/app/models/unit';
import { UnitService } from 'src/app/services/unit.service';

@Component({
	selector: 'app-unit',
	templateUrl: './unit.component.html',
	styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('unitFormModal', { read: TemplateRef }) unitFormModal: TemplateRef<any>;
	@ViewChild('deleteModal', { read: TemplateRef }) deleteModal: TemplateRef<any>;
	lstUnit: Unit[] = [];
	lstAllUnit: Unit[] = [];
	objUnit: Unit = new Unit();
	totalCount: number = 0;
	modalRef?: BsModalRef;
	buttonText: string;
	modalTitle: string;

	constructor(
		private headerService: HeaderService,
		private unitService: UnitService,
		private messageHelper: MessageHelper,
		public dataService: DataService,
		private modalService: BsModalService
	) { }

	ngOnInit() {
		Promise.resolve().then(() => this.headerService.setSubTitle('Unit'));
		this.getAllUnit();
	}

	toggleStatus(event: any) {
		this.objUnit.Status = (event.target.checked) ? 1 : 2;
	}

	getAllUnit() {
		this.unitService.getAllUnit()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstUnit = response.ResponseObj;
					this.lstAllUnit = JSON.parse(JSON.stringify(this.lstUnit));
					this.totalCount = response.TotalCount
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})

	}

	searchUnit(searchText: string) {
		var str = searchText!.replace(/\s/g, '').toLowerCase();		// remove spaces

		if (str == '') {
			this.lstUnit = JSON.parse(JSON.stringify(this.lstAllUnit));
		} else {
			this.lstUnit = this.lstAllUnit.filter(x => x.UnitName.replace(/\s/g, '').toLowerCase().includes(str));
		}
		this.totalCount = this.lstUnit.length;
	}

	createUnit() {
		this.modalTitle = 'Add';
		this.buttonText = 'Save';

		this.objUnit = new Unit();
		this.modalRef = this.modalService.show(this.unitFormModal);
	}

	editUnit(unit: Unit) {
		this.modalTitle = 'Edit';
		this.buttonText = 'Update';

		this.objUnit = new Unit();
		this.objUnit = JSON.parse(JSON.stringify(unit));
		this.modalRef = this.modalService.show(this.unitFormModal);
	}

	saveUnit() {
		this.dataService.isFormSubmitting.next(true);
		this.unitService.saveUnit(this.objUnit)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					var index = this.lstUnit.findIndex(x => x.UnitID == response.ResponseObj.UnitID);
					if (index > -1) {
						this.lstUnit.splice(index, 1, response.ResponseObj);
						this.lstAllUnit.splice(index, 1, response.ResponseObj);
					} else {
						this.lstUnit.push(response.ResponseObj);
						this.lstAllUnit.push(response.ResponseObj);
					}

					this.objUnit = new Unit();
					this.modalRef?.hide();
				}
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
			})
	}

	deleteUnit(unit: Unit) {
		this.objUnit = new Unit();
		this.objUnit = JSON.parse(JSON.stringify(unit));

		this.modalRef = this.modalService.show(this.deleteModal);
	}

	confirmDelete() {
		if (this.objUnit.UnitID > 0) {
			this.unitService.deleteUnit(this.objUnit.UnitID)
				.pipe(takeUntil(this.destroy))
				.subscribe((response: ResponseMessage) => {
					if (response.ResponseCode == ResponseStatus.success) {
						var index = this.lstUnit.findIndex(x => x.UnitID == this.objUnit.UnitID);
						if (index > -1) {
							this.lstUnit.splice(index, 1);
							this.lstAllUnit.splice(index, 1);
							this.objUnit = new Unit();
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
