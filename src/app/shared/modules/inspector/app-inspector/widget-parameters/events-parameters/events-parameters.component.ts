import { SnPageWidgetDto, SnPageEventDto, SnAppDto, SnPageDto } from '@algotech/core';
import { Component, Input, Output, SimpleChanges, EventEmitter, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { PageUtilsService } from '../../../../app/services';
import { EventGroup, EventType } from '../../../dto/event-group.dto';
import { InspectorSectionButton } from '../../../dto/inspector-section-button.dto';
import { PageWidgetParametersService } from '../../../services/page-widget-parameters.service';
import { eventGroups } from './events-cards/event-card/events';

@Component({
    selector: 'events-parameters',
    templateUrl: './events-parameters.component.html',
    styleUrls: ['./events-parameters.component.scss'],
})
export class EventsParametersComponent implements OnChanges {

    @Input() widget: SnPageWidgetDto;
    @Input() events: SnPageEventDto[];
    @Input() app: SnAppDto;
    @Input() page: SnPageDto;
    @Output() eventsChanged = new EventEmitter<SnPageEventDto[]>();
    listEvents: SnPageEventDto[] = [];
    listInheritEvents: SnPageEventDto[] = [];
    listMode: InspectorSectionButton[];

    constructor(
        private pageWidgetParametersService: PageWidgetParametersService,
        private pageUtilsService: PageUtilsService,
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.events?.currentValue) {

            const object = (this.widget) ?
                this.page.widgets.some((w) => w.id === this.widget.id) ? 'main' : 'child'
                : 'page';

            const eGroup: EventGroup = _.find(eventGroups, (tp: EventGroup) => tp.object === object);
            this.listEvents = this.events.reduce((results: SnPageEventDto[], event) => {
                const findEv = _.find(eGroup.events, (ev: EventType) => ev.event === event.eventKey || ev.event === '*');
                if (findEv?.types.length > 0) {
                    results.push(event);
                }
                return results;
            }, []);

            this.listMode = _.map(this.listEvents, (event: SnPageEventDto) =>  this.pageWidgetParametersService.getEventModes(event));

            if (object === 'child') {
                this.listInheritEvents = _.map(this.listEvents, (event: SnPageEventDto) => {
                    if (event.custom?.inherit) {
                        const tree = this.pageUtilsService.getTree(null, this.widget, this.page);
                        const inheritCmp = tree.find((item) => item.typeKey === event?.custom?.inherit);
                        return inheritCmp && _.find(inheritCmp.events, { eventKey: event.eventKey });
                    }
                    return null;
                });
            }
        }
    }

    onEventChanged(changedEvent: SnPageEventDto, event: SnPageEventDto) {
        event = changedEvent;
        const emitEvents: SnPageEventDto[] = (this.widget) ? this.widget.events : this.page.events;
        this.eventsChanged.emit(emitEvents);
    }

    onModeChanged(selectedKey: string, index: number) {
        this.listEvents[index].custom.mode = selectedKey;
        const emitEvents: SnPageEventDto[] =
            (this.widget) ? this.widget.events : this.page.events;
        this.eventsChanged.emit(emitEvents);
    }
}
