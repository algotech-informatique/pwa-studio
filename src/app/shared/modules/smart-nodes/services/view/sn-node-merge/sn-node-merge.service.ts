import { Injectable } from '@angular/core';
import { SnNode, SnParam, SnSection, SnFlow } from '../../../models';
import * as _ from 'lodash';
import { UUID } from 'angular2-uuid';
import { SnNodeSchema } from '../../../dto';

@Injectable()
export class SnNodeMergeService {

    mergedNode(node: SnNode, schema: SnNodeSchema) {
        const nodeClone: SnNode = _.cloneDeep(node);
        const schemaClone: SnNodeSchema = _.cloneDeep(schema);

        nodeClone.type = schemaClone.type;
        nodeClone.icon = schemaClone.icon;
        nodeClone.flowsEditable = schemaClone.flowsEditable;
        if (!nodeClone.custom) {
            nodeClone.custom = schemaClone.custom;
        } else if (nodeClone.custom.service) {
            nodeClone.custom.service = schemaClone.custom.service;
        }

        if (!nodeClone.displayName) {
            nodeClone.displayName = schemaClone.displayName;
        }

        // browse flows
        const newFlows = _.reduce(schemaClone.flows, (results, flow: SnFlow) => {
            const findFlow = nodeClone.flows.find((f) => f.direction === flow.direction && f.key === flow.key);
            if (findFlow) {
                const newFlow: SnFlow = this.mergeFlow(findFlow, flow);
                if (!flow.paramsEditable) {
                    newFlow.params = this.mergeParams(findFlow.params, flow.params);
                }
                results.push(newFlow);
            } else {
                const newFlow = _.cloneDeep(flow);
                newFlow.id = UUID.UUID();
                _.each(newFlow.params, (param) => {
                    param.id = UUID.UUID();
                    param.displayState = {};
                    this.mergeParam(param, param);
                });
                newFlow.displayState = {};
                results.push(newFlow);
            }
            return results;
        }, []);

        // reaffect flows
        const towards = _.reduce(nodeClone.flows, (results, flow: SnFlow) => {
            if (newFlows.indexOf(flow) === -1 && flow.direction === 'out' && flow.toward) {
                results.push(flow.toward);
            }
            return results;
        }, []);
        if (towards.length !== 0) {
            let i = 0;
            for (const flow of newFlows) {
                if (flow.direction === 'out' && !flow.toward && i < towards.length) {
                    flow.toward = towards[i];
                    i++;
                }
            }
        }

        if (nodeClone.flowsEditable) {
            if (nodeClone.flows.filter((f) => f.direction === 'out').length === 0) {
                nodeClone.flows = newFlows;
            }
        } else {
            nodeClone.flows = newFlows;
        }

        // browse params
        nodeClone.params = this.mergeParams(nodeClone.params, schemaClone.params);

        // browse sections
        nodeClone.sections = _.reduce(schemaClone.sections, (results, section: SnSection) => {
            const findSection: SnSection = nodeClone.sections.find((s) => s.key === section.key);
            if (findSection) {
                const newSection = this.mergeSection(findSection, section);

                if (!findSection.editable) {
                    newSection.params = this.mergeParams(findSection.params, section.params);
                }
                results.push(newSection);
            } else {
                const newSection = _.cloneDeep(section);
                newSection.id = UUID.UUID();
                _.each(newSection.params, (param) => {
                    param.id = UUID.UUID();
                    param.displayState = {};
                    this.mergeParam(param, param);
                });
                newSection.displayState = {};
                results.push(newSection);
            }
            return results;
        }, []);

        if (JSON.stringify(node) !== JSON.stringify(nodeClone)) {
            // merged !

            node.custom = nodeClone.custom;
            node.flowsEditable = nodeClone.flowsEditable;
            node.flows = nodeClone.flows;
            node.params = nodeClone.params;
            node.type = nodeClone.type;
            node.icon = nodeClone.icon;
            node.displayName = nodeClone.displayName;
            node.sections = nodeClone.sections;

            return true;
        }
        return false;
    }

    public mergeParam(nodeParam: SnParam, schemaParam: SnParam, mergeKey = true): SnParam {
        if (mergeKey) {
            nodeParam.key = schemaParam.key;
        }
        nodeParam.displayName = schemaParam.displayName;
        nodeParam.direction = schemaParam.direction;
        nodeParam.master = schemaParam.master;
        nodeParam.required = schemaParam.required;
        nodeParam.pluggable = schemaParam.pluggable;
        nodeParam.display = schemaParam.display;

        if (schemaParam.types !== null && schemaParam.types !== undefined) {
            const staticOrFirstInit = !schemaParam.dynamic || nodeParam.types === undefined || _.isEqual(nodeParam.types, []);
            if (staticOrFirstInit) {
                nodeParam.types = schemaParam.types;
            }
        }
        if (schemaParam.multiple !== null && schemaParam.multiple !== undefined) {
            const staticOrFirstInit = !schemaParam.dynamic || nodeParam.multiple === undefined;
            if (staticOrFirstInit) {
                nodeParam.multiple = schemaParam.multiple;
            }
        }

        // default initialization
        if (nodeParam.key === undefined) {
            nodeParam.key = '';
        }
        if (nodeParam.types === undefined) {
            nodeParam.types = null;
        }
        if (nodeParam.multiple === undefined) {
            nodeParam.multiple = null;
        }
        if (nodeParam.value === undefined) {
            nodeParam.value = schemaParam.default === undefined ? null : schemaParam.default;
            if (nodeParam.value === null) {
                this.initializeParamValue(nodeParam);
            }
        }

        return nodeParam;
    }

    initializeParamValue(param: SnParam) {
        if (param.display !== 'input') {
            return ;
        }
        switch (param.types) {
            case 'number':
                param.value = !param.value ? 0 : +param.value;
                break;
            case 'string':
                param.value = !param.value || !_.isString(param.value) ? '' : param.value;
                break;
            case 'boolean':
                param.value = !param.value || !_.isBoolean(param.value) ? false : param.value;
                break;
        }
    }

    private mergeSection(nodeSection: SnSection, schemaSection: SnSection): SnSection {
        nodeSection.key = schemaSection.key;
        nodeSection.displayName = schemaSection.displayName;
        nodeSection.editable = schemaSection.editable;
        return nodeSection;
    }

    private mergeFlow(nodeFlow: SnFlow, flow: SnFlow): SnFlow {
        nodeFlow.key = flow.key;
        if (!nodeFlow.displayName) {
            nodeFlow.displayName = flow.displayName;
        }
        nodeFlow.paramsEditable = flow.paramsEditable;
        nodeFlow.direction = flow.direction;
        return nodeFlow;
    }

    private mergeParams(nodeParams: SnParam[], schemaParams: SnParam[]): SnParam[] {
        return _.reduce(schemaParams, (results, param: SnParam) => {
            const findParam = nodeParams.find((p) => (p.master && param.master && p.direction === param.direction) ||
                (p.key && p.key === param.key));

            if (findParam) {
                results.push(this.mergeParam(findParam, param));
            } else {
                const newParam = _.cloneDeep(param);
                newParam.id = UUID.UUID();
                newParam.displayState = {};
                this.mergeParam(newParam, param);

                results.push(newParam);
            }

            return results;
        }, []);
    }
}
