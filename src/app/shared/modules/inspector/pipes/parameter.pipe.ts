import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({ name: 'parameterCode' })
export class ParameterPipe implements PipeTransform {

    constructor() { }

    transform(value: string): string {

        const valueIsPath: boolean = ('' + value).startsWith('{{') && value?.endsWith('}}');
        if (valueIsPath)    {
            const split = value.replace('{{', '').replace('}}', '').split('.');
            return (split.length <= 1) ? value : split.slice(1).join('.');
        } else {
            return value;
        }
    }
}
