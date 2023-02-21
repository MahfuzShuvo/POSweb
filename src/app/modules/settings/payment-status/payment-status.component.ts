import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/common/service/header.service';

@Component({
	selector: 'app-payment-status',
	templateUrl: './payment-status.component.html',
	styleUrls: ['./payment-status.component.css']
})
export class PaymentStatusComponent implements OnInit {

	constructor(
		private headerService: HeaderService
	) { }

	ngOnInit() {
		Promise.resolve().then(() => this.headerService.setSubTitle('Payment Status'));
	}

}
