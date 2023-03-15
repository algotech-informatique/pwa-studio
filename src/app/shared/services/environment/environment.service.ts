import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ObjectTreeLineDto, EnvironmentDisplayDto, ResourceType, DirectoryClipboardDto, ModuleTreeLineDto } from '../../dtos';
import { UUID } from 'angular2-uuid';
import { SessionDto } from '../../dtos/session.dto';
import { EnvironmentDirectoryDto, SnModelDto, EnvironmentDto, SnAppDto } from '@algotech/core';
import { CreateLineDto } from '../../dtos/create-line.dto';
import { DEFAULT_STUDIO_ENVIRONMENT } from './environment.metadata';
import { TranslateLangDtoService } from '@algotech/angular';

@Injectable()
export class EnvironmentService {
    selectedRessource: ObjectTreeLineDto|ModuleTreeLineDto = null;

    constructor(
        private snTranslate: TranslateLangDtoService) {
    }

    createNewResource(
        type: ResourceType,
        customerKey: string,
        host: string,
        parent?: ObjectTreeLineDto,
        value?: SnModelDto,
        context?: any
    ) {
        const createLine: CreateLineDto = {
            parent,
            type: 'resource',
            value,
            context,
        };
        const name = value ? this.snTranslate.transform(value.displayName) : '';
        return this._createRessource(type, customerKey, host, name, UUID.UUID(), createLine, context);
    }

    createNewDirectory(
        type: ResourceType,
        customerKey: string,
        host: string,
        isConnector: boolean,
        parent: ObjectTreeLineDto,
        value: DirectoryClipboardDto,
    ) {
        const createContext: CreateLineDto = {
            parent: _.isArray(parent) ? null : parent,
            type: 'directory',
            value,
        };
        const name = value ? value.directory.name : '';
        return this._createDirectory(type, customerKey, host, name, UUID.UUID(), isConnector, createContext);
    }

    calculEnv(session: SessionDto): EnvironmentDisplayDto {
        /* */
        const statePrevious: EnvironmentDisplayDto = _.cloneDeep(session.environment);

        const workflows: ObjectTreeLineDto[] = [];
        const connectors: ObjectTreeLineDto[] = [];
        const reports: ObjectTreeLineDto[] = [];
        const apps: ObjectTreeLineDto[] = [];

        const smartmodel: SnModelDto = session.datas.write.snModels.find((sn) => sn.type === 'smartmodel');
        const environment = DEFAULT_STUDIO_ENVIRONMENT(smartmodel ? smartmodel.uuid : null,
            session.connection, apps, workflows, connectors, reports);

        apps.push(...this.createDirectories('app', session.datas.write.environment.apps, session, false));
        reports.push(...this.createDirectories('report', session.datas.write.environment.reports, session, false));
        workflows.push(...this.createDirectories('workflow', session.datas.write.environment.workflows, session, false));
        connectors.push(...this.createDirectories('smartflow', session.datas.write.environment.smartflows, session, true));

        apps.push(...this.createResources('app', session, apps));
        reports.push(...this.createResources('report', session, reports));
        workflows.push(...this.createResources('workflow', session, workflows));
        connectors.push(...this.createResources('smartflow', session, connectors));

        return this.restoreState(statePrevious, environment);
    }

    editing(current: EnvironmentDisplayDto) {
        return this.getObjectsTreeLineByEnvironment(current).some((o) => o.renaming || o.creation);
    }

    restoreState(statePrevious: EnvironmentDisplayDto, state: EnvironmentDisplayDto): EnvironmentDisplayDto {
        if (!statePrevious) {
            return state;
        }

        const stateClone: EnvironmentDisplayDto = _.cloneDeep(state);
        const objects = _.concat(this.getObjectsTreeLineByEnvironment(stateClone), this.getModulesTreeLine(stateClone.modules));
        const objectsPrev = _.concat(this.getObjectsTreeLineByEnvironment(statePrevious), this.getModulesTreeLine(statePrevious.modules));

        _.each(objects, (object: ObjectTreeLineDto|ModuleTreeLineDto) => {
            const openClose = this.getStateObjectTree(object, objectsPrev, 'state');
            const selected = this.getStateObjectTree(object, objectsPrev, 'selected');

            if (selected) {
                this.selectedRessource = object;
            }

            object.state = openClose;
            object.selected = selected;
        });
        stateClone.state = statePrevious.state;

        return stateClone;
    }

