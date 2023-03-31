import { SnModelDto } from '@algotech-ce/core';
import { HelperContext } from '../helper.context';
import { FlowHelper } from './flow.helper';

export class SmartflowHelper extends FlowHelper<SmartflowHelper> {
    constructor(helperContext: HelperContext, model: SnModelDto) {
        // TODO do we want to allow also passing the connector UUID as optional constructor param instead of relying on the model dirUUID ?
        super(helperContext, model, helperContext.getSmartflowEntryComponents(model.dirUuid));
    }
}
