export class AppConstant {
    public static readonly FILE_PATH = 'http://localhost:8050/assets/';
    // public static readonly FILE_PATH = 'http://192.168.0.110:8050/assets/';
    public static readonly PURCHASE_STATUS = [
        { Id: 1, Status: 'Recieved' },
        { Id: 2, Status: 'Pending' },
        { Id: 3, Status: 'Ordered' }
    ];
    public static readonly DISCOUNT_TYPE = [
        { Id: 1, Discount: 'Percentage (%)' },
        { Id: 2, Discount: 'Fixed (৳)' },
    ];
}