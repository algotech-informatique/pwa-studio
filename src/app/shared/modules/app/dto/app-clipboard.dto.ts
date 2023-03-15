import { SnPageDto, SnPageWidgetDto } from '@algotech/core';

export class AppClipboardDto {
    key: string;
    pages: SnPageDto[];
    widgets: SnPageWidgetDto[];
    styles: SnPageWidgetDto[];
    x: number;
    y: number;
}

