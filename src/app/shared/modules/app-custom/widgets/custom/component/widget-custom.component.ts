
import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { ChangeDetectorRef, Component, QueryList, ViewChildren } from '@angular/core';
import { AppSelectionService } from '../../../../app/services';
import { WidgetComponent } from '../../../../app/components/widget/widget.component';
import { WidgetComponentInterface } from '../../../../app/interfaces';

@Component({
    selector: 'widget-custom',
    templateUrl: './widget-custom.component.html',
    styleUrls: ['widget-custom.component.scss'],
})
export class WidgetCustomComponent implements WidgetComponentInterface {
    @ViewChildren(WidgetComponent) widgetsCmp: QueryList<WidgetComponent>;

    snApp: SnAppDto;
    widget: SnPageWidgetDto;
    widgets: SnPageWidgetDto[] = [];
    master = true;

    constructor(private ref: ChangeDetectorRef, public appSelection: AppSelectionService) {
    }

    initialize() {
    }

    calculate() {
        for (const widget of this.widgetsCmp.toArray()) {
            widget.calculate();
        }
    }
}
