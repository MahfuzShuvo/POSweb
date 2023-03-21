import { AccountStatement } from './../../models/accountStatement';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-account-statement-sidebar',
	templateUrl: './account-statement-sidebar.component.html',
	styleUrls: ['./account-statement-sidebar.component.css']
})
export class AccountStatementSidebarComponent implements OnInit {

	private destroy: Subject<void> = new Subject<void>();
	@Output() isShow: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() accountTitle: string = '';
	@Output() accountNumber: string = '';
	@Output() lstAccountStatement: AccountStatement[] = [];

	constructor() { }

	ngOnInit() {
	}

	closeSidebar() {
		this.lstAccountStatement = [];
		this.isShow.emit(false);
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
