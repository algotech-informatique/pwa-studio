import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { OpenInspectorType } from '../modules/app/dto/app-selection.dto';
import { SnConnector, SnNode, SnView } from '../modules/smart-nodes';

export class ReportData {
    view: SnView | SnAppDto;
    code: string;
    element: SnPageWidgetDto | SnNode | SnConnector;
    widget?: SnPageWidgetDto;
    parent?: SnNode;
    page?: SnPageDto;
    key?: string;
    type: string;
    path?: string;
    suggestion?: string;
    openInspector?: OpenInspectorType
}
