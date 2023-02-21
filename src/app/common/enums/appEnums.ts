export enum RecordStatus {
	Active = 1,
	Inactive = 2,
	Deleted = 9
}

export enum Gender {
	Male = 1,
	Female = 2,
	Other = 3
}

export enum ResponseStatus {
	success = 1,
	fail = 2,
	warning = 3,
	internalServerError = 500,
	info = 300,
	unAuthorize = 401
}

export enum TaxType {
	Exclusive = 1,
	Inclusive = 2
}

export enum Unit {
	Piece = 1,
	Kilogram = 2,
	Meter = 3,
	Liter = 4
}

export enum DataType {
	Image = 1,
	Text = 2,
	Stream = 3,
	Video = 4
}

export enum UserRole {
	SuperAdmin = 1,
	CompanyAdmin = 2,
	Agent = 3,
	Participant = 4
}

export enum CommonAction {
	Active = 1,
	Inactive = 2,
	Remove = 3,
	View = 4,
	Edit = 5
}

export let monthList = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

export const NO_OF_AUTO_COMPLETE_DATA = 100;
export const NO_OF_ROW_DATA = 20;
