import { SnAppDto, SnPageDto, SnPageEventDto, SnPageEventPipeDto, SnPageWidgetDto, WorkflowProfilModelDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListItem } from '../../../../../../../dto/list-item.dto';
import { PageWidgetParametersService } from '../../../../../../../services/page-widget-parameters.service';
import { AppCustomService } from '../../../../../../../../app-custom/services';
import { InputItem } from '../../../../../../../dto/input-item.dto';
import { WidgetInput } from '../../../../../../../../app-custom/dto/widget-input.dto';
import { Observable } from 'rxjs';
import { EventWorkflowPairDto } from '../../../../../../../dto/event-workflow-pair.dto';

@Component({
    selector: 'event-card-type-workflow',
    templateUrl: './event-card-type-workflow.component.html',
    styleUrls: ['./event-card-type-workflow.component.scss'],
})
export class EventCardTypeWorkflowComponent implements OnInit {

    @Input() event: SnPageEventDto;
    @Input() pipeEvent: SnPageEventPipeDto;
    @Input() app: SnAppDto;
    @Input() page: SnPageDto;
    @Input() widget: SnPageWidgetDto;
    @Output() eventPipeChanged = new EventEmitter<SnPageEventPipeDto>();
    workflows: ListItem[];
    eventInputs: InputItem[];
    eventProfiles: WorkflowProfilModelDto[];
    saveModesList: ListItem[];
    inputsData: Observable<WidgetInput[]>;
    showAdvanced: boolean;

    constructor(
        private pageWidgetParametersService: PageWidgetParametersService,
        private appCustomService: AppCustomService,
    ) { }

    ngOnInit() {
        this.workflows = this.pageWidgetParametersService.getModelsList(this.event.eventKey, 'workflow');
        this.loadPipeEventOptions(false);
    }

    onSelectWorkflow(smartflow: string) {
        this.pipeEvent.action = smartflow;
        this.loadPipeEventOptions(true);
        this.eventPipeChanged.emit(this.pipeEvent);
    }

    loadPipeEventOptions(updateAction: boolean) {
        this.eventInputs = this.appCustomService.loadInputs(this.app, this.event, this.pipeEvent);
        if (this.eventInputs?.length > 0) {
            this.inputsData = this.appCustomService.getAvailableInputs$(this.page, this.widget, this.event, this.pipeEvent);
        }

        this.eventProfiles = this.appCustomService.mergeWorkflows(this.pipeEvent, updateAction);
        this.saveModesList = this.pageWidgetParametersService.getWfSaveModes(this.pipeEvent.type);
    }

    onInputsChanged(inputs: InputItem[]) {
        this.pipeEvent.inputs = inputs.map((input: InputItem) => ({ key: input.key, value: input.value }));
        this.eventPipeChanged.emit(this.pipeEvent);
    }

    onSelectSaveMode(saveMode: string) {
        this.pipeEvent.custom.savingMode = saveMode;
        this.eventPipeChanged.emit(this.pipeEvent);
    }

    onUniqueChanged(value: boolean) {
        this.pipeEvent.custom.unique = value;
        this.eventPipeChanged.emit(this.pipeEvent);
    }

    onProfilesChanged(pair: EventWorkflowPairDto[]) {
        this.pipeEvent.custom.pair = pair;
        this.eventPipeChanged.emit(this.pipeEvent);
    }

    toggleShowAdvanced() {
        this.showAdvanced = !this.showAdvanced;
    }

}
