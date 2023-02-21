import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import * as appEnums from '../enums/appEnums';

@Injectable()
export class MessageHelper {
    options: GlobalConfig | undefined;
    constructor(
        private toastr: ToastrService
    ) { }

    showMessage(code: number, message: string) {
        if (code === appEnums.ResponseStatus.success) {
            this.toastr.success(message, 'Generation POS', {
                // disableTimeOut: true,
                // tapToDismiss: false,
                toastClass: "toast-icon custom-toast-success"
            });
        }
        else if (code === appEnums.ResponseStatus.warning) {
            this.toastr.warning(message, 'Generation POS', {
                // disableTimeOut: true,
                // tapToDismiss: false,
                toastClass: "toast-icon custom-toast-warning"
            });
        }
        else if (code === appEnums.ResponseStatus.info) {
            this.toastr.info(message, 'Generation POS', {
                // disableTimeOut: true,
                // tapToDismiss: false,
                toastClass: "toast-icon custom-toast-info"
            });
        }
        else if (code === appEnums.ResponseStatus.fail) {
            this.toastr.error(message, 'Generation POS', {
                // disableTimeOut: true,
                // tapToDismiss: false,
                toastClass: "toast-icon custom-toast-error"
            });
        } else if (code != null) {
            this.toastr.error(message, 'Generation POS', {
                // disableTimeOut: true,
                // tapToDismiss: false,
                toastClass: "toast-icon custom-toast-error"
            });
        }
    }
}
