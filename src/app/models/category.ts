import { BaseModel } from './baseModel';
export class Category extends BaseModel {
    CategoryID: number;
    CategoryName: string;
    IsParent: boolean = false;
}