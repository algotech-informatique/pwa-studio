import { SnAppDto, SnPageWidgetDto } from '@algotech/core';
import { Component } from '@angular/core';
import { WidgetComponentInterface } from '../../../../../app/interfaces';

@Component({
  selector: 'widget-rectangle',
  templateUrl: './widget-rectangle.component.html',
  styleUrls: ['widget-rectangle.component.scss'],
})
export class WidgetRectangleComponent implements WidgetComponentInterface {

    snApp: SnAppDto;
    widget: SnPageWidgetDto;

    initialize() {
    }
}
