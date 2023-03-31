import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Pipe, PipeTransform } from '@angular/core';
import { PageWidgetService } from '../services';

@Pipe({ name: 'isShared' })
export class SharedComponentsPipe implements PipeTransform {
    constructor(
        private pageWidgetService: PageWidgetService
    ) { }
    transform(update, app: SnAppDto, widgets?: SnPageWidgetDto[]): boolean {
        return this.pageWidgetService.canWidgetsBeLocked(app, widgets);
  }
}
