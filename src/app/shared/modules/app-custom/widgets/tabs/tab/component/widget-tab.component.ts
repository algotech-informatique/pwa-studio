import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech/core';
import { Component } from '@angular/core';
import { WidgetComponentInterface } from '../../../../../app/interfaces';
import { WidgetTabsService } from '../../services/widget-tabs.service';

@Component({
    selector: 'widget-tab',
    templateUrl: './widget-tab.component.html',
    styleUrls: ['widget-tab.component.scss'],
})
export class WidgetTabComponent implements WidgetComponentInterface {

    widget: SnPageWidgetDto;
    parent: SnPageWidgetDto;
    snApp: SnAppDto;
    page: SnPageDto;
    tabsOrientationStartsWithRow = true;
    css: any;

    constructor(
        private widgetTabsService: WidgetTabsService,
    ) { }

    initialize() {
        this.tabsOrientationStartsWithRow = this.parent?.css?.tabs?.['flex-direction']?.startsWith('row');
        this.calculate();
    }

    calculate() {
        this.css = this.widgetTabsService.getModel(this.widget, null, this.parent)?.css;
    }
}
