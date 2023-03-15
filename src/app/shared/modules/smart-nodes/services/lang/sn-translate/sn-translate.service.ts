import { Injectable } from '@angular/core';
import { SnLang } from '../../../models';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { zip } from 'rxjs';
import { PairDto } from '@algotech/core';
import { tap } from 'rxjs/operators';
import { ValidationReportDto } from 'src/app/shared/dtos';

@Injectable()
export class SnTranslateService {

    private _lang = 'en-US';
    private _fallBackTranslation = '[no translation available]';

    private translationObjects: PairDto[] = [];
    private docLinks;

    constructor(private translate: TranslateService) {
    }

    get lang() {
        return this._lang;
    }

    set lang(value) {
        this._lang = value;
    }

    initialize() {
        this._lang =
            this.translate.currentLang ||
            this.translate.getBrowserCultureLang() || 'fr-FR';

        return zip(
            this.translate.getTranslation('fr-FR'),
            this.translate.getTranslation('en-US'),
            this.translate.getTranslation('es-ES'),
            this.translate.getTranslation('fr-FR-errors'),
            this.translate.getTranslation('en-US-errors'),
            this.translate.getTranslation('es-ES-errors'),
            this.translate.getTranslation('doc-Links')).pipe(
                tap((langs: any) => {
                    this.translationObjects.push({ key: 'fr-FR', value: langs[0] });
                    this.translationObjects.push({ key: 'en-US', value: langs[1] });
                    this.translationObjects.push({ key: 'es-ES', value: langs[2] });
                    this.translate.setTranslation('fr-FR', langs[3], true);
                    this.translate.setTranslation('en-US', langs[4], true);
                    this.translate.setTranslation('es-ES', langs[5], true);
                    this.docLinks = langs[6];
                }));
    }


    transform(value: SnLang[] | string, alertNoTranslate = true, lang?: string): string {
        let translation;

        if (value === '') {
            return value;
        }

        if (_.isString(value)) {
            return this.translate.instant(value as string);
        }
        
        
        if (!value || value.length === 0) {
            return alertNoTranslate ? this._fallBackTranslation : '';
        }

        if (lang) {
            translation = (value as SnLang[]).find(l => l.lang === lang);
        } else {
            translation = (value as SnLang[]).find(l => l.lang === this._lang);
        }

        return translation && translation.value ?
            translation.value.startsWith('SN-') ? this.translate.instant(translation.value) : translation.value
            : (alertNoTranslate ? this._fallBackTranslation : '');
    }

    getLink(key): string {
        const val = (key) ? this.docLinks[key.toUpperCase()] : null;
        return (val) ? val : null;
    }

    public initializeLangs(value: string, languages: SnLang[]): string | SnLang[] {
        if (!languages) {
            return value;
        }
        return _.map(languages, (lang: SnLang) => {
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

    public initializeLangsByKey(key: string, languages: SnLang[]): string | SnLang[] {
        if (!languages) {
            return key;
        }
        return _.map(languages, (lang: SnLang) => {
            const translate = _.find(this.translationObjects, { key: lang.lang })?.value?.[key];
            return {
                lang: lang.lang,
                value: translate ? translate : '',
            };
        });
    }

    public setValue(value: string, values: SnLang[]) {
        return _.map(values, (lang: SnLang) => {
            if (this.translate.currentLang === lang.lang) {
                return {
                    lang: lang.lang,
                    value,
                };
            }
            return lang;
        });
    }
}
