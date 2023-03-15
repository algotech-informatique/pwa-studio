import { Component } from '@angular/core';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnATNodeComponent } from '../../sn-at-node/sn-at-node.component';
import { SN_BASE_METADATA } from '../../../../smart-nodes/components';

@Component({
    template: SN_BASE_METADATA.template,
})
export class SnServiceUsersNodeComponent extends SnATNodeComponent {

    initialize(schema: SnNodeSchema) {
        super.initialize(schema);
    }

    calculate() {
        super.calculate();
    }
}
