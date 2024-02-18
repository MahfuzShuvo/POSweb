import { HeaderComponent } from './components/header/header.component';
import { MessageHelper } from './common/helper/messageHelper';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';

import { CustomDateFormatPipe } from './common/pipes/datefilter.pipe';
import { UrlifyPipe } from './common/pipes/Urlify.pipe';
import { PhoneNumberPipe } from './common/pipes/PhoneNumber.pipe';
import { AttachmentExtensionPipe } from './common/pipes/AttachmentExtension.pipe';
import { HttpHelper } from './common/helper/httpHelper';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LoginLayoutComponent } from './common/layout/login-layout.component';
import { HomeLayoutComponent } from './common/layout/home-layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MatchPasswordDirective } from './common/directives/match-password.directive';
import { SafeResourceUrlPipe } from './common/pipes/SafeResourceUrl.pipe';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomSelectDropdownComponent } from './components/custom-select-dropdown/custom-select-dropdown.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
    declarations: [
        HomeLayoutComponent,
        LoginLayoutComponent,
        SidebarComponent,
        HeaderComponent,
        CustomSelectDropdownComponent,

        MatchPasswordDirective,

        // pipes
        CustomDateFormatPipe,
        UrlifyPipe,
        PhoneNumberPipe,
        AttachmentExtensionPipe,
        SafeResourceUrlPipe
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        HttpClientModule,
        RouterModule,
        NgProgressModule.withConfig({
            color: '#39c5f8',
            spinner: false
        }),
        NgProgressHttpModule,
        TabsModule.forRoot(),
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        NgxMaskModule.forRoot()
    ],
    exports: [
        HomeLayoutComponent,
        LoginLayoutComponent,
        SidebarComponent,
        HeaderComponent,
        CustomSelectDropdownComponent,

        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        TabsModule,
        ModalModule,
        TooltipModule,
        BsDropdownModule,
        BsDatepickerModule,
        NgxMaskModule,

        MatchPasswordDirective,

        // pipes
        CustomDateFormatPipe,
        UrlifyPipe,
        PhoneNumberPipe,
        AttachmentExtensionPipe,
        SafeResourceUrlPipe,
    ],
    bootstrap: [AppComponent],
    providers: [MessageHelper]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [HttpHelper]
        };
    }
}
