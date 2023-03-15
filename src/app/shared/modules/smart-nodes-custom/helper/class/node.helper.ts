import { Subject } from 'rxjs';
import { SnFlow, SnNode, SnParam, SnView } from '../../../smart-nodes/models';
import { HelperContext } from '../helper.context';
import * as _ from 'lodash';

export class NodeHelper<HelperType extends unknown> {
    public changed: Subject<any>;
    public node: SnNode;

    protected helperContext: HelperContext;
    protected view: SnView;

    constructor(helperContext: HelperContext, view: SnView, node: SnNode) {
        this.helperContext = helperContext;
        this.view = view;
        this.node = node;

        this.changed = new Subject<any>();
    }

    public getNode(): SnNode {
        return this.node;
    }

    public getInput(): SnFlow {
        return this.node.flows.filter(flow => flow.direction === 'in')[0];
        // TODO what if there are multiple in flows, or none ?
    }

    public getOutput(): SnFlow {
        return this.node.flows.filter(flow => flow.direction === 'out')[0];
        // TODO what if there are multiple out flows, or none ?
    }

    public getParam(key: string): SnParam {
        const allParams: SnParam[] = _.cloneDeep(this.node.params);
        this.node.sections.forEach(section => allParams.push(...section.params));

        const foundParam = allParams.find(param => param.key === key);
        if (!foundParam) {
            throw new Error(`Cannot find parameter with key [${key}] in node id [${this.node.id}]`);
        }
        return foundParam;
    }

    public setParamValue(data: { key: string; value?: any; relativeTo?: SnParam }) {
        if (data.relativeTo) {
            this.helperContext.linkParamConnectors(this.view, this.getParam(data.key), data.relativeTo);
        } else if (data.value) {
            this.getParam(data.key).value = data.value;
        } else {
            throw new Error('No parameter value has been provided for param key [' + data.key + ']');
        }
    }

    public linkTo<OtherHelperType extends NodeHelper<OtherHelperType>>(
        otherNodeHelper: NodeHelper<unknown>
    ): HelperType {
        this.helperContext.linkFlowConnectors(this.view, this.getOutput(), otherNodeHelper.getInput());
        return this as unknown as HelperType;
    }

    public initialize(): HelperType {
        // TODO: to implemented
        return this as unknown as HelperType;
    }

    public execute(): HelperType {
        this.changed.next(null);
        return this as unknown as HelperType;
    }

    public calculate(): HelperType {
        // TODO: to implemented
        return this as unknown as HelperType;
    }
}
