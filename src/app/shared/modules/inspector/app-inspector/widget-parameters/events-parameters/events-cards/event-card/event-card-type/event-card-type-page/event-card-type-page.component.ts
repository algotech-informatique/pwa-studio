import { SnAppDto, SnPageDto, SnPageEventDto, SnPageEventPipeDto, SnPageWidgetDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListItem } from '../../../../../../../dto/list-item.dto';
import { PageWidgetParametersService } from '../../../../../../../services/page-widget-parameters.service';
import { AppCustomService } from '../../../../../../../../app-custom/services';
import { InputItem } from '../../../../../../../dto/input-item.dto';
import { WidgetInput } from '../../../../../../../../app-custom/dto/widget-input.dto';
import { Observable } from 'rxjs';

@Component({
    selector: 'event-card-type-page',
    templateUrl: './event-card-type-page.component.html',
    styleUrls: ['./event-card-type-page.component.scss'],
})
export class EventCardTypePageComponent implements OnInit {

    @Input() event: SnPageEventDto;
    @Input() pipeEvent: SnPageEventPipeDto;
    @Input() app: SnAppDto;
    @Input() page: SnPageDto;
    @Input() widget: SnPageWidgetDto;
    @Output() eventPipeChanged = new EventEmitter<SnPageEventPipeDto>();
    pages: ListItem[];
    eventInputs: InputItem[];
    inputsData: Observable<WidgetInput[]>;

    constructor(
        private pageWidgetParametersService: PageWidgetParametersService,
        private appCustomService: AppCustomService,
    ) { }

    ngOnInit() {
        this.pages = this.pageWidgetParametersService.getPagesList(this.app);
        this.loadPipeEventOptions();
    }

    onSelectPage(page: string) {
        this.pipeEvent.action = page;
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
