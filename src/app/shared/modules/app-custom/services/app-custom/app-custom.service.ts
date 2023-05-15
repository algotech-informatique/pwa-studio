import {
    PairDto, SnAppDto, SnModelDto, SnPageDto, SnPageEventDto, SnPageEventPipeDto, SnPageVariableDto,
    SnPageWidgetDto, SnPageWidgetTypeReturnDto, SnVersionDto, SnViewDto, TaskModelDto, WorkflowModelDto, WorkflowProfilModelDto
} from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WidgetInput } from '../../dto/widget-input.dto';
import { SessionsService } from '../../../../services';
import { SnConnectorUtilsService } from '../../../smart-nodes-custom';
import { SnView } from '../../../smart-nodes';
import { SnModelsService } from '../../../../services';
import * as _ from 'lodash';
import { PageUtilsService } from '../../../app/services';
import { getAutoInputsEvents } from '../../widgets/_data/data';
import { WorkflowUtilsService } from '@algotech-ce/business';
import { EventWorkflowPairDto, EventWorkflowPairProfileDto } from '../../../inspector/dto/event-workflow-pair.dto';
import { InputItem } from '../../../inspector/dto/input-item.dto';
import { UUID } from 'angular2-uuid';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AppCustomService {
    constructor(
        private sessionsService: SessionsService,
        private snModelsService: SnModelsService,
        private pageUtils: PageUtilsService,
        private snConnectorUtilsService: SnConnectorUtilsService,
        private workflowUtilsService: WorkflowUtilsService,
        private translateService: TranslateService,
    ) { }

    public _getSymboles(value: any): string[] {
        if (typeof value === 'string') {
            const res = value.match(/{{(?!\[)(.*?)}}/ig);
            if (res) {
                return res;
            }
        }
        return [];
    }

    isExpression(value: any): boolean {
        const symboles = this._getSymboles(value);
        return symboles.length > 0;
    }

    getAvailableInputs(page: SnPageDto, widget: SnPageWidgetDto, event?: SnPageEventDto, action?: SnPageEventPipeDto): WidgetInput[] {

        // LIST
        let listItem: WidgetInput | undefined;
        if (widget) {
            const mainList = this.pageUtils.findMainListWidget(null, widget, page);
            const formula = mainList?.custom?.collection;
            const type = this.getItemType(page.variables, page.dataSources, page, mainList, formula);
            if (type) {
                listItem = this.getInput('current-list', type, 'item', false);
            }
        }

        // TABLE
        let tableItem: WidgetInput | undefined;
        if (widget && (widget.typeKey === 'table' || widget.typeKey === 'column')) {
            const table = widget.typeKey === 'table' ? widget : this.pageUtils.findParentWidget(null, widget, page);
            const formula = table?.custom?.collection;
            const type = this.getItemType(page.variables, page.dataSources, page, table, formula);
            if (type) {
                tableItem = this.getInput('current-list', type, 'item', false);
            }
        }


        // LOCAL
        let local: WidgetInput[] = [];
        if (event?.eventKey !== 'datasources' && event && action) {
            const index = event.pipe.indexOf(action);
            if (index !== -1) {
                const actions = [...event.pipe].splice(0, index);
                local = _.reduce(actions, (res: WidgetInput[], ac: SnPageEventPipeDto) => {
                    if (ac.type === 'smartflow') {
                        const typeAndMultiple = this.getSmartFlowTypeAndMultiple(ac.action);
                        if (typeAndMultiple) {
                            res.push(this.getInput('smartflow', typeAndMultiple.selectedType, ac.action, typeAndMultiple.multiple));
                        }
                    }
                    return res;
                }, []);
            }
        }

        // DATASOURCE
        const dataSourceItems = event?.eventKey === 'datasources' ? [] :
            _.reduce(page.dataSources, (res: WidgetInput[], dataSource: SnPageEventPipeDto) => {
                if (dataSource === action || !dataSource.key) {
                    return res;
                }
                let input: WidgetInput;
                switch (dataSource.type) {
                    case 'smartobjects':
                        input = this.getInput('datasource', `so:${dataSource.action}`, dataSource.key, true);
                        break;
                    case 'smartflow':
                        const typeAndMultiple = this.getSmartFlowTypeAndMultiple(dataSource.action);
                        if (typeAndMultiple) {
                            input = this.getInput('datasource', typeAndMultiple.selectedType, dataSource.key,
                                typeAndMultiple.multiple);
                        }
                        break;
                }
                if (input) { res.push(input); }
                return res;
            }, []);

        // VARIABLE
        const variableItems: WidgetInput[] = _.map(page.variables, (variable: SnPageVariableDto) =>
            this.getInput('variable', variable.type, variable.key, variable.multiple),
        );

        // WIDGETS
        const allWidgets: SnPageWidgetDto[] = this.pageUtils.getTreeWidgetOrderer(widget, page);
        const widgetItems: WidgetInput[] = _.reduce(allWidgets, (result, wd: SnPageWidgetDto) => {
            if (wd.returnData && wd.returnData.length !== 0) {
                result.push(... _.map(wd.returnData, (rt: SnPageWidgetTypeReturnDto) =>
                    this.getInput('widget', rt.type, `${wd.id}::${rt.key}`, rt.multiple,
                        `${wd.name} (${this.translateService.instant(rt.name)})`, wd),
                ));
            }
            return result;
        }, []);

        // SYSTEM DATA
        const systemData: WidgetInput[] = this.getSystemItems();
        return _.compact(_.concat(listItem, tableItem, local, dataSourceItems, variableItems, widgetItems, systemData));
    }

    getSystemItems(): WidgetInput[] {
        return [
            this.getInput('system', 'string', 'page-name',
                false, this.translateService.instant('DATA-SELECTOR-SYSTEM-PAGENAME')),
            this.getInput('system', 'string', 'app-name',
                false, this.translateService.instant('DATA-SELECTOR-SYSTEM-APPNAME')),
            this.getInput('system', 'datetime', 'now',
                false, this.translateService.instant('DATA-SELECTOR-SYSTEM-NOW')),
            this.getInput('system', 'date', 'date',
                false, this.translateService.instant('DATA-SELECTOR-SYSTEM-DATE')),
            this.getInput('system', 'time', 'time',
                false, this.translateService.instant('DATA-SELECTOR-SYSTEM-TIME')),
            /* this.getInput('system', 'sys:user', 'current-user',
                false, this.translateService.instant('DATA-SELECTOR-SYSTEM-CURRENTUSER')), */
        ];
    }

    paginable(page: SnPageDto, value: string, keysCheck: string[]): boolean {
        if (!value) {
            return true;
        }
        const split = value.replace('{{', '').replace('}}', '').split('.');
        if (split.length <= 1) {
            return true;
        }

        switch (split[0]) {
            case 'datasource': {
                const datasource = page.dataSources.find((ds) => ds.key === split[1]);
                if (!datasource || datasource.type !== 'smartflow') {
                    return true;
                }
                const view: SnViewDto = this.getSnView('smartflow', datasource.action) as SnViewDto;
                if (!view) {
                    return false;
                }
                if (!view.options.variables) {
                    return false;
                }
                if (view.options.variables.some((v) => v.key === 'search-parameters')) {
                    return true;
                }
                return keysCheck.every((key: string) => view.options.variables.some((v) => v.key === key));
            }
            default:
                return true;
        }
    }

    getAvailableInputs$(page: SnPageDto, widget: SnPageWidgetDto, event?: SnPageEventDto, action?: SnPageEventPipeDto):
        Observable<WidgetInput[]> {
        return new Observable((observer) => observer.next(this.getAvailableInputs(page, widget, event, action)));
    }

    getModel(keyType: string) {
        return this.sessionsService.active.datas.read.smartModels.find((sm) => `so:${sm.key}` === keyType);
    }

    getWidgetInputName(page: SnPageDto, widget: SnPageWidgetDto, path: string): string {
        const widgetInputs: WidgetInput[] = this.getAvailableInputs(page, widget);
        const split: string[] = path.split('.');
        if (split.length < 2) {
            return '';
        }
        const find = widgetInputs.find((i) => i.category === split[0] && i.key === split[1]);
        if (!find) {
            return '';
        }
        if (find.category === 'widget') {
            return find.name;
        }
        return path.substr(path.indexOf('.') + 1);
    }

    getPathTypeAndMultiple(
        path: string,
        page: SnPageDto,
        widget: SnPageWidgetDto,
        event?: SnPageEventDto,
        action?: SnPageEventPipeDto
    ): { type: string; multiple: boolean } | undefined {
        const widgetInputs: WidgetInput[] = this.getAvailableInputs(page, widget, event, action);
        const split: string[] = path.replace('{{', '').replace('}}', '').split('.');

        return this._validateWidget(widgetInputs, split);
    }

    _validateWidget(widgetInputs: WidgetInput[], split: string[]): { type: string; multiple: boolean } | undefined {
        const find = widgetInputs.find((i) => i.category === split[0] && i.key === split[1]);
        if (!find) {
            return undefined;
        }
        split.shift();
        if (split.length === 1) {
            return { type: find.type, multiple: find.multiple };
        }
        split.shift();
        if (split.length !== 0) {
            return this.getModelPropertyTypeAndMultiple(split, find.type);
        }
    }

    getSnModel(type: string, action: string) {
        return this.sessionsService.active.datas.write.snModels.find((snModel) =>
            snModel.type === type && snModel.key === action
        );
    }

    getDataSourcesEvent(page: SnPageDto) {
        return {
            eventKey: 'datasources',
            id: UUID.UUID(),
            pipe: (page.dataSources) ? page.dataSources : [],
        };
    }

    updateApp(app: SnAppDto) {
        for (const page of app.pages) {
            for (const ev of page.events) {
                // update inputs
                for (const pipeEv of ev.pipe) {
                    this.loadInputs(app, ev, pipeEv);
                    this.mergeWorkflows(pipeEv, false);
                }
            }
            // update inputs
            for (const ds of page.dataSources) {
                this.loadInputs(app, this.getDataSourcesEvent(page), ds);
            }
        }
        for (const widget of this.pageUtils.getWidgets(app)) {
            // update inputs
            for (const ev of [..._.flatMap(widget.rules, 'events'), ...widget.events]) {
                for (const pipeEv of ev.pipe) {
                    this.loadInputs(app, ev, pipeEv);
                    this.mergeWorkflows(pipeEv, false);
                }
            }
        }
    }

    mergeWorkflows(pipeEv: SnPageEventPipeDto, updateWf: boolean) {
        if (pipeEv.type === 'page::nav') {
            return [];
        }
        if (pipeEv.type !== 'workflow' || !pipeEv.action) {
            pipeEv.custom = null;
            return [];
        }
        if (!pipeEv.custom) {
            pipeEv.custom = {
                pair: [],
                savingMode: 'END',
                unique: false,
            };
        }
        if (!pipeEv.custom.pair || updateWf) {
            pipeEv.custom.pair = [];
        }

        let eventProfiles: WorkflowProfilModelDto[] = [];
        const wf = this.sessionsService.active.datas.read.workflows.find((w) => w.key === pipeEv.action);
        const task = this.tryGetFirstTaskModel(wf);
        if (wf && task) {
            eventProfiles = this.getWorkflowEventProfiles(wf, task);
            if (eventProfiles && eventProfiles.length > 0) {
                if (pipeEv.custom.pair.length === 0) {
                    (pipeEv.custom.pair as EventWorkflowPairDto[]).push({
                        profiles: this.getProfiles(eventProfiles, null),
                    });
                } else {
                    (pipeEv.custom.pair as EventWorkflowPairDto[]) = _.map(pipeEv.custom.pair, (pair: EventWorkflowPairDto) => {
                        pair.profiles = this.getProfiles(eventProfiles, pair);
                        return pair;
                    });
                }
            } else {
                pipeEv.custom.pair = [];
            }
        }
        return eventProfiles;
    }

    // inputs

    loadInputs(app: SnAppDto, event: SnPageEventDto, pipeEv: SnPageEventPipeDto) {
        let eventInputs: InputItem[] = [];
        if (pipeEv.type === 'workflow' || pipeEv.type === 'smartflow') {
            eventInputs = this.getSnModelEventInputs(event, pipeEv);
        } else if (pipeEv.type === 'page') {
            eventInputs = this.getPageEventInputs(event, app, pipeEv);
        } else if (pipeEv.type === 'page::nav') {
            eventInputs = this.getPageNavEventInputs(event, pipeEv);
        }

        // update data
        pipeEv.inputs = _.map(eventInputs, (e: InputItem) =>
            ({ key: e.key, value: e.value })
        );

        return eventInputs;
    }

    resetInput(type: string) {
        switch (type) {
            case 'string':
                return '';
            case 'number':
                return 0;
            case 'boolean':
                return false;
            default:
                return null;
        }
    }

    getSnView(type: string, action: string) {
        const model = this.getSnModel(type, action);
        if (!model) { return; }
        return this.snModelsService.getPublishedView(model);
    }

    private getProfiles(eventProfiles: WorkflowProfilModelDto[], pair: EventWorkflowPairDto): EventWorkflowPairProfileDto[] {
        return _.map(eventProfiles, (profile: WorkflowProfilModelDto, index: number) => {
            const groups = this.checkPairProfileConsistency(profile, pair?.profiles[index], index) ?
                pair.profiles[index].groups :
                [];
            return {
                uuid: profile.uuid,
                groups,
            } as EventWorkflowPairProfileDto;
        });
    }

    private checkPairProfileConsistency(
        wfProfile: WorkflowProfilModelDto,
        pairProfile: { uuid: string; groups: string[] },
        index: number
    ): boolean {
        return pairProfile &&
            wfProfile.uuid === pairProfile.uuid && (
                (index === 0 && pairProfile.groups.length >= 1) ||
                (index > 0 && pairProfile.groups.length === 1)
            );
    }

    private getWorkflowEventProfiles(workflow: WorkflowModelDto, firstTask: TaskModelDto): WorkflowProfilModelDto[] {
        const emitterUuid: string = firstTask.general.profil;
        const profiles: WorkflowProfilModelDto[] = _.cloneDeep(workflow.profiles);
        const indexEmitter = _.findIndex(profiles, { uuid: emitterUuid });
        profiles.unshift(profiles.splice(indexEmitter, 1)[0]);
        return profiles;
    }

    private getSnModelEventInputs(event: SnPageEventDto, pipeEv: SnPageEventPipeDto): InputItem[] {
        // todo,upgrade
        const exclude = getAutoInputsEvents(pipeEv.type, event.eventKey);
        const snModel: SnModelDto = this.getSnModel(pipeEv.type, pipeEv.action);
        if (snModel) {
            const publishedVersion: SnVersionDto = _.find(snModel.versions, { uuid: snModel.publishedVersion });
            return _.reduce((publishedVersion?.view as SnViewDto)?.options?.variables,
                (res: InputItem[], variable) => {
                    if (variable?.key && variable?.type && !exclude.includes(variable.key)) {
                        res.push({
                            key: variable.key,
                            value: this.getValueInputEvent(pipeEv.inputs, variable.key, variable.type),
                            types: [variable.type],
                            multiple: variable.multiple,
                        });
                    }
                    return res;
                }, []);
        }
        return [];
    }

    private getPageEventInputs(event: SnPageEventDto, app: SnAppDto, pipeEv: SnPageEventPipeDto): InputItem[] {
        const page = app.pages.find((p) => p.id === pipeEv.action);
        if (!page) { return []; }
        return this.transformPageVariableToInputItem(page.variables, event.eventKey, pipeEv);
    }

    private getPageNavEventInputs(event: SnPageEventDto, pipeEv: SnPageEventPipeDto): InputItem[] {
        if (!pipeEv.action) { return []; }
        const snApp = this.getSnView('app', pipeEv.action) as SnAppDto;
        const page = snApp?.pages?.find((p) => p.id === pipeEv.custom?.page);
        if (!page) { return []; }
        return this.transformPageVariableToInputItem(page.variables, event.eventKey, pipeEv);
    }

    private transformPageVariableToInputItem(variables: SnPageVariableDto[], eventKey: string, pipeEv: SnPageEventPipeDto): InputItem[] {
        const exclude = getAutoInputsEvents(pipeEv.type, eventKey);
        return _.reduce(variables, (res: InputItem[], variable: SnPageVariableDto) => {
            if (variable?.key && !exclude.includes(variable.key)) {
                res.push({
                    key: variable.key,
                    value: this.getValueInputEvent(pipeEv.inputs, variable.key, variable.type),
                    types: [variable.type],
                    multiple: variable.multiple,
                });
            }
            return res;
        }, []);
    }

    private getValueInputEvent(inputs: PairDto[], key: string, type: string): string {
        const inputEvent: PairDto = _.find(inputs, { key });
        return inputEvent?.value || this.resetInput(type);
    }

    private getInput(category: string, itemType: string, key: string, multiple: boolean, name?: string, ref?: any): WidgetInput {
        const typeValue: WidgetInput = {
            category,
            name: (name) ? name : key,
            type: itemType,
            key,
            multiple,
            ref,
        };

        if (itemType?.startsWith('so:')) {
            typeValue.model = itemType.slice(3);
        } else if (itemType?.startsWith('sys:')) {
            typeValue.model = itemType;
        }

        return typeValue;
    }

    private getSmartFlowTypeAndMultiple(eventAction: string) {
        const view = this.getSnView('smartflow', eventAction);
        if (!view) {
            return null;
        }
        return this.snConnectorUtilsService.checkTypeAndMultiple(view as SnView);
    }

    private getItemType(
        variables: SnPageVariableDto[],
        dataSources: SnPageEventPipeDto[],
        page: SnPageDto,
        widget?: SnPageWidgetDto,
        formula?: string,
    ): string | undefined {
        if (!formula) { return; }
        const split = formula.replace('{{', '').replace('}}', '').split('.');
        if (split.length <= 1) { return; }

        switch (split[0]) {
            case 'variable': {
                const findVar = variables.find((v) => v.key === split[1]);
                if (!findVar) {
                    return;
                }
                if (split.length === 2) {
                    return findVar.type;
                }
                return this.getModelPropertyTypeAndMultiple(split.slice(2), findVar.type)?.type;
            }
            case 'datasource': {
                const datasource = dataSources.find((ds) => ds.key === split[1]);
                if (!datasource) {
                    return;
                }
                if (datasource.type === 'smartobjects') {
                    return `so:${datasource.action}`;
                } else if (datasource.type === 'smartflow') {
                    const findEv = this.getSmartFlowTypeAndMultiple(datasource.action);
                    if (!findEv) {
                        return;
                    }
                    if (split.length === 2) {
                        return findEv.selectedType;
                    }
                    return this.getModelPropertyTypeAndMultiple(split.slice(2), findEv.selectedType)?.type;
                }
            }
                break;
            case 'smartflow': {
                const findEv = this.getSmartFlowTypeAndMultiple(split[1]);
                if (!findEv) {
                    return;
                }
                if (split.length === 2) {
                    return findEv.selectedType;
                }
                return this.getModelPropertyTypeAndMultiple(split.slice(2), findEv.selectedType)?.type;
            }
            case 'current-list': {
                const mainList = this.pageUtils.findMainListWidget(null, widget, page);
                const listFormula = mainList?.custom?.collection;
                const parentListItemType = this.getItemType(variables, dataSources, page, mainList, listFormula);
                return this.getModelPropertyTypeAndMultiple(split.slice(2), parentListItemType)?.type;
            }
        }
    }

    private getModelPropertyTypeAndMultiple(split: string[], keyType: string): { type: string; multiple: boolean } {

        const smartModel = this.getModel(keyType);
        if (!smartModel) {
            return null;
        }

        if (split.length === 0) {
            return null;
        }
        const propModel = smartModel.properties.find((p) => p.key.toUpperCase() === split[0].toUpperCase());
        if (!propModel) {
            return null;
        }

        split.shift();
        if (split.length === 0) {
            return { type: propModel.keyType, multiple: propModel.multiple };
        } else {
            return this.getModelPropertyTypeAndMultiple(split, propModel.keyType);
        }
    }

    private tryGetFirstTaskModel(wf: WorkflowModelDto | undefined) {
        const wfi: any = { workflowModel: wf };
        try {
            return this.workflowUtilsService.findFirstTaskModel(wfi).task as TaskModelDto;
        } catch {
        }
    }
}
