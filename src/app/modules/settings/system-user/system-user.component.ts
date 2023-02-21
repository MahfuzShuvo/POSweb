import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from 'src/app/common/service/header.service';

@Component({
	selector: 'app-system-user',
	templateUrl: './system-user.component.html',
	styleUrls: ['./system-user.component.css']
})
export class SystemUserComponent implements OnInit {

	constructor(
		private headerService: HeaderService
	) { }

	ngOnInit() {
		Promise.resolve().then(() => this.headerService.setSubTitle('System User'));
	}

}
