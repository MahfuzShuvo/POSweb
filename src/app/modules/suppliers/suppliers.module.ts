import { SharedModule } from './../../shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuppliersComponent } from './suppliers.component';
import { SupplierFormComponent } from 'src/app/components/forms/supplier-form/supplier-form.component';

const routes: Routes = [
	{ path: '', component: SuppliersComponent }
]

@NgModule({
	imports: [
		CommonModule,
		SharedModule.forRoot(),
		RouterModule.forChild(routes)
	],
	declarations: [
		SuppliersComponent,
		SupplierFormComponent
	]
})
export class SuppliersModule { }
