import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { LoginBranchComponent } from './login-branch/login-branch.component';

const routes: Routes = [
	{ path: '', component: LoginComponent },
	{ path: 'branch', component: LoginBranchComponent }
]

@NgModule({
	imports: [
		CommonModule,
		SharedModule.forRoot(),
		RouterModule.forChild(routes)
	],
	declarations: [
		LoginComponent,
		LoginBranchComponent
	]
})
export class LoginModule { }
