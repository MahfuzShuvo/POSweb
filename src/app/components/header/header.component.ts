import { HeaderService } from './../../common/service/header.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	title: string = '';

	constructor(
		private headerService: HeaderService
	) { }

	ngOnInit() {
		this.headerService.title.subscribe(title => {
			this.title = title;
		});
	}

}
