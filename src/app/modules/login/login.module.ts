import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';

const routes: Routes = [
  { path: '', component: LoginComponent }
]

@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
