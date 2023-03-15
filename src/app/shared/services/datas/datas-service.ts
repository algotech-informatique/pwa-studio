import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { CreateLineDto } from '../../dtos/create-line.dto';
import {
    EnvironmentDirectoryDto, SnModelDto, EnvironmentDto, PatchPropertyDto, PatchService,
    SmartModelDto, SnViewType, WorkflowModelDto, SnAppDto,
} from '@algotech/core';
import { UUID } from 'angular2-uuid';
import { ObjectTreeLineDto, DatasDto, CursorMoveDto, DirectoryClipboardDto, ResourceType } from '../../dtos';
import { SnModelsService } from '../smart-nodes/smart-nodes.service';
import { EnvironmentService } from '../environment/environment.service';
import { delay, flatMap, tap, debounceTime, map } from 'rxjs/operators';
import { zip, Subject } from 'rxjs';
import {
    CustomersService, EnvironmentsService, SmartModelsService,
    TranslateLangDtoService, KeyFormaterService,
    UsersService, SmartNodesService, WorkflowModelsService, LoaderService, SettingsDataService, DocumentIconDtoService, AuthService,
} from '@algotech/angular';
import { SnActionsService, SnView } from '../../modules/smart-nodes';
import { LangsService } from '../langs/langs.service';
import { MessageService } from '../message/message.service';
import { PatchesService } from './patches.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { AppActionsService } from '../../modules/app/services';

@Injectable()
export class DatasService {

    public disableWebsocket = false;
    notifyWithDebounce = new Subject();
    private datas: DatasDto[] = [];
    private queueingPatches: PatchPropertyDto[] = [];

    private errKey = '.err';
    private focusKey = '.focus';
    private addKey = '.add';
    private chgKey = '.chg';
    private rmKey = '.rm';

    constructor(
        private authService: AuthService,
        private undoRedoService: UndoRedoService,
        private customerService: CustomersService,
        private snModelService: SnModelsService,
        private environmentService: EnvironmentService,
        private envAngularService: EnvironmentsService,
        private snActions: SnActionsService,
        private smartModelsService: SmartModelsService,
        private translateLangDtoService: TranslateLangDtoService,
        private langsService: LangsService,
        private patchesService: PatchesService,
        private appActions: AppActionsService,
        private messageService: MessageService,
        private keyFormaterService: KeyFormaterService,
        private usersService: UsersService,
        private workflowModelsService: WorkflowModelsService,
        private smartNodesService: SmartNodesService,
        private settingsDataService: SettingsDataService,
        private docIcons: DocumentIconDtoService,
        private loader: LoaderService,
    ) {

        // regroup requests

        this.notifyWithDebounce.pipe(
            debounceTime(300),
        ).subscribe((data: { uuid: string; datas: DatasDto }) => {
            const patches = [...this.queueingPatches];
            this.queueingPatches = [];
            const notification = { uuid: data.uuid, patches };
            this.notify(notification, data.datas, 'smartnodes', this.chgKey);
        });
    }

    initialize(datas: DatasDto, socketHost: string, onCalculateEnv: () => void) {
        this.datas.push(datas);

        // socket
        datas.socket.start(socketHost, this.authService.localProfil.key, this.authService.localProfil.id);
        datas.socket.onConnect.pipe(
            flatMap(() => this.loadData(datas, onCalculateEnv))
        ).subscribe();

        datas.socket.onDisconnect.pipe(
            tap(() => {
                datas.status = -1;
            }),
            delay(2500)
        ).subscribe(() => {
            datas.socket.start(socketHost, this.authService.localProfil.key, this.authService.localProfil.id);
        });

        this.initializeSocket(datas, onCalculateEnv);
        return datas;
    }

    on(datas: DatasDto, pattern: string, executor: (data) => void, anycast: boolean = false) {
        datas.socket.messageListeners.push({ pattern, executor });
    }

