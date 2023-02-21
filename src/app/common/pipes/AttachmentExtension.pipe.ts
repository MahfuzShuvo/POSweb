import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extension'
})
export class AttachmentExtensionPipe implements PipeTransform {

  transform(attachment: string): any {
    return attachment.substring(attachment.lastIndexOf('.') + 1, attachment.length).toLowerCase();
  }

}
