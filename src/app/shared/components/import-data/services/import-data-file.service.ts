import { Injectable } from '@angular/core';
import { MessageService } from '../../../services';
import * as _ from 'lodash';
import { from, Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ImportDataFileDto } from '../dto/import-data-file.dto';
import { ImportDataService } from './import-data.service';
import { catchError, map } from 'rxjs/operators';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ImportDataFileService {

    constructor(
        private messageService: MessageService,
        private translateService: TranslateService,
        private importDataService: ImportDataService,
    ) {}

    splitImportData(data): ImportDataFileDto[] {
        return [
            {type: 'object', importData: _.reduce(data, (result, dm) => {
                const model: string = dm.model;
                if (!model.startsWith('DOCUMENTS#') && !model.startsWith('GLIST#') && !model.startsWith('RASTERS#')) {
                    result.push(dm);
                }
                return result;
            }, [])},
            {type: 'document', importData: _.reduce(data, (result, dm) => {
                if ((dm.model as string).startsWith('DOCUMENTS#')) {
                    dm.model = dm.model.replace('DOCUMENTS#', '');
                    result.push(dm);
                }
                return result;
            }, [])},
            {type: 'list', importData:  _.reduce(data, (result, dm) => {
                if ((dm.model as string).startsWith('GLIST#')) {
                    dm.model = dm.model.replace('GLIST#', '');
                    result.push(dm);
                }
                return result;
            }, [])},
            {type: 'layer', importData:  _.reduce(data, (result, dm) => {
                if ((dm.model as string).startsWith('RASTERS#')) {
                    result.push(dm);
                }
                return result;
            }, [])},
        ];
    }

    importFile(file, inputLog: string, clearLog: string): Observable<any> {
        this.messageService.send(clearLog, {});
        const ext =  file.name.split('.').pop();
        if (ext && ext.toUpperCase() !== 'XLSX') {
            this.importDataService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.XLSX-FILE-EXTENSION-ERROR'), true);
            return of(null);
        }

        this.importDataService.sendMessageService(inputLog, this.translateService.instant('IMPORT-DATA.START-READING-FILE'), false);
        return this._readWorkbook(file, inputLog).pipe(
            catchError((err) => {
                this.importDataService.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.READ-SHEET-ERROR'), true);
                return of(null);
            }),
        );
    }

    _readWorkbook(buffer, inputLog: string): Observable<any> {
        const wb = new ExcelJS.Workbook();
        return from(wb.xlsx.load(buffer).then((workbook) => {
            const object = [];
            workbook.eachSheet((sheet, id) => {
                this.importDataService.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.READ-SHEET', {sheet: sheet.name}), false);
                const dataArray = this._changeRowsToDict(sheet);
                object.push({model: sheet.name, data: dataArray});
            });
            return object;
        }));
    }

    _changeRowsToDict(worksheet) {
        const dataArray = [];
        let keys = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                keys = this._getCellsHeaders(row);
            } else {
                const rowDict = this._getCellsValue(keys, row);
                dataArray.push(rowDict);
            }
        });
        return dataArray;
    }

    _getCellsHeaders(row) {
        const keys = [];
        for (let i = 1; i < row.values.length; i++) {
            const cell = row.getCell(i);
            keys.push(cell.text);
        }
        return keys;
    }

    _getCellsValue(keys: string[], row) {
        const rowDict = {};
        _.forEach(keys, (key) => {
            const cell =  this._getCellByName(row, keys, key);
            const value = this._getCellValue(cell);
            rowDict[key] = value;
        });
        return rowDict;
    }

    _getCellValue(cell) {
        if (!cell) {
            return '';
        }
        switch (cell.type) {
            case 6:
                return cell.result;
            case 4:
                const d = new Date(cell.text);
                const c = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
                return c;
            case 5:
            case 8:
                return cell.text;
            default:
                return cell.value;
        }
    }

    _getCellByName(row, keys, key) {
        let match = null;
        row.eachCell( (cell, colNumber: number) => {
            const fetchedHeader: string = keys[colNumber - 1];
            if (fetchedHeader.toLowerCase().trim() === key.toLowerCase().trim()) {
                match = cell;
            }
        });
        return match;
    }

    cellValueToDict(keys, rowValue) {
        const rowDict = {};
        keys.forEach((value, index) => {
            if (value) {
                rowDict[value] = rowValue[index];
            }
        });
        return rowDict;
    }
}
