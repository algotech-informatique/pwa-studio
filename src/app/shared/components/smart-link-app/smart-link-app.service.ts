import { EMailDto, PairDto, SnModelDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionDto } from '../../dtos';
import { SessionsService } from '../../services';
import { Observable } from 'rxjs';
import { SmartLinkService, TranslateLangDtoService } from '@algotech-ce/angular';
import * as _ from 'lodash';

@Injectable()
export class SmartLinkAppExService {

    constructor(
        private translateService: TranslateService,
        private sessionService: SessionsService,
        private translateLang: TranslateLangDtoService,
        private smartLinkService: SmartLinkService,
    ) {
    }

    createMail(snModel: SnModelDto, link: string): EMailDto {
        return {
            to: [],
            subject: this.translateService.instant('SMARTLINK-LINK-APP.SHARE-MAIL-SUBJECT-TITLE',
                { app: this.translateLang.transform(snModel.displayName) }),
            content: '',
            linkedFiles: [link],
        };
    }

    createLink(snModel: SnModelDto, host: string, customerKey: string, pageKey: string, variables: PairDto[], isHomePage: boolean): string {
        const session: SessionDto = this.sessionService.findSession(host, customerKey);
        const server: string = session.connection.host;
        const filteredVar: PairDto[] = variables.filter(variable => variable.value);
        const queryParams: string = filteredVar?.length > 0 ?
            filteredVar.reduce((prevValue, curValue) => (prevValue + (prevValue === '?' ? '' : '&') + curValue.key + '='), '?') :
            '';
        const page: string = isHomePage ? '' : `/${pageKey}`;
        return `${server.replace('/api', '/player/app')}/${snModel.key}${page}${queryParams}`;
    }

    sendMail(eMail: EMailDto): Observable<any> {
        return this.smartLinkService.sendMail(eMail);
    }
}