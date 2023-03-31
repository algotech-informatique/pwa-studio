import { SnModelDto } from '@algotech-ce/core';
import { SnEntryComponents } from '../../../smart-nodes/dto';
import { SnView } from '../../../smart-nodes/models';
import { HelperContext } from '../helper.context';
import { ViewHelper } from './view.helper';

export class SmartModelsHelper extends ViewHelper<SmartModelsHelper> {
    constructor(helperContext: HelperContext, model: SnModelDto, entryComponents: (snView: SnView) => SnEntryComponents) {
        super(helperContext, model, entryComponents);
    }
}
