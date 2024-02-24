import { BaseModel } from "./baseModel";
import { SystemUser } from "./systemUser";

export class Branch extends BaseModel {
    BranchID: number;
    BranchName: string;
    Address: string;
    BranchManagerID: number = 0;
    lstAssignedUser: SystemUser[] = [];
}