    getStateObjectTree(object: ObjectTreeLineDto|ModuleTreeLineDto, previousObjects: ObjectTreeLineDto[]|ModuleTreeLineDto[],
        propName: string): boolean {
        const index = _.findIndex(previousObjects, (prv: ObjectTreeLineDto|ModuleTreeLineDto) =>
            object.refUuid === prv.refUuid && object.customerKey === prv.customerKey && object.host === prv.host,
        );
        return (index !== -1) ? previousObjects[index][propName] : object[propName];
    }

    createDirectories(
        type: ResourceType,
        directories: EnvironmentDirectoryDto[],
        session: SessionDto,
        isConnector: boolean) {

        return _.orderBy(_.map(directories, (directory: EnvironmentDirectoryDto) => {
            const dirDisplay = this._createDirectory(
                type,
                session.connection.customerKey,
                session.connection.host,
                directory.name,
                directory.uuid,
                isConnector,
            );

            if (directory.subDirectories.length > 0) {
                dirDisplay.children.push(...this.createDirectories(type, directory.subDirectories, session, false));
            }

            return dirDisplay;
        }), 'name');
    }

    createResources(
        type: ResourceType,
        session: SessionDto,
        environment: ObjectTreeLineDto[]
    ) {
        const objectsTreeLine = this.getObjectsTreeLine(environment);

        const filterSnModels: SnModelDto[] = session.datas.write.snModels.filter((sn) => sn.type === type);

        return _.orderBy(_.reduce(filterSnModels, (results: ObjectTreeLineDto[], snModel: SnModelDto) => {
            const resource = this._createRessource(
                type,
                session.connection.customerKey,
                session.connection.host,
                this.snTranslate.transform(snModel.displayName),
                snModel.uuid,
                null,
                type === 'app' && snModel.versions.length > 0 ? (snModel.versions[0].view as SnAppDto).environment : null,
                {
                    published: snModel.publishedVersion ? true : false,
                    valid: false, // todo
                });

            if (!snModel.dirUuid) {
                results.push(resource);
            } else {
                const parent = objectsTreeLine.find((o) => o.refUuid === snModel.dirUuid);
                if (parent) {
                    const childs = _.clone(parent.children);
                    childs.push(resource);
                    parent.children = _.orderBy(childs, ['isFolder', 'name'], ['desc', 'asc']);
                }
            }

            return results;

        }, []), 'name');
    }

    getChilds(environment: EnvironmentDisplayDto, type: ResourceType, parent?: ObjectTreeLineDto): ObjectTreeLineDto[] {
        if (parent) {
            return parent.children;
        } else {
            const env = this.getEnvironmentDisplayByType(environment, type);
            if (env) {
                return env;
            }
        }
        return null;
    }

    getAllObjectsTreeLine(environments: EnvironmentDisplayDto[]): ObjectTreeLineDto[] {
        return _.reduce(environments, (results, environment: EnvironmentDisplayDto) => {
            results.push(...this.getObjectsTreeLineByEnvironment(environment));
            return results;
        }, []);
    }

    getAllModulesTreeLine(environments: EnvironmentDisplayDto[]): ModuleTreeLineDto[] {
        return _.reduce(environments, (results, environment: EnvironmentDisplayDto) => {
            results.push(...this.getModulesTreeLine(environment.modules));
            return results;
        }, []);
    }

    getAll(environments: EnvironmentDisplayDto[]): (ObjectTreeLineDto|ModuleTreeLineDto)[] {
        return _.concat(this.getAllObjectsTreeLine(environments), this.getAllModulesTreeLine(environments));
    }

    deleteDirectories(environment: EnvironmentDto, type: ResourceType, uuid: string) {
        switch (type) {
            case 'app':
                this.deleteDirectory(environment.apps, uuid);
                break;
            case 'report':
                this.deleteDirectory(environment.reports, uuid);
                break;
            case 'workflow':
                this.deleteDirectory(environment.workflows, uuid);
                break;
            case 'smartflow':
                this.deleteDirectory(environment.smartflows, uuid);
                break;
        }
    }

