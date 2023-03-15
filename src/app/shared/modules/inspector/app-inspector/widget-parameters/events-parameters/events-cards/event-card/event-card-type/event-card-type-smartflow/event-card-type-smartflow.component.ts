import { SnAppDto, SnPageDto, SnPageEventDto, SnPageEventPipeDto, SnPageWidgetDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListItem } from '../../../../../../../dto/list-item.dto';
import { PageWidgetParametersService } from '../../../../../../../services/page-widget-parameters.service';
import { AppCustomService } from '../../../../../../../../app-custom/services';
import { InputItem } from '../../../../../../../dto/input-item.dto';
import { WidgetInput } from '../../../../../../../../app-custom/dto/widget-input.dto';
import { Observable } from 'rxjs';

@Component({
    selector: 'event-card-type-smartflow',
    templateUrl: './event-card-type-smartflow.component.html',
    styleUrls: ['./event-card-type-smartflow.component.scss'],
})
export class EventCardTypeSmartflowComponent implements OnInit {

    @Input() event: SnPageEventDto;
    @Input() pipeEvent: SnPageEventPipeDto;
    @Input() app: SnAppDto;
    @Input() page: SnPageDto;
    @Input() widget: SnPageWidgetDto;
    @Output() eventPipeChanged = new EventEmitter<SnPageEventPipeDto>();
    smartflows: ListItem[];
    eventInputs: InputItem[];
    inputsData: Observable<WidgetInput[]>;

    constructor(
        private pageWidgetParametersService: PageWidgetParametersService,
        private appCustomService: AppCustomService,
    ) { }

    ngOnInit() {
        this.smartflows = this.pageWidgetParametersService.getModelsList(this.event.eventKey, 'smartflow');
        this.loadPipeEventOptions();
    }

    onSelectSmartflow(smartflow: string) {
        this.pipeEvent.action = smartflow;
        this.loadPipeEventOptions();
        this.eventPipeChanged.emit(this.pipeEvent);
    }

    loadPipeEventOptions() {
        this.eventInputs = this.appCustomService.loadInputs(this.app, this.event, this.pipeEvent);
        if (this.eventInputs?.length > 0) {
            this.inputsData = this.appCustomService.getAvailableInputs$(this.page, this.widget, this.event, this.pipeEvent);
        }
    }

    onInputsChanged(inputs: InputItem[]) {
        this.pipeEvent.inputs = inputs.map((input: InputItem) => ({ key: input.key, value: input.value }));
        this.eventPipeChanged.emit(this.pipeEvent);
    }

}
