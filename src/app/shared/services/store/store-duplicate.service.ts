import { Injectable } from '@angular/core';
import { ResourceType, RessourcesDto, StoreArticleDto } from '../../dtos';
import { ClipboardService } from '../clipboard/clipboard.service';
import { SessionsService } from '../sessions/sessions.service';
import * as _ from 'lodash';
import { EnvironmentDirectoryDto, LangDto, SnModelDto } from '@algotech/core';
import { SnModelsService } from '../smart-nodes/smart-nodes.service';
import { MessageService } from '../message/message.service';
import { TranslateService } from '@ngx-translate/core';
import { DatasService } from '../datas/datas-service';
import { SnGroup, SnLang, SnNode, SnUtilsService, SnView } from '../../modules/smart-nodes';
import { UUID } from 'angular2-uuid';

interface CreationRessource {
    type: ResourceType;
    article: StoreArticleDto;
    objects: RessourcesDto[];
}

@Injectable()
export class StoreDuplicateService {

    messageInput = '';

    constructor(
        private clipboardService: ClipboardService,
        private sessionService: SessionsService,
        private snModelsService: SnModelsService,
        private messageService: MessageService,
        private translateService: TranslateService,
        private dataService: DatasService,
        private snModels: SnModelsService,
        private snUtils: SnUtilsService,
    ) {
    }

    deployElements(article: StoreArticleDto, ressources: RessourcesDto[], message: string) {
        this.messageInput = message;

        const creationRess: CreationRessource[] = this._splitRessources(article, ressources);
        _.forEach(creationRess, (creation: CreationRessource) => {

            if (creation.type === 'smartmodel') {
                this._createModelNode(creation);
            } else {
                this.messageService.send(this.messageInput, {
                    message: this.translateService.instant('STORE.START-TRAITMENT', { key: creation.type } ),
                    isError: false });
                const folder: EnvironmentDirectoryDto = this._createDirectory(creation.type, creation.article);
                _.forEach(creation.objects, (ressource) => {
                    this.messageService.send(this.messageInput, {
                        message: this.translateService.instant('STORE.START-TRAITMENT', { key: ressource.data.key } ),
                        isError: false });
                    this._createModel(ressource.data.type, ressource.data, folder.uuid);
                });
            }
        });
        this.sessionService.refreshEnv();
        this.messageService.send(this.messageInput, { message: this.translateService.instant('STORE.END-TRAITMENT'), isError: false});
    }

    getRessourceList(ressources: RessourcesDto[]): string[] {
        const objects = _.uniqBy(ressources, 'ressourceType');
        return _.map(objects, (object) => {
            return object.data.type;
        });
    }

    _splitRessources(article: StoreArticleDto, ressources: RessourcesDto[]): CreationRessource[] {
        const objects = _.uniqBy(ressources, 'ressourceType');

        return _.reduce(objects, (result, object) => {
            const fltr: RessourcesDto[] = _.filter(ressources, (res: RessourcesDto) => res.ressourceType === object.ressourceType);
            if (fltr.length > 0) {
                const creation: CreationRessource = {
                    article,
                    type: (fltr[0].data.type === 'SnModelNode') ? 'smartmodel' : fltr[0].data.type,
                    objects: fltr,
                };
                result.push(creation);
            }
            return result;
        }, []);
    }

    _createDirectory(type: ResourceType, article: StoreArticleDto) {
        this.messageService.send(this.messageInput,
            { message: this.translateService.instant('STORE.START-TRAITMENT.ADD-FOLDER', { key: article.key }), isError: false });

        const directory: EnvironmentDirectoryDto = {
            uuid: UUID.UUID(),
            name: article.key,
            subDirectories: [],
        };
        if (type === 'smartflow') {
            directory.custom = [];
        }
        this.dataService.createStoreDirectory(
            this.sessionService.active.connection.customerKey,
            this.sessionService.active.connection.host,
            type,
            directory,
        );
        this.messageService.send(this.messageInput,
            {message: this.translateService.instant('STORE.END-TRAITMENT.NEW-FOLDER', { key: directory.name }), isError: false});
        return directory;
    }

