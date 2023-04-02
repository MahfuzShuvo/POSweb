import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { VMAccountStatement } from 'src/app/models/VM/vmAccountStatement';

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
	@Output() lstAccountStatement: VMAccountStatement[] = [];
	@Output() totalInBalance: number = 0;
	@Output() totalOutBalance: number = 0;

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
