import { AccountsComponent } from './accounts/accounts.component';
import { SystemUserComponent } from './system-user/system-user.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { PermissionComponent } from './permission/permission.component';
import { PaymentStatusComponent } from './payment-status/payment-status.component';

const routes: Routes = [
	{ path: '', redirectTo: 'system-user', pathMatch: 'full' },
	{
		path: '',
		component: SettingsComponent,
		children: [
			{ path: 'system-user', component: SystemUserComponent },
			{ path: 'accounts', component: AccountsComponent },
			{ path: 'permission', component: PermissionComponent },
			{ path: 'payment-status', component: PaymentStatusComponent }
		]
	},
]

@NgModule({
	imports: [
		CommonModule,
		SharedModule.forRoot(),
		RouterModule.forChild(routes)
	],
	declarations: [SettingsComponent]
})
export class SettingsModule { }
