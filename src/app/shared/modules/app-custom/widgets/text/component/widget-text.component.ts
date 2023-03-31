import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component } from '@angular/core';
import { WidgetComponentInterface } from '../../../../app/interfaces';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'widget-text',
  templateUrl: './widget-text.component.html',
  styleUrls: ['widget-text.component.scss'],
})
export class WidgetTextComponent implements WidgetComponentInterface {

    widget: SnPageWidgetDto;
    snApp: SnAppDto;

    initialize() {
    }

}
