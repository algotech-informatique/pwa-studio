import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({ name: 'showAppErrorsContains' })
export class ShowAppErrorsContainsPipe implements PipeTransform {

    transform(errors: string[], path?: string): boolean {
        if (!errors) {
            return false;
        }
        if (!path) {
            return errors.length > 0;
        }
        return _.some(errors, (value: string) => value.startsWith(path));
    }
}
