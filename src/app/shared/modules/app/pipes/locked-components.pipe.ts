import { SnPageWidgetDto } from '@algotech-ce/core';
import { Pipe, PipeTransform } from '@angular/core';
import { PageWidgetService } from '../services';

@Pipe({ name: 'isLocked' })
export class LockedComponentsPipe implements PipeTransform {
  constructor(
    private pageWidgetService: PageWidgetService
  ) { }
  transform(update, section: string, widgets?: SnPageWidgetDto[]): boolean {
    return this.pageWidgetService.isSectionLocked(section, widgets);
  }
}
