import { SnPageEventPipeDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListItem } from '../../../../../../../dto/list-item.dto';
import { PageWidgetParametersService } from '../../../../../../../services/page-widget-parameters.service';

@Component({
    selector: 'event-card-type-smartobjects',
    templateUrl: './event-card-type-smartobjects.component.html',
    styleUrls: ['./event-card-type-smartobjects.component.scss'],
})
export class EventCardTypeSmartobjectsComponent implements OnInit {

    @Input() pipeEvent: SnPageEventPipeDto;
    @Output() eventPipeChanged = new EventEmitter<SnPageEventPipeDto>();
    smartmodels: ListItem[];

    constructor(
        private pageWidgetParametersService: PageWidgetParametersService,
    ) { }

    ngOnInit() {
        this.smartmodels = this.pageWidgetParametersService.getSmartModels();
    }

    onSelectSmartmodel(smartmodel: string) {
        this.pipeEvent.action = smartmodel;
        this.eventPipeChanged.emit(this.pipeEvent);
    }

}
