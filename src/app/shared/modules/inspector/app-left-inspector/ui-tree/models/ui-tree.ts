import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';

export interface UITree {
    element: SnPageWidgetDto | SnPageDto;
    type: 'page' | 'widget';
    children?: UITree[];
    open: boolean;
    parent?: UITree;
    snApp: SnAppDto;
    editMode?: boolean;
}
