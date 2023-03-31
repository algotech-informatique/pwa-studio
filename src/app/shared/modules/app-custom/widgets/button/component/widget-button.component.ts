import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component } from '@angular/core';
import { WidgetComponentInterface } from '../../../../app/interfaces';

@Component({
  selector: 'widget-button',
  templateUrl: './widget-button.component.html',
  styleUrls: ['widget-button.component.scss'],
})
export class WidgetButtonComponent implements WidgetComponentInterface {

    widget: SnPageWidgetDto;
    snApp: SnAppDto;

    initialize() {
    }
}