    _createModel(type: ResourceType, object: SnModelDto, parentUuid?: string ) {

        const newModel: SnModelDto = this.clipboardService.formatResource(
            this.sessionService.active.connection.customerKey,
            this.sessionService.active.connection.host,
            type,
            object,
            (parentUuid) ? parentUuid : null
        );
        newModel.displayName = this._transformLanguage(newModel.displayName);

        this.messageService.send(this.messageInput,
            { message: this.translateService.instant('STORE.START-TRAITMENT.NEW-MODEL'), isError: false });

        this._validateModelKey(newModel);
        this.snModelsService.setDuplicateView(object, newModel);
        this.dataService.createStoreModel(
            this.sessionService.active.connection.customerKey,
            this.sessionService.active.connection.host,
            newModel);
        this.messageService.send(this.messageInput, {message: this.translateService.instant('STORE.END-TRAITMENT.NEW-MODEL',
            { key: newModel.key }), isError: false });
    }

    _validateModelKey(newModel: SnModelDto) {
        if (!this.snModelsService.validateModelKey(this.sessionService.active.datas.write.snModels, newModel)) {
            this.messageService.send(this.messageInput, { message:
                this.translateService.instant('STORE.START-TRAITMENT.NEW-MODEL-NAME', {key: newModel.key }), isError: false });
        }
    }

    _createModelNode(creation: CreationRessource) {

        const snModel = _.find(this.sessionService.active.datas.write.snModels, (model: SnModelDto) => model.type === 'smartmodel');
        const snView = this.snModels.getActiveView(snModel) as SnView;
        if (snView) {
            const group: SnGroup = {
                canvas: this.snUtils.getCanvasPosition(snView, 0),
                color: '#4E4655',
                displayName: this._transformLanguage(creation.article.display),
                id: UUID.UUID(),
                open: true,
                displayState: {}

            };
            snView.groups.push(group);
            this.messageService.send(this.messageInput,
                {message: this.translateService.instant('STORE.END-TRAITMENT.NEW-MODEL-GROUP', {key: creation.article.key}),
                isError: false});

            _.forEach(creation.objects, (object) => {
                this.messageService.send(this.messageInput,
                    { message: this.translateService.instant('STORE.START-TRAITMENT.NEW-MODEL'), isError: false });

                const node: SnNode = object.data as SnNode;
                node.parentId = group.id;
                node.canvas = this.snUtils.getCanvasPosition(snView, 250);
                this._validateSnModelNodeKey(snView.nodes, node);
                node.displayName = this._transformLanguage(node.displayName);
                snView.nodes.push(node);
                this.messageService.send(this.messageInput,
                    { message: this.translateService.instant('STORE.END-TRAITMENT.NEW-MODEL', { key: node.custom.key }), isError: false });
            });
        }

        this.dataService.updateStoreModel(
            this.sessionService.active.connection.customerKey,
            this.sessionService.active.connection.host,
        );
        this.sessionService.refreshEnv();
    }

    _validateSnModelNodeKey(nodes: SnNode[], newNode: SnNode) {

        let key = newNode.custom.key;
        let pasteIncrement = 1;

        while (nodes.some((nd: SnNode) => nd.custom.key === key)) {
            pasteIncrement ++;
            key = `${newNode.custom.key}_${pasteIncrement}`;
        }
        if (newNode.custom.key !== key) {
            newNode.custom.key = key;
            this.messageService.send(this.messageInput,
                { message: this.translateService.instant('STORE.START-TRAITMENT.NEW-MODEL-NAME',
                {key: newNode.custom.key }), isError: false });
        }
    }

    _transformLanguage(langs: LangDto[] | SnLang[] | string) {
        if (!_.isArray(langs)) {
            return langs;
        }
        const lngs = _.map(this.sessionService.active.datas.read.customer.languages, (lng: LangDto) => {
            const index = _.findIndex(langs, (lan: LangDto) => lan.lang === lng.lang);
            if (index !== -1) {
                return langs[index];
            } else {
                return {
                    lang: lng.lang,
                    value: ''
                };
            }
        });
        return lngs;
    }
}
