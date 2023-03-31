import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component } from '@angular/core';
import { WidgetComponentInterface } from '../../../../../app/interfaces';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'widget-profile',
  templateUrl: './widget-profile.component.html',
  styleUrls: ['widget-profile.component.scss'],
})
export class WidgetProfileComponent implements WidgetComponentInterface {

    widget: SnPageWidgetDto;
    snApp: SnAppDto;

    initialize() {
    }
}
