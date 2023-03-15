import {
    Component
} from '@angular/core';
import { SN_BASE_METADATA, SnNodeBaseComponent } from '../../../smart-nodes';

@Component({
    template: SN_BASE_METADATA.template,
})
export class SnConnectorParameterNodeComponent extends SnNodeBaseComponent {
}
