import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { SessionDto } from '../../dtos/session.dto';
import { EnvService, AuthService, SettingsDataService } from '@algotech/angular';
import { ConnectionDto, ObjectTreeLineDto, ResourceType, DatasDto, AlertMessageDto,
    DirectoryClipboardDto, ModuleTreeLineDto, EnvironmentDisplayDto } from '../../dtos';
import { EnvironmentService } from '../environment/environment.service';
import { Observable, of } from 'rxjs';
import { SocketManager } from '../socket/socket-manager.service';
import { DatasService } from '../datas/datas-service';
import { LangsService } from '../langs/langs.service';
import { LangDto, SnModelDto } from '@algotech/core';
import { MessageService } from '../message/message.service';
import { DialogMessageService } from '../message/dialog-message.service';
import { TranslateService } from '@ngx-translate/core';
import { StudioHelper } from '../../modules/smart-nodes-custom/helper/helper.service';

@Injectable()
export class SessionsService {

    private _sessions: SessionDto[] = [];
    private _active: SessionDto;

    private host = '';
    private socket = '';
    private production = false;

    constructor(
        private env: EnvService,
        private authService:  AuthService,
        private langsService: LangsService,
        private datasService: DatasService,
        private environmentService: EnvironmentService,
        private messageService: MessageService,
        public translate: TranslateService,
        private dialogMessageService: DialogMessageService,
        private settingsDataService: SettingsDataService,
        private helper: StudioHelper
    ) {
        this.env.environment.subscribe((res) => {
            this.production = res.production;

            this.host = this.production ? `https://${window.location.host}${res.API_URL}` : res.API_URL;
            this.socket = this.production ? `wss://${window.location.host}${res.WS_URL}` : res.WS_URL;

            // FEATURE TOGGLES
            if (res.DISABLE_WS) {
                this.datasService.disableWebsocket = res.DISABLE_WS;
            } else {
                this.datasService.disableWebsocket = false;
            }
            if (res.ENABLE_HELPER) {
                this.helper.enableHelper = res.ENABLE_HELPER;
            } else {
                this.helper.enableHelper = false;
            }
        });
    }

    get sessions() {
        return this._sessions;
    }

    get active() {
        return this._active;
    }

    connect() {
        // already connect
        if (!this.authService.isAuthenticated) {
            return of({});
        }

        const connection: ConnectionDto = {
            host: this.host,
            login: this.authService.localProfil.login,
            customerKey: this.authService.localProfil.user.customerKey,
            name: this.authService.localProfil.user.customerKey,
            color: '#78909c',
        };

        if (this.findSession(connection.host, connection.customerKey)) {
            return of({});
        }

        // switch
        const datas: DatasDto = {
            customerKey: connection.customerKey,
            host: connection.host,
            socket: new SocketManager(),
            read: {
                localProfil: this.authService.localProfil,
                groups: [],
                glists: [],
                tags: [],
                smartModels: [],
                workflows: [],
                apps: [],
                settings: null,
                customer: null,
                users: [],
            },
            write: {
                previousState: {
                    environment: null,
                    snModels: [],
                },
                snModels: [],
                environment: {
                    smartflows: [],
                    smartmodels: [],
                    workflows: [],
                    reports: [],
                    apps: [],
                    smartTasks: [],
                },
            },
            status: 0
        };

        const session: SessionDto = {
            connection,
            environment: null,
            datas,
        };

        this._sessions.push(session);
        this._active = session;

        const onSocketLoaded = () => {
            this.change(connection);
            if (!session.environment || !this.environmentService.editing(session.environment)) {
                this.refreshEnv(connection.host, connection.customerKey);
            }
            this.expandEnvironment(session.environment);
        };

        return new Observable((observer) => {
            this.datasService.initialize(datas, this.socket, () => {
                onSocketLoaded();
                observer.next({});
            });
        });
    }

    disconnect(host: string, customerKey: string) {
        const findSession: SessionDto = this.findSession(host, customerKey);

        if (!findSession) {
            return;
        }

        // disconnect
        this.env.disconnect(host, findSession.connection.login);
        this._sessions.splice(this._sessions.indexOf(findSession), 1);

        this.datasService.disconnect(host, customerKey);
    }

    refresh(host: string, customerKey: string) {
        const active = this.active;
        const session = this.findSession(host, customerKey);
        this.change(session.connection);

        this.datasService.loadData(session.datas, () => {
            session.environment = this.environmentService.calculEnv(session);
            this.change(active.connection);
        }).subscribe();
    }

    findSession(host: string, customerKey: string): SessionDto {
        return _.find(this._sessions, (s: SessionDto) => s.connection.host === host && s.connection.customerKey === customerKey);
    }

    findConnection(host: string, customerKey: string) {
        const findSession = this.findSession(host, customerKey);
        if (!findSession) {
            throw Error(`connection ${host} ${customerKey} not find`);
        }
        return findSession.connection;
    }

