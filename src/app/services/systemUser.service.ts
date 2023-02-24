import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHelper } from '../common/helper/httpHelper';

@Injectable({
  providedIn: 'root'
})
export class SystemUserService {

  constructor(
    private httpHelper: HttpHelper
  ) { }

  getAllSystemUser(): Observable<any> {
    const url = 'api/SystemUser/GetAllSystemUser';
    return this.httpHelper.postHelper(url);
  }

  saveSystemUser(obj: any): Observable<any> {
    const url = 'api/SystemUser/SaveSystemUser';
    return this.httpHelper.postHelper(url, obj);
  }

}
