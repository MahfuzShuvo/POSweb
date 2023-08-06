import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseComponent } from './purchase.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { PurchaseFormComponent } from './purchase-form/purchase-form.component';
import { PurchaseViewComponent } from './purchase-view/purchase-view.component';

const routes: Routes = [
	{ path: '', component: PurchaseComponent },
	{ path: 'add', component: PurchaseFormComponent },
	{ path: 'edit/:purchaseCode', component: PurchaseFormComponent },
	{ path: 'view/:purchaseCode', component: PurchaseViewComponent }
]

@NgModule({
	imports: [
		CommonModule,
		SharedModule.forRoot(),
		RouterModule.forChild(routes)
	],
	declarations: [
		PurchaseComponent,
		PurchaseFormComponent,
		PurchaseViewComponent
	]
})
export class PurchaseModule { }
