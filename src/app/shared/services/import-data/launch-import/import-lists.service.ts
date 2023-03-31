import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ImportDataFileDto, ImportDataModel } from '../../../components/import-data/dto/import-data-file.dto';
import { ValidateImportDataDto, ValidateImportDataModelDto } from '../../../components/import-data/dto/validate-import-data.dto';
import * as _ from 'lodash';
import { UUID } from 'angular2-uuid';
import { SessionsService } from '../../sessions/sessions.service';
import { GenericListDto, GenericListValueDto, LangDto } from '@algotech-ce/core';
import { GenericListsService } from '@algotech-ce/angular';
import { TranslateService } from '@ngx-translate/core';
import { catchError, flatMap, map } from 'rxjs/operators';
import { ImportDataUtilsService } from '../import-data-utils.service';

@Injectable()
export class ImportListsService {

    constructor(
        private sessionService: SessionsService,
        private gListsService: GenericListsService,
        private translateService: TranslateService,
        private importUtilsService: ImportDataUtilsService,
    ) {}

    importObjects(data: ImportDataFileDto, forceData: boolean, inputLog: string): Observable<ValidateImportDataDto> {

        if (data.importData.length === 0) {
            return of( { type: data.type, valide: true, importData: [] });
        }

        this.importUtilsService.sendMessageService(inputLog,
            this.translateService.instant('IMPORT-DATA.IMPORT-DATA-LIST.LAUNCH'), false);

        return this.gListsService.list().pipe(
            flatMap((gList: GenericListDto[]) => this._importObjects(data, gList, forceData, inputLog) ),
            map((importData: ValidateImportDataModelDto[]) => {
                const valide = !_.some(data, (dt: ValidateImportDataModelDto) => dt.valide === false);
                const validate: ValidateImportDataDto = {
                    type: 'list',
                    valide,
                    importData,
                };
                return validate;
            }),
        );
    }

    _importObjects(data: ImportDataFileDto, gLists: GenericListDto[],
        forceData: boolean, inputLog: string): Observable<ValidateImportDataModelDto[]> {

        const langs: LangDto[] = this.sessionService.active.datas.read.customer.languages;
        const import$: Observable<ValidateImportDataModelDto>[] = _.map(data.importData, (list: ImportDataModel) =>
            this._loadExistingList(gLists, list, forceData, langs, inputLog),
        );
        return this.importUtilsService.sequence(import$);
    }

    _loadExistingList(gList: GenericListDto[], list: ImportDataModel, forceData: boolean,
        langs: LangDto[], inputLog: string): Observable<ValidateImportDataModelDto> {
        const index = this._genericListIndex(gList, list.model);
        gList[index].values = this._insertValues(gList[index], list.data, langs, forceData);
        return this._updateList(gList[index], list.model, inputLog);
    }

    _genericListIndex(gList: GenericListDto[], model: string): number {
        return _.findIndex(gList, (lst: GenericListDto) => lst.key.toUpperCase() === model.toUpperCase());
    }

    _updateList(lst: GenericListDto, model: string, inputLog: string): Observable<ValidateImportDataModelDto> {

        return this.gListsService.put(lst).pipe(
            map((result: GenericListDto) => {

                const message: string = (result) ?
                    'IMPORT-DATA.IMPORT-DATA-LIST-LOAD-UPDATE' :
                    'IMPORT-DATA.IMPORT-DATA-LIST-LOAD-UPDATE-ERROR';

                this.importUtilsService.sendMessageService(inputLog,
                    this.translateService.instant(message, { model }), (!result));

                const validate: ValidateImportDataModelDto = {
                    valide: (result) ? true : false,
                    model,
                    data: result.values,
                };
                return validate;
            }),
        );
    }

    _rowToLists = (list: ImportDataModel, langs) => {
        const objList: GenericListDto = _.keyBy(this._createLists(list.model, langs), 'key');
        objList.values = this._insertValues(objList, list.data, langs, false);
        return objList;
    };

    _createLists = (row, langs: LangDto[]) => _.map(Object.keys(row), (key) => ({
            uuid: UUID.UUID(),
            key,
            displayName: _.map(langs, (lang: LangDto) => ({
                lang: lang.lang,
                value: key
            })),
            protected: true,
            values: []
        }),
    );

    _insertValues = (list: GenericListDto, rows, langs: LangDto[], forceData: boolean) => {
        _.forEach(rows, (row) => {
            const rowKey: string = row['KEY'];
            if (rowKey) {
                const key = rowKey.toString().toLowerCase().split(' ').join('-');
                const findIndex = _.findIndex(list.values, (val: GenericListValueDto) => val.key === key);
                if (findIndex === -1) {
                    const indx = (list.values.length === 0) ? 0 : _.maxBy(list.values, 'index').index + 1;
                    list.values.push(this._insertNewValueLine(key, row, langs, indx ));
                } else if (findIndex !== -1 && forceData) {
                    list.values[findIndex] = this._updateValueLine(list.values[findIndex], row, langs);
                }
            }
        });
        return list.values;
    };

    _insertNewValueLine(key: string, row, langs: LangDto[], index): GenericListValueDto {
        const line: GenericListValueDto = {
            key,
            value: _.map(langs, (lang: LangDto) => {
                const lng: string = lang.lang;
                const val: string = row[lng.toUpperCase()];
                return {
                    lang: lang.lang,
                    value:  (val) ? val.toString() : '',
                };
            }),
            index,
        };
        return line;
    }

    _updateValueLine(line: GenericListValueDto, row, langs: LangDto[]): GenericListValueDto {
        line.value = _.map(langs, (lang: LangDto) => {
            const lng: string = lang.lang;
            const value: string = row[lng.toUpperCase()];
            return {
                lang: lang.lang,
                value: (value) ? value.toString() : '',
            };
        });
        return line;
    }

    _exists(gList: GenericListDto[], model: string): boolean {
        const findIndex = this._genericListIndex(gList, model);
        return (findIndex !== -1);
    }

    _loadNewList(list: ImportDataModel, langs: LangDto[], inputLog: string): Observable<ValidateImportDataModelDto> {
        const lst: GenericListDto = this._rowToLists(list, langs);
        return this._createList(lst, list.model, inputLog);
    }

    _createList(lst: GenericListDto, model: string, inputLog: string): Observable<ValidateImportDataModelDto> {
        return this.gListsService.post(lst).pipe(
            catchError((err) => {

                this.importUtilsService.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.IMPORT-DATA-LIST-ERROR', { model }), true);

                const validate: ValidateImportDataModelDto = {
                    valide: false,
                    model,
                    data: []
                };
                return of(validate);
            }),
            map((res: GenericListDto) => {

                this.importUtilsService.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.IMPORT-DATA-LIST-LOAD-ADD', { model }), false);

                const validate: ValidateImportDataModelDto = {
                    valide: true,
                    model,
                    data: res.values,
                };
                return validate;
            }),
        );
    }
}

