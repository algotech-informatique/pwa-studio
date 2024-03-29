import { SmartTaskDto } from '@algotech-ce/core';
import { Component, Input, Output, EventEmitter, OnChanges, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import moment from 'moment';
import { ScheduledDataDto } from '../../../../dtos';
import { OptionsElementDto } from '../../../../dtos/options-element.dto';
import { MessageService, SessionsService } from '../../../../services';
import { ScheduledTaskDetailService } from '../../services/scheduled-task-detail.service';

@Component({
    selector: 'scheduled-task-detail',
    templateUrl: './scheduled-task-detail.component.html',
    styleUrls: ['./scheduled-task-detail.component.scss'],
})
export class ScheduledTaskDetailComponent implements OnChanges, AfterViewInit {

    @Input() smartTask: SmartTaskDto;
    @Output() smartTaskChange = new EventEmitter<SmartTaskDto>();
    @Output() deleteTask = new EventEmitter<SmartTaskDto>();
    @Input() readOnly = true;

    @ViewChild('content') content: ElementRef;

    listSmartFlows: OptionsElementDto[];
    data: ScheduledDataDto;
    contentLeft: number;
    selectedSmartFlow: OptionsElementDto;

    constructor(
        private scheduleDataService: ScheduledTaskDetailService,
        private changeDetectorRef: ChangeDetectorRef,
        private sessionsService: SessionsService,
        private messageService: MessageService,
    ) {
        this.listSmartFlows = this.scheduleDataService.getListSmartFlows();
    }

    ngOnChanges() {
        this.data = this.scheduleDataService.transformImportSmartTask(this.smartTask, this.data);
        this.selectedSmartFlow = this.listSmartFlows.find((smartflow) => smartflow.key === this.data.smartFlowKey);
    }

    ngAfterViewInit() {
        this.contentLeft = 0; // this.content.nativeElement.getBoundingClientRect()?.x + 1;
        this.changeDetectorRef.detectChanges();
    }

    saveData() {
        this.data.enabled = !this.data.enabled;
        this._updateTask();
    }

    _updateTask() {
        this.smartTaskChange.emit(this.scheduleDataService.transformExportSmartTask(this.smartTask, this.data));
    }

    updateName(value) {
        this.data.name = value;
        this._updateTask();
    }

    onChangeStartDate(value) {
        this.data.startDate = this.validateDate(value);
        this._updateTask();
    }

    onEndChecked() {
        this.data.endDateActive = !this.data.endDateActive;
        if (!this.data.endDateActive) {
            this.data.endDate = '';
        }
        this._updateTask();
    }

    validateDate(value) {
        if (!moment(value).isValid()) {
            return value;
        }
        if (moment(value).hour() >= 22) {
            return moment(value).set('hour', 22).set('minute', 0).format('YYYY-MM-DDTHH:mm');
        }
        if (moment(value).hour() < 2) {
            return moment(value).set('hour', 2).set('minute', 0).format('YYYY-MM-DDTHH:mm');
        }
        return value;
    }

    onChangeEndDate(value) {
        this.data.endDate = value;
        this._updateTask();
    }

    onTypeChecked(type) {
        this.scheduleDataService.validateType(this.data, type);
        this._updateTask();
    }

    onRadioChanged(value) {
        this.data.repeatType = value;
        this._updateTask();
    }

    onCombinedChanged(value) {
        this.data = value;
        this._updateTask();
    }

    onSelectFlowType(value: OptionsElementDto) {
        this.data.smartFlowKey = value.key;
        this._updateTask();
    }

    onDeleteTask() {
        this.deleteTask.emit(this.smartTask);
    }

    openSmartflowTab() {
        const snModel = this.sessionsService.active.datas.write.snModels.find((sn) =>
            sn.key === this.data.smartFlowKey && sn.type === 'smartflow'
        );
        if (snModel) {
            this.messageService.send('open-tab', snModel);
        }
    }
}

