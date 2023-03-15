import { SmartTaskDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { OptionsObjectDto } from '../../../../dtos';
import { ScheduledTaskService } from '../../services/scheduled-task.service';

@Component({
    selector: 'scheduled-task-list',
    templateUrl: './scheduled-task-list.component.html',
    styleUrls: ['./scheduled-task-list.component.scss'],
})
export class ScheduledTaskListComponent implements OnInit, OnChanges {

    @Input() smartTasks: SmartTaskDto[];
    @Input() selectedId = '';

    @Output() selectedTask = new EventEmitter<OptionsObjectDto>();
    @Output() createTask = new EventEmitter();

    activeSelected = true;
    smartTaskActive: OptionsObjectDto[];
    smartTaskInActive: OptionsObjectDto[];

    constructor(
        private scheduledTaskService: ScheduledTaskService,
    ) { }

    ngOnInit() { }

    ngOnChanges() {
        this.smartTaskActive  = this.scheduledTaskService.getObjectsList(this.smartTasks, true);
        this.smartTaskInActive = this.scheduledTaskService.getObjectsList(this.smartTasks, false);
        if (this.selectedId) {
            const index = _.findIndex(this.smartTaskInActive, (task: OptionsObjectDto) => task.uuid ===  this.selectedId);
            this.activeSelected = (index === -1);
        }
    }

    onSelectedObject(optionObject: OptionsObjectDto) {
        this.selectedTask.emit(optionObject);
    }

    createNewTask() {
        this.createTask.emit();
    }

    onSelectedOption(value) {
        this.activeSelected = value;
    }
}
