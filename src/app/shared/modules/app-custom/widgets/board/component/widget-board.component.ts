import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component } from '@angular/core';
import * as _ from 'lodash';
import { WidgetComponentInterface } from '../../../../app/interfaces';
@Component({
    selector: 'widget-board',
    templateUrl: './widget-board.component.html',
    styleUrls: ['./widget-board.component.scss'],
})
export class WidgetBoardComponent implements WidgetComponentInterface {

    snApp: SnAppDto;
    widget: SnPageWidgetDto;

    initialize() {
    }
}
