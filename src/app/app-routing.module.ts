import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './common/auth/auth.guard';
import { HomeLayoutComponent } from './common/layout/home-layout.component';
import { LoginLayoutComponent } from './common/layout/login-layout.component';

const routes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{
		path: '',
		component: LoginLayoutComponent,
		children: [
			{ path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule) },
			{ path: 'register', loadChildren: () => import('./modules/register/register.module').then(m => m.RegisterModule) },
			{
				path: '',
				canActivate: [AuthGuard],
				component: HomeLayoutComponent,
				children: [
					{ path: 'pos', loadChildren: () => import('./modules/pos/pos.module').then(m => m.PosModule) },
					{ path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
					{ path: 'product', loadChildren: () => import('./modules/products/products.module').then(m => m.ProductsModule) },
					{ path: 'product-barcode', loadChildren: () => import('./modules/product-barcode/product-barcode.module').then(m => m.ProductBarcodeModule) },
					{ path: 'sales', loadChildren: () => import('./modules/sales/sales.module').then(m => m.SalesModule) },
					{ path: 'purchase', loadChildren: () => import('./modules/purchase/purchase.module').then(m => m.PurchaseModule) },
					{ path: 'category', loadChildren: () => import('./modules/category/category.module').then(m => m.CategoryModule) },
					{ path: 'brand', loadChildren: () => import('./modules/brand/brand.module').then(m => m.BrandModule) },
					{ path: 'customers', loadChildren: () => import('./modules/customers/customers.module').then(m => m.CustomersModule) },
					{ path: 'suppliers', loadChildren: () => import('./modules/suppliers/suppliers.module').then(m => m.SuppliersModule) },
					{ path: 'expense', loadChildren: () => import('./modules/expense/expense.module').then(m => m.ExpenseModule) },
					{ path: 'settings', loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule) },

				]
			}
		]
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
