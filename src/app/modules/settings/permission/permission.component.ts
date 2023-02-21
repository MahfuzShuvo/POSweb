import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/common/service/header.service';

@Component({
	selector: 'app-permission',
	templateUrl: './permission.component.html',
	styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit {

	constructor(
		private headerService: HeaderService
	) { }

	ngOnInit() {
		Promise.resolve().then(() => this.headerService.setSubTitle('Permission'));
	}

}
