import { SnPageDto } from '@algotech-ce/core';
import { Pipe, PipeTransform } from '@angular/core';
import { PageUtilsService } from '../services';
import { ResizeOrientation } from '../services/page-utils/resize-orientation.enum';

@Pipe({ name: 'buildPageHandlerId' })
export class BuildPageHandlerIdPipe implements PipeTransform {
    constructor(private pageUtils: PageUtilsService) { }

    transform(snPage: SnPageDto, orientation: ResizeOrientation) {
        return this.pageUtils.buildPageHandlerId(snPage, orientation);
    }
}
