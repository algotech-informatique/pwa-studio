import { SnAppDto, SnPageWidgetDto } from '@algotech/core';
import { ChangeDetectorRef, Component, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionsService } from '../../../../../services';
import { AppSelectionService, PageWidgetService } from '../../../../app/services';
import { WidgetComponent } from '../../../../app/components/widget/widget.component';
import { WidgetComponentInterface } from '../../../../app/interfaces';

@Component({
    selector: 'widget-tabs',
    templateUrl: './widget-tabs.component.html',
    styleUrls: ['widget-tabs.component.scss'],
})
export class WidgetTabsComponent implements WidgetComponentInterface, OnDestroy {
    @ViewChildren(WidgetComponent) widgetsCmp: QueryList<WidgetComponent>;

    widget: SnPageWidgetDto;
    snApp: SnAppDto;
    subscriber: Subscription;
    showTabs: boolean;

    constructor(
        public appSelection: AppSelectionService,
        private pageWidget: PageWidgetService,
        private sessionService: SessionsService,
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    initialize() {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
        }

        this.showTabs = false;
        this.changeDetectorRef.detectChanges();
        this.showTabs = true;
    }

    calculate() {
        if (!this.widget.group.widgets.some((w) => w.typeKey === 'tabModel')) {
            const box = { x: 0, y: 0, height: 0, width: 0 };
            const defaultTab = this.pageWidget.buildWidget('tabModel', box, this.sessionService.active.datas.read.customer.languages);
            const selectedTab = this.pageWidget.buildWidget('tabModel', box, this.sessionService.active.datas.read.customer.languages);
            selectedTab.custom.selected = true;

            this.widget.group = this.pageWidget.buildGroup([defaultTab, selectedTab, ...(this.widget.group ?
                this.widget.group.widgets : [])]);
        }
        for (const widget of this.widgetsCmp.toArray()) {
            widget.calculate();
        }
    }

    ngOnDestroy() {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
        }
    }

}
