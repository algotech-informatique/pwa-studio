import { Observable } from 'rxjs';
import { ListItem } from '../../../../../dto/list-item.dto';
import { SnPageEventPipeDto, SnAppDto, SnPageDto, SnPageWidgetDto, SnPageEventDto } from '@algotech/core';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { WidgetInput } from '../../../../../../app-custom/dto/widget-input.dto';
import { EventGroup, EventType } from '../../../../../dto/event-group.dto';
import { eventGroups } from './events';
import { EventTypeIconPipe } from '../../../../../pipes/event-type-icon.pipe';
import { EventTypePipe } from '../../../../../pipes/event-type.pipe';
import * as _ from 'lodash';
import { MessageService, SessionsService } from '../../../../../../../services';
import { AppActionsService } from '../../../../../../app/services';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'event-card',
    templateUrl: './event-card.component.html',
    styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnChanges {

    @Input() pipeEvent: SnPageEventPipeDto;
    @Input() event: SnPageEventDto;
    @Input() app: SnAppDto;
    @Input() page: SnPageDto;
    @Input() widget: SnPageWidgetDto;
    @Input() defaultOpen: boolean;
    @Input() isLastPipeEvent: boolean;
    @Input() error: false;
    @Input() hasKey: boolean;
    @Output() eventPipeChanged = new EventEmitter<SnPageEventPipeDto>();
    @Output() eventChanged = new EventEmitter<SnPageEventDto>();
    @Output() removeEventPipe = new EventEmitter();
    @Output() moveEvent = new EventEmitter<'up' | 'down'>();

    inputsData: Observable<WidgetInput[]>;
    eventTypes: ListItem[];
    objectType: 'page' | 'main' | 'child' = 'main';

    constructor(
        private eventTypeIconPipe: EventTypeIconPipe,
        private eventTypePipe: EventTypePipe,
        private messageService: MessageService,
        private sessionsService: SessionsService,
        private appActionsService: AppActionsService,
    ) { }

    ngOnChanges() {
        this.loadEvents();
    }

    loadEvents() {
        this.objectType = (this.widget) ?
            this.page.widgets.includes(this.widget) ? 'main' : 'child'
            : 'page';

        const eGroup: EventGroup = _.find(eventGroups, (tp: EventGroup) => tp.object === this.objectType);
        const eType: EventType = _.find(eGroup.events, (ev: EventType) => ev.event === this.event.eventKey || ev.event === '*');

        this.eventTypes = (eType) ? _.map(eType.types, (t: string) =>
        ({
            key: t,
            value: this.eventTypePipe.transform(t),
            icon: this.eventTypeIconPipe.transform(t),
        })
        ) : [];
    }

    onSelectType(type: string) {
        this.pipeEvent.type = type;
        this.pipeEvent.action = undefined;
        this.eventPipeChanged.emit(this.pipeEvent);
    }

    onEventPipeChanged(pipeEvent: SnPageEventPipeDto) {
        this.eventPipeChanged.emit(pipeEvent);
    }

    onInputKeyChanged(key: string) {
        this.pipeEvent.key = key;
        this.eventPipeChanged.emit(this.pipeEvent);
    }

    keyHasError: (key: string) => boolean = (key: string) => this._keyHasError(key);
    _keyHasError(key: string): boolean {
        return _.some(this.page.dataSources, (ds: SnPageEventPipeDto) => ds.id !== this.pipeEvent.id && ds.key === key);
    }

    removePipeEvent() {
        this.removeEventPipe.emit();
    }

    arrowMoveEvent(direction: 'up' | 'down') {
        this.moveEvent.emit(direction);
    }

    openWorkflowTab($event) {
        $event.stopPropagation();

        const pipeEvent = this.pipeEvent.type === 'page::nav' ? 'app' : this.pipeEvent.type;
        const snModel = this.sessionsService.active.datas.write.snModels.find((sn) =>
            sn.key === this.pipeEvent.action && sn.type === pipeEvent
        );
        switch (pipeEvent) {
            case 'workflow':
            case 'smartflow':
            case 'app':
                if (snModel) {
                    this.messageService.send('open-tab', snModel);
                }
                break;
            case 'page':
                this.appActionsService.notifyZoomPage(this.app, this.page);
                break;
            default:
                break;
        }
    }

}
