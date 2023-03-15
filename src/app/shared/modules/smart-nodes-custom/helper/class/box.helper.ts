import { ClassConstructor } from 'class-transformer';
import { SnEntryComponents } from '../../../smart-nodes/dto';
import { SnBox, SnView } from '../../../smart-nodes/models';
import { HelperContext } from '../helper.context';
import { NodeHelper } from './node.helper';
import { NodesHelper } from './nodes.helper';

export class BoxHelper extends NodesHelper<BoxHelper> {
    box: SnBox;

    constructor(helperContext: HelperContext, snView: SnView, entryComponents: (snView: SnView) => SnEntryComponents, box?: SnBox) {
        super(helperContext, snView, entryComponents);
        if (box) {
            this.box = box;
        }
    }

    public createNode<HelperType extends NodeHelper<HelperType>>(
        classType: ClassConstructor<NodeHelper<HelperType>>,
        dataSourceKey?: string
    ): HelperType {
        return super.createNode(classType, dataSourceKey, this.box);
    }

    public getNodes<HelperType extends NodeHelper<HelperType>>(): HelperType[] {
        return super.getNodes(this.box);
    }
}
