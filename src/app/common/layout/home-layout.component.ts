import { Component } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
	selector: 'app-home-layout',
	template: `
		<app-sidebar [class.toggled-sidebar]="dataService.isSidebarToggle | async"></app-sidebar>
		<app-header [class.toggled-header]="dataService.isSidebarToggle | async"></app-header>
		<main [class.toggled-main]="dataService.isSidebarToggle | async">
			<ng-progress></ng-progress>
			<div class="main-content">
				<router-outlet></router-outlet>
			</div>
		</main>
	`
})
export class HomeLayoutComponent {
	constructor(
		public dataService: DataService
	) { }
}
