import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'percentage'
})

export class GetPercentagePipe implements PipeTransform {
    constructor() {
    }

    transform(value: number, max: number): number {
        if (!max) {
            return 100;
        }
        if (value == null) {
            return 0;
        }
        return Math.round(100 * value / max);
    }
}
