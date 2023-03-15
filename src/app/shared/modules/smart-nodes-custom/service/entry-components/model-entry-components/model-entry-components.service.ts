import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as components from '../../../index-component';
import * as schema from '../../../index-schema';
import { SnEntryComponents } from '../../../../smart-nodes/dto';
import { SnTranslateService } from '../../../../smart-nodes/services';
import { SnLang, SnView } from '../../../../smart-nodes/models';

@Injectable()
export class ModelEntryComponentsService {

    constructor(private snTranslate: SnTranslateService) { }

    getEntryComponents(languages: SnLang[]): (snView: SnView) => SnEntryComponents {
        return (snView: SnView) => {
            return {
                groups: [{
                    displayName: 'SN-MODEL',
                    components: [{
                        displayName: 'SN-MODEL',
                        component: components.SnModelNodeComponent,
                        schema: schema.SN_MODEL_NODE_SCHEMA(
                            this.snTranslate.initializeLangs('', languages) as SnLang[]
                        ),
                    }]
                }]
            };
        };
    }
}
