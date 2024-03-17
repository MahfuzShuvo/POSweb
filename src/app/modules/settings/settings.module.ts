import { AccountStatementSidebarComponent } from './../../components/account-statement-sidebar/account-statement-sidebar.component';
import { SystemUserFormComponent } from '../../components/forms/systemUser-form/systemUser-form.component';
import { AccountsComponent } from './accounts/accounts.component';
import { SystemUserComponent } from './system-user/system-user.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { RolePermissionComponent } from './role-permission/role-permission.component';
import { UnitComponent } from './unit/unit.component';
import { BranchComponent } from './branch/branch.component';
import { CouponComponent } from './coupon/coupon.component';

const routes: Routes = [
	{ path: '', redirectTo: 'system-user', pathMatch: 'full' },
	{
		path: '',
		component: SettingsComponent,
		children: [
			{ path: 'system-user', component: SystemUserComponent },
			{ path: 'accounts', component: AccountsComponent },
			{ path: 'role-permission', component: RolePermissionComponent },
			{ path: 'branch', component: BranchComponent },
			{ path: 'unit', component: UnitComponent },
			{ path: 'coupon', component: CouponComponent },
		]
	},
]

@NgModule({
	imports: [
		CommonModule,
		SharedModule.forRoot(),
		RouterModule.forChild(routes)
	],
	declarations: [
		SettingsComponent,
		SystemUserComponent,
		SystemUserFormComponent,
		RolePermissionComponent,
		AccountsComponent,
		AccountStatementSidebarComponent,
		UnitComponent,
		BranchComponent,
		CouponComponent
	]
})
export class SettingsModule { }
