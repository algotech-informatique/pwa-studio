import { ClassConstructor } from 'class-transformer';
import { SnEntryComponents } from '../../../smart-nodes/dto';
import { SnGroup, SnView } from '../../../smart-nodes/models';
import { HelperContext } from '../helper.context';
import { BoxHelper } from './box.helper';
import { ContainerHelper } from './container.helper';
import { NodeHelper } from './node.helper';

export class GroupHelper extends ContainerHelper<GroupHelper> {
    group: SnGroup;

    constructor(helperContext: HelperContext, snView: SnView, entryComponents: (snView: SnView) => SnEntryComponents, group: SnGroup) {
        super(helperContext, snView, entryComponents);
        this.group = group;
    }

    public createBox(displayName = ''): BoxHelper {
        return super.createBox(displayName, this.group);
    }

    public getBox(id: string): BoxHelper {
        return super.getBox(id, this.group.id);
    }

    public getBoxes(): BoxHelper[] {
        return super.getBoxes(this.group.id);
    }

    public removeBox(id: string): GroupHelper {
        super.removeBox(id, this.group.id);
        return this;
    }

    public createNode<HelperType extends NodeHelper<HelperType>>(
        classType: ClassConstructor<NodeHelper<HelperType>>,
        dataSourceKey?: string
    ): HelperType {
        return super.createNode(classType, dataSourceKey, this.group);
    }

    public getNodes<HelperType extends NodeHelper<HelperType>>(): HelperType[] {
        return super.getNodes(this.group);
    }

}
