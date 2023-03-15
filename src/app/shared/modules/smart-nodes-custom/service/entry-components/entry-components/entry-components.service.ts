import { Injectable } from '@angular/core';
import { SnView, SnParam, SnLang } from '../../../../smart-nodes/models';
import { SnEntryComponent, SnNodeSchema } from '../../../../smart-nodes/dto';
import * as components from '../../../index-component';
import * as schema from '../../../index-schema';
import { EnvironmentParameterDto, WorkflowVariableModelDto } from '@algotech/core';
import * as _ from 'lodash';
import { SnTranslateService, SnUtilsService } from '../../../../smart-nodes/services';
import { SessionsService } from '../../../../../services';
import { SnDataNodeHelper } from '../../../index-helper';

@Injectable()
export class EntryComponentsService {

    constructor(private snTranslate: SnTranslateService, private sessionsService: SessionsService, private snUtils: SnUtilsService) { }

    initializeLangs(nameKey: string, languages: SnLang[]) {
        return this.snTranslate.initializeLangsByKey(nameKey, languages) as SnLang[];
    }

    createSchema(getSchema: (displayName: SnLang[]) => SnNodeSchema, nameKey: string, languages: SnLang[]): SnNodeSchema {
        return getSchema(this.initializeLangs(nameKey, languages));
    }

    getEntryConnectorsParams(customerKey: string, host: string, connectorUuid): SnEntryComponent[] {
        const parameters: EnvironmentParameterDto[] =
            this.sessionsService.getConnectorCustom(host, customerKey, 'smartflow', connectorUuid);

        if (!parameters) {
            return [];
        }

        return _.map(_.filter(parameters, (p: EnvironmentParameterDto) => p.key && p.active), (p: EnvironmentParameterDto) => ({
            component: components.SnConnectorParameterNodeComponent,
            displayName: p.key,
            schema: schema.SN_CONNECTOR_PARAMETER_NODE_SCHEMA(p.key)
        }));
    }

    getEntryInputs(snView: SnView): SnEntryComponent[] {
        return _.reduce(snView.options.variables, (results: SnEntryComponent[], v: WorkflowVariableModelDto) => {
            if (v.key && (!v.use || v.use === 'formData')) {
                results.push({
                    component: components.SnDataNodeComponent,
                    displayName: v.key,
                    schema: schema.SN_DATA_NODE_SCHEMA({
                        id: v.uuid,
                        key: v.key,
                        displayName: 'SN-INPUT-VALUE',
                        type: v.type,
                        multiple: v.multiple
                    }),
                    helper: SnDataNodeHelper
                });
            }
            return results;
        }, []);
    }

    getApiInputs(snView: SnView, use: 'query-parameter' | 'url-segment' | 'header' | 'body', displayName: string): SnEntryComponent[] {
        return _.reduce(snView.options.variables, (results: SnEntryComponent[], v: WorkflowVariableModelDto) => {
            if (v.key && v.use === use) {
                results.push({
                    component: components.SnDataNodeComponent,
                    displayName: v.key,
                    schema: schema.SN_DATA_NODE_SCHEMA({
                        id: v.key,
                        key: v.key,
                        displayName,
                        type: v.type,
                        multiple: v.multiple
                    })
                });
            }
            return results;
        }, []);
    }

    getEntryOutputs(snView: SnView): SnEntryComponent[] {
        const output = this.snUtils.getOutputs(snView);

        return _.map(output, (param: SnParam) => ({
            component: components.SnDataNodeComponent,
            displayName: param.key,
            schema: schema.SN_DATA_NODE_SCHEMA({
                id: param.id,
                key: param.key,
                displayName: 'SN-OUTPUT-VALUE',
                type: param.types as string,
                multiple: param.multiple
            })
        }));
    }
}
