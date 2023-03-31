import { Injectable } from '@angular/core';
import { RessourcesDto, RessourcesSearchDto, StoreConnectionDto } from '../../dtos';
import { Observable, of, zip } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { flatMap, catchError, map } from 'rxjs/operators';
import * as _ from 'lodash';
import moment from 'moment'; 
import { MessageService } from '../message/message.service';
import { RessourcesUpsertDto } from '../../dtos/store-ressources-upsert.dto';
import { SnModelDto } from '@algotech-ce/core';
import { SessionsService } from '../sessions/sessions.service';
import { RessourcesRefDto } from '../../dtos/ressource-ref.dto';
import { ConfigService } from '../config/config.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    store_token = '';
    connectionDate = 0;
    token_expiration = 0;

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private sessionsService: SessionsService,
        private configService: ConfigService,
        private translateService: TranslateService,
    ) {
        this.messageService.get('send-to-store').pipe(
            flatMap((confirmation: RessourcesUpsertDto) => {
                return this._upsertRessource(confirmation);
            })).subscribe(
                (results) => {
                    const dataSent = (_.indexOf(results, false) !== -1) ? false : true;

                    const message = (!dataSent) ?
                        this.translateService.instant('RESSOURCE_SENT_TO_STORE_ERROR') :
                        this.translateService.instant('STORE.TOTAL-SEND');
                    this.messageService.send('store-load-log', { message, isError: (!dataSent) });
                }
            );
    }

    _mapRessourceType(ressourceType) {
        const storeRessourceType = (ressourceType === 'workflow') ? 'workflow-model' :
            (ressourceType === 'smartflow') ? 'smartflow-model' :
                (ressourceType === 'SnModelNode') ? 'smart-model' :
                    (ressourceType === 'listgen') ? 'generic-list' :
                        (ressourceType === 'app') ? 'app' :
                            (ressourceType === 'report') ? 'report' :
                                'tag-list';
        return storeRessourceType;
    }

    _getData(uuid: string, data?): Observable<any> {
        if (data) {
            return of(data);
        }
        const snModel: SnModelDto = _.find(this.sessionsService.active.datas.write.snModels,
            (model: SnModelDto) => model.uuid === uuid);

        if (!snModel) {
            this.messageService.send('store-load-log',
            {message: this.translateService.instant('RESSOURCE_SENT_TO_STORE_ERROR'), isError: true });
        }
        return of(snModel);
    }

    _confirmUpsertRessource(customer: string, ressourceRef: RessourcesRefDto[], forceSend: boolean): Observable<boolean> {

        return this._searchRessource(ressourceRef).pipe(
            flatMap((search) => {
                if (search.continue) {
                    const confirmation: RessourcesUpsertDto = {
                        foundInStore: search.found,
                        doUpdate: forceSend,
                        ressources: _.map(ressourceRef, (r: RessourcesRefDto) => {
                            const store = _.find(search.ressources, ress => r.key === ress.key);
                            return {
                                key: r.key,
                                storeUuid: (store) ? store.uuid : '',
                                refUuid: r.refUuid,
                                data: r.data,
                                ressourceType: r.ressourceType
                            };
                        }),
                        customerKey: customer,
                    };
                    this.messageService.send('send-to-store', confirmation);
                    return of(confirmation.foundInStore);
                }
                return of(search.continue);
            })
        );
    }

    _upsertRessource(confirmation: RessourcesUpsertDto): Observable<boolean[]> {
        const { customerKey, doUpdate, ressources }: RessourcesUpsertDto = confirmation;
        let headers = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Authorization', `Bearer ${this.store_token}`);

        const store_api = this.configService.config.storeConnection?.serverApi;
        const upserts$ = _.map(ressources, (ress) => {
            return this._getData(ress.refUuid, ress.data).pipe(
                flatMap((data: any) => {
                    const update: RessourcesDto = {
                        ressourceType: this._mapRessourceType(ress.ressourceType),
                        display: data.displayName,
                        key: ress.key,
                        data,
                        publisher: customerKey,
                        ownerId: this.configService.config.storeConnection.login,
                    };

                    if (doUpdate && _.trim(ress.storeUuid) !== '') {
                        return this.http.patch<boolean>(store_api + '/ressources', { uuid: ress.storeUuid, update }, { headers }).pipe(
                            flatMap(() => {
                                this.messageService.send('store-load-log',
                                    {message: this.translateService.instant('STORE.UPDATE-OK', {key: ress.key }), isError: false });
                                return of(true);
                            }),
                            catchError(() => {
                                this.messageService.send('store-load-log',
                                    {message: this.translateService.instant('STORE.UPDATE-KO', {key: ress.key }), isError: true });
                                return of(false);
                            })
                        );
                    }

                    if (_.trim(ress.storeUuid) === '') {
                        return this.http.post<boolean>(store_api + '/ressources', update, { headers }).pipe(
                            flatMap(() =>  {
                                this.messageService.send('store-load-log',
                                    { message: this.translateService.instant('STORE.CREATION-OK', {key: ress.key }), isError: false });
                                return of(true);
                            }),
                            catchError(() =>  {
                                this.messageService.send('store-load-log',
                                    { message: this.translateService.instant('STORE.CREATION-KO', {key: ress.key }), isError: true });
                                return of(false);
                            })
                        );
                    }

                    if (!doUpdate && _.trim(ress.storeUuid) !== '') {
                        this.messageService.send('store-load-log',
                            { message: this.translateService.instant('STORE.NO-UPDATE', {key: ress.key }), isError: true });
                        return of(true);
                    }
                }));
        });

        return zip<boolean[]>(...upserts$);
    }

    _searchRessource(ressourceRef: RessourcesRefDto[]): Observable<{
        continue: boolean, found: boolean,
        ressources: RessourcesDto[]
    }> {
        const search: RessourcesSearchDto = {
            limitToTypes: _.map(ressourceRef, ress => this._mapRessourceType(ress.ressourceType)),
            keys: _.map(ressourceRef, ress => ress.key),
            uuids: [],
            search: '',
            limit: 0,
            skip: 0,
            ownerId: this.configService.config.storeConnection.login,
        };
        const store_api = this.configService.config.storeConnection?.serverApi;
        let headers = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Authorization', `Bearer ${this.store_token}`);

        return this.http.post<RessourcesDto[]>(store_api + '/ressources/search/', search, { headers }).pipe(
            catchError(() => {
                this.messageService.send('store-load-log',
                { message: this.translateService.instant('STORE_CONNECTION_IMPOSSIBLE'), isError: true });

                return of({
                    continue: false,
                    found: false,
                    ressources: []
                });
            }),
            flatMap((ressources: RessourcesDto[]) => of({
                continue: true,
                found: (ressources && ressources.length > 0),
                ressources: (ressources) ? ressources : []
            })));
    }

    loginStore(login: string, password: string, sendMessage: boolean): Observable<boolean> {

        const store_api = this.configService.config.storeConnection?.serverApi;
        return this.http.post<RessourcesDto[]>(store_api + '/auth/login', { username: login, login, password }).pipe(
            catchError(() => {
                this.store_token = '';
                this.connectionDate = moment.now();
                this.token_expiration = 0;
                if (sendMessage) {
                    this.messageService.send('store-load-log',
                    {message: this.translateService.instant('STORE_CONNECTION_IMPOSSIBLE'), isError: true });
                }
                return of(false);
            }),
            flatMap((connection: any) => {
                if (!connection) {
                    if (sendMessage) {
                        this.messageService.send('store-load-log',
                            {message: this.translateService.instant('STORE_CONNECTION_IMPOSSIBLE'), isError: true });
                    }
                    return of(false);
                } else {
                    this.store_token = connection.token;
                    this.connectionDate = moment.now();
                    this.token_expiration = connection.expiresIn;
                    return of(true);
                }
            })
        );
    }

    sendFilesToStore(store: StoreConnectionDto, ressourceRef: RessourcesRefDto[], forceSend: boolean): Observable<boolean> {
        if (!this.store_token || this.store_token === '' ||
            (this.store_token !== '' && (moment.now() - this.connectionDate) > this.token_expiration)) {

            return this.loginStore(store.login, store.password, false).pipe(
                flatMap(
                    signed => {
                        if (!signed) {
                            return of(false);
                        } else {
                            return this._confirmUpsertRessource(store.customer, ressourceRef, forceSend);
                        }
                    }));
        } else {
            return this._confirmUpsertRessource(store.customer, ressourceRef, forceSend);
        }
    }

    getStoreUserToken(store: StoreConnectionDto): Observable<string> {
        if (!this.store_token || this.store_token === '' ||
            (this.store_token !== '' && (moment.now() - this.connectionDate) > this.token_expiration)) {
                return this.loginStore(store.login, store.password, false).pipe(
                    map((signed: boolean) => {
                        return (signed) ? this.store_token : '';
                    })
                );
        } else {
            return of(this.store_token);
        }
    }
}
