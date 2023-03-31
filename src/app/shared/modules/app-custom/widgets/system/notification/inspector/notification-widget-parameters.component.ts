import { SnPageWidgetDto, SnAppDto, SnPageDto } from '@algotech-ce/core';
import { Component, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { WidgetParametersInterface } from '../../../../models/widget-parameters.interface';
import { WidgetInput } from '../../../../dto/widget-input.dto';
import { AppCustomService } from '../../../../services';
import { InspectorSectionButton } from '../../../../../inspector/dto/inspector-section-button.dto';
import { EventTextInputChanged } from '../../../../../inspector/dto/event-text-input-changed.dto';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'notification-widget-parameters',
  templateUrl: './notification-widget-parameters.component.html',
  styleUrls: ['./notification-widget-parameters.component.scss'],
})
export class NotificationWidgetParametersComponent implements WidgetParametersInterface {

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

    onChangeText(event: EventTextInputChanged) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.counter = event.value;
        this.widget.custom = custom;
        if (event.notify) {
            this.changed.emit();
        }
    }

    onChangePreview(data) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.preview = data;
        this.widget.custom = custom;
        this.changed.emit();
    }
}
