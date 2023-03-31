import { SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Pipe, PipeTransform } from '@angular/core';
import { PageUtilsService } from '../services';

@Pipe({ name: 'elementSelected' })
export class ElementSelectedPipe implements PipeTransform {

    constructor(private pageUtils: PageUtilsService) {}
    transform(elements: (SnPageWidgetDto|SnPageDto)[], element: SnPageWidgetDto|SnPageDto): 'selected' | 'border' | 'hidden' {
        if (!elements || !element) {
            return 'hidden';
        }
        if (elements.includes(element)) {
            return 'selected';
        }
        if (this.pageUtils.getChilds(element as SnPageWidgetDto).some((e) => elements.includes(e as SnPageWidgetDto))) {
            return 'border';
        }
        return 'hidden';
    }
}
