import { AppConstant } from './../../common/constants/appConstant';
import { DataService } from './../../common/service/data.service';
import { MessageHelper } from './../../common/helper/messageHelper';
import { BrandService } from './../../services/brand.service';
import { HeaderService } from './../../common/service/header.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Brand } from 'src/app/models/brand';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { VMAttachment } from 'src/app/models/VM/vmAttachment';

@Component({
	selector: 'app-brand',
	templateUrl: './brand.component.html',
	styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('brandFormModal', { read: TemplateRef }) brandFormModal: TemplateRef<any>;
	@ViewChild('deleteModal', { read: TemplateRef }) deleteModal: TemplateRef<any>;
	lstBrand: Brand[] = [];
	objBrand: Brand = new Brand();
	totalCount: number = 0;
	modalRef?: BsModalRef;
	lstAllBrand: Brand[] = [];
	buttonText: string;
	modalTitle: string;
	file: any = {};
	uploadedImageUrl: string = '';

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private brandService: BrandService,
		private messageHelper: MessageHelper,
		public dataService: DataService,
		private modalService: BsModalService
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		Promise.resolve().then(() => this.headerService.setTitle(headerTitle!.toString()));
	}

	ngOnInit() {
		this.getAllBrand();
	}

	getAllBrand() {
		this.brandService.getAllBrand()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstBrand = response.ResponseObj;
					this.lstAllBrand = JSON.parse(JSON.stringify(this.lstBrand));
					this.totalCount = response.TotalCount
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})

	}

	searchBrand(searchText: string) {
		var str = searchText!.replace(/\s/g, '').toLowerCase();		// remove spaces

		if (str == '') {
			this.lstBrand = JSON.parse(JSON.stringify(this.lstAllBrand));
		} else {
			this.lstBrand = this.lstAllBrand.filter(x => x.BrandName.replace(/\s/g, '').toLowerCase().includes(str));
		}
		this.totalCount = this.lstBrand.length;
	}

	createBrand() {
		this.modalTitle = 'Add';
		this.buttonText = 'Save';

		this.uploadedImageUrl = '';
		this.objBrand = new Brand();

		this.modalRef = this.modalService.show(this.brandFormModal);
	}

	editBrand(brand: Brand) {
		this.modalTitle = 'Edit';
		this.buttonText = 'Update';

		this.uploadedImageUrl = '';
		this.objBrand = new Brand();
		this.objBrand = JSON.parse(JSON.stringify(brand));
		this.uploadedImageUrl = this.objBrand.Logo;

		this.modalRef = this.modalService.show(this.brandFormModal);
	}

	saveBrand() {
		this.dataService.isFormSubmitting.next(true);
		if (this.objBrand.Logo?.includes(AppConstant.FILE_PATH)) {
			this.objBrand.Logo = this.objBrand.Logo.replace(AppConstant.FILE_PATH, '');
		}

		this.brandService.saveBrand(this.objBrand)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					var index = this.lstBrand.findIndex(x => x.BrandID == response.ResponseObj.BrandID);
					if (index > -1) {
						this.lstBrand.splice(index, 1, response.ResponseObj);
						this.lstAllBrand.splice(index, 1, response.ResponseObj);
					} else {
						this.lstBrand.push(response.ResponseObj);
						this.lstAllBrand.push(response.ResponseObj);
					}

					this.objBrand = new Brand();
					this.modalRef?.hide();
				}
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
			})
	}

	deleteBrand(brand: Brand) {
		this.objBrand = new Brand();
		this.objBrand = JSON.parse(JSON.stringify(brand));

		this.modalRef = this.modalService.show(this.deleteModal);
	}

	confirmDelete() {
		if (this.objBrand.BrandID > 0) {
			this.brandService.deleteBrand(this.objBrand.BrandID)
				.pipe(takeUntil(this.destroy))
				.subscribe((response: ResponseMessage) => {
					if (response.ResponseCode == ResponseStatus.success) {
						var index = this.lstBrand.findIndex(x => x.BrandID == this.objBrand.BrandID);
						if (index > -1) {
							this.lstBrand.splice(index, 1);
							this.lstAllBrand.splice(index, 1);
							this.objBrand = new Brand();
							this.modalRef?.hide()
						}
					}
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				})
		}
	}

	uploadFile(event: any) {

		this.objBrand.LogoAttachment = new VMAttachment();
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
		this.objBrand.LogoAttachment.Name = fileName;
		this.objBrand.LogoAttachment.Extension = fileExtension;
		reader.onload = () => {
			this.objBrand.LogoAttachment.Content = reader.result as string;
			this.uploadedImageUrl = this.objBrand.LogoAttachment.Content ?? '';
		};
	}

	clearUpload() {
		this.uploadedImageUrl = '';
		this.file = {};
		this.objBrand.LogoAttachment = new VMAttachment();
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
