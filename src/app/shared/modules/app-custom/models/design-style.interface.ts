import { SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';

export interface EleInterface {
    path: string;
    ref: SnPageDto | SnPageWidgetDto;
    widget?: SnPageWidgetDto;
}

export interface StyleInterface {
    style: string;
    value: any;
    elements: EleInterface[];
}
