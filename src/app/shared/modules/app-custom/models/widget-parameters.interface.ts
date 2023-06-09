import { EventEmitter } from '@angular/core';
import { SnPageWidgetDto, SnAppDto, SnPageDto } from '@algotech-ce/core';

export interface WidgetParametersInterface {
    widget: SnPageWidgetDto;
    changed: EventEmitter<any>;
    snApp?: SnAppDto;
    page?: SnPageDto;
    initialize: () => void;
}