    initializeSocket(datas: DatasDto, onCalculateEnv: () => void) {

        // snmodels (add, chg, rm)
        this.on(datas, 'event.smartnodes.add', (data: SnModelDto) => {
            datas.write.snModels.push(data);
            datas.write.previousState.snModels.push(_.cloneDeep(data));
            if (data.versions.length > 0) {
                this.snActions.notifyUpdate(data.versions[0].view as SnView);
            }
            onCalculateEnv();
        });

        this.on(datas, 'event.smartnodes.chg', (data: { uuid: string; patches: PatchPropertyDto[] }) => {
            const findIndex = _.findIndex(datas.write.snModels, (snData: SnModelDto) => snData.uuid === data.uuid);
            if (findIndex !== -1) {
                const model = datas.write.snModels[findIndex];
                this.patchesService.recomposeSNModel(model, data.patches);
                this._updatePreSNModel(datas, model);

                this.undoRedoService.clear(model.uuid, datas.host, datas.customerKey);
                for (const version of model.versions) {
                    this.snModelService.execute(model, () => {
                        this.snActions.notifyUpdate(version.view as SnView);
                    }, () => {
                        this.appActions.notifyUpdate(version.view as SnAppDto);
                    });
                }

                if (_.some(data.patches, (patch: PatchPropertyDto) =>
                    patch.path === '/dirUuid' || patch.path.startsWith('/displayName')
                )) {
                    onCalculateEnv();
                }
            }
        });

        this.on(datas, 'event.smartnodes.rm', (uuid: string) => {
            const findIndex = _.findIndex(datas.write.snModels, (snData: SnModelDto) => snData.uuid === uuid);
            if (findIndex > -1) {
                datas.write.snModels.splice(findIndex, 1);
            }
            const findPrev = _.findIndex(datas.write.previousState.snModels, (snData: SnModelDto) => snData.uuid === uuid);
            if (findPrev > -1) {
                datas.write.previousState.snModels.splice(findPrev, 1);
            }

            this.messageService.send('env-rm', uuid);
            onCalculateEnv();
        });

        // environemnt (chg)
        this.on(datas, 'event.environment.chg', (data: { uuid: string; patches: PatchPropertyDto[] }) => {
            new PatchService<EnvironmentDto>().recompose(data.patches, datas.write.environment, false);
            datas.write.previousState.environment = _.cloneDeep(datas.write.environment);
            onCalculateEnv();
        });

        // publish (refresh data)
        this.on(datas, 'event.publish', (type: ResourceType) => {
            switch (type) {
                case 'smartmodel':
                    this.smartModelsService.list().subscribe((smartModels: SmartModelDto[]) => {
                        datas.read.smartModels = smartModels;
                    });
                    break;
                case 'workflow':
                    this.workflowModelsService.list().subscribe((workflows: WorkflowModelDto[]) => {
                        datas.read.workflows = workflows;
                    });
            }
        });

        // Send Message Store
        this.on(datas, 'store.send.article', (data) => {
            this.messageService.send('get-store-article', data);
        });

        // focus
        this.initializeFocus(datas, 'event.view');
    }

    disconnect(host: string, customerKey: string) {
        const findDatas: DatasDto = this.findData(customerKey, host);
        if (!findDatas) {
            return;
        }

        for (const snModel of findDatas.write.snModels) {
            this.undoRedoService.clear(snModel.uuid, host, customerKey);
        }

        findDatas.socket.onDisconnect.unsubscribe();
        findDatas.socket.close();
        this.datas.splice(this.datas.indexOf(findDatas), 1);
    }

