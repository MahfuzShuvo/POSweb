import { MessageHelper } from './common/helper/messageHelper';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { interceptorsLink } from './common/interceptors/indexLink';
import { HeaderService } from './common/service/header.service';
import { AuthGuard } from './common/auth/auth.guard';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './shared.module';
import { CustomToastComponent } from './components/custom-toast/custom-toast.component';

@NgModule({
	declarations: [
		AppComponent,
		CustomToastComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		ToastrModule.forRoot({
			toastComponent: CustomToastComponent,
			closeButton: true,
			positionClass: 'toast-top-right',
			newestOnTop: false,
		}),
		SharedModule.forRoot(),
	],
	providers: [
		interceptorsLink,
		MessageHelper,
		HeaderService,
		AuthGuard
	],
	entryComponents: [CustomToastComponent],
	bootstrap: [AppComponent]
})
export class AppModule { }
