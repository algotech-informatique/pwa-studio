import { SnPageWidgetDto } from '@algotech/core';
import { Pipe, PipeTransform } from '@angular/core';

const width = 210;
const gap = 20;
@Pipe({
    name: 'previewSize'
})
export class PreviewSizePipe implements PipeTransform {
    transform(widget: SnPageWidgetDto, colCount: number): number {
        const large = width - (gap * (colCount - 1));
        if (widget.box.width >= widget.box.height) {
            return (large * ((100 / colCount) / 100)) / widget.box.width;
        } else {
            return (large * ((100 / colCount) / 100)) / widget.box.height;
        }
    }
}
