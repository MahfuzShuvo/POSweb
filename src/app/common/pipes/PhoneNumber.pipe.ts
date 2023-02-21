import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'PhoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

	transform(value: any): any {
		try {
			value = value.replace(/\D/g, "");

			if (value[0] == '1') {

				value = value.substring(1);

				var Quotient: number = Math.floor(value.length / 3);
				if (Quotient === 0) {
					return value;
				} else if (Quotient === 1) {
					return "1 (" + value.slice(0, 3) + ") " + value.slice(3);
				} else if (Quotient === 2 || Quotient > 2) {
					return "1 (" + value.slice(0, 3) + ") " + value.slice(3, 6) + "-" + value.slice(6);
				}
			} else {
				var Quotient: number = Math.floor(value.length / 3);
				if (Quotient === 0) {
					return value;
				} else if (Quotient === 1) {
					return "(" + value.slice(0, 3) + ") " + value.slice(3);
				} else if (Quotient === 2 || Quotient > 2) {
					return "(" + value.slice(0, 3) + ") " + value.slice(3, 6) + "-" + value.slice(6);
				}
			}

		} catch (error) {
			return value;
		}
	}

}