    deleteDirectory(directories: EnvironmentDirectoryDto[], uuid: string) {
        const index = _.findIndex(directories, (direc: EnvironmentDirectoryDto) => direc.uuid === uuid);
        if (index > -1) {
            directories.splice(index, 1);
        } else {
            _.forEach(directories, (direc: EnvironmentDirectoryDto) => {
                if (direc.subDirectories.length !== 0) {
                    this.deleteDirectory(direc.subDirectories, uuid);
                }
            });
        }
    }

    getDirectories(environment: EnvironmentDto, type: ResourceType, parentUuid?: string): EnvironmentDirectoryDto[] {
        let directories: EnvironmentDirectoryDto[] = null;

        if (parentUuid) {
            const dirParent = this.findDirectory(environment, type, parentUuid);
            if (dirParent) {
                directories = dirParent.subDirectories;
            }
        } else {
            switch (type) {
                case 'app':
                    directories = environment.apps;
                    break;
                case 'report':
                    directories = environment.reports;
                    break;
                case 'workflow':
                    directories = environment.workflows;
                    break;
                case 'smartflow':
                    directories = environment.smartflows;
                    break;
            }
        }

        return directories;
    }

    getEnvironmentDisplayByType(environment: EnvironmentDisplayDto, type: ResourceType): ObjectTreeLineDto[] {
        const modules = this.getModulesTreeLine(environment.modules);
        const module = modules.find((m) => m.class === 'objects' && m.type === type);
        return module ? module.childs as ObjectTreeLineDto[] : [];
    }

    getDirectoriesByType(environment: EnvironmentDto, type: ResourceType): EnvironmentDirectoryDto[] {
        switch (type) {
            case 'app':
                return environment.apps;
            case 'report':
                return environment.reports;
            case 'smartflow':
                return environment.smartflows;
            case 'smartmodel':
                return environment.smartmodels;
            case 'workflow':
                return environment.workflows;
            default:
                return null;
        }
    }

    findRootDirectoryByDirUuid(environment: EnvironmentDto, type: ResourceType, refUuid: string): EnvironmentDirectoryDto {
        const dir = this.findDirectory(environment, type, refUuid);
        if (!dir) {
            return null;
        }
        return this.findRootDirectory(environment, type, dir);
    }

    findRootDirectory(environment: EnvironmentDto, type: ResourceType, dir: EnvironmentDirectoryDto): EnvironmentDirectoryDto {
        const parent = this.findParentDirectory(environment, type, dir);
        if (parent) {
            return this.findRootDirectory(environment, type, parent);
        }
        return dir;
    }

    findParentDirectory(environment: EnvironmentDto, type: ResourceType, dir: EnvironmentDirectoryDto): EnvironmentDirectoryDto {
        const entryDirectories = this.getDirectoriesByType(environment, type);
        return this.getAllDirectories(entryDirectories).find((d) => d.subDirectories.some((sub) => sub.uuid === dir.uuid));
    }

    findDirectory(environment: EnvironmentDto, type: ResourceType, refUuid: string): EnvironmentDirectoryDto {
        const entryDirectories = this.getDirectoriesByType(environment, type);
        return this.getAllDirectories(entryDirectories).find((d) => d.uuid === refUuid);
    }

    getDirectoryUUIDByPath(environment: EnvironmentDto, type: ResourceType, path: string): UUID {
        if (path.startsWith('/')) {
            path = path.slice(1);
        }
        const directories = this.getAllDirectoriesFullname(this.getDirectoriesByType(environment, type));

        return directories.find((dir) => dir.name === path).uuid; // TODO handle directory not found case (prone to NPE here)
    }

    /**
     * Returns all the directories as a flat list of EnvironmentDirectoryDto but with the directory name being the full path of directory
     * (including parent directories names)
     */
    getAllDirectoriesFullname(directories: EnvironmentDirectoryDto[], parentDirName?: string): EnvironmentDirectoryDto[] {
        const results: EnvironmentDirectoryDto[] = [];
        const dirs = _.cloneDeep(directories);

        results.push(...dirs.map(dir => {
            if (parentDirName) {
                dir.name = parentDirName + '/' + dir.name;
            }
            return dir;
        }));
        results.push(..._.reduce(dirs, (r, envDir: EnvironmentDirectoryDto) => {
            if (envDir.subDirectories.length > 0) {
                r.push(...this.getAllDirectoriesFullname(envDir.subDirectories, envDir.name));
            }
            return r;
        }, []));

        return results;
    }

