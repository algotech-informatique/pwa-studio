import { SnAppDto, SnPageDto, SnPageEventPipeDto, SnPageWidgetDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppActionsService } from '../../../../../../../../app/services';
import { ListItem } from '../../../../../../../dto/list-item.dto';
import { PageWidgetParametersService } from '../../../../../../../services/page-widget-parameters.service';

@Component({
    selector: 'event-card-type-call-onload',
    templateUrl: './event-card-type-call-onload.component.html',
    styleUrls: ['./event-card-type-call-onload.component.scss'],
})
export class EventCardTypeCallOnloadComponent implements OnInit {

    @Input() pipeEvent: SnPageEventPipeDto;
    @Input() page: SnPageDto;
    @Input() app: SnAppDto;
    @Input() widget: SnPageWidgetDto;
    @Output() eventPipeChanged = new EventEmitter<SnPageEventPipeDto>();
    widgets: ListItem[];

    constructor(
        private pageWidgetParametersService: PageWidgetParametersService,
        private appActionsService: AppActionsService,
    ) { }

    ngOnInit() {
        this.widgets = this.pageWidgetParametersService.getPageWidgets(this.app, this.page);
    }

    onSelectWidget(widget: string) {
        this.pipeEvent.action = widget;
        this.eventPipeChanged.emit(this.pipeEvent);
    }

    setHighlight(item: ListItem, value: boolean) {
        if (!item.element?.displayState) {
            return;
        }
        if (item.element?.displayState.highlight === value) {
            return;
        }
        if (value) {
            this.appActionsService.applyHighlight(this.app, item.element, true);

        } else {
            this.appActionsService.resetHighlight(this.app);
        }
        item.element.displayState.highlight = value;
    }

}
