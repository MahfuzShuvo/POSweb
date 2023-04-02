import { ProductFormComponent } from './product-form/product-form.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';

const routes: Routes = [
	{ path: '', component: ProductsComponent },
	{ path: 'add', component: ProductFormComponent },
	{ path: 'edit', component: ProductFormComponent }
]

@NgModule({
	imports: [
		CommonModule,
		SharedModule.forRoot(),
		RouterModule.forChild(routes)
	],
	declarations: [
		ProductsComponent,
		ProductFormComponent
	]
})
export class ProductsModule { }