    loadData(datas: DatasDto, onCalculEnv: () => void) {
        datas.status = 0;
        return this.loader.Initialize(
            zip(
                this.customerService.getByCustomerKey(),
                this.usersService.list(),
                this.smartNodesService.list(),
                this.envAngularService.getEnvironment(),
            ).pipe(
                map((res: any[]) => {
                    datas.read.customer = res[0];
                    datas.read.users = res[1];
                    datas.write.snModels = res[2];
                    datas.write.environment = res[3];

                    return null;
                })
            )
        ).pipe(
            tap(() => {
                datas.read.groups = this.settingsDataService.groups;
                datas.read.glists = this.settingsDataService.glists;
                datas.read.tags = this.settingsDataService.tags;
                datas.read.smartModels = this.settingsDataService.smartmodels;
                datas.read.workflows = this.settingsDataService.workflows;
                datas.read.apps = this.settingsDataService.apps;
                datas.read.settings = this.settingsDataService.settings;

                // initialize previousState
                datas.write.previousState.environment = _.cloneDeep(datas.write.environment);
                datas.write.previousState.snModels = _.cloneDeep(datas.write.snModels);

                this.docIcons.initializeIcons();
                // refresh view
                this.messageService.send('loaded', { host: datas.host, customerKey: datas.customerKey });

            }), tap(() => {
                datas.status = 1;
                onCalculEnv();
            }),
        );
    }

    notify(data: any, currentData: DatasDto, event: string, postfixEvent = ''): void {
        if (this.disableWebsocket) {
            console.warn('websocket disabled !');
            return;
        }

        const queue = postfixEvent === this.chgKey;
        currentData.socket.send(`event.${event}${postfixEvent}`, data, queue);
        // Reload after error
        const pattern = `event.${event}${postfixEvent}${this.errKey}`;
        if (_.findIndex(currentData.socket.messageListeners, item => item.pattern === pattern) === -1) {
            this.on(currentData, pattern, () => {
                currentData.socket.onDisconnect.next(null);
                currentData.socket.close();
            });
        }
    }

    /*
    focus
    */
    notifyChangeView(customerKey: string, host: string, viewId: string) {
        const currentData: DatasDto = this.findData(customerKey, host);
        this.notify(viewId, currentData, 'view', this.focusKey);
    }

    notifyMouseMove(customerKey: string, host: string, data: CursorMoveDto) {
        const currentData: DatasDto = this.findData(customerKey, host);
        this.notify(data, currentData, 'cursor', this.focusKey);
    }

    public initializeFocus(datas: DatasDto, pattern: string) {
        const cbChange = ((data: any) => {
            const aUser = _.find(datas.socket.users, user => user.color === data.color);
            if (aUser) {
                if (aUser.focus) {
                    aUser.focus.zone = data.zone;
                } else {
                    aUser.focus = {
                        pattern,
                        zone: data.zone,
                    };
                }
            }
        });
        this.on(datas, pattern + this.focusKey + this.chgKey, cbChange);
    }
    /*
    */

    undo(model: SnModelDto, customerKey: string, host: string) {
        this._undoRedo(model, customerKey, host, () => this.undoRedoService.undo(model, host, customerKey));
    }

    redo(model: SnModelDto, customerKey: string, host: string) {
        this._undoRedo(model, customerKey, host, () => this.undoRedoService.redo(model, host, customerKey));
    }

    notifySNView(snView: SnViewType, customerKey: string, host: string) {
        // execute //
        window.requestAnimationFrame(() => {
            const currentData: DatasDto = this.findData(customerKey, host);
            const findModel = currentData.write.snModels.find((snModel) => snModel.versions.some((v) => v.view &&
                v.view.id === snView.id));

            if (!findModel) {
                return;
            }
            const model: SnModelDto = _.cloneDeep(findModel);

            const version = model.versions.find((v) => v.view && v.view.id === snView.id);
            if (!version) {
                return;
            }
            version.view = snView;
            this.notifySNModel(model, customerKey, host, true, version.uuid);
        });
    }

    notifySNModel(model: SnModelDto, customerKey: string, host: string, stackUndoRedo = true, versionUuid?: string) {
        const currentData: DatasDto = this.findData(customerKey, host);
        const preModel: SnModelDto = _.find(currentData.write.previousState.snModels,
            (prevModel: SnModelDto) => prevModel.uuid === model.uuid);

        this.patchesService.patchesSNModel(model, preModel, currentData, versionUuid).subscribe(
            (results) => {
                if (results.operations.length > 0) {

                    // undo redo
                    if (stackUndoRedo) {
                        this.undoRedoService.update(model.uuid, host, customerKey, results);
                    }

                    // patch
                    this.queueingPatches.push(...results.operations);
                    this.notifyWithDebounce.next({ uuid: model.uuid, datas: currentData });
                }
            });
    }

