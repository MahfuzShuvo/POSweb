import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { HeaderService } from 'src/app/common/service/header.service';
import { VMSales } from 'src/app/models/VM/vmSales';
import { SalesService } from 'src/app/services/sales.service';

@Component({
	selector: 'app-sales-view',
	templateUrl: './sales-view.component.html',
	styleUrls: ['./sales-view.component.css']
})
export class SalesViewComponent implements OnInit {

	objSales: VMSales = new VMSales();
	salesCode: string = '';
	discountInput: number = 0;
	
	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private messageHelper: MessageHelper,
		private salesService: SalesService,
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		var childRoute = "";
		this.activatedRoute.url.subscribe((params: Params) => {
			childRoute = params[0].path;
		})

		this.activatedRoute.params.subscribe((params: Params) => {
			this.salesCode = (!params['salesCode']) ? '' : params['salesCode'];
			if (this.salesCode != '') {
				setTimeout(() => {

					this.getSalesByCodeForView(this.salesCode);
				}, 500);
			}
		});
		Promise.resolve().then(() => this.headerService.setTitle(childRoute!.toString() + ' ' + headerTitle!.toString()));
	 }

	ngOnInit() {
	}

	getSalesByCodeForView(salesCode: string) {
		this.salesService.getSalesBySalesCodeForView(salesCode).subscribe(response => {
			if (response.ResponseCode == ResponseStatus.success) {
				this.objSales = JSON.parse(JSON.stringify(response.ResponseObj));

				// if (this.objSales.Discount > 0) {
				// 	if (this.objSales.DiscountType == 1) {
				// 		this.discountInput = (parseFloat(this.objSales.Discount.toString()) * 100) / parseFloat(this.objSales.SubTotal.toString());
				// 	} else {
				// 		this.discountInput =this.objSales.Discount;
				// 	}
				// }

				this.objSales.SalesDate = new Date(this.objSales.SalesDate).toLocaleString();

				// this.changeQty();
			} else {
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
			}
		})
	}

	calculateTotalQty() {
		return this.objSales.lstProduct.map(p => p.Qty).reduce((a, b) => a + b);
	}

	calculateTotalPrice() {
		return this.objSales.lstProduct.map(p => (p.Qty * p.FinalPrice)).reduce((a, b) => a + b);
	}

}
