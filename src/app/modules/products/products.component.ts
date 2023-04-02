import { MessageHelper } from './../../common/helper/messageHelper';
import { ProductService } from './../../services/product.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/common/service/header.service';
import { Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/models/product';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { ResponseStatus } from 'src/app/common/enums/appEnums';

@Component({
	selector: 'app-products',
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('deleteModal', { read: TemplateRef }) deleteModal: TemplateRef<any>;
	lstProduct: Product[] = [];
	objProduct: Product = new Product();
	totalCount: number = 0;
	modalRef?: BsModalRef;
	lstAllProduct: Product[] = [];
	buttonText: string;
	modalTitle: string;
	file: any = {};
	uploadedImageUrl: string = '';

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private productService: ProductService,
		private messageHelper: MessageHelper,
		private modalService: BsModalService
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		Promise.resolve().then(() => this.headerService.setTitle(headerTitle!.toString()));
	}

	ngOnInit() {
		this.getAllProduct();
	}

	toggleStatus(event: any) {
		this.objProduct.Status = (event.target.checked) ? 1 : 2;
	}

	getAllProduct() {
		this.productService.getAllProduct()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstProduct = response.ResponseObj;
					this.lstAllProduct = JSON.parse(JSON.stringify(this.lstProduct));
					this.totalCount = response.TotalCount
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
		this.totalCount = this.lstProduct.length;
	}

	deleteProduct(product: Product) {
		this.objProduct = new Product();
		this.objProduct = JSON.parse(JSON.stringify(product));

		this.modalRef = this.modalService.show(this.deleteModal);
	}

	confirmDelete() {
		if (this.objProduct.ProductID > 0) {
			this.productService.deleteProduct(this.objProduct.ProductID)
				.pipe(takeUntil(this.destroy))
				.subscribe((response: ResponseMessage) => {
					if (response.ResponseCode == ResponseStatus.success) {
						var index = this.lstProduct.findIndex(x => x.ProductID == this.objProduct.ProductID);
						if (index > -1) {
							this.lstProduct.splice(index, 1);
							this.lstAllProduct.splice(index, 1);
							this.objProduct = new Product();
							this.modalRef?.hide()
						}
					}
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				})
		}
	}

	addProduct() {
		this.router.navigate(['product/add']);
	}

	editProduct(product: Product) {

	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
