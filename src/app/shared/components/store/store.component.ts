import { SnModelDto, SnNodeDto, SnViewDto } from '@algotech/core';
import { ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import { OptionsObjectDto, RessourcesDto, StoreArticleDto, StoreConnectionDto } from '../../dtos';
import { MessageService, SessionsService, StorePreferencesService, ToastService } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { StoreFrontService } from './services/store-front.service';
import { StoreDuplicateService } from '../../services/store/store-duplicate.service';

@Component({
    selector: 'app-store',
    templateUrl: './store.component.html',
    styleUrls: ['./store.component.scss'],
})
export class StoreComponent implements OnChanges {

    @Input() customerKey: string;
    @Input() host: string;

    activeSelected: 'login' | 'download' | 'upload' = 'upload';
    models: SnModelDto[];
    storeLoginData: StoreConnectionDto;
    isStoreConnected = false;
    forceSend = true;

    listObjects: OptionsObjectDto[] = [];
    sendListObjects: OptionsObjectDto[] = [];
    storeLogInput = 'store-load-log';
    storeLogClear = 'store-clear-log';

    downloadListObjects: OptionsObjectDto[] = [];
    downloadListInput = 'store-dowload-load-log';
    downloadListclear = 'store-dowload-clear-log';
    deployRessources: RessourcesDto[] = [];
    deployArticle: StoreArticleDto;
    itemList: string[] = [];

    constructor(
        private storePreference: StorePreferencesService,
        private sessions: SessionsService,
        private ref: ChangeDetectorRef,
        private translateService: TranslateService,
        private storeFrontService: StoreFrontService,
        private messageService: MessageService,
        private storeDuplicateService: StoreDuplicateService,
        private toastMessage: ToastService,
    ) { }

    ngOnChanges() {
        this.storeLoginData = (this.storePreference.storeConnection) ? {
            login: (this.storePreference.storeConnection?.login) ? this.storePreference.storeConnection.login : '',
            password: (this.storePreference.storeConnection?.password) ? this.storePreference.storeConnection.password : '',
            serverUrl: (this.storePreference.storeConnection?.serverUrl) ? this.storePreference.storeConnection.serverUrl : '',
            customer: (this.storePreference.storeConnection?.customer) ? this.storePreference.storeConnection.customer : '',
            serverApi: (this.storePreference.storeConnection?.serverApi) ? this.storePreference.storeConnection.serverApi : '',
        } : {
            login: '',
            password: '',
            serverApi: '',
            customer: '',
            serverUrl: '',
        };

        this.models = this.sessions.findSession(this.host, this.customerKey).datas.write.snModels;
        this.storePreference.validateStoreConnection().pipe().subscribe(
            (validate: boolean) => {
                this.isStoreConnected = validate;
                this.activeSelected = (validate) ? 'upload' : 'login';
                if (!validate) {
                    this.toastMessage.addToast('error', '', this.translateService.instant('STORE.GESTION-LOGIN.ERROR'), 2000);
                }
                this.ref.detectChanges();
        });

        this.listObjects = this.storeFrontService.loadUploadList(this.models);
        this.load();
    }


    load() {
        this.downloadListObjects = [];
        this.messageService.send(this.storeLogClear, '');
        this.messageService.send(this.downloadListclear, '');
    }

    onOpenMenu(key) {
        this.activeSelected = key;
        this.load();
        this.ref.detectChanges();
    }

    onStoreLoginChanged(event)  {
        this.storePreference.save(event.login, event.password, event.serverUrl, event.customer, event.serverApi)
            .subscribe((validate: boolean) => {
                this.isStoreConnected = validate;
                this.ref.detectChanges();
        });
    }

    onSelectObject(data) {
        const index = _.findIndex(this.sendListObjects, (objects: OptionsObjectDto) => objects.uuid === data.uuid);
        if (index === -1) {
            this.sendListObjects.push(data);
            this.storeFrontService.activateOptionList(data);
        } else {
            this.sendListObjects.splice(index, 1);
            this.storeFrontService.activateOptionList(data);
        }
    }

    onRemoveItem(data) {
        const index = _.findIndex(this.sendListObjects, (objects: OptionsObjectDto) => objects.uuid === data.uuid);
        if (index !== -1) {
            this.sendListObjects.splice(index, 1);
            this.storeFrontService.activateOptionList(data);
        }
    }

    onCheckedChanged(data) {
        this.forceSend = data;
    }

    onSendStore() {

        const datas: SnModelDto[] = _.reduce(this.sendListObjects, (result, obj: OptionsObjectDto) => {
            if (obj.detailLine === 'SnModelNode') {
                const data = this._getDatasSnModel(obj.uuid);
                if (data) {
                    result.push(data);
                }
            } else {
                const index = _.findIndex(this.models, (mod: SnModelDto) => obj.uuid === mod.uuid);
                if (index !== -1) {
                    result.push(this.models[index]);
                }
            }
            return result;
        }, []);

        this.messageService.send(this.storeLogClear, '');
        this.messageService.send(this.storeLogInput, this.translateService.instant('STORE.LOAD-SEND-STORE'));

        this.storePreference.sendToStore(datas, this.forceSend).subscribe((result) => {
            this._clearList();
        });
    }

    onLoadListDownload(data: {article: StoreArticleDto, ressources: RessourcesDto[]}) {
        const objects = this.storeFrontService.loadDownloadList(data.ressources);
        this.deployRessources = data.ressources;
        this.deployArticle = data.article;
        this.itemList = this.storeDuplicateService.getRessourceList(this.deployRessources);
        this.downloadListObjects = objects;
    }

    onDeployItems(data: OptionsObjectDto[]) {

        const ressources: RessourcesDto[] = _.map(data, (ele: OptionsObjectDto) => {
            return _.find(this.deployRessources, (ress: RessourcesDto) => ress.uuid === ele.uuid);
        });

        this.messageService.send(this.downloadListclear, '');
        this.messageService.send(this.downloadListInput, this.translateService.instant('STORE.START-DEPLOY-RESSOURCES'));
        this.storeDuplicateService.deployElements(this.deployArticle, ressources, this.downloadListInput);
        setTimeout(() => {
            this.storeFrontService.clearList(this.downloadListObjects);
        }, 200);
    }

    _getDatasSnModel(modelUuid: string)  {
        const index = _.findIndex(this.models, (mod: SnModelDto) => mod.type === 'smartmodel');
        if (index !== -1) {
            const view: SnViewDto = this.models[index].versions[0].view as SnViewDto;
            return _.find(view.nodes, (node: SnNodeDto) => node.id === modelUuid);
        }
    }

    _clearList() {
        this.storeFrontService.clearList(this.listObjects);
        this.sendListObjects = [];
    }
}
