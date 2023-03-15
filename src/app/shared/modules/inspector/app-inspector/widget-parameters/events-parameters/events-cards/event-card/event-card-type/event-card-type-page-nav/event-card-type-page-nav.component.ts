import { SnAppDto, SnPageDto, SnPageEventDto, SnPageEventPipeDto, SnPageWidgetDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { WidgetInput } from '../../../../../../../../app-custom/dto/widget-input.dto';
import { AppCustomService } from '../../../../../../../../app-custom/services';
import { InputItem } from '../../../../../../../dto/input-item.dto';
import { ListItem } from '../../../../../../../dto/list-item.dto';
import { PageWidgetParametersService } from '../../../../../../../services/page-widget-parameters.service';

@Component({
    selector: 'event-card-type-page-nav',
    templateUrl: './event-card-type-page-nav.component.html',
    styleUrls: ['./event-card-type-page-nav.component.scss'],
})
export class EventCardTypePageNavComponent implements OnInit {

    @Input() event: SnPageEventDto;
    @Input() pipeEvent: SnPageEventPipeDto;
    @Input() app: SnAppDto;
    @Input() page: SnPageDto;
    @Input() widget: SnPageWidgetDto;
    @Output() eventPipeChanged = new EventEmitter<SnPageEventPipeDto>();
    apps: ListItem[];
    pages: ListItem[];
    eventInputs: InputItem[];
    inputsData: Observable<WidgetInput[]>;

    constructor(
        private pageWidgetParametersService: PageWidgetParametersService,
        private appCustomService: AppCustomService,
    ) { }

    ngOnInit() {
        this.apps = this.pageWidgetParametersService.getPublishedApplications(this.app);
        this.pages = this.getPagesList();
        this.loadPipeEventOptions();
    }

    onSelectApp(app: string) {
        this.pipeEvent.action = app;

        const snApp = this.appCustomService.getSnView('app', this.pipeEvent.action) as SnAppDto;
        const mainPage = snApp?.pages?.find(page => page.main)?.id;
        this.pipeEvent.custom = { page: mainPage };

        this.loadPipeEventOptions();
        this.pages = this.getPagesList();
        this.eventPipeChanged.emit(this.pipeEvent);
    }

    onSelectPage(page: string) {
        this.pipeEvent.custom = { page };
        this.loadPipeEventOptions();
        this.eventPipeChanged.emit(this.pipeEvent);
    }

    loadPipeEventOptions() {
        this.eventInputs = this.appCustomService.loadInputs(this.app, this.event, this.pipeEvent);
        if (this.eventInputs?.length > 0) {
            this.inputsData = this.appCustomService.getAvailableInputs$(this.page, this.widget, this.event, this.pipeEvent);
        }
    }

    getPagesList() {
        if (!this.pipeEvent.action) { return []; }
        const snApp = this.appCustomService.getSnView('app', this.pipeEvent.action);
        if (!snApp) { return []; }
        return this.pageWidgetParametersService.getPagesList(snApp as SnAppDto);
    }

    onInputsChanged(inputs: InputItem[]) {
        this.pipeEvent.inputs = inputs.map((input: InputItem) => ({ key: input.key, value: input.value }));
        this.eventPipeChanged.emit(this.pipeEvent);
    }
}
