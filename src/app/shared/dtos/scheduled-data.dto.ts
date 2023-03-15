export class ScheduledDataDto {

    uuid: string;
    enabled: boolean;

    name: string;
    startDate: string;
    endDate: string;
    endDateActive: boolean;

    byDay: boolean;
    byMonth: boolean;
    byYear: boolean;

    repeat: number;
    repeatWeek: number[];
    repeatDays: number[];
    repeatType: 'every' | 'week' | 'day';

    smartFlowKey: string;
    smartType: 'smartflow' | 'workflow' | 'mail' | 'notify';
}
