import { SnLang } from '@algotech/business/src/lib/app/models';
import { Injectable } from '@angular/core';
import { SnEntryComponent, SnNodeSchema } from '../../../smart-nodes/dto';
// eslint-disable-next-line max-len
import { SmartflowEntryComponentsService } from '../../service/entry-components/smartflow-entry-components/smartflow-entry-components.service';
import { WorkflowEntryComponentsService } from '../../service/entry-components/workflow-entry-components/workflow-entry-components.service';
import * as _ from 'lodash';
import { SnNode, SnParam } from '../../../smart-nodes/models';

export class SnEntryComponentEx extends SnEntryComponent {
    tags: string[];
}

export class InOut {
    key: string;
    type: string;
    name: string | SnLang[];
    elt: 'flow' | 'section' | 'param';
    direction: 'in' | 'out';
    index: number;
}

@Injectable()
export class DocUtilsService {
    constructor(
        private sfEntry: SmartflowEntryComponentsService,
        private wfEntry: WorkflowEntryComponentsService) { }

    buildCmps(languages: SnLang[]) {

        const sfGroups = this.sfEntry.getEntryComponents(languages, null, null, null)(null).groups;
        const wfGroups = this.wfEntry.getEntryComponents(languages)(null).groups;

        const groups: {
            displayName: string | SnLang[];
            components: SnEntryComponentEx[];
        }[] = _.uniqBy([...wfGroups, ...sfGroups], 'displayName');

        for (const group of groups) {
            const findSf = sfGroups.find((g) => g.displayName as string === group.displayName as string);
            const findWf = wfGroups.find((g) => g.displayName as string === group.displayName as string);

            group.components = _.uniqBy([...(findWf ? findWf.components : []), ...(findSf ? findSf.components : [])]
                .filter((cmp: SnEntryComponentEx) => !cmp.schema?.deprecated), 'displayName');
            for (const cmp of group.components) {
                cmp.tags = [];
                if (findSf?.components.some((c) => c.displayName === cmp.displayName)) {
                    cmp.tags.push('smartflow');
                }
                if (findWf?.components.some((c) => c.displayName === cmp.displayName)) {
                    cmp.tags.push('workflow');
                }
            }
        }

        return groups;
    }

    getInputs(schema: SnNodeSchema): InOut[] {
        // IN
        const res = [];
        let index = 0;
        for (const flow of schema.flows) {
            for (const param of flow.params.filter((p) => p.direction === 'in')) {
                res.push(this.getParam(param, index));
                index++;
            }
        }
        for (const param of schema.params) {
            if (param.direction === 'in') {
                res.push(this.getParam(param, index));
                index++;
            }
        }
        for (const section of schema.sections) {
            if (section.editable) {
                res.push({
                    direction: 'in',
                    elt: 'section',
                    key: section.key,
                    name: section.displayName ? section.displayName : null,
                    type: 'section',
                });
            }
            for (const param of section.params) {
                if (param.direction === 'in') {
                    res.push(this.getParam(param, index));
                    index++;
                }
            }
        }
        return res;
    }

    getOutputs(schema: SnNodeSchema): InOut[] {
        const res = [];
        const outFlows = schema.flows.filter((f) => f.direction === 'out');
        let index = 0;
        for (const flow of outFlows) {
            if (outFlows.length > 1) {
                res.push({
                    direction: 'out',
                    elt: 'flow',
                    key: flow.key,
                    name: flow.displayName ? flow.displayName : null,
                    type: 'flow',
                });
            }
            for (const param of flow.params.filter((p) => p.direction === 'out')) {
                res.push(this.getParam(param, index));
                index++;
            }
        }

        for (const param of schema.params) {
            if (param.direction === 'out') {
                res.push(this.getParam(param, index));
                index++;
            }
        }
        return res;
    }

    findEntryComponent(node: SnNode, languages: SnLang[]): SnEntryComponentEx {
        for (const group of this.buildCmps(languages)) {
            for (const cmp of group.components) {
                if (cmp.schema && !cmp.schema.deprecated && cmp.schema.key === node.key && cmp.schema.type === node.type) {
                    return cmp;
                }
            }
        }

        return null;
    }

    findSchema(node: SnNode, languages: SnLang[]): SnNodeSchema {
        return this.findEntryComponent(node, languages)?.schema;
    }

    getParam(param: SnParam, index: number) {
        const res: InOut = {
            direction: param.direction,
            elt: 'param',
            key: param.key,
            name: param.displayName ? param.displayName as string : null,
            type: Array.isArray(param.types) ? param.types.join(';') : param.types,
            index
        };
        return res;
    }
}
