import { SnPageWidgetDto, SnAppDto, SnPageDto, SnPageEventDto } from '@algotech/core';
import { Component, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { WidgetInput } from '../../../../dto/widget-input.dto';
import { WidgetParametersInterface } from '../../../../models/widget-parameters.interface';
import { AppCustomService } from '../../../../services';

@Component({
  selector: 'circle-widget-parameters',
  templateUrl: './circle-widget-parameters.component.html',
  styleUrls: ['./circle-widget-parameters.component.scss'],
})
export class CircleWidgetParametersComponent implements WidgetParametersInterface {

    widget: SnPageWidgetDto;

    snApp: SnAppDto;
    page: SnPageDto;
    subWidgets: SnPageWidgetDto[];

    changed = new EventEmitter();

    constructor(
    ) { }

    initialize() {}
}
