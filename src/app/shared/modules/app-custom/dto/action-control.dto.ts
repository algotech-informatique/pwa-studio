import { SnPageDto, SnPageEventDto, SnPageEventPipeDto, SnPageWidgetDto } from '@algotech/core';

export class ActionControl {
    element: SnPageWidgetDto | SnPageDto;
    type: 'widget' | 'page';
    event?: SnPageEventDto;
    pipe: SnPageEventPipeDto;
    path: string;
}
