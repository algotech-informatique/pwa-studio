import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { PageUtilsService } from '../../../../app/services';
import { WidgetComponent } from '../../../../app/components/widget/widget.component';
import { WidgetComponentInterface } from '../../../../app/interfaces';

@Component({
    selector: 'widget-header',
    templateUrl: './widget-header.component.html',
    styleUrls: ['widget-header.component.scss'],
})
export class WidgetHeaderComponent implements WidgetComponentInterface {
    @ViewChildren(WidgetComponent) widgetsCmp: QueryList<WidgetComponent>;

    widget: SnPageWidgetDto;
    snApp: SnAppDto;

    constructor(
        private pageUtilsService: PageUtilsService,
    ) { }

    initialize() {
    }

    calculate() {
        const page = this.pageUtilsService.findPage(this.snApp, this.widget);
        if (page) {
            this.widget.box.y = 0;
        }
        for (const widget of this.widgetsCmp.toArray()) {
            widget.calculate();
        }
    }

}
