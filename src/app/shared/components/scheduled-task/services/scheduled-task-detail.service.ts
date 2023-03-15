import { PairDto, SmartTaskDayofMonthDto, SmartTaskDayofWeekDto, SmartTaskDto } from '@algotech/core';
import { SnATNodeUtilsService } from '../../../modules/smart-nodes-custom/shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { Injectable } from '@angular/core';
import { ScheduledDataDto } from '../../../dtos';

import * as _ from 'lodash';
import { OptionsElementDto } from '../../../dtos/options-element.dto';
import moment from 'moment'; 

@Injectable()
export class ScheduledTaskDetailService {

    constructor(
        private snATNodeUtils: SnATNodeUtilsService,
    ) {
    }

    getListSmartFlows(): OptionsElementDto[] {
        const flows: OptionsElementDto[] = this.snATNodeUtils.getSmartflows();
        const empty: OptionsElementDto = {
            key: '',
            value: '-'
        };
        flows.unshift(empty);
        return flows;
    }

    transformImportSmartTask(smartTask: SmartTaskDto, data: ScheduledDataDto): ScheduledDataDto {

        if (data && data.uuid === smartTask.uuid) {
            return data;
        }
        const newData: ScheduledDataDto = {
            uuid: smartTask.uuid,
            name: smartTask.name,
            enabled: smartTask.enabled,
            startDate: smartTask.periodicity.dateRange.start,
            endDate: smartTask.periodicity.dateRange.end,
            endDateActive: (smartTask.periodicity.dateRange.end) ? true : false,
            byDay: (smartTask.periodicity.repeatEvery.length > 0 && smartTask.periodicity.repeatEvery[0].repeatType === 'days'),
            byMonth: (smartTask.periodicity.repeatEvery.length > 0 && smartTask.periodicity.repeatEvery[0].repeatType === 'months' && smartTask.periodicity.repeatEvery[0].frequency === 1),
            byYear: (smartTask.periodicity.repeatEvery.length > 0 && smartTask.periodicity.repeatEvery[0].repeatType === 'months' && smartTask.periodicity.repeatEvery[0].frequency === 12),
            repeat: this._getRepeatValeur((smartTask.periodicity.repeatEvery.length > 0) ? smartTask.periodicity.repeatEvery[0].frequency : null),
            repeatDays: this._validateInput(smartTask.periodicity.daysOftheMonth),
            repeatWeek: this._validateInput(smartTask.periodicity.daysOftheWeek),
            smartFlowKey: smartTask.flowKey,
            smartType: smartTask.flowType,
            repeatType: this._checkRepeatType(smartTask),
        };
        return newData;
    }

    transformExportSmartTask(smartTask: SmartTaskDto, data: ScheduledDataDto): SmartTaskDto {
        smartTask.name = data.name;
        smartTask.flowType = data.smartType;
        smartTask.flowKey = data.smartFlowKey;
        smartTask.enabled = data.enabled;
        smartTask.periodicity.dateRange.start = this._validateDate(data.startDate, true);
        smartTask.periodicity.dateRange.end = this._validateDate(data.endDate, data.endDateActive);

        smartTask.periodicity.repeatEvery = (data.byDay || data.byMonth || data.byYear) ? [
            {
                repeatType: (data.byDay) ? 'days' : (data.byMonth) ? 'months' : 'months',
                frequency: 1,
            }
        ] : [];
        if (data.byDay) {
            if (data.repeatType === 'every') {
                this.updatePeriodicity(smartTask, data, data.repeat, [], []);
            }

            if (data.repeatType === 'day') {
                this.updatePeriodicity(smartTask, data, 1, data.repeatDays, []);
            }

            if (data.repeatType === 'week') {
                this.updatePeriodicity(smartTask, data, 1, [], data.repeatWeek);
            }
        }

        if (data.byMonth) {
            this.updatePeriodicity(smartTask, data, 1, [], []);
        }

        if (data.byYear) {
            this.updatePeriodicity(smartTask, data, 12, [], []);
        }

        return smartTask;
    }


    updatePeriodicity(smartTask: SmartTaskDto, data: ScheduledDataDto,
        frequency: number | '*', repeatDays: number[], repeatWeek: number[]) {

        smartTask.periodicity.repeatEvery[0].frequency = frequency;
        smartTask.periodicity.daysOftheMonth = this._validateOutputMonth(repeatDays);
        smartTask.periodicity.daysOftheWeek = this._validateOutputWeek(repeatWeek);
        data.repeat = this._getRepeatValeur(frequency);
        data.repeatDays = repeatDays;
        data.repeatWeek = repeatWeek;
    }

    validateType(data: ScheduledDataDto, key: string) {
        data.byDay = (key === 'day') && !data.byDay;
        data.byMonth = (key === 'month') && !data.byMonth;
        data.byYear = (key === 'year') && !data.byYear;
    }

    private _validateDate(date, insert: boolean) {
        if (moment(date).isValid() && insert) {
            return moment(date).format('YYYY-MM-DDTHH:mm:ss');
        }
        return null;
    }

    private _checkRepeatType(smartTask: SmartTaskDto): 'every' | 'week' | 'day' {
        let type: 'every' | 'week' | 'day' = 'every';
        if (smartTask.periodicity.daysOftheMonth?.length !== 0) {
            type = 'day';
        } else if (smartTask.periodicity.daysOftheWeek?.length !== 0) {
            type = 'week';
        } else {
            type = 'every';
        }
        return type;
    }

    private _getRepeatValeur(data): number {
        if (!data) {
            return 1;
        }
        if (data === '*') {
            return 1;
        } else {
            return data;
        }
    }

    private _validateInput(datas): number[] {
        return _.reduce(datas, (result, data) => {
            result.push(data);
            return result;
        }, []);
    }

    private _validateOutputWeek(datas: number[]): SmartTaskDayofWeekDto[] {
        return _.reduce(datas, (result, data) => {
            result.push(data);
            return result;
        }, []);
    }

    private _validateOutputMonth(datas: number[]): SmartTaskDayofMonthDto[] {
        return _.reduce(datas, (result, data) => {
            result.push(data);
            return result;
        }, []);
    }
}
