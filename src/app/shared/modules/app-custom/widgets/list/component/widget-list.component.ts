import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WidgetComponentInterface } from '../../../../app/interfaces';
import { AppActionsService, AppSelectionService, PageUtilsService, PageWidgetService } from '../../../../app/services';

@Component({
    selector: 'widget-list',
    templateUrl: './widget-list.component.html',
    styleUrls: ['widget-list.component.scss'],
})
export class WidgetListComponent implements WidgetComponentInterface, OnDestroy {
    widget: SnPageWidgetDto;
    snApp: SnAppDto;

    isSelect = false;
    _height = 0;
    _width = 0;

    get height() {
        const box = this.pageWidget.buildBox(this.widget.group.widgets);
        return box.height + box.y;
    }
    get width() {
        const box = this.pageWidget.buildBox(this.widget.group.widgets);
        return box.width + box.x;
    }

    subscriber: Subscription;

    constructor(
        private appSelection: AppSelectionService,
        private appActions: AppActionsService,
        private pageUtils: PageUtilsService,
        private pageWidget: PageWidgetService) { }

    initialize() {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
        }
        this.subscriber = this.appActions.onUpdate(this.snApp).subscribe(() => {
            this.initialize();
        });
        this.subscriber.add(this.appSelection.onSelect(this.snApp).subscribe(() => {
            this.initialize();
        }));

        if (!this.widget.group) {
            return;
        }
        const elements = this.appSelection.selections.widgets;
        this.isSelect = this.pageUtils.getChilds(this.widget as SnPageWidgetDto).some((e) => elements.includes(e as SnPageWidgetDto));

        this._height = this.height;
        this._width = this.width;
    }

    ngOnDestroy() {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
        }
    }
}
