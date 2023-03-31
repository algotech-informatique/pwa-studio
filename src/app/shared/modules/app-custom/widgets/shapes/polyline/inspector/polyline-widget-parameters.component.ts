import { SnPageWidgetDto, SnAppDto, SnPageDto, SnPageEventDto } from '@algotech-ce/core';
import { Component, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { WidgetInput } from '../../../../dto/widget-input.dto';
import { WidgetParametersInterface } from '../../../../models/widget-parameters.interface';
import { AppCustomService } from '../../../../services';

@Component({
  selector: 'polyline-widget-parameters',
  templateUrl: './polyline-widget-parameters.component.html',
  styleUrls: ['./polyline-widget-parameters.component.scss'],
})
export class PolylineWidgetParametersComponent implements WidgetParametersInterface {

    widget: SnPageWidgetDto;

    snApp: SnAppDto;
    page: SnPageDto;
    subWidgets: SnPageWidgetDto[];

    changed = new EventEmitter();

    constructor(
    ) { }

    initialize() {}
}
