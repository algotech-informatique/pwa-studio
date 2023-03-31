import { SnAppDto, SnPageDto, SnPageEventDto, SnPageEventPipeDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'inherit-event-cards',
    templateUrl: './inherit-event-cards.component.html',
    styleUrls: ['./inherit-event-cards.component.scss'],
})
export class InheritEventCardsComponent implements OnInit {

    @Input() event: SnPageEventDto;
    @Input() inheritEvent: SnPageEventDto;
    @Input() page: SnPageDto;
    @Input() widget: SnPageWidgetDto;
    @Input() app: SnAppDto;
    @Output() eventChanged = new EventEmitter<SnPageEventDto>();
    allowedEvents: boolean[];

    ngOnInit() {
        this.allowedEvents = _.map(this.inheritEvent?.pipe, (action: SnPageEventPipeDto) => {
            return !_.includes(this.event.custom?.disableActions, action.id);
        });
    }

    clickAction(index: number) {
        this.allowedEvents[index] = !this.allowedEvents[index];
        if (this.allowedEvents[index]) {
            const indexRemove: number = this.event.custom?.disabledActions?.indexOf(this.inheritEvent.pipe[index].id);
            this.event.custom?.disableActions?.splice(indexRemove, 1);
        } else {
            this.event.custom.disableActions.push(this.inheritEvent.pipe[index].id);
        }
        this.eventChanged.emit(this.event);
    }

}
