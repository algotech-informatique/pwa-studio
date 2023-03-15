import { SnElement, SnParam, SnConnector, SnFlow, SnNode } from '../models';

export class SnRemoveSelection {
    containers: SnElement[];
    nodes: SnNode[];
    params: {
        params: SnParam[],
        param: SnParam,
    }[];
    flows:  {
        flows: SnFlow[],
        flow: SnFlow,
    }[];
    links: SnConnector[];
}
