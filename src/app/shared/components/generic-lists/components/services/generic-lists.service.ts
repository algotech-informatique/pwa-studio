import { GenericListsService, KeyFormaterService } from '@algotech-ce/angular';
import { GenericListDto, LangDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { DialogMessageService, SessionsService, ToastService } from '../../../../services';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import { AlertMessageDto } from '../../../../dtos';

@Injectable()
export class GenericListService {

    constructor(
        private gListsService: GenericListsService,
        private toastMessage: ToastService,
        private translateService: TranslateService,
        private keyFormater: KeyFormaterService,
        private messageService: DialogMessageService,
        private sessionService: SessionsService,
    ) { }

    load(): Observable<GenericListDto[]> {
        return this.gListsService.list();
    }

    refreshList(host: string, customerKey: string) {
        this.sessionService.refresh(host, customerKey);
    }

    createNewGenericList(customerLangs: LangDto[]): GenericListDto {

        const gList: GenericListDto = {
            key: 'new-list',
            displayName:
                _.map(customerLangs, (lang: LangDto) => {
                    const lng: LangDto = {
                        lang: lang.lang,
                        value: '',
                    };
                    return lng;
                }),
            protected: true,
            values: [],
        };
        return gList;
    }

    createList(gList: GenericListDto): Observable<GenericListDto> {

        const key: string = this.keyFormater.format(this._defaultLangValue(gList.displayName).toLowerCase());
        gList.key = key;

        if (key === '') {
            this.toastMessage.addToast('error', '', this.translateService.instant('GENERIC-LIST.CREATE-NEW-LIST-KO-KEY'), 2000);
            return of(null);
        }

        return this.gListsService.post(gList).pipe(
            catchError((err) => {
                this._alreadyExists(gList.key);
                return null;
            }),
            map((res: GenericListDto ) => {
                this.toastMessage.addToast('success', '', this.translateService.instant('GENERIC-LIST.CREATE-NEW-LIST-OK'), 1500);
                return res;
            }),
        );
    }

    deleteList(uuid: string): Observable<any> {

        const alertMessage: AlertMessageDto = {
            confirm: this.translateService.instant('DIALOGBOX.DELETE'),
            cancel: this.translateService.instant('DIALOGBOX.CANCEL'),
            message: this.translateService.instant('SETTINGS.LISTS.DELETE_CONFIRM'),
            title: this.translateService.instant('SETTINGS.LISTS.DELETE'),
            type: 'question',
            messageButton: true,
        };
        return this.messageService.getMessageConfirm(alertMessage).pipe(
            flatMap((result: boolean) =>
                (result) ? this.gListsService.delete(uuid) : of(null),
            )
        );
    }

    updateList(gList: GenericListDto): Observable<GenericListDto> {
        return this.gListsService.put(gList);
    }

    _alreadyExists(key) {
        this.toastMessage.addToast('error', '', this.translateService.instant('GENERIC-LIST.CREATE-NEW-LIST-KO', { key }), 2000);
    }

    sendErrorMessage(message: string) {
        this.toastMessage.addToast('error', '', this.translateService.instant(message), 2000);
    }

    _defaultLangValue(langs: LangDto[]) {
        const index = _.findIndex(langs, (lang: LangDto) => lang.lang === this.translateService.getDefaultLang());
        return (index !== -1) ? langs[index].value : '';
    }
}
