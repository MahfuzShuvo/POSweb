import { BaseModel } from "./baseModel";

export class Coupon extends BaseModel {
    CouponID: number;
    CouponCode: string;
    Type: number = 1;
    Value: number = 0;
    StartDate!: Date;
    EndDate!: Date;
    CouponDuration: string[];
}