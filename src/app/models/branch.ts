import { BaseModel } from "./baseModel";

export class Branch extends BaseModel {
    BranchID: number;
    BranchName: string;
    Address: string;
    BranchManagerID!: number;
}