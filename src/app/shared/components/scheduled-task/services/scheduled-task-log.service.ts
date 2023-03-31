import { Injectable } from '@angular/core';
import { OptionsObjectDto } from '../../../dtos';
import { TranslateService } from '@ngx-translate/core';
import { SmartTaskDto, SmartTaskLogDto } from '@algotech-ce/core';

import * as _ from 'lodash';
import moment from 'moment'; 

@Injectable()
export class ScheduledTaskLogService {

    constructor(
        private translateService: TranslateService,
    ) {

    }

    getLogList(tasksLogs: SmartTaskLogDto[], smartTask: SmartTaskDto): OptionsObjectDto[] {
        const datas: OptionsObjectDto[] = _.map(tasksLogs, (log: SmartTaskLogDto) => {
            const dataOption: OptionsObjectDto = {
                uuid: log.uuid,
                title: moment(log.runAt).format('DD/MM/YYYY HH:mm'),
                mainLine: this._mainLine(log),
                statusIcon: this._statusIcon(log),
                detailLine: this._detailLine(log),
            };
            return dataOption;
        });
        if (smartTask.nextRunAt && smartTask.enabled) {
            datas.unshift(this._getNextLog(smartTask));
        }
        return datas;
    }

    private _mainLine(log: SmartTaskLogDto) {
        switch (log.status) {
            case 'start':
                return this._startTime(log);
            default:
                return this._logTime(log);
        }
    }

    private _statusIcon(log: SmartTaskLogDto) {
        switch (log.status) {
            case 'start':
                return {
                    icon: 'fa-solid fa-play-circle',
                    status: true,
                    color: '#27AE60',
                };
            case 'failure':
                return {
                    icon: 'fa-solid fa-circle-xmark',
                    status: false,
                    color: '#FF6473',
                };
            case 'success':
                return {
                    icon: 'fa-solid fa-circle-check',
                    status: true,
                    color: '#27AE60',
                };
        }
    }

    private _detailLine(log: SmartTaskLogDto) {
        switch (log.status) {
            case 'failure':
                return log.failureMsg;
            default:
                return '';
        }
    }

    private _getNextLog(smartTask: SmartTaskDto): OptionsObjectDto {
        return {
            uuid: smartTask.uuid,
            title: moment(smartTask.nextRunAt).format('DD/MM/YYYY HH:mm'),
            mainLine: this._nextTime(smartTask.nextRunAt),
            statusIcon: {
                icon: 'fa-solid fa-circle-question',
                status: true,
                color: '#A5A5A5'
            }
        };
    }

    private _logTime(log: SmartTaskLogDto): string {
        const startH = moment(log.runAt).format('LTS');
        const endH = moment(log.finishAt).format('LTS');
        return this.translateService.instant('SMART-TASKS.TASK-LOG.LOG-TIME', {start: startH, end: endH});
    }

    private _nextTime(nextRunAt): string {
        const startH = moment(nextRunAt).format('HH:mm');
        return this.translateService.instant('SMART-TASKS.TASK-LOG.LOG-NEXT-TIME', {start: startH });
    }

    private _startTime(log: SmartTaskLogDto): string {
        const startH = moment(log.runAt).format('HH:mm');
        return this.translateService.instant('SMART-TASKS.TASK-LOG.LOG-START-TIME', {start: startH });
    }

}
