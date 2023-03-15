import { SnPageWidgetDto, SnAppDto, SnPageDto } from '@algotech/core';
import { Component, EventEmitter, Output } from '@angular/core';
import { WidgetParametersInterface } from '../../../models/widget-parameters.interface';

@Component({
  selector: 'custom-widget-parameters',
  templateUrl: './custom-widget-parameters.component.html',
  styleUrls: ['./custom-widget-parameters.component.scss'],
})
export class CustomWidgetParametersComponent implements WidgetParametersInterface {

    widget: SnPageWidgetDto;

    snApp: SnAppDto;
    page: SnPageDto;
    subWidgets: SnPageWidgetDto[];

    changed = new EventEmitter();

    constructor(
    ) { }

    initialize() {}

}

