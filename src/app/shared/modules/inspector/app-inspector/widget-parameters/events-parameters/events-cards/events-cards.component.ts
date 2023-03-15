import { UUID } from 'angular2-uuid';
import { SnPageEventDto, SnPageDto, SnPageWidgetDto, SnAppDto, SnPageEventPipeDto } from '@algotech/core';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'events-cards',
  templateUrl: './events-cards.component.html',
  styleUrls: ['./events-cards.component.scss'],
})
export class EventsCardsComponent {

    @Input() event: SnPageEventDto;
    @Input() page: SnPageDto;
    @Input() widget: SnPageWidgetDto;
    @Input() app: SnAppDto;
    @Input() hasKey: boolean;

    @Output() eventChanged = new EventEmitter<SnPageEventDto>();
    addedIndex: number;

    onEventPipeChanged(eventPipe: SnPageEventPipeDto, index: number) {
        this.event.pipe[index] = eventPipe;
        this.eventChanged.emit(this.event);
    }

    onRemoveEventPipe(index: number) {
        this.event.pipe.splice(index, 1);
        this.eventChanged.emit(this.event);
    }

    addEvent() {
        const event: SnPageEventPipeDto = {
            id: UUID.UUID(),
            type: '',
            inputs: [],
        };
        this.event.pipe.push(event);
        this.addedIndex = this.event.pipe.length - 1;
        this.eventChanged.emit(this.event);
    }

    onMoveEventPipe(direction: 'up' | 'down', eventPipe: SnPageEventPipeDto, index: number) {
        this.event.pipe.splice(index, 1);
        this.event.pipe.splice(direction === 'up' ? index - 1 : index + 1, 0, eventPipe);
        this.eventChanged.emit(this.event);
    }

}