    notifyPublishWorkflow(customerKey: string, host: string, workflow: WorkflowModelDto) {
        const currentData: DatasDto = this.findData(customerKey, host);
        _.remove(currentData.read.workflows, { uuid: workflow.uuid });
        currentData.read.workflows.push(workflow);
        this.notify('workflow', currentData, 'publish');
    }

    notifyPublishSmartModels(customerKey: string, host: string, smartModels: SmartModelDto[]) {
        const currentData: DatasDto = this.findData(customerKey, host);
        currentData.read.smartModels = smartModels;
        this.notify('smartmodel', currentData, 'publish');
    }

    notifyPatchEnvironment(customerKey: string, host: string) {
        const currentData: DatasDto = this.findData(customerKey, host);
        const patches = this.patchesService.notifyPatchEnvironment(currentData, currentData.write.environment);
        if (patches.length > 0) {
            const notification = { uuid: currentData.write.environment.uuid, patches };
            this.notify(notification, currentData, 'environment', this.chgKey);
        }
    }

    notifyDeleteEnv(line: ObjectTreeLineDto) {
        const datas: DatasDto = this.findData(line.customerKey, line.host);
        const uuid = line.refUuid;
        this.notify(uuid, datas, 'smartnodes', this.rmKey);
    }

    notifyCreateEnv(line: ObjectTreeLineDto, creation: CreateLineDto) {
        /* */
        const datas = this.findData(line.customerKey, line.host);

        if (creation.type === 'directory') {
            let directory: EnvironmentDirectoryDto = {
                uuid: (line.refUuid) ? line.refUuid : UUID.UUID(),
                name: line.name,
                subDirectories: [],
            };
            if (line.type === 'smartflow') {
                directory.custom = [];
            }

            if (creation.value) {
                const clipboard = (creation.value as DirectoryClipboardDto);
                directory = clipboard.directory;
                directory.name = line.name;

                // add model
                for (const snModel of clipboard.snModels) {
                    this.notify(snModel, datas, 'smartnodes', this.addKey);
                    datas.write.previousState.snModels.push(_.cloneDeep(snModel));
                    datas.write.snModels.push(snModel);
                }
            }

            const childs = this.environmentService.getDirectories(datas.write.environment, line.type,
                line.creation.parent ? line.creation.parent.refUuid : null);
            if (childs) {
                // if not unique name
                if (childs.find((d) => d.name === line.name)) {
                    return false;
                }
                childs.push(directory);
                this.notifyPatchEnvironment(line.customerKey, line.host);
            }
        } else if (creation.type === 'resource') {

            switch (line.type) {
                case 'smartmodel': {
                    const snModel = datas.write.snModels.find((model) => model.type === 'smartmodel');
                    const snView = this.snModelService.getActiveView(snModel) as SnView;
                    if (snView) {
                        const group = this.snActions.createNewGroup(snView, { x: 0, y: 0 }, datas.read.customer.languages, line.name,
                            '#4E4655');
                        line.refUuid = group.id;
                    }
                }
                    break;
                default:
                    let resource: SnModelDto = this.snModelService.createNewModel(line.type, line.refUuid, line.name,
                        datas.read.localProfil.id, creation.parent ? creation.parent.refUuid : null, creation.context, datas);
                    if (creation.value) {
                        resource = creation.value as SnModelDto;
                        resource.displayName = this.langsService.initializeLangs(line.name, datas.read.customer.languages);
                        resource.key = this.keyFormaterService.format(line.name);
                    }

                    // if not unique key
                    if (!this.snModelService.checkKey(resource, resource.key, datas.write.snModels)) {
                        return false;
                    }

                    line.refUuid = resource.uuid;
                    this.notify(resource, datas, 'smartnodes', this.addKey);
                    datas.write.previousState.snModels.push(_.cloneDeep(resource));
                    datas.write.snModels.push(resource);
            }
        }
        return true;
    }

