import { SnPageWidgetDto, SnAppDto, SnPageDto } from '@algotech/core';
import { Component, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { WidgetParametersInterface } from '../../../../models/widget-parameters.interface';
import { WidgetInput } from '../../../../dto/widget-input.dto';
import { AppCustomService } from '../../../../services';
import { InspectorSectionButton } from '../../../../../inspector/dto/inspector-section-button.dto';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'selector-widget-parameters',
  templateUrl: './selector-widget-parameters.component.html',
  styleUrls: ['./selector-widget-parameters.component.scss'],
})
export class SelectorWidgetParametersComponent implements WidgetParametersInterface {

    changed = new EventEmitter();

    widget: SnPageWidgetDto;

    snApp: SnAppDto;
    page: SnPageDto;
    items: Observable<WidgetInput[]>;
    addedIndex: number;
    listMode: InspectorSectionButton;

    constructor(
        private appCustomService: AppCustomService,
    ) { }

    initialize() {
        this.items = this.appCustomService.getAvailableInputs$(this.page, this.widget);
    }

    onIconChanged(icon: string) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.icon = icon;
        this.widget.custom = custom;
        this.changed.emit();
    }
}