    /*
        langs
    */

    initializeLangs(value: string) {
        const session: SessionDto = this.active;
        return this.langsService.initializeLangs(value, session.datas.read.customer.languages);
    }

    mergeLangs(value: LangDto[]) {
        const session: SessionDto = this.active;
        return this.langsService.mergeLangs(session.datas.read.customer.languages, value);
    }

    /*
        model
    */

    findModel(host: string, customerKey: string, uuid: string): SnModelDto {
        const session = this.findSession(host, customerKey);
        if (!session) {
            return null;
        }
        return session.datas.write.snModels.find((snModel) => snModel.uuid === uuid);
    }

    /*
        environment (display)
    */

    setActiveSession(session: SessionDto) {
        this._active = session;
    }

    refreshEnv(host?: string, customerKey?: string) {
        const session  = customerKey && host ? this.findSession(host, customerKey) : this._active;
        session.environment = this.environmentService.calculEnv(session);
        this.messageService.send('session-refresh-env', this.environmentService.getAll(_.map(this.sessions, (s: SessionDto) =>
            s.environment)));
    }

    refreshAllEnv() {
        for (const session of this.sessions) {
            session.environment = this.environmentService.calculEnv(session);
        }
        this.messageService.send('session-refresh-env', this.environmentService.getAll(_.map(this.sessions, (s: SessionDto) =>
            s.environment)));
    }

    selectEnv(ressource: ObjectTreeLineDto|ModuleTreeLineDto) {
        if (!ressource) {
            for (const env of this.getEnvironments()) {
                this.environmentService.expandModule(env, null);
            }
            this.environmentService.select(null);
            return ;
        }
        this.selectEnvByUUid(ressource.host, ressource.customerKey, ressource.refUuid);
    }

    selectEnvByUUid(host: string, customerKey: string, uuid: string) {
        this.change(this.findConnection(host, customerKey));
        this.environmentService.selectByUUid(this.getEnvironments(), host, customerKey, uuid);
    }

    expandModule(module: ModuleTreeLineDto) {
        this.environmentService.expandModule(this.findSession(module.host, module.customerKey).environment, module);
    }

    expandEnvironment(environment: EnvironmentDisplayDto) {
        this.environmentService.expandEnvironment(this.getEnvironments(), environment);
    }

    deactivateEnv() {
        this.environmentService.deactivateEnv(this.getEnvironments());
    }

    getDirectory(host: string, customerKey: string, type: ResourceType, refUuid: string) {
        const datas: DatasDto = this.findSession(host, customerKey).datas;
        if (!datas) {
            return null;
        }
        const dir = this.environmentService.findDirectory(datas.write.environment, type, refUuid);
        return dir;
    }

    getRootDirectory(host: string, customerKey: string, type: ResourceType, refUuid: string) {
        const datas: DatasDto = this.findSession(host, customerKey).datas;
        if (!datas) {
            return null;
        }
        const dir = this.environmentService.findRootDirectoryByDirUuid(datas.write.environment, type, refUuid);
        return dir;
    }

    getConnectorCustom(host: string, customerKey: string, type: ResourceType, refUuid: string) {
        const dir = this.getRootDirectory(host, customerKey, type, refUuid);
        if (!dir) {
            return null;
        }
        return dir.custom;
    }

    getDirectoryName(host: string, customerKey: string, type: ResourceType, refUuid: string) {
        const dir = this.getDirectory(host, customerKey, type, refUuid);
        if (!dir) {
            return null;
        }
        return dir.name;
    }

    getEnvByType(host: string, customerKey: string, type: ResourceType) {
        return this.environmentService.getEnvironmentDisplayByType(this.findSession(host, customerKey).environment, type);
    }

    getEnvByUUid(host: string, customerKey: string, uuid: string) {
        return this.environmentService.getByUuid(this.getEnvironments(), host, customerKey, uuid);
    }

    createNewResource(
        type: ResourceType,
        customerKey: string,
        host: string,
        parent?: ObjectTreeLineDto,
        resource?: SnModelDto,
        context?: any,
    ) {
        const session = this.findSession(host, customerKey);
        const resourceLine = this.environmentService.createNewResource(type, customerKey, host, parent, resource, context);
        const childs = this.environmentService.getChilds(session.environment, type, parent);
        if (childs) {
            childs.push(resourceLine);
        }
    }

    createNewDirectory(
        type: ResourceType,
        customerKey: string,
        host: string,
        isConnector: boolean,
        parent?: ObjectTreeLineDto,
        resource?: DirectoryClipboardDto,
    ) {
        const session = this.findSession(host, customerKey);
        const resourceLine = this.environmentService.createNewDirectory(type, customerKey, host, isConnector, parent, resource);
        const childs = this.environmentService.getChilds(session.environment, type, parent);
        if (childs) {
            const indexRec = childs.findIndex((c) => !c.isFolder);
            if (indexRec === -1) {
                childs.push(resourceLine);
                return;
            }
            // insert
            childs.splice(indexRec, 0, resourceLine);
        }
    }

