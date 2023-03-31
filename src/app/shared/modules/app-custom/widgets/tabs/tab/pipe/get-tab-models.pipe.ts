import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Pipe, PipeTransform } from '@angular/core';
import { AppSelectionService, PageUtilsService } from '../../../../../app/services';
import { WidgetTabsService } from '../../services/widget-tabs.service';
import * as _ from 'lodash';

@Pipe({
    name: 'getTabModels'
})

export class GetTabModelsPipe implements PipeTransform {

    constructor(
        private appSelectionService: AppSelectionService,
        private widgetTabsService: WidgetTabsService,
        private pageUtilsService: PageUtilsService) {
        }

    transform(update: any, snApp: SnAppDto, page: SnPageDto, widget: SnPageWidgetDto): any {
        const select: SnPageWidgetDto[] = _.intersection(
            this.appSelectionService.selections.widgets,
            this.widgetTabsService.getTabs(
                this.pageUtilsService.findParentWidget(snApp, widget)
            )
        );

        return _.uniq(select.map((w) => this.widgetTabsService.getModel(w, page)));
    }
}
