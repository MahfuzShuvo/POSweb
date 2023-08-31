import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesComponent } from './sales.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { SalesViewComponent } from './sales-view/sales-view.component';

const routes: Routes = [
	{ path: '', component: SalesComponent },
	{ path: 'view/:salesCode', component: SalesViewComponent }
]

@NgModule({
	imports: [
		CommonModule,
		SharedModule.forRoot(),
		RouterModule.forChild(routes)
	],
	declarations: [
		SalesComponent,
		SalesViewComponent
	]
})
export class SalesModule { }
