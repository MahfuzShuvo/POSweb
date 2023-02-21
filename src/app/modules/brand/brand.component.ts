import { HeaderService } from './../../common/service/header.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-brand',
	templateUrl: './brand.component.html',
	styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {

	constructor(
		private headerService: HeaderService,
		private activatedRoute: ActivatedRoute
	) {
		const headerTitle = this.activatedRoute.parent?.snapshot.url[0].path;
		Promise.resolve().then(() => this.headerService.setTitle(headerTitle!.toString()));
	}

	ngOnInit() {
	}

}
