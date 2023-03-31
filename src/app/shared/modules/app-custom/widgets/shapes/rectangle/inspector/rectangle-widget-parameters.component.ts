import { SnPageWidgetDto, SnAppDto, SnPageDto, SnPageEventDto } from '@algotech-ce/core';
import { Component, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { WidgetParametersInterface } from '../../../../models/widget-parameters.interface';

@Component({
  selector: 'rectangle-widget-parameters',
  templateUrl: './rectangle-widget-parameters.component.html',
  styleUrls: ['./rectangle-widget-parameters.component.scss'],
})
export class RectangleWidgetParametersComponent implements WidgetParametersInterface {

    widget: SnPageWidgetDto;

    snApp: SnAppDto;
    page: SnPageDto;
    subWidgets: SnPageWidgetDto[];

    changed = new EventEmitter();

    constructor(
    ) { }

    initialize() {}
}
