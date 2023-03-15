import { PairDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScheduledDataDto } from '../../../../dtos';
import { ScheduledTaskService } from '../../services/scheduled-task.service';
import * as _ from 'lodash';

@Component({
    selector: 'scheduled-task-combined',
    templateUrl: './scheduled-task-combined.component.html',
    styleUrls: ['./scheduled-task-combined.component.scss'],
})
export class ScheduledTaskCombinedComponent implements OnInit {

    @Input() inputValue: string;
    @Input() inputdata: PairDto[];
    @Input() value: string;
    @Input() data: ScheduledDataDto;
    @Input() readOnly = false;
    @Output() combinedChanged = new EventEmitter<ScheduledDataDto>();
    @Output() radioChanged = new EventEmitter();

    listRadio: PairDto[] = [];
    listWeek: PairDto[];
    listDays: PairDto[];

    totalDays: string;
    totalWeek: String;

    constructor(
        private scheduleService: ScheduledTaskService,
    ) {
    }

    ngOnInit() {
        this.listDays = this.scheduleService.getListDays();
        this.listWeek = this.scheduleService.getListWeek();
        this.listRadio = this.scheduleService.getListRadio();
    }

    updateRepeat(value) {
        this.data.repeat = parseInt(value, 10);
        this.combinedChanged.emit(this.data);
    }

    updateWeek(value) {
        this.data.repeatWeek = this.transformList(value);
        this.combinedChanged.emit(this.data);
    }

    updateDays(value) {
        this.data.repeatDays = this.transformList(value);
        this.combinedChanged.emit(this.data);
    }

    updateRadio(event, key) {
        this.radioChanged.emit(key);
        event.stopPropagation();
    }

    transformList(list: []): number[] {
        return _.map(list, (value) => {
            return parseInt(value, 10);
        });
    }
}
