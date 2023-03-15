import { SnPageEventDto, SnPageEventPipeDto, SnPageWidgetDto } from '@algotech/core';

export class FormulaWidget {
    element: SnPageWidgetDto;
    property: any;
    type: 'event' | 'custom' | 'makeList';
    event?: SnPageEventDto;
    action?: SnPageEventPipeDto;
    path: string;
}
