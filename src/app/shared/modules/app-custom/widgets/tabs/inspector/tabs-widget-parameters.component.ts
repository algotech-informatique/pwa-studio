import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component, EventEmitter, Output } from '@angular/core';
import { ListItem } from '../../../../inspector/dto/list-item.dto';
import { SnTranslateService } from '../../../../smart-nodes';
import { WidgetParametersInterface } from '../../../models/widget-parameters.interface';
import { WidgetTabsService } from '../services/widget-tabs.service';

@Component({
    selector: 'tabs-widget-parameters',
    templateUrl: './tabs-widget-parameters.component.html',
    styleUrls: ['./tabs-widget-parameters.component.scss'],
})
export class TabsWidgetParametersComponent implements WidgetParametersInterface {

    changed = new EventEmitter();

    snApp: SnAppDto;
    widget: SnPageWidgetDto;
    tabs: ListItem[];
    selectedTab: SnPageWidgetDto;
    selectedTabStyle: any;
    unselectedTabStyle: any;

    constructor(
        private widgetTabsService: WidgetTabsService,
        private snTranslateService: SnTranslateService,
    ) { }

    initialize() {
        this.tabs = this.widgetTabsService.getTabs(this.widget)
            .map((tab) => ({
                key: tab?.custom?.tabId,
                value: this.snTranslateService.transform(tab?.custom?.text),
                icon: tab?.custom?.icon,
            }));
        this.selectedTab = this.widgetTabsService.getTabs(this.widget)
            .find((tab) => tab.custom.tabId === this.widget.custom.selectedTabId);
    }

    onSelectTab(selectedTabId: string) {
        this.widget.custom.selectedTabId = selectedTabId;
        this.changed.emit();
    }
}
