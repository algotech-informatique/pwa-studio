import { SnModelDto, WorkflowVariableModelDto } from '@algotech/core';
import { UUID } from 'angular2-uuid';
import { SnEntryComponent, SnEntryComponents, SnNodeSchema } from '../../../smart-nodes/dto';
import { SnNode, SnElement, SnView } from '../../../smart-nodes/models';
import { NodeHelper } from './node.helper';
import _ from 'lodash';
import { HelperContext } from '../helper.context';
import { Subject } from 'rxjs';
import { ClassConstructor } from 'class-transformer';

export class NodesHelper<HelperTypeA extends unknown> {
    public changed: Subject<any>;
    helperContext: HelperContext;
    snView: SnView;
    snModel: SnModelDto;
    entryComponents: (snView: SnView) => SnEntryComponents;

    constructor(helperContext: HelperContext, snView: SnView, entryComponents: (snView: SnView) => SnEntryComponents) {
        this.helperContext = helperContext;
        this.snView = snView;
        this.entryComponents = entryComponents;
        this.changed = new Subject<any>();
    }

    public get nodes(): NodeHelper<any>[] {
        return this.getNodes();
    }

    public update(): HelperTypeA {
        this.repositionNodesInView();
        return this as unknown as HelperTypeA;
    }

    public execute(): HelperTypeA {
        this.changed.next(null);
        return this as unknown as HelperTypeA;
    }

    public createNode<HelperTypeB extends NodeHelper<HelperTypeB>>(
        classType: ClassConstructor<NodeHelper<HelperTypeB>>,
        dataSourceKey?: string,
        parentElement?: SnElement
    ): HelperTypeB {
        const schema: SnNodeSchema = this._getSchema(classType, dataSourceKey);
        const newNode: SnNode = {
            id: UUID.UUID(),
            parentId: parentElement ? parentElement.id : null,
            type: schema.type,
            key: schema.key,
            canvas: { x: 0, y:0 },
            displayName: schema.displayName,
            icon: schema.icon,
            open: true,
            flows: [],
            params: [],
            sections: [],
            displayState: {}
        };
        this.helperContext.mergedNode(newNode as SnNode, schema);
        this.snView.nodes.push(newNode);

        return this._createNodeInstance(classType, newNode);
    }

    public chainLinkNodes(...helpers: NodeHelper<unknown>[]): HelperTypeA {
        for(let i = 0; i < helpers.length-1; i++ ) {
            helpers[i].linkTo(helpers[i+1]);
        }
        return this as unknown as HelperTypeA;
    }

    public getNode<HelperTypeB extends NodeHelper<HelperTypeB>>(
        nodeId: string
    ): HelperTypeB {
        return this.getNodes<HelperTypeB>().find(nodeHelper => nodeHelper.getNode().id === nodeId);
    }

    public getNodes<HelperTypeB extends NodeHelper<HelperTypeB>>(
        container?: SnElement
    ): HelperTypeB[] {
        const nodes = !container ? this.snView.nodes : this.helperContext.getNodesBy(container, this.snView);
        return nodes.map((node: SnNode) => this._createNodeInstance(this._getType(node), node));
    }

    public removeNode(nodeId: string): HelperTypeA {
        const toRemove = this.nodes.find(nodeHelper => nodeHelper.node.id === nodeId);
        const deleted = this.nodes.splice(this.nodes.indexOf(toRemove),1);
        return this as unknown as HelperTypeA;
    }

    /** public for test */
    _createNodeInstance<HelperTypeB>(
        classType: ClassConstructor<any>,
        node: SnNode
    ): HelperTypeB {
        const nodeInstance = new classType(this.helperContext, this.snView, node);
        nodeInstance.changed.subscribe(() => {
            this.update();
        });

        return nodeInstance;
    }

    /** public for test */
    _getSchema<HelperTypeB extends NodeHelper<HelperTypeB>>(
        classType: ClassConstructor<NodeHelper<HelperTypeB>>,
        dataSourceKey?: string
    ): SnNodeSchema {
        if (classType.name === 'SnDataNodeHelper' && (!dataSourceKey || dataSourceKey.length === 0)) {
            throw new Error(`No data source key has been provided while a SnDataNodeHelper has been instantiated`);
        }
        const findVariable: WorkflowVariableModelDto = (this.snView.options.variables as WorkflowVariableModelDto[])
            .find((v) => v.key === dataSourceKey);

        const foundComponent = this._getEntryComponents()
                                    .find((component) =>
                                        component.schema.type + 'Helper' === classType.name
                                        && (!dataSourceKey || (findVariable && findVariable.uuid === component.schema.key))
                                    );
        if (!foundComponent) {
            if (dataSourceKey) {
                throw new Error(`No node schema found for helper [${classType.name}] and data key [${dataSourceKey}]`);
            } else {
                throw new Error(`No node schema found for helper [${classType.name}]`);
            }
        }
        return foundComponent.schema;
    }

    /** public for test */
    _getType<HelperTypeB extends NodeHelper<HelperTypeB>>(
        node: SnNode
    ): ClassConstructor<NodeHelper<HelperTypeB>> {
        const foundComponent = this._getEntryComponents()
                                    .find((component) => component.schema.key === node.key && component.schema.type === node.type);
        if (!foundComponent) {
            throw new Error(`Unable to find component for node type [${node.type}]`);
        }
        if (!foundComponent.helper) {
            throw new Error(`Helper not implemented for node type [${node.type}]`);
        }
        return foundComponent.helper;
    }

    /** public for test */
    _getEntryComponents(): SnEntryComponent[] {
        return _.flatMap(this.entryComponents(this.snView).groups, (group) => group.components);
    }

    /**
     * Temporary util method
     *
     * Updates the position of nodes in the view in order to not overlap them
     * // TODO: this is to be wrapped in a dedicated service and with probably more advanced positioning logics
     */
    private repositionNodesInView() {
        // TODO take in account the node order and their connections to position them on the canvas, a predefined grid can be used first
        const distanceBetween = 400;
        let cornerX = 0;
        this.snView.nodes = this.snView.nodes.map((node) => {
            if (node.canvas.x === 0 && node.canvas.y === 0) {
                node.canvas = { x: cornerX, y: 0 };
            }
            cornerX += distanceBetween;
            return node;
        });
    }
}
