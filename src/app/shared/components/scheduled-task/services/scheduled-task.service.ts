import { PairDto, SmartTaskDayofWeekDto, SmartTaskDto, SmartTaskPeriodicityDto } from '@algotech/core';
import { Injectable } from '@angular/core';
import { OptionsObjectDto } from '../../../dtos';
import { TranslateService } from '@ngx-translate/core';
import { SessionsService } from '../../../services';
import { UUID } from 'angular2-uuid';

import * as _ from 'lodash';
import moment from 'moment'; 

@Injectable()
export class ScheduledTaskService {

    constructor(
        private translateService: TranslateService,
        private sessionService: SessionsService,
    ) {
    }

    createNewObject(): SmartTaskDto {
        return {
            uuid: UUID.UUID(),
            enabled: false,
            name: this.translateService.instant('SMART-TASKS.TASK-PROPERTY-NEW-TASK'),
            flowKey: '',
            flowType: 'smartflow',
            periodicity: {
                dateRange: {
                    end: null,
                    start: null
                },
                repeatEvery: [
                    {
                        repeatType: 'days',
                        frequency: 1,
                    }
                ],
                daysOftheMonth: [],
                daysOftheWeek: [],
                hoursOfTheDay: [],
                monthsOftheYear: [],
                skipImmediate: false,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            userUuid: this.sessionService.active.connection.login,
            priority: 'normal',
        };
    }

    getObjectsList(tasks: SmartTaskDto[], status: boolean): OptionsObjectDto[] {
        return  _.uniqBy(_.reduce(tasks, (result, task: SmartTaskDto) => {
            if (task.enabled === status) {
                const option: OptionsObjectDto = {
                    uuid: task.uuid,
                    title: task.name,
                    mainLine: this._scheduleTime(task),
                    mainIcon: 'fa-solid fa-calendar-days',
                    detailLine: task.flowKey,
                    detailIcon: this._getFlowIcon(task.flowType),
                };
                result.push(option);
            }
            return result;
        }, []), 'uuid');
    }

    getListFiltered(datas: SmartTaskDto[]): SmartTaskDto[] {
        return _.filter(datas, (data: SmartTaskDto) => (data.flowType !== 'mail' && data.flowType !== 'notify'));
    }

    private _scheduleTime(task: SmartTaskDto): string {

        const data = this._getDateType(task);
        if (!data) {
            return (task.periodicity) ? moment(task.periodicity.dateRange.start).format('DD/MM/YYYY HH:mm') : '';
        }

        return this.translateService.instant('SMART-TASKS.LIST-REPEAT',
            {'number': data.everyType, 'key': data.dateType, 'hour': data.hour });
    }

    private _getDateType(task: SmartTaskDto): any {
        if (!task.periodicity) {
            return null;
        }
        const data: SmartTaskPeriodicityDto = task.periodicity;
        if (data.daysOftheMonth && data.daysOftheMonth.length !== 0) {
            return {
                everyType: data.daysOftheMonth.join(', '),
                dateType: '',
                hour:  moment(task.periodicity.dateRange.start).format('HH:mm'),
            };
        }

        if (data.daysOftheWeek && data.daysOftheWeek.length !== 0) {
            return {
                everyType: this._getDateDays(data.daysOftheWeek).join(', '),
                dateType: '',
                hour:  moment(task.periodicity.dateRange.start).format('HH:mm'),
            };
        }

        if (data.repeatEvery.length === 0) {
            return null;
        }
        return {
            everyType: data.repeatEvery[0].frequency,
            dateType: this._getType(data.repeatEvery[0].repeatType),
            hour:  moment(task.periodicity.dateRange.start).format('HH:mm'),
        };
    }

    private _getDateDays(days: SmartTaskDayofWeekDto[]) {
        const listDays = this.getListWeek();
        const a = _.reduce(days, (result, d) => {
            const index = _.findIndex(listDays, (day: PairDto) => day.key === d.toString());
            if (index !== -1) {
                result.push(listDays[index].value);
            }
            return result;
        }, []);
        return a;
    }

    private _getType(type: string) {
        switch (type) {
            case 'days':
                return this.translateService.instant('SMART-TASKS.DAY');
            case 'hours':
                return this.translateService.instant('SMART-TASKS.HOUR');
            case 'months':
                return this.translateService.instant('SMART-TASKS.MONTH');
            case 'week':
                return this.translateService.instant('SMART-TASKS.WEEK');
            case 'year':
                return this.translateService.instant('SMART-TASKS.YEAR');
            default:
                return '';
        }
    }

    private _getFlowIcon(type) {
        switch (type) {
            case 'smartflow':
                return 'fa-solid fa-atom';
            case 'workflow':
                return 'fa-solid fa-diagram-project';
            case 'mail':
                return 'fa-solid fa-envelope';
            case 'notify':
                return 'fa-solid fa-bell';
            default:
                return '';
        }
    }

    getListDays(): PairDto[] {
        const nums = _.range(1, 32);
        return _.map(nums, (num) => {
            return {
                key: num.toString(),
                value: num,
            };
        });
    }

    getListWeek(): PairDto[] {
        moment.locale(this.translateService.currentLang);
        const days = moment.weekdays();
        let i = 0;
        return _.map(days, (day) => {
            return {
                key: (i++).toString(),
                value: day,
            };
        });
    }

    getListRadio(): PairDto[] {
        return [
            {
                key: 'every',
                value: 'repeat',
            },
            {
                key: 'week',
                value: 'week'
            },
            {
                key: 'day',
                value: 'day',
            }
        ];
    }
}

