import { Directive, HostListener } from '@angular/core';

@Directive({
	selector: '[appBanglaNumberFormat]'
})
export class BanglaNumberFormatDirective {

	@HostListener('input', ['$event'])
	onInput(event: any) {
		const value = event.target.value;
		const transformedValue = this.transformValue(value);
		event.target.value = transformedValue;
	}

	transformValue(value: string): string {
		// Remove any non-digit characters
		const newValue = value.replace(/[^\d]/g, '');

		// Format the number in Bangladeshi style
		let formattedValue = '';
		let counter = 0;
		for (let i = newValue.length - 1; i >= 0; i--) {
			if (counter === 2) {
				formattedValue = ',' + formattedValue;
				counter = 0;
			}
			formattedValue = newValue.charAt(i) + formattedValue;
			counter++;
		}
		return formattedValue;
	}

}
