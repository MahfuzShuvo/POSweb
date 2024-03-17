import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppConstant } from 'src/app/common/constants/appConstant';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { DataService } from 'src/app/common/service/data.service';
import { HeaderService } from 'src/app/common/service/header.service';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { VMAttachment } from 'src/app/models/VM/vmAttachment';
import { Brand } from 'src/app/models/brand';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { Unit } from 'src/app/models/unit';
import { ProductService } from 'src/app/services/product.service';

@Component({
	selector: 'app-product-form',
	templateUrl: './product-form.component.html',
	styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('searchCategory') searchCategory: ElementRef;
	@ViewChild('searchBrand') searchBrand: ElementRef;
	@ViewChild('searchUnit') searchUnit: ElementRef;
	lstProduct: Product[] = [];
	lstCategory: Category[] = [];
	lstBrand: Brand[] = [];
	lstUnit: Unit[] = [];
	tempLstCategory: Category[] = [];
	tempLstBrand: Brand[] = [];
	tempLstUnit: Unit[] = [];
	objProduct: Product = new Product();
	totalCount: number = 0;
	lstAllProduct: Product[] = [];
	buttonText: string;
	file: any = {};
	uploadedImageUrl: string = '';
	selectedCategory: Category = new Category();
	selectedBrand: Brand = new Brand();
	selectedUnit: Unit = new Unit();
	productSlug: string = '';
	isSellingPriceInputManually: boolean = false;
	today: Date;

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private messageHelper: MessageHelper,
		private productService: ProductService,
		public dataService: DataService,
		private router: Router
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		var childRoute = "";
		this.activatedRoute.url.subscribe((params: Params) => {
			childRoute = params[0].path;
		})

		this.activatedRoute.params.subscribe((params: Params) => {
			this.productSlug = (!params['slug']) ? '' : params['slug'];
			if (this.productSlug != '') {
				setTimeout(() => {

					this.getProductBySlug(this.productSlug);
				}, 500);
			}
		});
		Promise.resolve().then(() => this.headerService.setTitle(childRoute!.toString() + ' ' + headerTitle!.toString()));
	}

	ngOnInit() {
		this.getInitialDataForSaveProduct();
		console.log('pro: ', this.objProduct);

		this.today = new Date();
	}

	getProductBySlug(slug: string) {
		this.productService.getProductBySlug({ slug })
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.uploadedImageUrl = '';
					this.objProduct = new Product();

					this.objProduct = JSON.parse(JSON.stringify(response.ResponseObj));
					this.uploadedImageUrl = this.objProduct.Image;

					this.selectedCategory = this.lstCategory.filter(x => x.CategoryID == this.objProduct.CategoryID)[0]
					this.selectedBrand = this.lstBrand.filter(x => x.BrandID == this.objProduct.BrandID)[0]
					this.selectedUnit = this.lstUnit.filter(x => x.UnitID == this.objProduct.Unit)[0]
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})
	}

	getInitialDataForSaveProduct() {
		this.productService.getInitialDataForSaveProduct()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstCategory = response.ResponseObj.lstCategory;
					this.tempLstCategory = JSON.parse(JSON.stringify(this.lstCategory));

					this.lstBrand = response.ResponseObj.lstBrand;
					this.tempLstBrand = JSON.parse(JSON.stringify(this.lstBrand));

					this.lstUnit = response.ResponseObj.lstUnit;
					this.tempLstUnit = JSON.parse(JSON.stringify(this.lstUnit));
				}
			})
	}

	saveProduct() {
		if (!this.objProduct.CategoryID || this.objProduct.CategoryID == 0) {
			this.messageHelper.showMessage(ResponseStatus.warning, "Category is required");
			return;
		}
		if (!this.objProduct.Unit || this.objProduct.Unit == 0) {
			this.messageHelper.showMessage(ResponseStatus.warning, "Unit is required");
			return;
		}
		this.dataService.isFormSubmitting.next(true);
		if (this.objProduct.ExpireDate) {
			this.objProduct.ExpireDateString = new Date(this.objProduct.ExpireDate).toLocaleString();
		}
		if (this.objProduct.Image?.includes(AppConstant.FILE_PATH)) {
			this.objProduct.Image = this.objProduct.Image.replace(AppConstant.FILE_PATH, '');
		}

		this.productService.saveProduct(this.objProduct)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					var index = this.lstProduct.findIndex(x => x.ProductID == response.ResponseObj.ProductID);
					if (index > -1) {
						this.lstProduct.splice(index, 1, response.ResponseObj);
						this.lstAllProduct.splice(index, 1, response.ResponseObj);
					} else {
						this.lstProduct.push(response.ResponseObj);
						this.lstAllProduct.push(response.ResponseObj);
					}

					this.clickCancel();
				}
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
			})
	}

	selectCategory(category: Category) {
		if (category) {
			this.selectedCategory = JSON.parse(JSON.stringify(category));
			this.objProduct.CategoryID = category.CategoryID;
		} else {
			this.objProduct.CategoryID = 0;
		}
	}

	// searchCategoryDropdown(str: string) {
	// 	if (str == '') {
	// 		this.lstCategory = JSON.parse(JSON.stringify(this.tempLstCategory));
	// 	} else {
	// 		this.lstCategory = this.tempLstCategory.filter(x => x.CategoryName.toLowerCase().includes(str.toLowerCase()))
	// 	}

	// }

	// openCategoryDrop() {
	// 	this.lstCategory = JSON.parse(JSON.stringify(this.tempLstCategory));
	// 	setTimeout(() => {
	// 		this.searchCategory!.nativeElement.value = '';
	// 		this.searchCategory!.nativeElement.focus();
	// 	}, 5);
	// }

	selectBrand(brand: Brand) {
		if (brand) {
			this.selectedBrand = JSON.parse(JSON.stringify(brand));
			this.objProduct.BrandID = brand.BrandID;
		} else {
			this.objProduct.BrandID = 0;
		}
	}

	// searchBrandDropdown(str: string) {
	// 	if (str == '') {
	// 		this.lstBrand = JSON.parse(JSON.stringify(this.tempLstBrand));
	// 	} else {
	// 		this.lstBrand = this.tempLstBrand.filter(x => x.BrandName.toLowerCase().includes(str.toLowerCase()))
	// 	}

	// }

	// openBrandDrop() {
	// 	this.lstBrand = JSON.parse(JSON.stringify(this.tempLstBrand));
	// 	setTimeout(() => {
	// 		this.searchBrand!.nativeElement.value = '';
	// 		this.searchBrand!.nativeElement.focus();
	// 	}, 5);
	// }

	selectUnit(unit: Unit) {
		if (unit) {
			this.selectedUnit = JSON.parse(JSON.stringify(unit));
			this.objProduct.Unit = unit.UnitID;
		} else {
			this.objProduct.Unit = 0;
		}
	}

	// searchUnitDropdown(str: string) {
	// 	if (str == '') {
	// 		this.lstUnit = JSON.parse(JSON.stringify(this.tempLstUnit));
	// 	} else {
	// 		this.lstUnit = this.tempLstUnit.filter(x => x.UnitName.toLowerCase().includes(str.toLowerCase()))
	// 	}

	// }

	// openUnitDrop() {
	// 	this.lstUnit = JSON.parse(JSON.stringify(this.tempLstUnit));
	// 	setTimeout(() => {
	// 		this.searchUnit!.nativeElement.value = '';
	// 		this.searchUnit!.nativeElement.focus();
	// 	}, 5);
	// }

	numbersOnlyValidator(event: any) {
		const pattern = /^[0-9\-]*$/;
		if (!pattern.test(event.target.value)) {
			event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
		}
	}

	uploadFile(event: any) {

		this.objProduct.Attachment = new VMAttachment();
		const reader = new FileReader();
		const [file] = event.target.files;
		let fileExtension = "";
		let fileName = "";
		if (file.name.lastIndexOf(".") > 0) {
			// fileExtension = file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length);
			fileName = file.name.split(".")[0];
			fileExtension = file.name.split(".")[1];
		}

		if (fileExtension != 'png' && fileExtension != 'jpeg' && fileExtension != 'jpg') {
			this.messageHelper.showMessage(ResponseStatus.warning, "This type of file can't upload. Try png, jpeg or jpg file")
			return;
		}

		reader.readAsDataURL(file);
		this.objProduct.Attachment.Name = fileName;
		this.objProduct.Attachment.Extension = fileExtension;
		reader.onload = () => {
			this.objProduct.Attachment.Content = reader.result as string;
			this.uploadedImageUrl = this.objProduct.Attachment.Content ?? '';
		};
	}

	calculateAllPricing() {

		// calculate purchase price 
		this.objProduct.PurchasePrice = (this.objProduct.TaxType == 1 && this.objProduct.Tax > 0)
			? parseFloat(this.objProduct.Price.toString()) + (parseFloat(this.objProduct.Price.toString()) * parseFloat(this.objProduct.Tax.toString()) / 100)
			: parseFloat(this.objProduct.Price.toString());

		this.objProduct.PurchasePrice = parseFloat(this.objProduct.PurchasePrice.toFixed(2));

		// calculate selling price 
		if (!this.isSellingPriceInputManually) {

			this.objProduct.SellingPrice = (this.objProduct.ProfitMargin > 0)
				? parseFloat(this.objProduct.Price.toString()) + (parseFloat(this.objProduct.Price.toString()) * parseFloat(this.objProduct.ProfitMargin.toString()) / 100)
				: parseFloat(this.objProduct.Price.toString());

			this.objProduct.SellingPrice = parseFloat(this.objProduct.SellingPrice.toFixed(2));
		}

		// calculate final price 
		this.objProduct.FinalPrice = (this.objProduct.TaxType == 1 && this.objProduct.Tax > 0)
			? parseFloat(this.objProduct.PurchasePrice.toString()) + (parseFloat(this.objProduct.PurchasePrice.toString()) * this.objProduct.ProfitMargin / 100)
			: parseFloat(this.objProduct.SellingPrice.toString());

		this.objProduct.FinalPrice = parseFloat(this.objProduct.FinalPrice.toFixed(2));
	}

	inputSellingPrice() {
		this.isSellingPriceInputManually = true;
		// calculate profit margin 
		this.objProduct.ProfitMargin = Math.round(parseFloat((((parseInt(this.objProduct.SellingPrice.toString()) / parseInt(this.objProduct.Price.toString())) - 1) * 100).toFixed(2)))

		this.calculateAllPricing()
	}

	// calculatePurchasePrice() {
	// 	if (this.objProduct.Price && this.objProduct.Price > 0) {
	// 		// debugger
	// 		var tax = ((this.objProduct.Tax && this.objProduct.Tax > 0) ? parseFloat(this.objProduct.Tax.toString()) : 0) / 100;
	// 		var afterTax = parseFloat(this.objProduct.Price.toString()) * tax

	// 		this.objProduct.PurchasePrice = (this.objProduct.TaxType == 1) ? parseFloat(this.objProduct.Price.toString()) + afterTax : parseFloat(this.objProduct.Price.toString());
	// 	} else {
	// 		this.objProduct.PurchasePrice = 0;
	// 	}

	// 	this.objProduct.SellingPrice = this.objProduct.Price;
	// }

	// calculate final price & selling price if input -> PROFIT MARGIN
	// onChangeProfitMargin_calculateFinalPrice() {
	// 	this.calculatePurchasePrice();
	// 	if (this.objProduct.ProfitMargin && this.objProduct.ProfitMargin > 0) {
	// 		// sales = {(profit / 100) * purchase } + purchase 
	// 		this.objProduct.SellingPrice = (parseInt(this.objProduct.ProfitMargin.toString()) / 100) * parseInt(this.objProduct.SellingPrice.toString()) + parseInt(this.objProduct.SellingPrice.toString());
	// 		if (this.objProduct.TaxType == 1) {
	// 			// Tax type = EXCLUSIVE
	// 			var tax = ((this.objProduct.Tax && this.objProduct.Tax > 0) ? parseInt(this.objProduct.Tax.toString()) : 0) / 100;
	// 			var afterTax = parseInt(this.objProduct.SellingPrice.toString()) * tax;

	// 			this.objProduct.FinalPrice = parseFloat(this.objProduct.SellingPrice.toString()) + afterTax;
	// 		} else if (this.objProduct.TaxType == 2) {
	// 			// Tax type = INCLUSIVE
	// 			this.objProduct.FinalPrice = this.objProduct.SellingPrice;
	// 		}
	// 	}
	// }

	// calculate final price & profit margin if input -> SELLING PRICE
	// onChangeSellingPrice_calculateFinalPrice() {
	// 	if (this.objProduct.SellingPrice && this.objProduct.SellingPrice > 0) {
	// 		// profit = {(sales / purchase) - 1} * 100
	// 		this.objProduct.ProfitMargin = parseFloat((((parseInt(this.objProduct.SellingPrice.toString()) / parseInt(this.objProduct.PurchasePrice.toString())) - 1) * 100).toFixed(2));
	// 		if (this.objProduct.TaxType == 1) {
	// 			// Tax type = EXCLUSIVE
	// 			var tax = ((this.objProduct.Tax && this.objProduct.Tax > 0) ? parseInt(this.objProduct.Tax.toString()) : 0) / 100;
	// 			var afterTax = parseInt(this.objProduct.SellingPrice.toString()) * tax;

	// 			this.objProduct.FinalPrice = parseFloat(this.objProduct.SellingPrice.toString()) + afterTax;
	// 		} else if (this.objProduct.TaxType == 2) {
	// 			// Tax type = INCLUSIVE
	// 			this.objProduct.FinalPrice = this.objProduct.SellingPrice;
	// 		}
	// 	}
	// }

	clearUpload() {
		this.uploadedImageUrl = '';
		this.file = {};
		this.objProduct.Attachment = new VMAttachment();
	}

	clickCancel() {
		this.objProduct = new Product();
		this.router.navigate(['product']);
	}

	incrementValue(event: Event) {
		const inputElement = (event.target as HTMLElement).parentNode?.querySelector('input[type="number"]') as HTMLInputElement;
		if (inputElement) {
			inputElement.focus();
			inputElement.stepUp();
		}
	}
	decrementValue(event: Event) {
		const inputElement = (event.target as HTMLElement).parentNode?.querySelector('input[type="number"]') as HTMLInputElement;
		if (inputElement) {
			inputElement.focus();
			inputElement.stepDown();
		}
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
