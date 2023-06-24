import { BaseModel } from './baseModel';
import { VMAttachment } from './VM/vmAttachment';
export class Brand extends BaseModel {
    BrandID: number;
    BrandName: string;
    Description: string;
    Logo: string
    LogoAttachment: VMAttachment = new VMAttachment();
}