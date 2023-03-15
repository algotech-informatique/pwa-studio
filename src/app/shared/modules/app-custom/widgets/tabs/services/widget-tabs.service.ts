import { SnAppDto, SnPageBoxDto, SnPageDto, SnPageWidgetDto } from '@algotech/core';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { SessionsService } from '../../../../../services';
import { AppContextmenuActionExtension } from '../../../../app/dto';
import { AppActionsService, AppSelectionService, PageUtilsService, PageWidgetService } from '../../../../app/services';
import { generateCss, tab } from '../../_data/data';
import * as _ from 'lodash';
import { TranslateLangDtoService } from '@algotech/angular';
import { UUID } from 'angular2-uuid';

@Injectable()
export class WidgetTabsService {

    constructor(
        private appActions: AppActionsService,
        private appSelections: AppSelectionService,
        private pageWidget: PageWidgetService,
        private sessionService: SessionsService,
        private pageUtils: PageUtilsService,
        private translateLangDtoService: TranslateLangDtoService,
    ) { }

    extendedContextMenu(snApp: SnAppDto): AppContextmenuActionExtension[] {
        return [{
            filter: () =>
                this.appSelections.selections.widgets.length === 1 && this.appSelections.selections.widgets[0].typeKey === 'tabs',
            onClick: () => {
                const tabs = this.pageUtils.getWidgets(snApp).find(w => w.id === this.appSelections.selections?.widgets[0]?.id);
                const unselectedTab = this.getUnselectedTab(tabs);
                const box: SnPageBoxDto = {
                    x: 0,
                    y: 0,
                    height: unselectedTab?.box?.height || tab?.defaultHeight,
                    width: unselectedTab?.box?.width || tab?.defaultWidth,
                };
                const addTab = this.pageWidget.buildWidget(tab.typeKey, box, this.sessionService.active.datas.read.customer.languages);
                addTab.custom.tabId = UUID.UUID();

                if (unselectedTab?.custom?.icon) {
                    addTab.custom.icon = 'fa-solid fa-plus';
                }
                if (unselectedTab && !this.translateLangDtoService.transform(unselectedTab.custom?.text, null, false)) {
                    addTab.custom.text = unselectedTab.custom?.text;
                }

                tabs.group = this.pageWidget.buildGroup([...(tabs.group ? tabs.group.widgets : []), addTab]);
                this.appActions.notifyUpdate(snApp);
                this.appSelections.select(d3.event, snApp, { element: tabs.group.widgets[tabs.group.widgets.length - 1], type: 'widget' });
            },
            title: 'INSPECTOR.WIDGET.TAB.ADD-TAB',
            icon: 'fa-solid fa-plus',
        }];
    }

    getTabs(tabContainer: SnPageWidgetDto) {
        return this.getByType(tabContainer, 'tab');
    }

    getTabModels(tabContainer: SnPageWidgetDto) {
        return this.getByType(tabContainer, 'tabModel');
    }

    getModel(widget: SnPageWidgetDto, page: SnPageDto, parent?: SnPageWidgetDto) {
        parent = (parent ? parent : this.pageUtils.findParentWidget(null, widget, page));
        const selected = parent.custom.selectedTabId === widget.custom.tabId;
        return this.getTabModels(parent).find((w) => w.custom.selected === selected);
    }

    private getByType(tabContainer: SnPageWidgetDto, typeKey: string) {
        return tabContainer
            .group.widgets
            .filter((w) => w.typeKey === typeKey);
    }

    private getUnselectedTab(tabsContainer: SnPageWidgetDto): SnPageWidgetDto {
        return this.getTabs(tabsContainer).find((t) => tabsContainer.custom.selectedTabId !== t.custom.tabId);
    }
}
