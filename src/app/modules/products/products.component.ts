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
import { VMCountProductByCategory } from 'src/app/models/VM/vmCountProductByCategory';
import { VMProduct } from 'src/app/models/VM/vmProduct';
import * as XLSX from 'xlsx';
import { VMProductImport } from 'src/app/models/VM/vmProductImport';
import { DataService } from 'src/app/common/service/data.service';

@Component({
	selector: 'app-products',
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('deleteModal', { read: TemplateRef }) deleteModal: TemplateRef<any>;
	@ViewChild('importModal', { read: TemplateRef }) importModal: TemplateRef<any>;
	lstProduct: VMProduct[] = [];
	objProduct: Product = new Product();
	totalCount: number = 0;
	modalRef?: BsModalRef;
	lstAllProduct: VMProduct[] = [];
	buttonText: string;
	modalTitle: string;
	file: any = {};
	uploadedImageUrl: string = '';
	lstCategory: VMCountProductByCategory[] = [];
	selectedCategoryID: number = 0;
	csvfile: any = '';
	fileName = '';
	arrayBuffer: any;
	isUploading: boolean = false;
	processedDataLength: number = 0;

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private productService: ProductService,
		private messageHelper: MessageHelper,
		private modalService: BsModalService,
		public dataService: DataService
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

	changeProductStatus(event: any, product: VMProduct) {
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

	deleteProduct(product: VMProduct) {
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

	openImportModal() {
		this.modalRef = this.modalService.show(this.importModal);
	}
	closeImportModal() {
		this.csvfile = '';
		this.fileName = '';
		this.modalRef?.hide()
	}

	uploadCsv(files: any) {
		this.csvfile = files[0];

		this.fileName = this.csvfile?.name;
		var fileType = this.csvfile?.type;
		var fileSize = this.csvfile?.size;
	}

	clickUploadBtn() {
		this.dataService.isFormSubmitting.next(true);
		let fileReader = new FileReader();

		fileReader.onload = (e) => {
			this.arrayBuffer = fileReader.result;
			var data = new Uint8Array(this.arrayBuffer);
			var arr = new Array();

			for (var i = 0; i != data.length; ++i)
				arr[i] = String.fromCharCode(data[i]);

			var bstr = arr.join('');
			var workbook = XLSX.read(bstr, { type: 'binary' });
			var first_sheet_name = workbook.SheetNames[0];
			var worksheet = workbook.Sheets[first_sheet_name];

			var importExcel = XLSX.utils.sheet_to_json(worksheet, { raw: true });
			console.log("Check excel read data", importExcel);

			if (importExcel.length == 0) {
				this.closeImportModal();
				this.messageHelper.showMessage(ResponseStatus.warning, "Uploaded csv file is empty");
				return;
			}
			this.processedDataLength = 0;
			new Promise<void>((resolve, reject) => {
				let chunkSize = 50000;
				for (let i = 0; i < importExcel.length; i += chunkSize) {
					const chunk = importExcel.slice(i, i + chunkSize);
					this.updateImportedFile(chunk, importExcel.length);
					if (this.processedDataLength === importExcel.length) resolve();
				};
			});

		};
		fileReader.readAsArrayBuffer(this.csvfile);
		// fileReader.abort()
	}

	updateImportedFile(chunckFile: any[] = [], fileLength: number) {
		var lstProductImport: VMProductImport[] = [];
		if (chunckFile.length > 0) {
			var countChunckFileError = 0;
			chunckFile.forEach(element => {
				var product = new VMProductImport();

				product.ProductName = element["Product Name*"] ? element["Product Name*"] : "";
				product.Description = element["Description"] ? element["Description"] : "";
				product.Category = element["Category*"] ? element["Category*"] : "";
				product.Brand = element["Brand"] ? element["Brand"] : "";
				product.StockQuantity = element["Stock Quantity*"] ? parseInt(element["Stock Quantity*"]) : 0;
				product.AlertQuantity = element["Alert Quantity*"] ? parseInt(element["Alert Quantity*"]) : 0;
				product.PurchasePrice = element["Purchase Price*"] ? parseFloat(element["Purchase Price*"]) : 0;
				product.SellingPrice = element["Selling Price*"] ? parseFloat(element["Selling Price*"]) : 0;
				product.Unit = element["Unit*"] ? element["Unit*"] : "";
				product.ExpireDate = element["Expire Date"] ? element["Expire Date"] : "";
				product.Discount = element["Discount"] ? parseFloat(element["Discount"]) : 0;
				product.ProfitMargin = element["Profit Margin"] ? parseFloat(element["Profit Margin"]) : 0;

				if (product!.ProductName == null || product!.ProductName == "") {
					this.messageHelper.showMessage(ResponseStatus.warning, "Product name is required");
					countChunckFileError++;
				}
				if (product!.Category == null || product!.Category == "") {
					this.messageHelper.showMessage(ResponseStatus.warning, "Category is required");
					countChunckFileError++;
				}
				if (product!.StockQuantity == 0) {
					this.messageHelper.showMessage(ResponseStatus.warning, "Stock quantity is required");
					countChunckFileError++;
				}
				if (product!.AlertQuantity == 0) {
					this.messageHelper.showMessage(ResponseStatus.warning, "Alert quantity is required");
					countChunckFileError++;
				}
				if (product!.PurchasePrice == 0) {
					this.messageHelper.showMessage(ResponseStatus.warning, "Purchase price is required");
					countChunckFileError++;
				}
				if (product!.SellingPrice == 0) {
					this.messageHelper.showMessage(ResponseStatus.warning, "Selling price is required");
					countChunckFileError++;
				}
				if (product!.Unit == null || product!.Unit == "") {
					this.messageHelper.showMessage(ResponseStatus.warning, "Unit is required");
					countChunckFileError++;
				}

				lstProductImport.push(product);

			});
			if (countChunckFileError > 0) {
				lstProductImport = [];
				return;
			}

			if (lstProductImport!.length > 0) {
				this.productService.importProduct(lstProductImport)
					.pipe(takeUntil(this.destroy))
					.subscribe((response: ResponseMessage) => {
						if (response.ResponseCode == ResponseStatus.success) {
							response.ResponseObj?.forEach((product: VMProduct) => {

								this.lstAllProduct.push(product);
								this.lstProduct.push(product);
								this.totalCount++;
								var existCategory = this.lstCategory.filter(x => x.CategoryName == product.CategoryName)[0];
								if (existCategory) {
									existCategory.ProductCount++;
								}
							})
							this.closeImportModal();
						}
						this.messageHelper.showMessage(response.ResponseCode, response.Message);
					})
			}
		}
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
