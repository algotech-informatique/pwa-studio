import { SnModelDto, SnNodeDto } from '@algotech/core';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConfigDto, ResourceType, StoreConnectionDto } from '../../dtos';
import { RessourcesRefDto } from '../../dtos/ressource-ref.dto';
import { ConfigService } from '../config/config.service';
import { StoreService } from './store.service';
import * as _ from 'lodash';

@Injectable()
export class StorePreferencesService  {

    constructor(
        private configService: ConfigService,
        private storeService: StoreService,
    ) {
    }

    get config() {
        return this.configService.config;
    }

    get storeConnection() {
        return this.config.storeConnection;
    }

    validateStoreConnection(): Observable<boolean> {

        if (this.storeConnection
            && this.storeConnection?.login !== ''
            && this.storeConnection?.password !== ''
            && this.storeConnection?.serverUrl !== ''
            && this.storeConnection?.customer !== ''
            && this.storeConnection?.serverApi !== ''
        ) {
            return this.storeService.loginStore(this.storeConnection.login, this.storeConnection.password, false);
        } else {
            return of(false);
        }
    }

    save(user: string, password: string, url: string, customer: string, serverApi: string): Observable<boolean> {
        const store: StoreConnectionDto = {
            login:  user,
            password: password,
            serverUrl: url,
            customer: customer,
            serverApi: serverApi,
        };
        this.configService.setStoreConfig(store).subscribe();
        return this.storeService.loginStore(this.storeConnection.login, this.storeConnection.password, false);
    }

    sendToStore(items: SnModelDto[] | SnNodeDto, forceSend: boolean): Observable<boolean> {

        const ressourcesRef: RessourcesRefDto[] = _.map(items, (item) => {
            const res: RessourcesRefDto = {
                key: (item.type === 'SnModelNode') ? item.custom.key : item.key,
                refUuid: (item.type === 'SnModelNode') ? item.id : item.uuid,
                ressourceType: <ResourceType>item.type,
                storeUuid: '',
                data: (item.type === 'SnModelNode') ? item : null,
            };
            return res;
        });

        const store: StoreConnectionDto = {
            login: this.storeConnection.login,
            password: this.storeConnection.password,
            serverUrl: this.storeConnection.serverUrl,
            customer: this.storeConnection.customer,
            serverApi: this.storeConnection.serverApi,
        };
        return this.storeService.sendFilesToStore(store, ressourcesRef, forceSend);
    }
}
