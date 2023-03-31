import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Pipe, PipeTransform } from '@angular/core';
import { PageUtilsService } from '../../app/services';
import { AppCustomService } from '../services';
import * as _ from 'lodash';

@Pipe({ name: 'inputTransform' })
export class InputTransformPipe implements PipeTransform {

    constructor(
        private pageUtils: PageUtilsService,
        private appCustomService: AppCustomService,
    ) {}

    transform(text: string, snApp: SnAppDto, widget: SnPageWidgetDto): string {
        const inputsRegex = /{{.+?}}/g;
        const page: SnPageDto = this.pageUtils.findPage(snApp, widget);
        return text.replace(inputsRegex, (t) => {
            t = t.slice(2, t.length - 2);
            return this.appCustomService.getWidgetInputName(page, widget, t);
        });
    }
}
