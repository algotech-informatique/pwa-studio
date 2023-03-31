import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component } from '@angular/core';
import { WidgetComponentInterface } from '../../../../../app/interfaces';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'widget-selector',
  templateUrl: './widget-selector.component.html',
  styleUrls: ['widget-selector.component.scss'],
})
export class WidgetSelectorComponent implements WidgetComponentInterface {

    widget: SnPageWidgetDto;
    snApp: SnAppDto;

    initialize() {
    }
}