    getAllDirectories(directories: EnvironmentDirectoryDto[]): EnvironmentDirectoryDto[] {
        const results: EnvironmentDirectoryDto[] = [];

        results.push(...directories);
        results.push(..._.reduce(directories, (r, envDir: EnvironmentDirectoryDto) => {
            if (envDir.subDirectories.length > 0) {
                r.push(...this.getAllDirectories(envDir.subDirectories));
            }
            return r;
        }, []));

        return results;
    }

    getParentsModule(allModules: ModuleTreeLineDto[], module: ModuleTreeLineDto): ModuleTreeLineDto[] {
        const findParent = allModules.find((m) => (m.childs as ModuleTreeLineDto[]).includes(module));
        if (findParent) {
            return _.concat([findParent], this.getParentsModule(allModules, findParent));
        }
        return [];
    }

    getModulesTreeLine(modules: ModuleTreeLineDto[]): ModuleTreeLineDto[] {
        return _.reduce(modules, (results, module: ModuleTreeLineDto) => {
            results.push(module);
            if (module.class === 'modules') {
                results.push(...this.getModulesTreeLine(module.childs as ModuleTreeLineDto[]));
            }
            return results;
        }, []);
    }

    getObjectsTreeLineByEnvironment(environment: EnvironmentDisplayDto): ObjectTreeLineDto[] {
        const modules = this.getModulesTreeLine(environment.modules);
        return _.reduce(modules, (results, module: ModuleTreeLineDto) => {
            if (module.class === 'objects') {
                results.push(...this.getObjectsTreeLine(module.childs as ObjectTreeLineDto[]));
            }
            return results;
        }, []);
    }

    getObjectsTreeLine(objectsTreeLine: ObjectTreeLineDto[]): ObjectTreeLineDto[] {
        const results: ObjectTreeLineDto[] = [];

        results.push(...objectsTreeLine);
        results.push(..._.reduce(objectsTreeLine, (r, object) => {
            if (object.children.length > 0) {
                r.push(...this.getObjectsTreeLine(object.children));
            }
            return r;
        }, []));

        return results;
    }

    select(ressource: ObjectTreeLineDto|ModuleTreeLineDto) {
        if (this.selectedRessource) {
            this.selectedRessource.selected = false;
            this.selectedRessource = null;
        }
        if (!ressource) {
            return;
        }

        this.selectedRessource = ressource;
        this.selectedRessource.selected = true;
    }

    getByUuid(environments: EnvironmentDisplayDto[], host: string, customerKey: string, uuid: string) {
        return this.getAllObjectsTreeLine(environments).find((e) => e.refUuid === uuid && e.host === host && e.customerKey === customerKey);
    }

    findParent(objects: ObjectTreeLineDto[], child: ObjectTreeLineDto) {
        return this.getObjectsTreeLine(objects).find((e) => e.children.some((c) => c.refUuid === child.refUuid));
    }

    findModuleParent(environment: EnvironmentDisplayDto, object: ObjectTreeLineDto): ModuleTreeLineDto {
        const modules = this.getModulesTreeLine(environment.modules).filter((m) => m.class === 'objects');
        return modules.find((m) => this.getObjectsTreeLine(m.childs as ObjectTreeLineDto[]).indexOf(object) > -1);
    }

    deactivateEnv(environments: EnvironmentDisplayDto[]) {
        // patch for not reload the entire component
        for (const object of this.getAll(environments)) {
            object.active = false;
        }
    }

    selectByUUid(environments: EnvironmentDisplayDto[], host: string, customerKey: string, uuid: string) {
        const env: EnvironmentDisplayDto = _.find(environments, { host, customerKey });
        const modules = this.getModulesTreeLine(env.modules);
        const objects = this.getObjectsTreeLineByEnvironment(env);
        if (this._trySelectRessource(objects, uuid)) {
            const parent = this.findModuleParent(env, this.selectedRessource as ObjectTreeLineDto);
            if (!parent) {
                return ;
            }
            this.expandEnvironment(environments, env);
            this.expandModule(env, parent);
        } else if (this._trySelectModule(modules, uuid)) {
            this.expandEnvironment(environments, env);
            this.expandModule(env, this.selectedRessource as ModuleTreeLineDto);
        }
    }

