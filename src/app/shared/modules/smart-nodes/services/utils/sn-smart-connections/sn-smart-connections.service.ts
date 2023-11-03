import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { SnView, SnParam, SnFlow, SnNode, SnConnector } from '../../../models';
import { SnNodeSchema, SnCustomFilterConnector } from '../../../dto';
import { SnUtilsService } from '../sn-utils/sn-utils.service';

@Injectable()
export class SnSmartConnectionsService {

    constructor(private snUtils: SnUtilsService) {
    }

    filterSchema(snView: SnView, schema: SnNodeSchema, node: SnNode,
        customFilterFlows?: SnCustomFilterConnector<SnFlow>,
        customFilterParams?: SnCustomFilterConnector<SnParam>): boolean {

        // classic add
        if (node.flows.length === 0 && node.params.length === 0) {
            return true;
        }

        if (node.flows.length > 0) {
            // flow add
            if (schema.flows) {
                const connected = node.flows[0] ? this.snUtils.findConnectedFlow(snView, node.flows[0]) : null;
                return this.filterSchemaByFlow(schema, connected, customFilterFlows);
            }

        } else if (node.params.length > 0 && schema.params.length > 0) {
            // param master
            const paramMaster = this.snUtils.getParams(null, node).find((p) => p.master);
            const connected = paramMaster ? this.snUtils.findConnectedParam(snView, paramMaster) : null;

            return this.filterSchemaByParam(schema, connected, customFilterParams);
        }

        return false;
    }

    filterSchemaByParam(schema: SnNodeSchema, param: SnParam,
        customFilterParams?: SnCustomFilterConnector<SnParam>): boolean {
        if (!param) {
            return false;
        }

        const paramSchema = this.snUtils.getParams(null, schema as any).find(
            (p) => p.master && param.direction !== p.direction);

        if (!paramSchema) {
            return false;
        }

        const params = this.snUtils.findInOut(param, paramSchema) as { in: SnParam, out: SnParam };
        if (customFilterParams) {
            return customFilterParams(params.in, params.out);
        }
        return this.filterParam(params.in, params.out);
    }

    filterSchemaByFlow(schema: SnNodeSchema, flow: SnFlow,
        customFilterFlows?: SnCustomFilterConnector<SnFlow>): boolean {
        // first flow
        if (!flow) {
            return false;
        }

        const flowSchema = schema.flows.find((f) => f.direction !== flow.direction);

        if (!flowSchema) {
            return false;
        }

        const flows = this.snUtils.findInOut(flow, flowSchema) as { in: SnFlow, out: SnFlow };
        if (customFilterFlows) {
            return customFilterFlows(flows.in, flows.out);
        }
        return this.filterFlow(flows.in, flows.out);
    }

    getConnectorsDroppable(snView: SnView, element: SnConnector, type: 'param' | 'flow',
        customFilter: SnCustomFilterConnector<SnConnector>): SnConnector[] {

        const params = this.snUtils.getParams(snView);
        const flows = this.snUtils.getFlows(snView);

        if (!element) {
            return;
        }

        switch (type) {
            case 'flow':
                return _.reduce(flows, (results, flow: SnFlow) => {
                    if (this.filterConnector(flow, element, 'flow', this.filterFlow, customFilter)) {
                        results.push(flow);
                    }
                    return results;
                }, []);
            case 'param':
                return _.reduce(params, (results, param: SnParam) => {
                    if (this.filterConnector(param, element, 'param', this.filterParam, customFilter)) {
                        results.push(param);
                    }
                    return results;
                }, []);
        }
    }

    private filterConnector(connector: SnConnector, connectorCompare: SnConnector,
        type: 'param' | 'flow',
        standardFilter: SnCustomFilterConnector<SnConnector>,
        customFilter: SnCustomFilterConnector<SnConnector>) {

        const connectors = this.snUtils.findInOut(connector, connectorCompare);

        const checkDisconnected = type === 'param' ? (!connector.displayState.connected || connector.direction === 'out') :
            (!connector.displayState.connected || connector.direction === 'in');

        if (connector.direction === connectorCompare.direction || !checkDisconnected) {
            return false;
        }
        if (customFilter) {
            return customFilter(connectors.in, connectors.out);
        }
        return standardFilter(connectors.in, connectors.out);
    }

    private filterFlow(flowIn: SnFlow, flowOut: SnFlow) {
        return true;
    }

    private filterParam(paramIn: SnParam, paramOut: SnParam) {
        // check the flow

        const typesIn = Array.isArray(paramIn.types) ? paramIn.types : [paramIn.types];
        const typesOut = Array.isArray(paramOut.types) ? paramOut.types : [paramOut.types];

        return _.intersection(typesIn, typesOut).length > 0 && (paramIn.multiple == null || paramOut.multiple == null ||
            paramIn.multiple === paramOut.multiple);
    }
}
