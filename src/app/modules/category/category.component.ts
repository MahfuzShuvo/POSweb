import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from 'src/app/common/enums/appEnums';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { DataService } from 'src/app/common/service/data.service';
import { HeaderService } from 'src/app/common/service/header.service';
import { Category } from 'src/app/models/category';
import { ResponseMessage } from 'src/app/models/DTO/responseMessage';
import { CategoryService } from 'src/app/services/category.service';

@Component({
	selector: 'app-category',
	templateUrl: './category.component.html',
	styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@ViewChild('categoryFormModal', { read: TemplateRef }) categoryFormModal: TemplateRef<any>;
	@ViewChild('deleteModal', { read: TemplateRef }) deleteModal: TemplateRef<any>;
	lstCategory: Category[] = [];
	lstAllCategory: Category[] = [];
	objCategory: Category = new Category();
	totalCount: number = 0;
	modalRef?: BsModalRef;
	buttonText: string;
	modalTitle: string;

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute,
		private categoryService: CategoryService,
		private messageHelper: MessageHelper,
		public dataService: DataService,
		private modalService: BsModalService
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		Promise.resolve().then(() => this.headerService.setTitle(headerTitle!.toString()));
	}

	ngOnInit() {
		this.getAllCategory();
	}

	toggleStatus(event: any) {
		this.objCategory.Status = (event.target.checked) ? 1 : 2;
	}

	getAllCategory() {
		this.categoryService.getAllCategory()
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					this.lstCategory = response.ResponseObj;
					this.lstAllCategory = JSON.parse(JSON.stringify(this.lstCategory));
					this.totalCount = response.TotalCount
				} else {
					this.messageHelper.showMessage(response.ResponseCode, response.Message);
				}
			})

	}

	searchCategory(searchText: string) {
		var str = searchText!.replace(/\s/g, '').toLowerCase();		// remove spaces

		if (str == '') {
			this.lstCategory = JSON.parse(JSON.stringify(this.lstAllCategory));
		} else {
			this.lstCategory = this.lstAllCategory.filter(x => x.CategoryName.replace(/\s/g, '').toLowerCase().includes(str));
		}
		this.totalCount = this.lstCategory.length;
	}

	createCategory() {
		this.modalTitle = 'Add';
		this.buttonText = 'Save';

		this.objCategory = new Category();
		this.modalRef = this.modalService.show(this.categoryFormModal);
	}

	editCategory(brand: Category) {
		this.modalTitle = 'Edit';
		this.buttonText = 'Update';

		this.objCategory = new Category();
		this.objCategory = JSON.parse(JSON.stringify(brand));
		this.modalRef = this.modalService.show(this.categoryFormModal);
	}

	saveCategory() {
		this.dataService.isFormSubmitting.next(true);
		this.categoryService.saveCategory(this.objCategory)
			.pipe(takeUntil(this.destroy))
			.subscribe((response: ResponseMessage) => {
				if (response.ResponseCode == ResponseStatus.success) {
					var index = this.lstCategory.findIndex(x => x.CategoryID == response.ResponseObj.CategoryID);
					if (index > -1) {
						this.lstCategory.splice(index, 1, response.ResponseObj);
						this.lstAllCategory.splice(index, 1, response.ResponseObj);
					} else {
						this.lstCategory.push(response.ResponseObj);
						this.lstAllCategory.push(response.ResponseObj);
					}

					this.objCategory = new Category();
					this.modalRef?.hide();
				}
				this.messageHelper.showMessage(response.ResponseCode, response.Message);
			})
	}

	deleteCategory(brand: Category) {
		this.objCategory = new Category();
		this.objCategory = JSON.parse(JSON.stringify(brand));

		this.modalRef = this.modalService.show(this.deleteModal);
	}

	confirmDelete() {
		if (this.objCategory.CategoryID > 0) {
			this.categoryService.deleteCategory(this.objCategory.CategoryID)
				.pipe(takeUntil(this.destroy))
				.subscribe((response: ResponseMessage) => {
					if (response.ResponseCode == ResponseStatus.success) {
						var index = this.lstCategory.findIndex(x => x.CategoryID == this.objCategory.CategoryID);
						if (index > -1) {
							this.lstCategory.splice(index, 1);
							this.lstAllCategory.splice(index, 1);
							this.objCategory = new Category();
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
