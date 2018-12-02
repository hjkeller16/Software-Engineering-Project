import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'base64'
})
export class Base64Pipe implements PipeTransform {

  transform(value: Uint8Array, args?: any): any {
    return value.reduce((acc, cur) => acc += String.fromCharCode(cur), '')
  }

}
