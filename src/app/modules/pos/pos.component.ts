import { DataService } from './../../common/service/data.service';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';
import { AppConstant } from 'src/app/common/constants/appConstant';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { HeaderService } from 'src/app/common/service/header.service';
import { CustomerFormComponent } from 'src/app/components/forms/customer-form/customer-form.component';
import { PaymentDTO } from 'src/app/models/DTO/paymentDTO';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { VMProduct } from 'src/app/models/VM/vmProduct';
import { Account } from 'src/app/models/account';
import { Customer } from 'src/app/models/customer';
import { Sales } from 'src/app/models/sales';
import { AccountService } from 'src/app/services/account.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ProductService } from 'src/app/services/product.service';
import { SalesService } from 'src/app/services/sales.service';

@Component({
	selector: 'app-pos',
	templateUrl: './pos.component.html',
	styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('customerForm', { read: ViewContainerRef }) customerForm: ViewContainerRef;
	@ViewChild('searchProductText') searchProductText: ElementRef;
	@ViewChild('searchCustomer') searchCustomer: ElementRef;
	@ViewChild('discountModal', { read: TemplateRef }) discountModal: TemplateRef<any>;
	@ViewChild('paymentModal', { read: TemplateRef }) paymentModal: TemplateRef<any>;
	modalRef?: BsModalRef;
	lstProduct: VMProduct[] = [];
	lstProductForCart: VMProduct[] = [];
	lstAllProduct: VMProduct[] = [];
	timeout: any;
	activateTab: number = 1;
	objSales: Sales = new Sales();
	discountInput: number = 0;
	totalSalesQty: number = 0;
	lstCustomer: Customer[] = [];
	lstAllCustomer: Customer[] = [];
	selectedCustomer: Customer = new Customer();
	isEditMode: boolean = false;
	objDiscount = {
		discountType: 0,
		discount: 0
	};
	lstAccount: Account[] = [];
	objPaymentDTO: PaymentDTO = new PaymentDTO();
	salesCode: string = '';
	noMatchFound: string = '';
	selectedPaymentType: Account = new Account();
	lstDiscountType: any[] = AppConstant.DISCOUNT_TYPE;
	selectedDiscountType: any;
	isDisablePaymentAmount: boolean = false;

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private productService: ProductService,
		private messageHelper: MessageHelper,
		public dataService: DataService,
		private salesService: SalesService,
		private customerService: CustomerService,
		private accountService: AccountService,
		private router: Router,
		private modalService: BsModalService
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		var childRoute = "";
		this.activatedRoute.url.subscribe((params: Params) => {
			childRoute = params[0]?.path;
		})

		this.activatedRoute.params.subscribe((params: Params) => {
			this.salesCode = (!params['salesCode']) ? '' : params['salesCode'];
			if (this.salesCode != '') {
				this.isEditMode = true;
				setTimeout(() => {

					this.getSalesByCode(this.salesCode);
				}, 500);
			} else {
				this.isEditMode = false;
			}
		});
		Promise.resolve().then(() => this.headerService.setTitle(childRoute?.toString() + ' ' + headerTitle!.toString()));
		dataService.isSidebarToggle.next(true);
	}

	ngOnInit() {
		this.getAllProduct();
		this.getAllCustomer();
	}

	clickViewTab(value: number) {
		this.activateTab = value;
	}

	getSalesByCode(salesCode: string) {
		this.salesService.getSalesBySalesCode(salesCode).subscribe(response => {
			if (response.ResponseCode == ResponseStatus.success) {
				this.objSales = JSON.parse(JSON.stringify(response.ResponseObj));

				if (this.objSales.Discount > 0) {
					if (this.objSales.DiscountType == 1) {
						this.discountInput = (parseFloat(this.objSales.Discount.toString()) * 100) / parseFloat(this.objSales.SubTotal.toString());
					} else {
						this.discountInput = this.objSales.Discount;
					}
				}

				this.objSales.SalesDate = new Date(this.objSales.SalesDate).toLocaleString();

				this.changeQty();
			} else {
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
			}
		})
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

	// customer section: start

	getAllCustomer() {
		this.customerService.getAllCustomer()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstCustomer = response.ResponseObj;
					this.lstCustomer = this.lstCustomer.filter(x => x.Status == 1);
					this.lstAllCustomer = JSON.parse(JSON.stringify(this.lstCustomer));

				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})
	}

	getCustomerName() {
		setTimeout(() => {
			var existCustomer = this.lstAllCustomer.filter(x => x.CustomerID == this.objSales?.CustomerID)[0];
			if (existCustomer) {
				this.selectedCustomer = JSON.parse(JSON.stringify(existCustomer));
			}
		}, 500);
	}

	selectCustomer(customer: Customer) {
		if (customer) {
			this.selectedCustomer = JSON.parse(JSON.stringify(customer));
			this.objSales.CustomerID = customer.CustomerID;
		} else {
			this.objSales.CustomerID = 0;
		}
	}

	// searchCustomerDropdown(str: string) {
	// 	if (str == '') {
	// 		this.lstCustomer = JSON.parse(JSON.stringify(this.lstAllCustomer));
	// 	} else {
	// 		this.lstCustomer = this.lstAllCustomer.filter(x => x.CustomerName.toLowerCase().includes(str.toLowerCase()))
	// 	}

	// }

	// openCustomerDrop() {
	// 	// this.lstCustomer = JSON.parse(JSON.stringify(this.lstAllCustomer));
	// 	setTimeout(() => {
	// 		this.searchCustomer!.nativeElement.value = '';
	// 		this.searchCustomer!.nativeElement.focus();
	// 	}, 5);
	// }

	createCustomer() {
		// Clear the container
		this.customerForm.clear();
		// Create component.
		const customerRef = this.customerForm.createComponent(CustomerFormComponent);
		customerRef.instance.headerText = 'Add Customer';
		customerRef.instance.buttonText = 'Save';
		// destroy component
		let isShowInstance = customerRef.instance.isShow;
		if (isShowInstance) {
			isShowInstance.emit(true);
			isShowInstance.subscribe((isShow: boolean) => {
				if (!isShow) {
					customerRef.destroy();
					this.customerForm.clear();
				}
			});
		}

		customerRef.instance.newCustomer.subscribe((data: Customer) => {
			var index = this.lstCustomer.findIndex(x => x.CustomerID == data.CustomerID);

			this.lstCustomer.push(data);
			this.lstAllCustomer.push(data);

			this.selectedCustomer = JSON.parse(JSON.stringify(data));
		})
	}
	// customer section: end

	onKeyProductSearch(event: any) {
		var value = event.target.value;

		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			if (value != '') {
				if (event.keyCode != 13) {
					this.searchProductForCart(value);
				}
			} else {
				this.lstProductForCart = [];
				this.noMatchFound = '';
			}
		}, 500);
	}

	searchProductForCart(value: string) {
		this.productService.searchProduct(value)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstProductForCart = response.ResponseObj;
					this.noMatchFound = '';
				} else {
					this.noMatchFound = response.Message;
				}
			})
	}

	productAddToCart(product: VMProduct) {
		if (product && product.SKU != '') {
			var existProduct = this.objSales.lstProduct.filter(x => x.SKU == product.SKU)[0];
			if (!existProduct) {
				product.Qty = 1;
				this.objSales.lstProduct.push(product);
				this.lstProductForCart = [];
				this.searchProductText!.nativeElement.value = '';

				this.changeQty();
			}
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
		var objProduct = JSON.parse(JSON.stringify(product));
		if (objProduct.SKU != '' && objProduct.Qty > 0) {
			var existProduct = this.objSales.lstProduct.filter(x => x.SKU == objProduct.SKU)[0];
			if (!existProduct) {
				objProduct.Qty = 1;
				this.objSales.lstProduct.push(objProduct)
			} else {
				existProduct.Qty++;
			}
		}
		console.log('Sales product: ', this.objSales.lstProduct);
		this.changeQty();
	}

	incrementValue(event: Event, product: VMProduct) {
		const inputElement = (event.target as HTMLElement).parentNode?.querySelector(`input[type="number"]#quantity_${product.SKU}`) as HTMLInputElement;
		if (inputElement) {
			inputElement.focus();
			// inputElement.stepUp();

			product.Qty++;
			this.changeQty();
		}
	}

	decrementValue(event: Event, product: VMProduct) {
		const inputElement = (event.target as HTMLElement).parentNode?.querySelector(`input[type="number"]#quantity_${product.SKU}`) as HTMLInputElement;
		if (inputElement) {
			inputElement.focus();
			// inputElement.stepDown();

			if (product.Qty > 1) {
				product.Qty--;
			}
			this.changeQty();
		}
	}

	changeQty() {
		if (this.objSales.lstProduct.length > 0) {
			this.totalSalesQty = this.objSales.lstProduct.map(p => p.Qty).reduce((a, b) => a + b);
			this.objSales.SubTotal = this.objSales.lstProduct.reduce((acc, obj) => acc + (obj.FinalPrice * obj.Qty), 0);
		} else {
			this.totalSalesQty = 0;
			this.objSales.SubTotal = 0;
		}
		this.calculateTotalPrice();
	}

	calculateTotalPrice() {
		if (this.objSales.SubTotal == 0) {
			this.objSales.Discount = 0;
			this.discountInput = 0;
		}
		this.objSales.TotalSalesPrice = parseFloat(this.objSales.SubTotal.toString()) - parseFloat(this.objSales.Discount.toString());
	}

	clickToRemoveFromList(index: number) {
		this.objSales.lstProduct.splice(index, 1);
		this.changeQty();
	}

	discountModalOpen() {
		this.cancelDiscount();
		this.modalRef = this.modalService.show(this.discountModal);
	}

	addDiscount() {
		if (this.objSales!.lstProduct!.length == 0) {
			this.messageHelper.showMessage(ResponseStatus.warning, 'Please add product before applying discount');
			return;
		}


		if (this.objDiscount.discount > 0) {

			this.objSales.DiscountType = this.objDiscount.discountType;
			if (this.objSales.DiscountType == 1) {
				this.objSales.Discount = parseFloat(this.objSales.SubTotal.toString()) * (parseFloat(this.objDiscount.discount.toString()) / 100);
			} else {
				this.objSales.Discount = this.objDiscount.discount;
			}

			if (this.objSales.Discount > this.objSales.SubTotal) {
				this.objDiscount = {
					discountType: 0,
					discount: 0
				};
				this.objSales.DiscountType = 0;
				this.objSales.Discount = 0;
				this.messageHelper.showMessage(ResponseStatus.warning, "Discount can not exceed total price");
				return;
			}
		} else {
			this.objSales.DiscountType = 0;
			this.objSales.Discount = 0;
		}

		this.selectedDiscountType = null;
		this.objDiscount = {
			discountType: 0,
			discount: 0
		};
		this.calculateTotalPrice();
		this.modalRef?.hide();
	}

	clearDsicount() {
		this.objDiscount = {
			discountType: 1,
			discount: 0
		};
		this.addDiscount();
	}

	discountEntry(discount: any) {
		if (discount > 0) {
			this.objDiscount.discount = parseFloat(discount);
		}
	}

	payAmountEntry(value: any) {
		var amount;
		if (typeof (value) == 'number') {
			amount = value;
		} else {
			amount = value
				? parseFloat((value!.indexOf(',') > -1) ? value!.replaceAll(",", "") : value)
				: 0;
		}

		if (amount > 0) {
			this.objPaymentDTO.Amount = amount;
		} else {
			this.objPaymentDTO.Amount = 0;
		}

		this.objPaymentDTO.RemainingAmount = (this.objPaymentDTO.Amount > 0 && this.objPaymentDTO.Amount < this.objPaymentDTO.TotalPayable) ? (this.objPaymentDTO.TotalPayable - this.objPaymentDTO.Amount) : 0;
		this.objPaymentDTO.ReturnAmount = (this.objPaymentDTO.Amount > 0 && this.objPaymentDTO.Amount > this.objPaymentDTO.TotalPayable) ? (this.objPaymentDTO.Amount - this.objPaymentDTO.TotalPayable) : 0;
	}

	clickToHoldSales() {

	}

	openPaymentModal() {
		this.getAllAccount();
		this.selectedPaymentType = new Account();
		this.isDisablePaymentAmount = false;
		this.objPaymentDTO = new PaymentDTO();
		this.objPaymentDTO.TotalQty = this.totalSalesQty;
		this.objPaymentDTO.TotalPayable = this.objSales.TotalSalesPrice;
		this.objPaymentDTO.Total = this.objSales.SubTotal;
		this.objPaymentDTO.Discount = this.objSales.Discount;

		this.modalRef = this.modalService.show(this.paymentModal, { class: 'modal-lg' });
	}

	saveSales() {
		this.objSales.PayAmount = (this.objPaymentDTO.Amount >= this.objSales.TotalSalesPrice) ? this.objSales.TotalSalesPrice : this.objPaymentDTO.Amount;
		this.objSales.DueAmount = this.objPaymentDTO.RemainingAmount;

		if (this.objSales.CustomerID == 0 && this.objSales.DueAmount > 0) {
			this.messageHelper.showMessage(ResponseStatus.warning, "Walk-in customer should pay complete amount");
			return
		}

		this.objSales.SalesDate = new Date().toLocaleString();
		this.salesService.saveSales(this.objSales)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.objSales = new Sales();
					this.selectedCustomer = new Customer();
					if (this.isEditMode) {
						this.getSalesByCode(this.salesCode)
					}
					this.modalRef?.hide();
				}
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
			})
	}

	getAllAccount() {
		this.accountService.getAllAccount()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstAccount = response.ResponseObj;
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})

	}

	selectPayentType(account: Account) {
		if (account) {
			this.selectedPaymentType = this.lstAccount.filter(x => x.AccountID == account.AccountID)[0];
			this.objSales.AccountID = account.AccountID;

			if (this.selectedPaymentType!.AccountID > 0 && this.selectedPaymentType!.AccountTitle!.toLowerCase() != 'cash') {
				this.payAmountEntry(this.objSales.TotalSalesPrice);
				this.isDisablePaymentAmount = true;
			}

		} else {
			this.objSales.AccountID = 0;
		}
	}

	selectDiscount(event: any) {
		if (event) {
			this.selectedDiscountType = this.lstDiscountType.filter(x => x.Id == event.Id)[0];
			this.objDiscount.discountType = event.Id;
		} else {
			this.objDiscount.discountType = 0;
		}
	}

	cancelDiscount() {
		this.selectedDiscountType = null;
		this.objSales.Discount = 0;
		this.objSales.DiscountType = 0;
		this.objDiscount = {
			discountType: 0,
			discount: 0
		};

	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
