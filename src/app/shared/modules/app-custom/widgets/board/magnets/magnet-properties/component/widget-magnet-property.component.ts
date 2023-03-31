import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component } from '@angular/core';
import { WidgetComponentInterface } from '../../../../../../app/interfaces';

@Component({
  selector: 'widget-magnet-property',
  templateUrl: './widget-magnet-property.component.html',
  styleUrls: ['widget-magnet-property.component.scss'],
})
export class WidgetMagnetPropertyComponent implements WidgetComponentInterface {

    widget: SnPageWidgetDto;
    snApp: SnAppDto;

    initialize() {
    }
}
