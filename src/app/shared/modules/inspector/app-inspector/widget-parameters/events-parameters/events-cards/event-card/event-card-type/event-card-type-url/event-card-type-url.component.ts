import { SnPageDto, SnPageEventDto, SnPageEventPipeDto, SnPageWidgetDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListItem } from '../../../../../../../dto/list-item.dto';
import { WidgetInput } from '../../../../../../../../app-custom/dto/widget-input.dto';
import { Observable } from 'rxjs';
import { AppCustomService } from '../../../../../../../../app-custom/services';

@Component({
    selector: 'event-card-type-url',
    templateUrl: './event-card-type-url.component.html',
    styleUrls: ['./event-card-type-url.component.scss'],
})
export class EventCardTypeUrlComponent implements OnInit {

    @Input() event: SnPageEventDto;
    @Input() pipeEvent: SnPageEventPipeDto;
    @Input() page: SnPageDto;
    @Input() widget: SnPageWidgetDto;
    @Output() eventPipeChanged = new EventEmitter<SnPageEventPipeDto>();
    widgets: ListItem[];
    inputsData: Observable<WidgetInput[]>;

    constructor(
        private appCustomService: AppCustomService,
    ) { }

    ngOnInit() {
        this.inputsData = this.appCustomService.getAvailableInputs$(this.page, this.widget, this.event, this.pipeEvent);
    }

    onSelectUrl(url: string) {
        this.pipeEvent.action = url;
        this.eventPipeChanged.emit(this.pipeEvent);
    }

}
