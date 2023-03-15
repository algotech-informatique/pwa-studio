import { SnPageDto, SnPageWidgetDto } from '@algotech/core';

export type AppSelectionType = 'sharedWidget' | 'widget' | 'page'| 'app';
export type OpenInspectorType = 'node' | 'inspector' | 'application' | 'behavior' | 'conditions' | 'layers';
export class AppSelectionEvent {
    openInspector?: OpenInspectorType;
    element: SnPageWidgetDto | SnPageDto;
    type: AppSelectionType;
    rightClickMode?: boolean;
    ignoreUnselect?: boolean;
}
