import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
	name: 'urlify'
})
export class UrlifyPipe implements PipeTransform {

	transform(text: any): any {
		var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

		return text?.replace(urlRegex, function (url: string) {
			return '<a target="_blank" href="' + url + '">' + url + '</a>';
		});
	}
}
