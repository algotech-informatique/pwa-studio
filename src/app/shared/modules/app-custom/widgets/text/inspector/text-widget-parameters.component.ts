import { SnATNodeUtilsService } from '../../../../smart-nodes-custom/shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { WidgetParametersInterface } from '../../../models/widget-parameters.interface';
import { Observable } from 'rxjs';
import { AppCustomService } from '../../../services';
import { WidgetInput } from '../../../dto/widget-input.dto';
import { EventTextInputChanged } from '../../../../inspector/dto/event-text-input-changed.dto';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'text-widget-parameters',
  templateUrl: './text-widget-parameters.component.html',
  styleUrls: ['./text-widget-parameters.component.scss'],
})
export class TextWidgetParametersComponent implements WidgetParametersInterface {

    changed = new EventEmitter();

    widget: SnPageWidgetDto;

    snApp: SnAppDto;
    page: SnPageDto;
    items: Observable<WidgetInput[]>;

    constructor(
        protected snATNodeUtils: SnATNodeUtilsService,
        private appCustomService: AppCustomService,
    ) { }

    initialize() {
        this.items = this.appCustomService.getAvailableInputs$(this.page, this.widget);
    }

    onChangeText(event: EventTextInputChanged) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.text = event.value;
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
