import { SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';

export class AppClipboardDto {
    key: string;
    pages: SnPageDto[];
    widgets: SnPageWidgetDto[];
    styles: SnPageWidgetDto[];
    x: number;
    y: number;
}

