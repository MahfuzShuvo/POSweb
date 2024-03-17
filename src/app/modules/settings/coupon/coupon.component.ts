import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';
import { AppConstant } from 'src/app/common/constants/appConstant';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { DataService } from 'src/app/common/service/data.service';
import { HeaderService } from 'src/app/common/service/header.service';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { Coupon } from 'src/app/models/coupon';
import { CouponService } from 'src/app/services/coupon.service';

@Component({
	selector: 'app-coupon',
	templateUrl: './coupon.component.html',
	styleUrls: ['./coupon.component.css']
})
export class CouponComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('couponFormModal', { read: TemplateRef }) couponFormModal: TemplateRef<any>;
	@ViewChild('deleteModal', { read: TemplateRef }) deleteModal: TemplateRef<any>;
	lstCoupon: Coupon[] = [];
	lstAllCoupon: Coupon[] = [];
	objCoupon: Coupon = new Coupon();
	totalCount: number = 0;
	modalRef?: BsModalRef;
	buttonText: string;
	modalTitle: string;
	lstDiscountType: any[] = AppConstant.DISCOUNT_TYPE;
	selectedDiscountType: any;
	today: Date = new Date();
	bsRangeValue: Date[];
	couponStat: number = 0;

	constructor(
		private headerService: HeaderService,
		private couponService: CouponService,
		private messageHelper: MessageHelper,
		public dataService: DataService,
		private modalService: BsModalService
	) { }

	ngOnInit() {
		Promise.resolve().then(() => this.headerService.setSubTitle('Coupon'));
		this.getAllCoupon();
	}

	toggleStatus(event: any) {
		this.objCoupon.Status = (event.target.checked) ? 1 : 2;
	}

	getAllCoupon() {
		this.couponService.getAllCoupon()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstCoupon = response.ResponseObj;
					this.lstAllCoupon = JSON.parse(JSON.stringify(this.lstCoupon));
					this.totalCount = response.TotalCount
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})

	}

	searchCoupon(searchText: string) {
		var str = searchText!.replace(/\s/g, '').toLowerCase();		// remove spaces

		if (str == '') {
			this.lstCoupon = JSON.parse(JSON.stringify(this.lstAllCoupon));
		} else {
			this.lstCoupon = this.lstAllCoupon.filter(x => x.CouponCode.replace(/\s/g, '').toLowerCase().includes(str));
		}
		this.totalCount = this.lstCoupon.length;
	}

	createCoupon() {
		this.modalTitle = 'Add';
		this.buttonText = 'Save';

		this.objCoupon = new Coupon();
		this.selectedDiscountType = this.lstDiscountType.filter(x => x.Id == this.objCoupon.Type)[0];
		this.modalRef = this.modalService.show(this.couponFormModal);
	}

	editCoupon(coupon: Coupon) {
		this.modalTitle = 'Edit';
		this.buttonText = 'Update';

		this.objCoupon = new Coupon();
		this.objCoupon = JSON.parse(JSON.stringify(coupon));
		this.selectedDiscountType = this.lstDiscountType.filter(x => x.Id == this.objCoupon.Type)[0];

		this.bsRangeValue = [new Date(this.objCoupon.StartDate), new Date(this.objCoupon.EndDate)];

		this.modalRef = this.modalService.show(this.couponFormModal);
	}

	saveCoupon() {
		if (!this.objCoupon.Type || this.objCoupon.Type == 0) {
			this.messageHelper.showMessage(ResponseStatus.warning, 'Coupon type must be required');
			return;
		}
		if (!this.objCoupon.Value || this.objCoupon.Value == 0) {
			this.messageHelper.showMessage(ResponseStatus.warning, 'Coupon value must be required');
			return;
		}
		this.dataService.isFormSubmitting.next(true);

		if (this.bsRangeValue && this.bsRangeValue.length > 0) {
			this.objCoupon.CouponDuration = [new Date(this.bsRangeValue[0]).toLocaleString(), new Date(this.bsRangeValue[1]).toLocaleString()]
		}

		this.couponService.saveCoupon(this.objCoupon)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					var index = this.lstCoupon.findIndex(x => x.CouponID == response.ResponseObj.CouponID);
					if (index > -1) {
						this.lstCoupon.splice(index, 1, response.ResponseObj);
						this.lstAllCoupon.splice(index, 1, response.ResponseObj);
					} else {
						this.lstCoupon.push(response.ResponseObj);
						this.lstAllCoupon.push(response.ResponseObj);
					}

					this.objCoupon = new Coupon();
					this.modalRef?.hide();
				}
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
			})
	}

	deleteCoupon(coupon: Coupon) {
		this.objCoupon = new Coupon();
		this.objCoupon = JSON.parse(JSON.stringify(coupon));

		this.modalRef = this.modalService.show(this.deleteModal);
	}

	confirmDelete() {
		if (this.objCoupon.CouponID > 0) {
			this.couponService.deleteCoupon(this.objCoupon.CouponID)
				.pipe(takeUntil(this.destroy))
				.subscribe((response: ResponseMessage) => {
					if (response.ResponseCode == ResponseStatus.success) {
						var index = this.lstCoupon.findIndex(x => x.CouponID == this.objCoupon.CouponID);
						if (index > -1) {
							this.lstCoupon.splice(index, 1);
							this.lstAllCoupon.splice(index, 1);
							this.objCoupon = new Coupon();
							this.modalRef?.hide()
						}
					}
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				})
		}
	}

	selectDiscount(event: any) {
		if (event) {
			this.selectedDiscountType = this.lstDiscountType.filter(x => x.Id == event.Id)[0];
			this.objCoupon.Type = event.Id;
		} else {
			this.objCoupon.Type = 0;
		}
	}

	couponValueEntry(amount: any) {
		if (amount > 0) {
			this.objCoupon.Value = parseFloat(amount);
		}
	}

	remainingCoupon(coupon: Coupon) {
		var result = '';
		if (coupon.StartDate && coupon.EndDate) {
			var dif = this.dayDifference(coupon.StartDate, coupon.EndDate);

			if (new Date(coupon.StartDate).valueOf() > new Date().valueOf()) {
				this.couponStat = 1;
				result = `Start after ${this.dayDifference(coupon.StartDate, coupon.EndDate)} days`;
			} else if (new Date(coupon.StartDate).valueOf() <= new Date().valueOf() && new Date(coupon.StartDate).valueOf() < new Date(coupon.EndDate).valueOf()) {
				result = `${dif} days remaining`;
				this.couponStat = 2;
			} else {
				result = 'Expired';
				this.couponStat = 3;
			}
		}

		return result;
	}

	dayDifference(startDate: Date, endDate: Date) {
		var dif = new Date(endDate).valueOf() - new Date(startDate).valueOf();
		// console.log('Dif: ', dif);

		const totalSeconds = Math.floor(dif / 1000);
		const totalMinutes = Math.floor(totalSeconds / 60);
		const totalHours = Math.floor(totalMinutes / 60);
		const totalDays = Math.floor(totalHours / 24);

		return totalDays;
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}

}
