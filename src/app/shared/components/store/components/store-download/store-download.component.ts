import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { OptionsObjectDto, StoreConnectionDto, StoreArticleDto, RessourcesDto } from '../../../../dtos';
import * as _ from 'lodash';
import { MessageService, SessionsService, StoreService, ToastService } from '../../../../services';
import { AuthService } from '@algotech-ce/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface ApiNotif {
    user: string;
    tokenId: string;
    contexte: {
        visionToken: string;
        storeServer: string;
        socketHost: string,
        customerKey: string;
    };
    notifUrl: string;
}

@Component({
    selector: 'store-download',
    templateUrl: './store-download.component.html',
    styleUrls: ['./store-download.component.scss'],
})
export class StoreDownloadComponent implements OnDestroy {

    @Input() storeLoginData: StoreConnectionDto;
    @Input() customerKey: string;
    @Input() host: string;
    @Input() itemList: string[] = [];
    @Output() selectObject = new EventEmitter<OptionsObjectDto>();
    @Output() loadListObjects = new EventEmitter<{article: StoreArticleDto, ressources: RessourcesDto[]} >();

    article: StoreArticleDto;
    ressources: RessourcesDto[] = [];
    subscription: Subscription;

    constructor(
        private storeService: StoreService,
        private messageService: MessageService,
        private sessionService: SessionsService,
        protected authService: AuthService,
        private toastMessage: ToastService,
        private translateService: TranslateService,
    ) {
        this.subscription = this.messageService.get('get-store-article').pipe().subscribe((data: any) => {
            this.article = data.article;
            this.ressources = data.datas;
            this.loadListObjects.emit({ article: this.article, ressources: this.ressources });
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onStoreConnect() {
        this._openStore();
    }

    _encodeB64(object: ApiNotif): string {
        const json = JSON.stringify(object);
        return window.btoa(json);
    }

    _openStore() {

        this.storeService.getStoreUserToken(this.storeLoginData).pipe()
            .subscribe((data_token: string) => {
                if (data_token) {
                    const embebbedLink = this._createDataLink(data_token);
                    const url = `${this.storeLoginData.serverUrl}/store/${embebbedLink}`;
                    window.open(url, "_blank");
                } else {
                    this.toastMessage.addToast('error', '', this.translateService.instant('STORE.GESTION-LOGIN.ERROR'));
                }
            }, (err) => {
                console.error(err);
            }
        );
    }

    _createDataLink(token: string): string {
        const link: ApiNotif = {
            contexte: {
                visionToken: this.authService.localProfil.key,
                storeServer: this.storeLoginData.serverApi,
                socketHost: this.sessionService.active.connection.socketHost,
                customerKey: this.customerKey,
            },
            tokenId: token,
            user: this.storeLoginData.login,
            notifUrl: this.host,
        };
        return this._encodeB64(link);
    }
}
