import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component } from '@angular/core';
import * as _ from 'lodash';
import { WidgetComponentInterface } from '../../../../../app/interfaces';

@Component({
    selector: 'widget-zone',
    templateUrl: './widget-zone.component.html',
    styleUrls: ['./widget-zone.component.scss'],
})

export class WidgetZoneComponent implements WidgetComponentInterface {
    // custom params

    snApp: SnAppDto;
    widget: SnPageWidgetDto;

    initialize() {
    }
}
