import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { EventEmitter } from '@angular/core';

export interface WidgetComponentInterface {
    snApp: SnAppDto;
    page?: SnPageDto;
    widget: SnPageWidgetDto;
    master?: boolean;
    parent?: SnPageWidgetDto;
    initialize: () => void;
}
