import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { I18nService, TranslateLangDtoService } from '@algotech-ce/angular';
import { MessageService } from '../message/message.service';
import { TranslateService } from '@ngx-translate/core';
import { SessionsService } from '..';
import { SnTranslateService } from '../../modules/smart-nodes';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { LangDto } from '@algotech-ce/core';
import moment from 'moment';

@Injectable()
export class StudioTranslationService {

    acceptedLanguages = ['fr-FR', 'en-US', 'es-ES'];
    currentLang = 'fr-FR';

    constructor(
        public messageService: MessageService,
        private translateService: TranslateService,
        private translateServiceLangDtoService: TranslateLangDtoService,
        private snTranslateService: SnTranslateService,
        private sessionService: SessionsService,
        private i18n: I18nService,
    ) {
        this.currentLang = this.translateService.currentLang;
    }

    defineDefaultLang(langs: LangDto[]): Observable<string> {
        const index = _.findIndex(langs, (lng) => lng.lang === this.currentLang);
        return (index === -1) ? this.changeLang(langs[0].lang) : of(this.currentLang);
    }

    changeLang(lang: string): Observable<string> {
        return this.translateService.use(lang).pipe(
            mergeMap(() => {
                moment.locale(lang);
                this.translateServiceLangDtoService.lang = lang;
                this.snTranslateService.lang = lang;
                return this.translateService.reloadLang(lang);
            }),
            map(() => {
                // Refresh de l'environnement fenêtre
                this.sessionService.refreshAllEnv();
                // Refresh de la page courante, affichée
                if (this.sessionService.active) {
                    this.messageService.send('loaded', {
                        host: this.sessionService.active.connection.host,
                        customerKey: this.sessionService.active.connection.customerKey
                    });
                }
                this.currentLang = lang;
                this.translateService.defaultLang = lang;
                return this.translateService.currentLang;
            }),
            mergeMap((lng) => {
                this.i18n.defaultLanguage = lang;
                return lng;
            }),
        );
    }
}