    expandEnvironment(environments: EnvironmentDisplayDto[], environment: EnvironmentDisplayDto) {
        for (const env of environments) {
            env.state = (env === environment);
        }
    }

    expandModule(environment: EnvironmentDisplayDto, module: ModuleTreeLineDto) {
        const allModules = this.getModulesTreeLine(environment.modules);
        const parents = module ? [module, ...this.getParentsModule(allModules, module)] : [];
        for (const m of allModules) {
            if (m.class !== 'module') {
                m.state = parents.includes(m);
            }
        }
    }

    _trySelectModule(modules: ModuleTreeLineDto[], uuid: string): boolean {
        const find = modules.find((m) => m.refUuid === uuid);
        if (find) {
            this.select(find);
            return true;
        }
        return false;
    }
    _trySelectRessource(ressources: ObjectTreeLineDto[], uuid: string): boolean {
        const res: ObjectTreeLineDto = _.reduce(ressources, (result, ressource) => {
            const rec = this._findRec(ressource, uuid);
            if (rec) {
                return rec;
            } else {
                return result;
            }
        }, null);
        if (res) {
            this.select(res);
            return true;
        }
        return false;
    }
    _findRec(line: ObjectTreeLineDto, uuid: string): ObjectTreeLineDto {
        if (line.refUuid === uuid) {
            return line;
        } else {
            const ret = _.compact(_.map(line.children, (child) => this._findRec(child, uuid)));
            if (ret.length === 1) {
                return ret[0];
            }
            return null;
        }
    }

    _createRessource(
        type: ResourceType,
        customerKey: string,
        host: string,
        name: string,
        uuid: string,
        creation?: CreateLineDto,
        context?: any,
        status: {
            published: boolean;
            valid: boolean;
        } = {
                published: false,
                valid: false,
            }
    ) {
        let icon: string = null;
        const rightIcons: string[] = [];

        switch (type) {
            case 'app':
                icon = context === 'web' ? 'fa-solid fa-window-maximize' : 'fa-solid fa-mobile';
                break;
            case 'report':
                icon = 'fa-solid fa-file-lines';
                break;
            case 'workflow':
                icon = 'fa-solid fa-diagram-project';
                break;
            case 'smartmodel':
                icon = 'fa-solid fa-cubes';
                break;
            case 'smartflow':
                icon = 'fa-solid fa-atom';
                break;
        }

        if (status.published) {
            rightIcons.push('fa-solid fa-link');
        }
        if (status.valid) {
            rightIcons.push('fa-solid fa-circle');
        }

        const resource: ObjectTreeLineDto = {
            refUuid: uuid,
            openIcon: 'fa-solid fa-caret-down',
            closeIcon: 'fa-solid fa-caret-right',
            icon,
            state: false,
            name,
            rightIcons,
            action: '',
            isFolder: false,
            selectable: true,
            selected: false,
            type,
            customerKey,
            host,
            children: [],
            renaming: false,
            creation,
        };
        return resource;
    }

    _createDirectory(
        type: ResourceType,
        customerKey: string,
        host: string,
        name: string,
        uuid: string,
        isConnector: boolean,
        creation?
    ) {
        const folder: ObjectTreeLineDto = {
            refUuid: uuid,
            customerKey,
            host,
            openIcon: (type === 'smartflow' && isConnector) ? 'fa-solid fa-atom' : 'fa-solid fa-folder-open',
            closeIcon: (type === 'smartflow' && isConnector) ? 'fa-solid fa-atom' : 'fa-solid fa-folder',
            isConnector,
            state: false,
            icon: null,
            name,
            rightIcons: ['fa-solid fa-link', 'fa-solid fa-circle'],
            action: '',
            isFolder: true,
            selectable: false,
            selected: false,
            type,
            children: [],
            renaming: false,
            creation,
        };

        return folder;
    }
}
