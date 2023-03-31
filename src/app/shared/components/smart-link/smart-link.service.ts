import { EMailDto, SmartLinkDto, PairDto, WorkflowModelDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnView } from '../../modules/smart-nodes';
import { ActiveSmartLinks, ResourceType, SessionDto } from '../../dtos';
import { SessionsService } from '../../services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SmartLinkService, TranslateLangDtoService } from '@algotech-ce/angular';
import * as _ from 'lodash';

@Injectable()
export class SmartLinkExService {

    private activateSmartLinks: ActiveSmartLinks[] = [];

    constructor(
        private translateService: TranslateService,
        private smartlinkService: SmartLinkService,
        private sessionService: SessionsService,
        private translateLang: TranslateLangDtoService,
    ) {
    }

    openSmartLink(snView: SnView, type: ResourceType, key: string): SmartLinkDto {
        const find = this.activateSmartLinks.find((smartLink) => smartLink.id === snView.id);
        if (find) {
            return find.activeSmartLink;
        }
        return this.createSmartLink(type, key);
    }


    createMail(workFlow: WorkflowModelDto, link: string): EMailDto {
        return {
            to: [],
            subject: this.translateService.instant('SMARTLINK-LINK.SHARE-MAIL-SUBJECT-TITLE',
                { workflow: this.translateLang.transform(workFlow.displayName) }),
            content: '',
            linkedFiles: [link],
        };
    }

    createSmartLink(type: string, key: string): SmartLinkDto {
        return {
            type,
            key,
            sources: [],
            unique: false,
            duration: '',
            backupType: 'END',
            authentication: 'manual',
            automaticLogin: {
                password: '',
                user: '',
            },
        };
    }

    updateLinkInfo(snView: SnView, smartLink: SmartLinkDto) {
        const activeSmartLink = _.assign(_.cloneDeep(smartLink), { sources: [] }); // todo restore sources
        const findIndex = _.findIndex(this.activateSmartLinks, { id: snView.id });
        if (findIndex === -1) {
            const active: ActiveSmartLinks = {
                id: snView.id,
                activeSmartLink,
            };
            this.activateSmartLinks.push(active);
        } else {
            this.activateSmartLinks[findIndex].activeSmartLink = activeSmartLink;
        }
    }

    createAsapEndList(): PairDto[] {
        return [{
            key: 'END',
            value: this.translateService.instant('SETTINGS.WORKFLOWS.UPDATE.END'),
        }, {
            key: 'ASAP',
            value: this.translateService.instant('SETTINGS.WORKFLOWS.UPDATE.ASAP'),
        }];
    }

    createAutoManualList(): PairDto[] {
        /* return [
            {
                key: 'automatic',
                value: this.translateService.instant('SMARTLINK-LINK.AUTHENTICATION-AUTO'),
            },
            {
                key: 'manual',
                value: this.translateService.instant('SMARTLINK-LINK.AUTHENTICATION-MANUAL'),
            }
        ]; */
        return [
            {
                key: 'manual',
                value: this.translateService.instant('SMARTLINK-LINK.AUTHENTICATION-MANUAL'),
            }
        ];
    }

    durationList(): PairDto[] {
        return [
            {
                key: '1H',
                value: this.translateService.instant('SMARTLINK-LINK.DURATION-HOUR', { key: '1' }),
            },
            {
                key: '12H',
                value: this.translateService.instant('SMARTLINK-LINK.DURATION-HOUR', { key: '12' }),
            },
            {
                key: '1D',
                value: this.translateService.instant('SMARTLINK-LINK.DURATION-DAY', { key: '1' }),
            },
            {
                key: '3D',
                value: this.translateService.instant('SMARTLINK-LINK.DURATION-DAY', { key: '3' }),
            },
            {
                key: '1W',
                value: this.translateService.instant('SMARTLINK-LINK.DURATION-WEEK', { key: '1' }),
            },
            {
                key: '2W',
                value: this.translateService.instant('SMARTLINK-LINK.DURATION-WEEK', { key: '2' }),
            },
            {
                key: '1M',
                value: this.translateService.instant('SMARTLINK-LINK.DURATION-MONTH', { key: '1' }),
            },
            {
                key: '3M',
                value: this.translateService.instant('SMARTLINK-LINK.DURATION-MONTH', { key: '3' }),
            },
        ];
    }


    createLink(smartLink: SmartLinkDto, host: string, customerKey: string): Observable<string> {
        const session: SessionDto = this.sessionService.findSession(host, customerKey);
        const server: string = session.connection.host;
        const url = `${server.replace('/api', '/smartlink')}/`;
        return  this.smartlinkService.getSmartLinkParameters(smartLink).pipe(
            map((encodeLink: string) => `${url}${encodeLink}`),
        );
    }

    sendMail(eMail: EMailDto): Observable<any> {
        return this.smartlinkService.sendMail(eMail);
    }
}
