import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component } from '@angular/core';
import { WidgetComponentInterface } from '../../../../../app/interfaces';

@Component({
  selector: 'widget-circle',
  templateUrl: './widget-circle.component.html',
  styleUrls: ['widget-circle.component.scss'],
})
export class WidgetCircleComponent implements WidgetComponentInterface {

    snApp: SnAppDto;
    widget: SnPageWidgetDto;

    initialize() {
    }
}
