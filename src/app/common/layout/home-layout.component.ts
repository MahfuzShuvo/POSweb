import { Component } from '@angular/core';

@Component({
	selector: 'app-home-layout',
	template: `
		<app-sidebar></app-sidebar>
		<app-header></app-header>
		<main>
			<ng-progress></ng-progress>
			<div class="main-content">
				<router-outlet></router-outlet>
			</div>
		</main>
	`
})
export class HomeLayoutComponent { }
