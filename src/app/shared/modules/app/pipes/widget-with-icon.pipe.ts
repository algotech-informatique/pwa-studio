import { SnPageWidgetDto } from '@algotech-ce/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'widgetsWithIcon' })
export class WidgetsWithIconPipe implements PipeTransform {

    transform(widgets: SnPageWidgetDto[]): boolean {
        return !widgets.some(widget => !widget?.custom?.icon);
    }

}
