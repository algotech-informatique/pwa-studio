import { SnPageWidgetDto } from '@algotech/core';
import { Component, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { WidgetParametersInterface } from '../../../../../models/widget-parameters.interface';

@Component({
  selector: 'magnet-property-widget-parameters',
  templateUrl: './magnet-property-widget-parameters.component.html',
  styleUrls: ['./magnet-property-widget-parameters.component.scss'],
})
export class MagnetPropertyWidgetParametersComponent implements WidgetParametersInterface {

    widget: SnPageWidgetDto;

    changed = new EventEmitter();
    initialize() {
    }
}
