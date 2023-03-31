import { ImportOptionsDto, LangDto, PairDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImportDataService } from '../../import-data/services/import-data.service';
import * as _ from 'lodash';
import { StatusFile } from '../interfaces/status-import.enum';
import { MessageService } from '../../../services';
@Injectable()
export class I18nValidateFileService {

    constructor(
        private translateService: TranslateService,
        private importDataService: ImportDataService,
        private messageService: MessageService,
    ) { }

    validateImportationFile(file: File, inputLog: string, clearLog: string, customerLangs: LangDto[], options?: ImportOptionsDto):
        Observable<StatusFile> {
        this.messageService.send(clearLog, {});
        if (file && customerLangs.length !== 0) {
            return this.csvData(file, options).pipe(
                map((mappings: any[]) => this._getData(mappings, inputLog, clearLog, customerLangs)),
            );
        } else {
            this.importDataService.sendMessageService(inputLog,
                this.translateService.instant('INSPECTOR.I18N.TRANSLATION.NO-FILE'), true);
        };
        return of(StatusFile.nothing);
    }

    csvData(file: File, options?: ImportOptionsDto): Observable<PairDto[]> {
        const papa = require('papaparse');
        return new Observable((observer) => {
            papa.parse(file, {
                header: true,
                delimiter: options?.delimiter ?? '',
                newline: options?.newline ?? '',
                skipEmptyLines: true,

                complete: (res) => {
                    const data = res.data;
                    observer.next(data);
                    observer.complete();
                },
                error: (err) => {
                    observer.error(err);
                    observer.complete();
                }
            });
        });
    }

    _getData(data: any[], inputLog: string, clearLog: string, customerLangs: LangDto[]): StatusFile {
        const validate = {
            error: [],
            warning: [],
        };
        _.forEach(data, (dt, index) => {
            _.forEach(customerLangs, (lng: LangDto) => {
                if (!dt[lng.lang]) {
                    validate.warning.push({ line: index + 2, lang: lng.lang });
                }
            });
            if (!dt.id) {
                validate.error.push({ line: index + 2 });
            }
        });
        if (validate.error.length > 0) {
            this.importDataService.sendMessageService(inputLog,
                validate.error.map((e) => this.translateService.instant('INSPECTOR.I18N.TRANSLATION.ERROR-ID', { line: e.line }))
                    .join('\n'),
                true, false);
        }
        if (validate.warning.length > 0) {
            this.importDataService.sendMessageService(inputLog,
                validate.warning.map((w) => this.translateService.instant('INSPECTOR.I18N.TRANSLATION.WARNING',
                { line: w.line, lang: w.lang })).join('\n'),
                false, true);
        }

        return (validate.error.length > 0) ?
            StatusFile.error : (validate.warning.length > 0) ?
            StatusFile.warning :
            StatusFile.ok;
    }

    clearMessage(clearLog: string) {
        this.messageService.send(clearLog, {});
    }

    importMessage(inputLog: string, message: string, isError: boolean, isWarning: boolean) {
        this.importDataService.sendMessageService(inputLog,
            this.translateService.instant(message), isError, isWarning); // 'INSPECTOR.I18N.IMPORT-FILE.ACTION-MESSAGE'), false);

    }

}
