export class BaseModel {
    Status: number = 1;
    CreatedBy!: number;
    CreatedDate!: Date;
    UpdatedBy!: number;
    UpdatedDate!: Date;
}