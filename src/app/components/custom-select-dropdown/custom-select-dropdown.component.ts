import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'custom-select-dropdown',
	templateUrl: './custom-select-dropdown.component.html',
	styleUrls: ['./custom-select-dropdown.component.css'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CustomSelectDropdownComponent),
			multi: true
		}
	]
})
export class CustomSelectDropdownComponent implements OnInit {

	@ViewChild('searchInput') searchInput: ElementRef;

	@Input() isDropup: boolean = false;
	@Input() rightAlign: boolean = false;
	@Input() placeholderText: string = 'Select';
	@Input() Id: string = 'custom';
	@Input() key: any;
	@Input() lstItem: any[] = [];
	@Input() selectedItem: any;
	@Input() isClearSelection: boolean = true;

	@Output() onSelectEvent: EventEmitter<any> = new EventEmitter();

	lstTempItem: any[] = [];
	timer: any;

	constructor() { }

	ngOnInit() {
		// this.lstTempItem = JSON.parse(JSON.stringify(this.lstItem));

	}

	openDropdown() {
		this.lstTempItem = JSON.parse(JSON.stringify(this.lstItem));
		setTimeout(() => {
			this.searchInput!.nativeElement.value = '';
			this.searchInput!.nativeElement.focus();
		}, 5);
	}

	searchDropdwon(event: any) {
		clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			var str = event.target.value;

			if (str == '') {
				this.lstItem = JSON.parse(JSON.stringify(this.lstTempItem));
			} else {
				this.lstItem = this.lstTempItem.filter(x => x[this.key].toLowerCase().includes(str.toLowerCase()))
			}
		}, 200);
	}

	selectItem(item: any) {
		// if (item) {
		this.selectedItem = JSON.parse(JSON.stringify(item));
		this.lstItem = JSON.parse(JSON.stringify(this.lstTempItem));

		this.onSelectEvent.emit(this.selectedItem);
		// }
	}

}
