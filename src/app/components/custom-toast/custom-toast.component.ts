import {
	animate,
	keyframes,
	state,
	style,
	transition,
	trigger
} from '@angular/animations';
import { Component } from '@angular/core';

import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';

@Component({
	selector: '[custom-toast-component]',
	styleUrls: [`./custom-toast.component.css`],
	templateUrl: `./custom-toast.component.html`,
	animations: [
		trigger('flyInOut', [
			state('inactive', style({
				opacity: 1,
			})),
			transition('inactive <=> active', animate('500ms ease-out', keyframes([
				style({
					transform: 'translateX(340px)',
					offset: 0,
					opacity: 0,
				}),
				style({
					offset: .7,
					opacity: 1,
					transform: 'translateX(-20px)'
				}),
				style({
					offset: 1,
					transform: 'translateX(0)',
				})
			]))),
			transition('active => removed', animate('500ms ease-in', keyframes([
				style({
					transform: 'translateX(-20px)',
					opacity: 1,
					offset: .2
				}),
				style({
					opacity: 0,
					transform: 'translateX(340px)',
					offset: 1
				})
			])))
		]),
	],
	preserveWhitespaces: false,
})
export class CustomToastComponent extends Toast {
	// used for demo purposes
	undoString = 'undo';

	// constructor is only necessary when not using AoT
	constructor(
		protected override toastrService: ToastrService,
		public override toastPackage: ToastPackage,
	) {
		super(toastrService, toastPackage);
	}

	action(event: Event) {
		event.stopPropagation();
		this.undoString = 'undid';
		this.toastPackage.triggerAction();
		return false;
	}
}