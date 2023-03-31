import { LangDto, TagDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { TagsListFormatedLine } from '../dto/tags-list-formated.dto';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { KeyFormaterService } from '@algotech-ce/angular';

@Injectable()
export class TagsListsDetailService {

    constructor(
        private translate: TranslateService,
        private keyFormater: KeyFormaterService,
    ) { }

    getMainLang() {
        return this.translate.currentLang;
    }

    createEmptyFormatedLine(customerLangs: LangDto[]): TagsListFormatedLine {

        const line: TagDto = {
            color: '#000',
            key: 'new-line',
            displayName: _.map(customerLangs, (lng: LangDto) => ({
                lang: lng.lang,
                value: '',
            })),
        };
        return this.createFormatedLine(line, customerLangs);
    }

    createFormatedLine(line: TagDto, customerLangs: LangDto[]): TagsListFormatedLine {

        const defaultLang = this._getDefaultLang(line.displayName);
        const detail: TagsListFormatedLine = {
            checked: false,
            color: line.color,
            key: line.key,
            defaultLang,
            nextLangs: this._getNextLangs(defaultLang, line.displayName, customerLangs),
            line,
        };
        return detail;
    }

    updateKey(line: TagsListFormatedLine, lines: TagsListFormatedLine[]): boolean {
        if (line.key === 'new-line' && line.defaultLang.value !== '') {
            const key: string = this.keyFormater.format(line.defaultLang.value).toLowerCase();
            if (this._validateKey(key, lines)) {
                return false;
            }
            line.key = key;
        }
        return true;
    }

    createTagValue(data: TagsListFormatedLine): TagDto {
        const langs: LangDto[] = _.map(data.nextLangs, (lng: LangDto) => lng);
        langs.unshift(data.defaultLang);
        const line: TagDto = {
            color: data.color,
            key: data.key,
            displayName: langs,
        };
        return line;
    }

    updateTagValue(data: TagsListFormatedLine, line: TagDto) {
        this._updateLang(line, data.defaultLang);
        _.forEach(data.nextLangs, (nLangs: LangDto) => {
            this._updateLang(line, nLangs);
        });
        line.color = data.color;
    }

    _updateLang(line: TagDto, dataLang: LangDto) {
        const index = _.findIndex(line.displayName, (val: LangDto) => val.lang === dataLang.lang);
        if (index !== -1) {
            if (line.displayName[index].value !== dataLang.value) {
                line.displayName[index].value = dataLang.value;
            }
        }
    }

    _validateKey(key: string, list: TagsListFormatedLine[]): boolean {
        const index = _.findIndex(list, (line: TagsListFormatedLine) => line.key === key);
        return (index !== -1);
    }

    _getDefaultLang(langs: LangDto[]): LangDto {
        return _.find(langs, (lang: LangDto) => lang.lang === this.translate.getDefaultLang());
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
