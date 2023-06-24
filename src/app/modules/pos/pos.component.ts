import { DataService } from './../../common/service/data.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { HeaderService } from 'src/app/common/service/header.service';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { VMProduct } from 'src/app/models/VM/vmProduct';
import { ProductService } from 'src/app/services/product.service';

@Component({
	selector: 'app-pos',
	templateUrl: './pos.component.html',
	styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	lstProduct: VMProduct[] = [];
	lstAllProduct: VMProduct[] = [];
	timeout: any;
	activateTab: number = 1;

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private productService: ProductService,
		private messageHelper: MessageHelper,
		public dataService: DataService
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		Promise.resolve().then(() => this.headerService.setTitle(headerTitle!.toString()));
		dataService.isSidebarToggle.next(true);
	}

	ngOnInit() {
		this.getAllProduct();
	}

	clickViewTab(value: number) {
		this.activateTab = value;
	}

	getAllProduct() {
		this.productService.getAllProduct()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstProduct = response.ResponseObj;
					this.lstAllProduct = JSON.parse(JSON.stringify(this.lstProduct));
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})

	}

	searchProduct(searchText: string) {
		var str = searchText!.replace(/\s/g, '').toLowerCase();		// remove spaces

		if (str == '') {
			this.lstProduct = JSON.parse(JSON.stringify(this.lstAllProduct));
		} else {
			this.lstProduct = this.lstAllProduct.filter(x => x.ProductName.replace(/\s/g, '').toLowerCase().includes(str));
		}
	}

	// server side search ......................................
	// searchProduct(event: any) {
	// 	clearTimeout(this.timeout);
	// 	this.timeout = setTimeout(() => {
	// 		var searchText = event.target.value;

	// 		this.productService.searchProduct(searchText)
	// 			.pipe(takeUntil(this.destroy))
	// 			.subscribe((response: ResponseMessage) => {
	// 				if (response.ResponseCode == ResponseStatus.success) {
	// 					this.lstProduct = response.ResponseObj;
	// 				}
	// 			})
	// 	}, 500);
	// }

	clickToAddCart(product: VMProduct) {
		if (product.SKU != '' && product.Qty > 0) {
			alert('hi')
		}
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
