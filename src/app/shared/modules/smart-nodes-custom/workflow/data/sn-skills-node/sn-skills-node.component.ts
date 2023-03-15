import {
    Component
} from '@angular/core';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';
import * as _ from 'lodash';

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnSkillsNodeComponent extends SnTaskNodeComponent {

    initialize(schema: SnNodeSchema) {
        super.initialize(schema);
    }

    calculate() {
        const flowOut = this.node.flows.find((f) => f.direction === 'out');
        const flowOutCopy = _.cloneDeep(flowOut);

        // hide if type change
        const objectType: string = this.snATNodeUtils.findType(this.snView, this.node, 'object');

        const sysFile = flowOut.params[0];
        const sysLocation = flowOut.params[1];
        const sysTag = flowOut.params[2];
        const sysSignature = flowOut.params[3];
        const sysMagnet = flowOut.params[4];

        const model = objectType ? this.snATNodeUtils.getSmartModel(objectType.replace('so:', '')) : null;
        if (model) {
            sysFile.displayState.hidden = !model.skills.atDocument;
            sysLocation.displayState.hidden = !model.skills.atGeolocation;
            sysSignature.displayState.hidden = !model.skills.atSignature;
            sysTag.displayState.hidden = !model.skills.atTag;
            sysMagnet.displayState.hidden = !model.skills.atMagnet;
        } else {
            sysFile.displayState.hidden = true;
            sysLocation.displayState.hidden = true;
            sysSignature.displayState.hidden = true;
            sysTag.displayState.hidden = true;
            sysMagnet.displayState.hidden = true;

            switch (objectType) {
                case 'sk:atDocument':
                    sysFile.displayState.hidden = false;
                    break;
                case 'sk:atGeolocation':
                    sysLocation.displayState.hidden = false;
                    break;
                case 'sk:atSignature':
                    sysSignature.displayState.hidden = false;
                    break;
                case 'sk:atTag':
                    sysTag.displayState.hidden = false;
                    break;
                case 'sk:atMagnet':
                    sysMagnet.displayState.hidden = false;
                    break;

                default: {
                    sysFile.displayState.hidden = false;
                    sysLocation.displayState.hidden = false;
                    sysSignature.displayState.hidden = false;
                    sysTag.displayState.hidden = false;
                    sysMagnet.displayState.hidden = false;
                }
            }
        }

        super.calculate();

        if (JSON.stringify(flowOut) !== JSON.stringify(flowOutCopy)) {
            this.snActions.notifyHide(this.snView, this.node);
        }
    }
}
