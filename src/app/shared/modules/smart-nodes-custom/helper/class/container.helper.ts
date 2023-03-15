import { UUID } from 'angular2-uuid';
import { SnBox, SnGroup, SnView } from '../../../smart-nodes/models';
import { BoxHelper } from './box.helper';
import _ from 'lodash';
import { NodesHelper } from './nodes.helper';
import { SnEntryComponents } from '../../../smart-nodes/dto';
import { HelperContext } from '../helper.context';

export abstract class ContainerHelper<HelperType extends unknown> extends NodesHelper<HelperType> {
    constructor(helperContext: HelperContext, snView: SnView, entryComponents: (snView: SnView) => SnEntryComponents) {
        super(helperContext, snView, entryComponents);
    }

    public createBox(displayName: string = '', parentGroup?: SnGroup): BoxHelper {
        const newBox: SnBox = {
            id: UUID.UUID(),
            parentId: parentGroup ? parentGroup.id : null,
            canvas: { x: 0, y: 0},
            displayName: this.helperContext.initializeLangs(displayName),
            open: true,
            displayState: {},
        };
        this.snView.box.push(newBox);

        return new BoxHelper(this.helperContext, this.snView, this.entryComponents, newBox);
    }

    public getBox(boxId: string, parentId?: string): BoxHelper {
        const foundBox = this.snView.box.find(box => box.id === boxId && (!parentId || box.parentId === parentId));
        if (foundBox) {
            return new BoxHelper(this.helperContext, this.snView, this.entryComponents, foundBox);
        } else {
            let errorMessage = `box with id=[${boxId}] not found`;
            if (parentId) {
                errorMessage += ` in group id=[${parentId}]`;
            }
            throw new Error(errorMessage);
        }
    }

    public getBoxes(parentId?: string): BoxHelper[] {
        let boxes: SnBox[] = [];
        if (parentId) {
            boxes = this.snView.box.filter(box => box.parentId === parentId);
        } else {
            boxes = this.snView.box;
        }
        return boxes.map(box => new BoxHelper(this.helperContext, this.snView, this.entryComponents, box));
    }

    public removeBox(id: string, parentId?: string): HelperType {
        const boxToRemove = this.getBox(id, parentId);
        this.snView.box.splice(this.snView.box.indexOf(boxToRemove.box));
        return this as unknown as HelperType;
    }
}
