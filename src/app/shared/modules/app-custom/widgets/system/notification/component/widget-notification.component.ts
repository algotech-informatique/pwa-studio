import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component } from '@angular/core';
import { WidgetComponentInterface } from '../../../../../app/interfaces';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'widget-notification',
  templateUrl: './widget-notification.component.html',
  styleUrls: ['widget-notification.component.scss'],
})
export class WidgetNotificationComponent implements WidgetComponentInterface {

    widget: SnPageWidgetDto;
    snApp: SnAppDto;

    counterValue = '1+';

    initialize() {
    }
}
