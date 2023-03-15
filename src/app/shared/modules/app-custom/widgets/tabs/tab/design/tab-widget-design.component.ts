import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech/core';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppActionsService, AppSelectionService, PageUtilsService } from '../../../../../app/services';
import { WidgetParametersInterface } from '../../../../models/widget-parameters.interface';
@Component({
    selector: 'tab-widget-design',
    templateUrl: './tab-widget-design.component.html',
    styleUrls: ['./tab-widget-design.component.scss'],
})
export class TabWidgetDesignComponent implements WidgetParametersInterface, OnDestroy {

    changed = new EventEmitter();

    snApp: SnAppDto;
    page: SnPageDto;
    widget: SnPageWidgetDto;
    tabWidth: number;
    tabHeight: number;
    widthDisabled = false;
    heightDisabled = false;
    subscription: Subscription;
    tabModels: SnPageWidgetDto[] = [];

    constructor(
        public appActions: AppActionsService,
        private pageUtilsService: PageUtilsService,
        private appSelectionService: AppSelectionService,
    ) { }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    initialize() {
        const tabsContainer = this.pageUtilsService.getParent(this.snApp, this.widget) as SnPageWidgetDto;
        const orientation = tabsContainer?.css?.tabs?.['flex-direction'];
        this.tabWidth = orientation === 'row' ? this.widget?.box?.width : tabsContainer?.box?.width;
        this.tabHeight = orientation === 'row' ? tabsContainer?.box?.height : this.widget?.box?.height;
        this.widthDisabled = orientation !== 'row';
        this.heightDisabled = orientation === 'row';

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onWidgetWidthChanged(width: number) {
        this.appSelectionService.selections.widgets.forEach((widget) => {
            if (widget.typeKey === 'tab') {
                widget.box.width = width;
            }
        });
        this.changed.emit();
    }

    onWidgetHeightChanged(height: number) {
        this.appSelectionService.selections.widgets.forEach((widget) => {
            if (widget.typeKey === 'tab') {
                widget.box.height = height;
            }
        });
        this.changed.emit();
    }

    onChanged() {
        this.changed.emit();
    }
}
