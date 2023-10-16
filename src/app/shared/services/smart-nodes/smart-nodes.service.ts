import { Injectable } from '@angular/core';
import { SnModelDto, SmartModelDto, SnVersionDto, SnViewDto, SnViewType, SnAppDto, WorkflowModelDto } from '@algotech-ce/core';
import { UUID } from 'angular2-uuid';
import { KeyFormaterService } from '@algotech-ce/angular';
import { LangsService } from '../langs/langs.service';
import { ActiveVersion, DatasDto, ResourceType } from '../../dtos';
import moment from 'moment'; 
import * as _ from 'lodash';
import { SnNode, SnView, SnParam } from '../../modules/smart-nodes';
import { MessageService } from '../message/message.service';
import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class SnModelsService {

    _activeVersions: ActiveVersion[] = [];

    constructor(
        private messageService: MessageService,
        private keyFormaterService: KeyFormaterService,
        private langsService: LangsService,
    ) { }

    execute(type: SnModelDto | ResourceType, smartnodes: () => any, app: () => any, report?: () => any): any {
        switch (_.isString(type) ? type as ResourceType : (type as SnModelDto).type) {
            case 'workflow':
            case 'smartflow':
            case 'smartmodel':
                return smartnodes();
            case 'app':
                return app();
            case 'report':
                return report ? report() : null;
            default:
                return null;
        }
    }

    checkKey(
        model: SnModelDto,
        key: string,
        snModels: SnModelDto[],
        models?: SmartModelDto[],
        param?: SnParam,
        modelParams?: SnParam[],
    ): boolean {
        switch (model.type) {
            case 'smartmodel': {
                if (models && models.length > 0) {
                    if (modelParams && modelParams.length > 0) {
                        return !_.find(modelParams, (prm: SnParam) => prm.key === key && param.id !== prm.id);
                    }
                    const view = this.getActiveView(model) as SnView;
                    return view && !_.find(view.nodes, (node: SnNode) => node.custom.key === key);
                }
                return true;
            }
            case 'app': {
                return !(_.find(snModels, (snModel: SnModelDto) =>
                    snModel.type === model.type && snModel.key === key && snModel.uuid !== model.uuid)) &&
                    key !== 'plan';
            }
            default:
                return !(_.find(snModels, (snModel: SnModelDto) =>
                    snModel.type === model.type && snModel.key === key && snModel.uuid !== model.uuid));
        }
    }


    updateActiveVersion(model: SnModelDto, versionId: string) {
        const findIndex = _.findIndex(this._activeVersions, { uuid: model.uuid });
        if (findIndex === -1) {
            const active: ActiveVersion = {
                uuid: model.uuid,
                activeVersion: versionId,
            };
            this._activeVersions.push(active);
        } else {
            this._activeVersions[findIndex].activeVersion = versionId;
        }
        this.messageService.send('save.preferences', {});
    }

    setDuplicateView(model: SnModelDto, duplicateModel: SnModelDto) {
        const findIndex = _.findIndex(this._activeVersions, (activeView) => activeView.uuid === model.uuid);
        if (findIndex !== -1) {
            const versIndex = _.findIndex(_.filter(model.versions, { deleted: false }), (vrs: SnVersionDto) => vrs.uuid ===
                this._activeVersions[findIndex].activeVersion);

            const actVersion: SnVersionDto = duplicateModel.versions[versIndex];
            const active: ActiveVersion = {
                uuid: duplicateModel.uuid,
                activeVersion: actVersion.uuid,
            };
            this._activeVersions.push(active);
            this.messageService.send('save.preferences', {});
        }
    }

    getPublishedView(snModel: SnModelDto): SnViewType {
        if (!snModel || snModel.versions.length === 0) {
            return null;
        }
        const publishVersion = _.find(snModel.versions, { uuid: snModel.publishedVersion });
        return publishVersion ? publishVersion.view : null;
    }

    getActiveVersion(snModel: SnModelDto): SnVersionDto {
        if (!snModel || snModel.versions.length === 0) {
            return null;
        }
        const findIndex = _.findIndex(this._activeVersions, { uuid: snModel.uuid });
        if (findIndex !== -1) {
            const versionId = this._activeVersions[findIndex].activeVersion;
            const vrs: SnVersionDto = _.find(snModel.versions, { uuid: versionId });
            if (vrs) {
                return vrs;
            }
        }
        const publishVersion = _.find(snModel.versions, { uuid: snModel.publishedVersion });
        return publishVersion ? publishVersion : snModel.versions[snModel.versions.length - 1];
    }

    getActiveView(snModel: SnModelDto): SnViewType {
        const version = this.getActiveVersion(snModel);
        if (!version) {
            return null;
        }
        return version.view;
    }

    getViewByWorkflow(workflow: WorkflowModelDto, snModels: SnModelDto[]): SnViewDto {
        const view: SnViewDto = snModels.find(
            (snModel) => snModel.uuid === workflow.uuid
        )?.versions.find(
            (version) => version.view.id === workflow.viewId
        )?.view as SnViewDto;

        return view;
    }

    createNewModel(type: ResourceType, uuid: string, name: string, creatorUuid: string, dirUuid: string,
        context: any, datas: DatasDto): SnModelDto {
        const model: SnModelDto = {
            displayName: this.langsService.initializeLangs(name, datas.read.customer.languages),
            dirUuid,
            key: this.keyFormaterService.format(name),
            type,
            uuid,
            versions: [{
                uuid: UUID.UUID(),
                createdDate: moment().format(),
                creatorUuid,
                deleted: false,
                updateDate: moment().format(),
                view: this.execute(type, () => {
                    const view: SnViewDto = {
                        id: UUID.UUID(),
                        groups: [],
                        nodes: [],
                        box: [],
                        comments: [],
                        options: {},
                        drawing: {
                            lines: [],
                            elements: []
                        }
                    };
                    switch (type) {
                        case 'smartflow':
                            view.options = {
                                type,
                                tags: [],
                                variables: [],
                                api: {
                                    route: this.keyFormaterService.format(name),
                                    type: 'GET',
                                    auth: { jwt: true },
                                    summary: '',
                                    description: '',
                                    result: [],
                                },
                            };
                            break;
                        case 'workflow':
                            view.options = {
                                type,
                                tags: [],
                                variables: [],
                                profiles: [],
                                subWorkflow: false,
                            };
                            break;
                        case 'smartmodel':
                            view.options = {
                                type,
                            };
                            break;
                    }
                    return view;
                }, () => {
                    const app: SnAppDto = {
                        id: UUID.UUID(),
                        environment: context,
                        icon: '',
                        securityGroups: [],
                        pageHeight: context === 'web' ? 1080 : 812,
                        pageWidth: context === 'web' ? 1920 : 375,
                        pages: [{
                            id: UUID.UUID(),
                            canvas: {
                                x: 0,
                                y: 0
                            },
                            css: {
                                'background-color': 'var(--ALGOTECH-BACKGROUND)'
                            },
                            pageHeight: context === 'web' ? 1080 : 812,
                            pageWidth: context === 'web' ? 1920 : 375,
                            displayName: this.langsService.initializeLangs(name, datas.read.customer.languages),
                            variables: [],
                            dataSources: [],
                            widgets: [],
                            events: [{
                                eventKey: 'onLoad',
                                id: UUID.UUID(),
                                pipe: [],
                            }],
                            main: true,
                            custom: {},
                        }],
                        drawing: {
                            lines: [],
                            elements: []
                        },
                        theme: datas.read.settings.theme,
                        shared: []
                    };
                    return app;
                }, () => {
                    const report: SnViewDto = {
                        id: UUID.UUID(),
                        groups: [],
                        nodes: [],
                        box: [],
                        comments: [],
                        options: {
                            type,
                            enabled: false,
                            fileId: '',
                            fileName: '',
                            variables: [],
                        },
                        drawing: {
                            lines: [],
                            elements: []
                        }
                    };
                    return report;
                })
            }]
        };
        return model;
    }

    validateModelKey(models: SnModelDto[], model: SnModelDto) {
        const list: SnModelDto[] = _.filter(models, (m: SnModelDto) => m.type === model.type);
        let key = model.key;
        let pasteIncrement = 1;

        while (list.some((e: SnModelDto) => e.key === key)) {
            pasteIncrement++;
            key = `${model.key}_${pasteIncrement}`;
        }

        if (model.key !== key) {
            model.key = key;
            return false;
        }
        return true;
    }

    actionVersion(type: 'select' | 'add' | 'remove', version: SnVersionDto | SnViewType,
        snModel: SnModelDto, snView: SnViewType, creator: string): SnViewType {

        switch (type) {
            case 'add':
                const vers: SnVersionDto = this.duplicateModelVersion(snModel, version as SnViewType, creator);
                this.updateActiveVersion(snModel, vers.uuid);
                return vers.view;
            case 'remove':
                return this.deleteVersion(snModel, snView, version as SnVersionDto);
            case 'select':
                return (version as SnVersionDto).view;
            default:
                return snView;
        }
    }

    duplicateModelVersion(snModel: SnModelDto, view: SnViewType, creator: string): SnVersionDto {

        const newVersion: SnViewType = _.cloneDeep(view);
        newVersion.id = UUID.UUID();

        const version: SnVersionDto = {
            uuid: UUID.UUID(),
            createdDate: moment().format(),
            creatorUuid: creator,
            deleted: false,
            view: newVersion,
        };

        snModel.versions.push(version);
        return version;
    }

    deleteVersion(snModel: SnModelDto, snView: SnViewType, version: SnVersionDto): SnViewType {
        let activeView: SnViewType = snView;
        const versionIndex: number = _.findIndex(snModel.versions, { uuid: version.uuid });
        if (versionIndex !== -1) {
            if (snView.id === version.view.id) {
                const activeVersion = versionIndex > 0 ? snModel.versions[versionIndex - 1] : snModel.versions[versionIndex + 1];
                this.updateActiveVersion(snModel, activeVersion.uuid);
                activeView = activeVersion.view;
            }
            snModel.versions.splice(versionIndex, 1);
            return activeView;
        }
    }
}
