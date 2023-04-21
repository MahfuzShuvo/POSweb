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
import { AppConstant } from 'src/app/common/constants/appConstant';
import { VMPrduct } from 'src/app/models/VM/vmProduct';
import { VMCountProductByCategory } from 'src/app/models/VM/vmCountProductByCategory';

@Component({
	selector: 'app-products',
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('deleteModal', { read: TemplateRef }) deleteModal: TemplateRef<any>;
	lstProduct: VMPrduct[] = [];
	objProduct: Product = new Product();
	totalCount: number = 0;
	modalRef?: BsModalRef;
	lstAllProduct: VMPrduct[] = [];
	buttonText: string;
	modalTitle: string;
	file: any = {};
	uploadedImageUrl: string = '';
	lstCategory: VMCountProductByCategory[] = [];
	selectedCategoryID: number = 0;

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private productService: ProductService,
		private messageHelper: MessageHelper,
		private modalService: BsModalService,
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		Promise.resolve().then(() => this.headerService.setTitle(headerTitle!.toString()));
	}

	ngOnInit() {
		this.getAllCategoryWithProductCount();
		this.getAllProduct();
	}

	getAllCategoryWithProductCount() {
		this.productService.getProductCountByCategory()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstCategory = response.ResponseObj;
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})

	}

	changeProductStatus(event: any, product: VMPrduct) {
		this.objProduct = new Product();
		this.objProduct = JSON.parse(JSON.stringify(product));
		this.objProduct.Status = event.target.checked ? 1 : 2;
		if (this.objProduct.Image?.includes(AppConstant.FILE_PATH)) {
			this.objProduct.Image = this.objProduct.Image.replace(AppConstant.FILE_PATH, '');
		}

		this.productService.changeProductStatus(this.objProduct)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					var exist = this.lstProduct.filter(x => x.SKU == response.ResponseObj.SKU)[0];
					if (exist) {
						exist.Status = response.ResponseObj.Status;
					}
				}
				this.messageHelper.showMessage(response.ResponseCode, response.Message);

				this.objProduct = new Product();
			})
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

	getAllProductByCategoryID(id: number) {
		this.selectedCategoryID = id;
		this.productService.getAllProductByCategoryID(id)
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

	deleteProduct(product: VMPrduct) {
		this.objProduct = new Product();
		this.objProduct = JSON.parse(JSON.stringify(product));

		this.modalRef = this.modalService.show(this.deleteModal);
	}

	confirmDelete() {
		if (this.objProduct.SKU != '') {
			if (this.objProduct.Image?.includes(AppConstant.FILE_PATH)) {
				this.objProduct.Image = this.objProduct.Image.replace(AppConstant.FILE_PATH, '');
			}

			this.productService.deleteProduct(this.objProduct)
				.pipe(takeUntil(this.destroy))
				.subscribe((response: ResponseMessage) => {
					if (response.ResponseCode == ResponseStatus.success) {
						var index = this.lstProduct.findIndex(x => x.SKU == this.objProduct.SKU);
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

	editProduct(slug: string) {
		this.router.navigate(['product/edit', slug])
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
