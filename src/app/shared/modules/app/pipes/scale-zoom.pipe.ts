import { SnPageWidgetDto } from '@algotech/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'scaleZoom' })
export class ScaleZoomPipe implements PipeTransform {

    transform(k: number, mode: '+/-' | '-' | '+' = '+', minAccept?: number): number {
        k = minAccept ? Math.max(k, minAccept) : k;
        switch (mode) {
            case '+/-':
                return 1 / k;
            case '+':
                return k <= 1 ? 1 : (1 / k);
            case '-':
                return k >= 1 ? 1 : (1 / k);
        }
    }
}
