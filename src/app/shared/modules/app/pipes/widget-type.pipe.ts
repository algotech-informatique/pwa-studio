import { SnPageWidgetDto } from '@algotech/core';
import { Pipe, PipeTransform } from '@angular/core';
import { WidgetTypeDto } from '../dto';
import { PageWidgetService } from '../services';

@Pipe({ name: 'widgetType' })
export class WidgetTypePipe implements PipeTransform {
    constructor() {}
    transform(widget: SnPageWidgetDto): WidgetTypeDto {
        return PageWidgetService.getType(widget);
    }
}
