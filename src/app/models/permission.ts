import { BaseModel } from './baseModel';
export class Permission extends BaseModel {
    PermissionID: number;
    PermissionName: string;
    DisplayName: string;
    Icon: string;
    Sequence: number;
}