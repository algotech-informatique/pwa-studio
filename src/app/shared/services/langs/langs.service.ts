import { Injectable } from '@angular/core';
import { LangDto } from '@algotech-ce/core';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LangsService {

    constructor(private translate: TranslateService) {

    }

    public initializeLangs(value: string, languages: LangDto[]) {

        return _.map(languages, (lang: LangDto) => {
            if (this.translate.currentLang === lang.lang) {
                return {
                    lang: lang.lang,
                    value,
                };
            } else {
                return {
                    lang: lang.lang,
                    value: '',
                };
            }
        });
    }

    public mergeLangs(langs: LangDto[], value: LangDto[]): any[] {
        return _.map(langs, (lang: LangDto) => {
            const findIndex = _.findIndex(value, (param) => param.lang === lang.lang);
            if (findIndex === -1) {
                return  {
                    lang: lang.lang,
                    value: '',
                };
            } else {
                return value[findIndex];
            }
        });
    }
}
