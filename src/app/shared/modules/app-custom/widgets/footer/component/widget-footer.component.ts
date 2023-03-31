import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { PageUtilsService } from '../../../../app/services';
import { WidgetComponent } from '../../../../app/components/widget/widget.component';
import { WidgetComponentInterface } from '../../../../app/interfaces';

@Component({
    selector: 'widget-footer',
    templateUrl: './widget-footer.component.html',
    styleUrls: ['widget-footer.component.scss'],
})
export class WidgetFooterComponent implements WidgetComponentInterface {
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
            this.widget.box.y = page.pageHeight - this.widget.box.height;
        }
        for (const widget of this.widgetsCmp.toArray()) {
            widget.calculate();
        }
    }

}
