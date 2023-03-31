import { SmartTaskLogDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { DialogMessageService } from '../../../services';
import * as _ from 'lodash';

@Injectable()
export class ScheduledTaskExportService {

    constructor(
        private dialogService: DialogMessageService,
    ) {
    }

    ConvertToCSV(objArray: SmartTaskLogDto[]): boolean {
        if (objArray.length === 0) {
            return false;
        }
        const logArray = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        const keys = Object.keys(objArray[0]);
        str += keys.join(';')  + '\r\n';
        const lines = _.map(logArray, (logJson) => {
            const elements = _.reduce(keys, (result, key) => {
                result.push( (logJson[key]) ? logJson[key] : '');
                return result;
            }, []);
            return elements.join(';');
        });
        str += lines.join('\r\n');
        return this.dialogService.getSaveMessage(str, 'text/csv', 'export_log.csv');
    }

}
