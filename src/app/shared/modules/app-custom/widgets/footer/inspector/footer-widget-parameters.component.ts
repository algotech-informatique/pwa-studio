import { SnPageWidgetDto } from '@algotech/core';
import { Component, EventEmitter, Output } from '@angular/core';
import { WidgetParametersInterface } from '../../../models/widget-parameters.interface';

@Component({
    selector: 'footer-widget-parameters',
    templateUrl: './footer-widget-parameters.component.html',
    styleUrls: ['./footer-widget-parameters.component.scss'],
})
export class FooterWidgetParametersComponent implements WidgetParametersInterface {

    changed = new EventEmitter();

    widget: SnPageWidgetDto;

    initialize() {
    }

}
