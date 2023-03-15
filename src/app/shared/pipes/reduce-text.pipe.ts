import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({ name: 'reduceText' })
export class ReduceTextPipe implements PipeTransform {

    constructor() { }

    transform(value: string[]): string {
        if (value.length === 0) {
            return '';
        }
        const text: string[] = _.map(value, (val: string) => {
            if (!val) {
                return '';
            }
            return val.substring(0, 1).toUpperCase();
        });
        return text.join('');
    }
}
