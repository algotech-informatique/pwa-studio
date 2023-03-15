import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customerCode' })
export class CustomerCodePipe implements PipeTransform {
    constructor() { }
    transform(value: string): string {
        if (!value) {
            return '';
        }
        if (value.length < 2) {
            return value.toUpperCase();
        }
        return value.substring(0, 2).toUpperCase();
    }
}
