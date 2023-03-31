import { SnPageWidgetDto, SnAppDto, SnPageDto, SnPageEventDto } from '@algotech-ce/core';
import { Component, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { WidgetParametersInterface } from '../../../models/widget-parameters.interface';
import { WidgetInput } from '../../../dto/widget-input.dto';
import { AppCustomService } from '../../../services';
import { InspectorSectionButton } from '../../../../inspector/dto/inspector-section-button.dto';
import { EventTextInputChanged } from '../../../../inspector/dto/event-text-input-changed.dto';

@Component({
  selector: 'button-widget-parameters',
  templateUrl: './button-widget-parameters.component.html',
  styleUrls: ['./button-widget-parameters.component.scss'],
})
export class ButtonWidgetParametersComponent implements WidgetParametersInterface {

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

    onChangeTitle(event: EventTextInputChanged) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.title = event.value;
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
