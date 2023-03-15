import { SmartTasksService } from '@algotech/angular';
import { SmartTaskDto, SmartTaskLogDto } from '@algotech/core';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AlertMessageDto, OptionsObjectDto } from '../../dtos';
import * as _ from 'lodash';
import { ScheduledTaskService } from './services/scheduled-task.service';
import { DialogMessageService, ToastService } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { ScheduledTaskExportService } from './services/scheduled-task-export.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScheduledTaskLogService } from './services/scheduled-task-log.service';

@Component({
    selector: 'app-scheduled-task',
    templateUrl: './scheduled-task.component.html',
    styleUrls: ['./scheduled-task.component.scss'],
})
export class ScheduledTaskComponent implements OnInit, OnChanges {

    @Input() customerKey: string;
    @Input() host: string;

    selectedTask: SmartTaskDto;

    selectedId = '';
    selectedLogs: SmartTaskLogDto[];
    tasksList: SmartTaskDto[];
    smartTaskLogs: OptionsObjectDto[]  = [];
    readOnly: boolean;

    constructor(
        private smartTaksService: SmartTasksService,
        private scheduledTaskService: ScheduledTaskService,
        private scheduledTaskExportService: ScheduledTaskExportService,
        private toastService: ToastService,
        private translateService: TranslateService,
        private scheduledTaskLogService: ScheduledTaskLogService,
        private dialogMessage: DialogMessageService,
    ) { }

    ngOnInit() {
    }

    ngOnChanges() {
        this.getSmartTasksList()
            .subscribe((datas: SmartTaskDto[]) => {
                this.tasksList = this.scheduledTaskService.getListFiltered(datas);
            },
        );
    }

    onSelectTask(optionObject: OptionsObjectDto) {
        if (optionObject && this.tasksList.length !== 0) {
            const index = _.findIndex(this.tasksList, (task: SmartTaskDto) => task.uuid === optionObject.uuid);
            if (index !== -1) {
                this.validateTask(this.tasksList[index]);
                this.updateLogs();
            }
        }
    }

    getSmartTasksList(): Observable<SmartTaskDto[]> {
        return this.smartTaksService.list();
    }

    getLogs(): Observable<OptionsObjectDto[]> {
        return this.smartTaksService.getSmartTaskLogs(this.selectedTask.uuid).pipe(
            map((logs: SmartTaskLogDto[]) => {
                this.selectedLogs = this._getSortData(logs);
                return this.scheduledTaskLogService.getLogList(logs, this.selectedTask);
            }
        ));
    }

    _getSortData(logs: SmartTaskLogDto[]) {
        return logs.sort((a: SmartTaskLogDto, b: SmartTaskLogDto) =>
            (new Date(b.runAt) as any) - (new Date(a.runAt) as any),
        );
    }

    deleteTaks(taskUuid: string) {
        this.smartTaksService.delete(taskUuid).subscribe((data: {acknowledged: boolean}) => {
            if (data.acknowledged) {
                this.toastService.addToast('success', this.translateService.instant('SMART-TASKS.DELETE-TITLE'),
                    this.translateService.instant('SMART-TASKS.DELETE-MESSAGE-OK'), 2000 );
                const index = _.findIndex(this.tasksList, (tsk: SmartTaskDto) => tsk.uuid === taskUuid);
                if (index !== -1) {
                    this.tasksList.splice(index, 1);
                }
                this.selectedId = '';
            } else {
                this.toastService.addToast('error', this.translateService.instant('SMART-TASKS.DELETE-TITLE'),
                    this.translateService.instant('SMART-TASKS.DELETE-MESSAGE-KO'), 2000 );
            }
            this.loadFirstTask();
        });
    }

    onDeleteTask(task: SmartTaskDto) {

        const alert: AlertMessageDto = {
            confirm: this.translateService.instant('DIALOGBOX.DELETE'),
            cancel: this.translateService.instant('DIALOGBOX.CANCEL'),
            title: this.translateService.instant('SMART-TASKS.DELETE-TASK-TITLE'),
            message: this.translateService.instant('SMART-TASKS.DELETE-TASK-MESSAGE'),
            type: 'question',
            messageButton: true,
        };

        this.dialogMessage.getMessageConfirm(alert).pipe().subscribe((result: boolean) => {
            if (result) {
                this.deleteTaks(task.uuid);
            }
        });
    }

    loadFirstTask() {
        const task = _.find(this.tasksList, (tsk: SmartTaskDto) => tsk.enabled === true);
        if (task) {
            this.validateTask(task);
            this.updateLogs();
        } else {
            this.selectedId = '';
            this.selectedTask = null;
        }
    }

    onSmartTaskChange(task: SmartTaskDto) {
        this.smartTaksService.patch(this.selectedTask.uuid, task).pipe()
            .subscribe((data: SmartTaskDto) => {
                this.validateTask(data);
        });
    }

    validateTask(smartTask: SmartTaskDto) {
        this.selectedTask = smartTask;
        this.selectedId = this.selectedTask.uuid;
        this.readOnly = (this.selectedTask.flowType !== 'smartflow') ;
        this.updateList(smartTask);
    }

    onCreateTask() {
        this.selectedTask = this.scheduledTaskService.createNewObject();
        this.smartTaksService.post(this.selectedTask).pipe()
            .subscribe((data: SmartTaskDto) => {
                this.validateTask(data);
                this.smartTaskLogs = [];
        });
    }

    updateList(smartTask: SmartTaskDto) {
        const list: SmartTaskDto[] = this.tasksList;
        const index = _.findIndex(list, (task: SmartTaskDto) => task.uuid === smartTask.uuid);
        if (index !== -1) {
            list[index] = smartTask;
            this.tasksList = _.cloneDeep(list);
        } else {
            this.tasksList.unshift(smartTask);
        }
    }

    onExportCSV() {
        if (!this.scheduledTaskExportService.ConvertToCSV(this.selectedLogs)) {
            this.toastService.addToast(
                'error',
                this.translateService.instant('SMART-TASKS.TASK-LOG.SAVE-FILE'),
                this.translateService.instant('SMART-TASKS.TASK-LOG.SAVE-FILE-KO'),
                3000,
            );
        }
    }

    onReloadLog() {
        this.smartTaksService.getByUuid(this.selectedId).subscribe((data: SmartTaskDto) => {
            this.validateTask(data);
            this.updateLogs();
        });
    }

    updateLogs() {
        this.getLogs().pipe()
            .subscribe((logs: OptionsObjectDto[]) => {
                this.smartTaskLogs = logs;
        });
    }
}
