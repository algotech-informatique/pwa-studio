import { AppActionsService } from '../../../app/services/app-actions/app-actions.service';
import { SnAppDto } from '@algotech/core';
import { Component, Input, AfterViewInit, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { templatesLibrary } from '../../../app-custom/widgets/templates/templates';
import { AppTemplateCategoryDto } from '../../../app-custom/dto/app-template-category.dto';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'widget-selector',
  templateUrl: './widget-selector.component.html',
  styleUrls: ['widget-selector.component.scss'],
})
export class WidgetSelectorComponent implements AfterViewInit, OnChanges {

    @Input() snApp: SnAppDto;

    widgetTypes: AppTemplateCategoryDto[] = templatesLibrary;
    selectedWidgetType: AppTemplateCategoryDto;

    constructor(
        private appActions: AppActionsService,
        private ref: ChangeDetectorRef,
    ) {
        this.selectedWidgetType = this.widgetTypes.find(widget => widget.key === 'button');
    }

    ngAfterViewInit() {
        this.notify();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.selectedWidgetType = this.widgetTypes.find(widget => widget.key === 'button');
    }

    selectType(key: string) {
        this.selectedWidgetType = this.widgetTypes.find(widget => widget.key === key);
        this.notify();
    }

    notify() {
        this.ref.detectChanges();
        this.appActions.notifyShowedWidgetSelector(this.snApp);
    }
}