    createStoreDirectory(customerKey: string, host: string, type: ResourceType, directory: EnvironmentDirectoryDto, recreate = true,
        parentUuid?: string) {
        const datas = this.findData(customerKey, host);
        const childs: EnvironmentDirectoryDto[] = this.environmentService.getDirectories(datas.write.environment, type, parentUuid);

        if (childs) {
            if (!recreate) {
                const findDir = childs.find((ch: EnvironmentDirectoryDto) => ch.name === directory.name);
                // FIXME this may find wrong directory if names are equal but not structure, like /folder1/toto will equal /folder2/toto
                if (findDir) {
                    return findDir;
                }
            }
            this._validateFolderName(directory, childs);
            childs.push(directory);
            this.notifyPatchEnvironment(customerKey, host);
        }

        return directory;
    }

    _validateFolderName(directory: EnvironmentDirectoryDto, childs: EnvironmentDirectoryDto[]) {
        let name = directory.name;
        let pasteIncrement = 1;

        while (childs.some((ch: EnvironmentDirectoryDto) => ch.name === name)) {
            pasteIncrement++;
            name = `${directory.name}_${pasteIncrement}`;
        }

        if (directory.name !== name) {
            directory.name = name;
        }
    }

    createStoreModel(customerKey: string, host: string, resource: SnModelDto) {
        const datas = this.findData(customerKey, host);
        this.notify(resource, datas, 'smartnodes', this.addKey);
        datas.write.previousState.snModels.push(_.cloneDeep(resource));
        datas.write.snModels.push(resource);
    }

    updateStoreModel(customerKey: string, host: string) {
        this.notifyPatchEnvironment(customerKey, host);
    }

    notifyMoveEnv(
        ressource: ObjectTreeLineDto,
        destination: ObjectTreeLineDto
    ) {
        const datas: DatasDto = this.findData(ressource.customerKey, ressource.host);

        if (ressource.isFolder) {
            const childs = this.environmentService.getDirectories(datas.write.environment, ressource.type,
                destination ? destination.refUuid : null);
            const resource = this.environmentService.findDirectory(datas.write.environment, ressource.type,
                ressource.refUuid);

            if (childs && resource) {
                // rm
                this.environmentService.deleteDirectories(datas.write.environment, ressource.type, ressource.refUuid);
                const patches = this.patchesService.notifyPatchEnvironment(datas, datas.write.environment);

                // add
                childs.push(resource);
                patches.push(...this.patchesService.notifyPatchEnvironment(datas, datas.write.environment));

                // notify
                const notification = { uuid: datas.write.environment.uuid, patches };
                this.notify(notification, datas, 'environment', this.chgKey);
            }
        } else {
            const model = datas.write.snModels.find((snModel) => snModel.uuid === ressource.refUuid);
            if (!model) {
                return false;
            }
            model.dirUuid = destination ? destination.refUuid : null;
            this.notifySNModel(model, ressource.customerKey, ressource.host, false);
        }
    }

