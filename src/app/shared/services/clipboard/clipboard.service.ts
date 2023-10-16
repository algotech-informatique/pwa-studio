import { Injectable } from '@angular/core';
import { SnModelDto, SnVersionDto, EnvironmentDirectoryDto } from '@algotech-ce/core';
import * as _ from 'lodash';
import { SessionsService } from '../sessions/sessions.service';
import { SessionDto, ObjectTreeLineDto, ResourceType, DirectoryClipboardDto } from '../../dtos';
import { UUID } from 'angular2-uuid';
import { LangsService } from '../langs/langs.service';
import { SnTranslateService, SnView } from '../../modules/smart-nodes';
import { EnvironmentService } from '../environment/environment.service';
import { SnModelsService } from '../smart-nodes/smart-nodes.service';
import { from } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { KeyFormaterService } from '@algotech-ce/angular';

@Injectable()
export class ClipboardService {

    clipboard: {
        key: string;
        type: ResourceType;
        snModelDto: SnModelDto;
        directory: DirectoryClipboardDto;
    } = {
            key: null,
            type: null,
            snModelDto: null,
            directory: null,
        };

    constructor(
        private sessionsService: SessionsService,
        private langsService: LangsService,
        private snTranslateService: SnTranslateService,
        private environmentService: EnvironmentService,
        private snModelsService: SnModelsService,
        private clipboardService: Clipboard,
        private keyFormaterService: KeyFormaterService,
    ) {

        window.addEventListener('focus', () => {
            if(!navigator.clipboard?.readText) {
                return ;
            }
            from(navigator.clipboard.readText()).subscribe((text) => {
                try {
                    const object = JSON.parse(atob(text));
                    if (object?.key === 'at-resource') {
                        this.clipboard = object;
                    }
                } catch (e) {
                }
                return null;
            });
        });
    }

    isEmpty() {
        return !this.clipboard.snModelDto && !this.clipboard.directory;
    }

    canCopy(type: ResourceType) {
        return this.snModelsService.execute(type, () =>
            type !== 'smartmodel'
        , () => true
        , () => false
        );
    }

    noChildSmartFlow(line: ObjectTreeLineDto): boolean {
        return (line.children?.length !== 0 &&
            (line.children?.filter((fol) => fol.isFolder === true).length !== 0));
    }

    noFolder(line: ObjectTreeLineDto): boolean {
        return line.isFolder === false;
    }

    canPasteResource(type: ResourceType) {
        return (this.clipboard.type === type);
    }

    copyResource(customerKey: string, host: string, refUuid: string, ) {
        if (this.clipboard.snModelDto && refUuid === this.clipboard.snModelDto.uuid) { return; }
        const session: SessionDto = this.sessionsService.findSession(host, customerKey);
        const snModelDto: SnModelDto = _.find(session.datas.write.snModels, { uuid: refUuid });

        this.clipboard = {
            key: 'at-resource',
            snModelDto: _.cloneDeep(snModelDto),
            type: snModelDto.type as ResourceType,
            directory: null
        };
        this.clipboardService.copy(btoa(JSON.stringify(this.clipboard)));
    }

    pasteResource(customerKey: string, host: string, type: ResourceType, parent?: ObjectTreeLineDto) {
        const modelToPaste: SnModelDto = this.formatResource(customerKey, host, type, this.clipboard.snModelDto,
            parent ? parent.refUuid : null);
        this.sessionsService.createNewResource(type, customerKey, host, parent, modelToPaste);
        this.snModelsService.setDuplicateView(this.clipboard.snModelDto, modelToPaste);
    }

    canPasteDirectory(type: ResourceType) {
        return this.clipboard.directory && this.clipboard.type === type;
    }

    copyDirectory(customerKey: string, host: string, refUuid: string, type: ResourceType) {
        const session: SessionDto = this.sessionsService.findSession(host, customerKey);
        const directory: EnvironmentDirectoryDto = this.environmentService.findDirectory(session.datas.write.environment, type, refUuid);
        const directories: EnvironmentDirectoryDto[] = this.environmentService.getAllDirectories([directory]);

        const snModels: SnModelDto[] = _.reduce(session.datas.write.snModels, (results, snModel: SnModelDto) => {
            if (directories.some((d) => d.uuid === snModel.dirUuid)) {
                results.push(snModel);
            }
            return results;
        }, []);

        this.clipboard = {
            key: 'at-resource',
            type,
            directory: {
                directory: _.cloneDeep(directory),
                snModels: _.cloneDeep(snModels),
            },
            snModelDto: null,
        };
        this.clipboardService.copy(btoa(JSON.stringify(this.clipboard)));
    }

    pasteDirectory(customerKey: string, host: string, type: ResourceType, isConnector: boolean, parent?: ObjectTreeLineDto) {
        // todo

        const directory = this._formatDirectory(customerKey, host, type, this.clipboard.directory.directory, parent);
        const snModels = _.map(this.clipboard.directory.snModels, (snModel: SnModelDto) =>
            this.formatResource(customerKey, host, type, snModel, directory.uuid)
        );

        this.sessionsService.createNewDirectory(type, customerKey, host, isConnector, parent, {
            directory,
            snModels
        });
    }

    _formatDirectory(customerKey: string, host: string, type: ResourceType,
        directory: EnvironmentDirectoryDto, parent?: ObjectTreeLineDto) {
        const session: SessionDto = this.sessionsService.findSession(host, customerKey);
        const formatDirectory: EnvironmentDirectoryDto = _.cloneDeep(directory);
        const allDirectories: EnvironmentDirectoryDto[] = this.environmentService.getAllDirectories([formatDirectory]);

        for (const dir of allDirectories) {
            dir.uuid = UUID.UUID();
        }

        const childs = parent ? parent.children : this.environmentService.getEnvironmentDisplayByType(session.environment, type);
        formatDirectory.name = this._findName(formatDirectory.name, childs);

        return formatDirectory;
    }

    formatResource(customerKey: string, host: string, type: ResourceType, model: SnModelDto, dirUuid: string) {
        const session: SessionDto = this.sessionsService.findSession(host, customerKey);
        const formatModel: SnModelDto = _.cloneDeep(model);

        let allEnv: ObjectTreeLineDto[] = [];
        if (type === 'smartflow' || type === 'app') {
            const parent = this.sessionsService.getEnvByUUid(host, customerKey, dirUuid);
            if (parent) {
                allEnv = this.environmentService.getObjectsTreeLine(parent.children);
            }
        } else {
            allEnv = this.environmentService.getObjectsTreeLine(this.sessionsService.getEnvByType(host, customerKey, type));
        }

        const name = this._findName(this.snTranslateService.transform(formatModel.displayName), allEnv);
        formatModel.uuid = UUID.UUID();
        formatModel.dirUuid = dirUuid;
        delete formatModel.publishedVersion;
        formatModel.displayName = this.langsService.initializeLangs(name, session.datas.read.customer.languages);
        formatModel.versions = _.map(_.filter(formatModel.versions, { deleted: false }), (version: SnVersionDto) => {
            version.uuid = UUID.UUID();
            version.view.id = UUID.UUID();

            if (type === 'smartflow' && (version.view as SnView)?.options?.api?.route) {
                (version.view as SnView).options.api.route = this.keyFormaterService.format(name);
            }

            return version;
        });

        return formatModel;
    }

    _findName(originalName: string, allEnv: ObjectTreeLineDto[]) {
        let name = originalName;
        let pasteIncrement = 1;

        while (allEnv.some((e) => e.name === name)) {
            pasteIncrement++;
            name = `${originalName} (${pasteIncrement})`;
        }

        return name;
    }
}
