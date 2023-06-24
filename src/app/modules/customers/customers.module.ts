import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { CustomerFormComponent } from 'src/app/components/forms/customer-form/customer-form.component';

const routes: Routes = [
	{ path: '', component: CustomersComponent }
]

@NgModule({
	imports: [
		CommonModule,
		SharedModule.forRoot(),
		RouterModule.forChild(routes)
	],
	declarations: [
		CustomersComponent,
		CustomerFormComponent
	]
})
export class CustomersModule { }
