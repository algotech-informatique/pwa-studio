import { KeyFormaterService } from '@algotech-ce/angular';
import { GenericListDto, GenericListValueDto, LangDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { GenericFormatedLine } from '../../dto/generic-formated-line.dto';

@Injectable()
export class GenericListsDetailService {

    constructor(
        private translateService: TranslateService,
        private keyFormater: KeyFormaterService,
    ) { }

    getMainLang() {
        return this.translateService.currentLang;
    }

    createEmptyFormatedLine(customerLangs: LangDto[]): GenericFormatedLine {

        const line: GenericListValueDto = {
            key: 'new-line',
            value: _.map(customerLangs, (lng: LangDto) => (
                {
                    lang: lng.lang,
                    value: ''
                })
            ),
            index: 0,
        };
        return this.createFormatedLine(line, customerLangs);
    }

    createFormatedLine(line: GenericListValueDto, customerLangs: LangDto[]): GenericFormatedLine {

        const defaultLang = this._getDefaultLang(line.value);
        const detail: GenericFormatedLine = {
            checked: false,
            key: line.key,
            defaultLang,
            nextLangs: this._getNextLangs(defaultLang, line.value, customerLangs),
            line: null,
            index: line.index,
        };
        return detail;
    }

    returnFormatedLines(lines: GenericListValueDto[], customerLangs: LangDto[]): GenericFormatedLine[] {

        return _.sortBy(_.map(lines, (line: GenericListValueDto) =>
            this.createFormatedLine(line, customerLangs),
        ), (ln: GenericListValueDto) => ln.index);
    }

    getDisplayName(linelangs: LangDto[], customerLangs: LangDto[]): LangDto[] {

        return _.reduce(customerLangs, (result, csLang: LangDto) => {
            const index = _.findIndex(linelangs, (llang: LangDto) => llang.lang === csLang.lang);
            if (index !== -1) {
                result.push(linelangs[index]);
            } else {
                result.push({
                    lang: csLang.lang,
                    value: '',
                });
            }
            return result;
        }, []);
    }

    updateKey(data: GenericFormatedLine, list: GenericFormatedLine[]): boolean {
        if (data.key === 'new-line' && data.defaultLang.value !== '') {
            const key: string = this.keyFormater.format(data.defaultLang.value).toLowerCase();
            if (this._validateKey(key, list)) {
                return false;
            }
            data.key = key;
        }
        return true;
    }

    _validateKey(key: string, list: GenericFormatedLine[]): boolean {
        const index = _.findIndex(list, (line: GenericFormatedLine) => line.key === key);
        return (index !== -1);
    }

    createGenericValue(data: GenericFormatedLine, index: number): GenericListValueDto {
        const langs: LangDto[] = _.map(data.nextLangs, (lng: LangDto) => lng );
        langs.unshift(data.defaultLang);
        return {
            key: data.key,
            value: langs,
            index,
        };
    }

    updateGenericValue(data: GenericFormatedLine, line: GenericListValueDto) {
        this._updateLang(line, data.defaultLang);
        _.forEach(data.nextLangs, (nLangs: LangDto) => {
            this._updateLang(line, nLangs);
        });
    }

    updateGenericValueIndex(line: GenericListDto, data: GenericFormatedLine[]) {
        _.forEach(data, (dt: GenericFormatedLine) => {
            if (dt) {
                const index = _.findIndex(line.values, (lst: GenericListValueDto) => lst.key === dt.key);
                if (index !== -1) {
                    line.values[index].index = dt.index;
                }
            }
        });
    }

    _updateLang(line: GenericListValueDto, dataLang: LangDto) {
        const index = _.findIndex(line.value, (val: LangDto) => val.lang === dataLang.lang);
        if (index !== -1) {
            if (line.value[index].value !== dataLang.value) {
                line.value[index].value = dataLang.value;
            }
        }
    }

    _validateKeyExists(key: string, lines: GenericListValueDto[] ): boolean {
        const index = _.findIndex(lines, (line: GenericListValueDto) => line.key === key);
        return (index !== -1);
    }

    getLangs(defaultlang: string, langs: LangDto[]): string[] {

        return _.reduce(langs, (result, lng: LangDto) => {
            if (lng.lang !== defaultlang) {
                result.push(lng.lang);
            }
            return result;
        }, []);
    }

    _getDefaultLang(langs: LangDto[]): LangDto {
        return _.find(langs, (lang: LangDto) => lang.lang === this.translateService.currentLang);
    }

    _getNextLangs(defaultLang: LangDto, linelangs: LangDto[], customerLangs: LangDto[]): LangDto[] {

        return _.reduce(customerLangs, (result, csLang: LangDto) => {
            if (defaultLang.lang !== csLang.lang) {
                const index = _.findIndex(linelangs, (llang: LangDto) => llang.lang === csLang.lang);
                if (index !== -1) {
                    result.push(linelangs[index]);
                } else {
                    result.push({
                        lang: csLang.lang,
                        value: '',
                    });
                }
            }
            return result;
        }, []);
    }
}
