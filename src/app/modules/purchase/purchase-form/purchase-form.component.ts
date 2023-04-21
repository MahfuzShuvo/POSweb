import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MessageHelper } from 'src/app/common/helper/messageHelper';
import { DataService } from 'src/app/common/service/data.service';
import { HeaderService } from 'src/app/common/service/header.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
	selector: 'app-purchase-form',
	templateUrl: './purchase-form.component.html',
	styleUrls: ['./purchase-form.component.css']
})
export class PurchaseFormComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	purchaseCode: string = '';

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
			this.purchaseCode = (!params['slug']) ? '' : params['slug'];
			if (this.purchaseCode != '') {
				setTimeout(() => {

					this.getPurchaseByCode(this.purchaseCode);
				}, 500);
			}
		});
		Promise.resolve().then(() => this.headerService.setTitle(childRoute!.toString() + ' ' + headerTitle!.toString()));
	}

	ngOnInit() {

	}

	getPurchaseByCode(purchaseCode: string) {

	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