    removeDirectory(line: ObjectTreeLineDto) {
        const session = this.findSession(line.host, line.customerKey);

        // remove data
        this.environmentService.deleteDirectories(session.datas.write.environment, line.type, line.refUuid);

        // notify
        this.datasService.notifyPatchEnvironment(line.customerKey, line.host);

        // refresh
        this.removeResource(session, line);
    }

    removeElement(line: ObjectTreeLineDto) {
        const session = this.findSession(line.host, line.customerKey);
        this.dialogMessageService.getMessageConfirm(this.removeElementMessage()).pipe()
            .subscribe((data: boolean) => {
                if (data) {

                    // remove data
                    const findIndex = _.findIndex(session.datas.write.snModels, (snData: SnModelDto) => snData.uuid === line.refUuid);
                    if (findIndex > -1) {
                        session.datas.write.snModels.splice(findIndex, 1);
                    }
                    const findPrev = _.findIndex(session.datas.write.previousState.snModels, (snData: SnModelDto) =>
                        snData.uuid === line.refUuid);
                    if (findPrev > -1) {
                        session.datas.write.previousState.snModels.splice(findPrev, 1);
                    }

                    // notify
                    this.datasService.notifyDeleteEnv(line);


                    // refresh
                    this.messageService.send('env-rm', line.refUuid);
                    this.removeResource(session, line);
                }
            });
    }

    remove(line: ObjectTreeLineDto, parent?: ObjectTreeLineDto) {
        const session = this.findSession(line.host, line.customerKey);
        this.removeResource(session, line, parent);
    }

    validateChilds(line: ObjectTreeLineDto, parent?: ObjectTreeLineDto): ObjectTreeLineDto[] {
        const session = this.findSession(line.host, line.customerKey);
        const childs = this.environmentService.getChilds(session.environment, line.type, parent);
        const defaultChild: ObjectTreeLineDto[] = this.getChild(childs, line);
        return (defaultChild[0].children.length !== 0) ? this.getNoFolderObject(defaultChild[0].children) : [];
    }

    private getEnvironments() {
        return _.compact(_.map(this._sessions, (session) => session.environment));
    }

    private change(connection: ConnectionDto) {
        this._active = this.findSession(connection.host, connection.customerKey);

        this.settingsDataService.glists = this.active.datas.read.glists;
        this.settingsDataService.groups = this.active.datas.read.groups;
        this.settingsDataService.settings = this.active.datas.read.settings;
        this.settingsDataService.smartmodels = this.active.datas.read.smartModels;
        this.settingsDataService.tags = this.active.datas.read.tags;
        this.settingsDataService.workflows = this.active.datas.read.workflows;

        this.messageService.send('session-change', this._active);
    }

    private removeResource(
        session: SessionDto,
        line: ObjectTreeLineDto,
        parent?: ObjectTreeLineDto
    ) {
        const childs = this.environmentService.getChilds(session.environment, line.type, parent);
        this.removeChilds(childs, line);
    }

    private removeChilds(childs: ObjectTreeLineDto[], line: ObjectTreeLineDto) {
        const index = childs.indexOf(line);
        if (index > -1) {
            childs.splice(childs.indexOf(line), 1);
        } else {
            _.forEach(childs, (child: ObjectTreeLineDto) => {
                if (child.children.length !== 0 && child.isFolder) {
                    this.removeChilds(child.children, line);
                }
            });
        }
    }

    private getChild(childs: ObjectTreeLineDto[], line: ObjectTreeLineDto): ObjectTreeLineDto[] {
        const index = childs.indexOf(line);
        if (index > -1) {
            return [childs[index]];
        } else {
            return _.reduce(childs, (result, child: ObjectTreeLineDto) => {
                if (child.children.length !== 0 && child.isFolder) {
                    result.push(...this.getChild(child.children, line));
                }
                return result;
            }, []);
        }
    }

    private getNoFolderObject(childs: ObjectTreeLineDto[]) {
        return _.reduce(childs, (result, child: ObjectTreeLineDto) => {
            if (child.isFolder && child.children.length !== 0) {
                result.push(...this.getNoFolderObject(child.children));
            } else {
                if (!child.isFolder) {
                    result.push(child);
                }
            }
            return result;
        }, []);
    }

    private removeElementMessage(): AlertMessageDto {
        return {
            title: this.translate.instant('SN-DELETE-VIEW-TITLE'),
            message: this.translate.instant('SN-DELETE-VIEW-MESSAGE'),
            detail: this.translate.instant('SN-DELETE-VIEW-DETAIL'),
            confirm: this.translate.instant('SN-DELETE-CONFIRM'),
            cancel: this.translate.instant('SN-DELETE-CANCEL'),
            type: 'warning',
            messageButton: true,
        };
    }

}