    notifyRenameEnv(line: ObjectTreeLineDto): boolean {
        const datas: DatasDto = this.findData(line.customerKey, line.host);
        const allDirectories: EnvironmentDirectoryDto[] = _.concat(
            this.environmentService.getAllDirectories(datas.write.environment.apps),
            this.environmentService.getAllDirectories(datas.write.environment.reports),
            this.environmentService.getAllDirectories(datas.write.environment.workflows),
            this.environmentService.getAllDirectories(datas.write.environment.smartflows)
        );
        if (line.isFolder) {
            const parent: EnvironmentDirectoryDto = _.find(allDirectories, (directory: EnvironmentDirectoryDto) =>
                _.find(directory.subDirectories, (subDirectory: EnvironmentDirectoryDto) => subDirectory.uuid === line.refUuid)
            );
            const children: EnvironmentDirectoryDto[] = parent ? parent.subDirectories : null;
            if (children) {
                if (this._notUniqueDirectoryName(children, line.name, line.refUuid)) { return false; }
                const childIndex: number = _.findIndex(children, (child: EnvironmentDirectoryDto) => child.uuid === line.refUuid);
                children[childIndex].name = line.name;
            } else {
                const rootDirectory: EnvironmentDirectoryDto = !children ?
                    _.find(allDirectories, (directory: EnvironmentDirectoryDto) => directory.uuid === line.refUuid) :
                    null;
                if (rootDirectory) {
                    const rootDirectories: EnvironmentDirectoryDto[] =
                        line.type === 'workflow' ? datas.write.environment.workflows :
                            line.type === 'report' ? datas.write.environment.reports :
                                line.type === 'app' ? datas.write.environment.apps :
                                    datas.write.environment.smartflows;
                    if (this._notUniqueDirectoryName(rootDirectories, line.name, line.refUuid)) { return false; }
                    rootDirectory.name = line.name;
                }
            }
            this.notifyPatchEnvironment(line.customerKey, line.host);
        } else {
            const snModelIndex: number = _.findIndex(datas.write.snModels, (snModel: SnModelDto) => snModel.uuid === line.refUuid);
            if (snModelIndex > -1) {
                const resourcesChild = this._resourcesChild(datas.write.snModels[snModelIndex], datas.write.snModels);
                if (this._notUniqueResourceName(resourcesChild, line.name, line.refUuid)) { return false; }
                datas.write.snModels[snModelIndex].displayName = this.langsService.initializeLangs(line.name,
                    datas.read.customer.languages);
                this.notifySNModel(datas.write.snModels[snModelIndex], datas.customerKey, datas.host);
            }
        }

        return true;
    }

    _undoRedo(model: SnModelDto, customerKey: string, host: string, action: () => PatchPropertyDto[]) {
        const datas = this.findData(customerKey, host);
        const patches = action();

        if (patches) {
            this.queueingPatches.push(...patches);
            this.notifyWithDebounce.next({ uuid: model.uuid, datas });

            this._updatePreSNModel(this.findData(customerKey, host), model);

            for (const version of model.versions) {
                    this.snModelService.execute(model, () => {
                        this.snActions.notifyUpdate(version.view as SnView);
                    }, () => {
                        this.appActions.notifyUpdate(version.view as SnAppDto);
                    });
                }
        }
    }

    _updatePreSNModel(datas: DatasDto, model: SnModelDto) {
        const prevIndex = _.findIndex(datas.write.previousState.snModels, (mod: SnModelDto) => mod.uuid === model.uuid);
        if (prevIndex !== -1) {
            datas.write.previousState.snModels[prevIndex] = JSON.parse(JSON.stringify(model));
        }
    }

    _resourcesChild(resource: SnModelDto, snModels: SnModelDto[]): SnModelDto[] {
        return _.reduce(snModels, (res: SnModelDto[], snModel: SnModelDto) => {
            if (
                snModel &&
                snModel.type === resource.type &&
                snModel.dirUuid === resource.dirUuid &&
                snModel.uuid !== resource.uuid
            ) {
                res.push(snModel);
            }
            return res;
        }, []);
    }

    _notUniqueResourceName(resources: SnModelDto[], name: string, uuid: string): SnModelDto {
        return _.find(resources, (resource: SnModelDto) => {
            if (resource) {
                return this.translateLangDtoService.transform(resource.displayName) === name && resource.uuid !== uuid;
            }
        });
    }

    _notUniqueDirectoryName(directories: EnvironmentDirectoryDto[], name: string, uuid: string): EnvironmentDirectoryDto {
        return _.find(directories, (directory: EnvironmentDirectoryDto) => {
            if (directory) { return directory.name === name && directory.uuid !== uuid; }
        });
    }

    findData(customerKey: string, host: string): DatasDto {
        return _.find(this.datas, (data: DatasDto) => data.customerKey === customerKey && data.host === host);
    }
}
