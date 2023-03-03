import { BaseModel } from './baseModel';
export class SystemUser extends BaseModel {
    SystemUserID: number;
    FullName: string;
    Username: string;
    Password: string;
    Email: string;
    PhoneNumber: string;
    City: string;
    State: string;
    Zip: string;
    Address: string;
    RoleID: number = 0;
}