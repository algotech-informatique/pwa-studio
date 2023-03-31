import { GenericListsService } from '@algotech-ce/angular';
import { GenericListDto, GenericListValueDto, LangDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImportDataFileDto, ImportDataModel } from '../../../components/import-data/dto/import-data-file.dto';
import { ValidateData, ValidateDataFileDto, ValidateDataModel } from '../../../components/import-data/dto/validate-data-file.dto';
import { SessionsService } from '../../sessions/sessions.service';
import { ImportDataUtilsService } from '../import-data-utils.service';

@Injectable()
export class ImportListsDataService {

    constructor(
        private translateService: TranslateService,
        private importUtilsService: ImportDataUtilsService,
        private gListsService: GenericListsService,
        private sessionService: SessionsService,
    ) {}

    validateLists(data: ImportDataFileDto, forceData: boolean, inputLog: string): Observable<ValidateDataFileDto> {

        this.importUtilsService.sendMessageService(inputLog,
            this.translateService.instant('IMPORT-DATA.VALIDATE-GLIST'), false);

        return this.gListsService.list().pipe(
            map((glist: GenericListDto[]) => {
                const importData: ValidateDataModel[] = _.map(data.importData, (imp: ImportDataModel) => {
                    return (imp.data.length === 0) ?
                        { valide: true, model: imp.model, data: []} :
                        this._validate(glist, imp, forceData, inputLog);
                });
                const valide = !_.some(importData, (imp: ValidateDataModel) => imp.valide === false);
                const validate: ValidateDataFileDto = {
                    type: 'list',
                    valide,
                    importData,
                };
                return validate;
            })
        );
    }

    _validate(gList: GenericListDto[], dt: ImportDataModel, forceData: boolean, inputLog: string): ValidateDataModel {

        const empty = _.some(dt.data, (d) => d['KEY'] === null || d['KEY'] === '');
        if (empty) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-GLIST-EMPTY-KEY', {list: dt.model}), false);
            return {valide: false, model: dt.model, data: this.importUtilsService.transformData(dt.data, false)};
        }
        const data = this._validateDetailList(gList, dt, forceData, inputLog);
        const valideData = !_.some(data, (vdt: ValidateData) => vdt.valide === false);
        const valideDuplicate = this.importUtilsService.findDuplicates(dt.data, dt.model, inputLog, 'KEY');
        if (!valideDuplicate) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-GLIST-DUPLICATE-ERROR', {list: dt.model}), true);
        }
        const valide = (valideData && valideDuplicate);
        return {valide, model: dt.model, data};
    }

    _validateDetailList(gList: GenericListDto[], dt: ImportDataModel, forceData: boolean, inputLog: string): ValidateData[] {
        const list: GenericListDto = _.find(gList, (lst: GenericListDto) => lst.key.toUpperCase() === dt.model.toUpperCase());
        const langs: LangDto[] = this.sessionService.active.datas.read.customer.languages;
        return _.map(dt.data, (row, index) => {
            return this._validateLine(row, dt.model, index, forceData, list, langs, inputLog);
        });
    }

    _validateLine(row, model, index, forceData, list: GenericListDto, langs: LangDto[], inputLog: string): ValidateData {
        const valideExists = this._validateExists(row, model, index, inputLog);
        const valideDetail = (!list) ? true :
             (!forceData) ? this._validateDetail(row, list, model, inputLog, index + 2) : true;
        const valideLang = this._validateMultiLangs(row, model, langs, index + 2, inputLog);
        const valide = (valideExists && valideDetail && valideLang);
        return {
            object: row,
            valide,
        };
    }

    _validateMultiLangs(row, model: string, langs: LangDto[], index: number, inputLog: string): boolean {
        let valide = true;
        _.forEach(langs, (lang: LangDto) => {
            const value = row[lang.lang.toUpperCase()];
            if (!value) {
                valide = false;
                this.importUtilsService.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.VALIDATE-GLIST-NO-VALUE-LANG',
                    {list: model, lang: lang.lang, index }), true);
            }
        });
        return valide;
    }

    _validateExists(row, model, index, inputLog: string): boolean {
        const key = row['KEY'];
        if (!key) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-GLIST-EMPTY-KEY-LINE', {list: model, index}), true);
            return false;
        }
        return true;
    }

    _validateDetail(row, list: GenericListDto, model, inputLog: string, index): boolean {
        const findKey = row['KEY'];
        if (!findKey) {
            return false;
        }
        const key = findKey.toString().toLowerCase().split(' ').join('-');
        const found = _.some(list.values, (val: GenericListValueDto) => val.key === key);
        if (found) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-GLIST-VALUE-DUPLICATE-ERROR', {list: model, index }), true);
            return false;
        }
        return true;
    }
}
