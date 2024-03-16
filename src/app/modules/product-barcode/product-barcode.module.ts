import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductBarcodeComponent } from './product-barcode.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';

const routes: Routes = [
	{ path: '', component: ProductBarcodeComponent },
	{ path: ':sku', component: ProductBarcodeComponent },
]

@NgModule({
	imports: [
		CommonModule,
		SharedModule.forRoot(),
		RouterModule.forChild(routes),
		NgxBarcodeModule
	],
	declarations: [
		ProductBarcodeComponent
	]
})
export class ProductBarcodeModule { }
