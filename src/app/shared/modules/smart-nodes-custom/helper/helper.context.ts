import { KeyFormaterService } from '@algotech-ce/angular';
import { LangDto, SmartModelDto, SnModelDto } from '@algotech-ce/core';
import { Injectable, Injector, ProviderToken } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { ResourceType, SessionDto } from 'src/app/shared/dtos';
import { SmartflowEntryComponentsService, WorkflowEntryComponentsService } from '..';
import { DatasService, EnvironmentService, LangsService, SessionsService, SmartModelsService, SnModelsService } from '../../../services';
import { SnEntryComponents, SnNodeSchema } from '../../smart-nodes/dto';
import { SnConnector, SnElement, SnNode, SnParam, SnView } from '../../smart-nodes/models';
import { SnActionsService, SnNodeMergeService, SnTranslateService, SnUtilsService } from '../../smart-nodes/services';
import { SnATNodeUtilsService } from '../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import HelperUtils from './helper.utils';

type FlowType = 'workflow' | 'smartflow';
@Injectable()
export class HelperContext {
    constructor(private injector: Injector) { }

    get activeSession(): SessionDto {
        return this._getProvider(SessionsService).active;
    }

    getWorkflowEntryComponents(): (snView: SnView) => SnEntryComponents {
        return this._getProvider(WorkflowEntryComponentsService).getEntryComponents(
            this.activeSession.datas.read.customer.languages
        );
    }

    getSmartflowEntryComponents(connectorUUID: string): (snView: SnView) => SnEntryComponents {
        return this._getProvider(SmartflowEntryComponentsService).getEntryComponents(
            this.activeSession.datas.read.customer.languages,
            this.activeSession.connection.customerKey,
            this.activeSession.connection.host,
            connectorUUID
        );
    }

    getViewFromModel(model: SnModelDto): SnView {
        return this._getProvider(SnModelsService).getActiveView(model) as SnView;
    }

    getFlow(key: string, flowType: FlowType): SnModelDto {
        const foundWorkflow = this.activeSession.datas.write.snModels
            .find(snModel => snModel.key === key && snModel.type === flowType);
        if (!foundWorkflow) {
            throw new Error(`StudioHelper was unable to find ${flowType} with key=[${key}]`);
        }
        return foundWorkflow;
    }

    getFlows(flowType: FlowType): SnModelDto[] {
        return this.activeSession.datas.write.snModels
            .filter(snModel => snModel.type === flowType);
    }

    createFlowModel(dirName: string, modelName: string, flowType: FlowType): SnModelDto {
        const directoryUUID = this.getFlowDirUUID(dirName, flowType);
        const snModel: SnModelDto = this.createNewModel(flowType, modelName, directoryUUID);
        this.storeSnModel(snModel);

        return snModel;
    }

    createFlowDir(directory: string, flowType: FlowType) {
        this._getProvider(DatasService).createStoreDirectory(
            this.activeSession.connection.customerKey,
            this.activeSession.connection.host,
            flowType,
            HelperUtils.prepareDirDto(directory),
            false
        );
    }

    getFlowDirUUID(directory: string, flowType: FlowType): UUID {
        return this._getProvider(EnvironmentService).getDirectoryUUIDByPath(
            this.activeSession.datas.write.environment,
            flowType,
            directory
        );
    }

    createNewModel(type: ResourceType, name: string, directoryUUID: UUID): SnModelDto {
        const newModel = this._getProvider(SnModelsService).createNewModel(
            type,
            UUID.UUID(),
            name,
            this.activeSession.datas.read.localProfil.id,
            directoryUUID.toString(),
            null,
            this.activeSession.datas
        );
        newModel.displayName = this._getProvider(LangsService).initializeLangs(
            name,
            this.activeSession.datas.read.customer.languages
        );
        newModel.key = this._getProvider(KeyFormaterService).format(name);

        return newModel;
    }

    getSmartModel(key: string): SmartModelDto {
        const model = this._getProvider(SnATNodeUtilsService).getSmartModel(key);
        if (!model) {
            throw new Error(`Smart model with key [${key}] not found`);
        }
        return model;
    }

    getSmartModelWithSubModels(key: string): SmartModelDto[] {
        const model = this.getSmartModel(key);
        const subModels = this._getProvider(SmartModelsService).getCompositionsModel(model, this.activeSession.datas.read.smartModels);

        return [model, ...subModels];
    }

    storeSnModel(model: SnModelDto) {
        if (!this._getProvider(SnModelsService).checkKey(model, model.key, this.activeSession.datas.write.snModels)) {
            throw new Error(`Invalid SnModel key [${model.key}], unable to store it`);
        }

        this._getProvider(DatasService).createStoreModel(
            this.activeSession.connection.customerKey,
            this.activeSession.connection.host,
            model
        );
    }

    createNodeParam(view: SnView, node: SnNode, param: SnParam) {
        const section = node.sections.find((s) => s.key === 'sources');
        this._getProvider(SnActionsService).addParam(view, node, param, section.params);
    }

    initializeParamValue(param: SnParam) {
        this._getProvider(SnNodeMergeService).initializeParamValue(param);
    }

    getNodesBy(container: SnElement, view: SnView): SnNode[] {
        return this._getProvider(SnUtilsService).getNodesByContainer(view, container);
    }

    linkParamConnectors(view: SnView, connectorA: SnConnector, connectorB: SnConnector) {
        this._getProvider(SnActionsService).linkConnector(view, connectorA, connectorB, 'param');
    }

    linkFlowConnectors(view: SnView, connectorA: SnConnector, connectorB: SnConnector) {
        this._getProvider(SnActionsService).linkConnector(view, connectorA, connectorB, 'flow');
    }

    refreshEnv() {
        this._getProvider(SessionsService).refreshEnv();
    }

    mergedNode(node: SnNode, schema: SnNodeSchema) {
        this._getProvider(SnNodeMergeService).mergedNode(node, schema);
    }

    initializeLangs(value: string): LangDto[] {
        return this.activeSession.datas.read.customer.languages.map((lang) => ({
                lang: lang.lang,
                value
            })
        );
    }

    getCurrentLanguage(): string {
        return this.activeSession.datas.read.localProfil.preferedLang; // FIXME is it the right way to get user's main language ?
    }

    /**
     * This method is only used by tests, it initializes a Studio minimal context but without being executed in Studio
     */
     _initializeOutsideStudio() {
        this.injector.get(DatasService).initialize(
            this.activeSession.datas,
            this.activeSession.connection.socketHost,
            () => {},
            () => {}
        );
        this.injector.get(SessionsService).connect(() => {});
    }

    private _getProvider<T>(providerName: ProviderToken<T>): T {
        return this.injector.get(providerName);
    }
}
