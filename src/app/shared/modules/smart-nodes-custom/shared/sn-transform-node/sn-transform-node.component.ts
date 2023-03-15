import { Component, ChangeDetectorRef } from '@angular/core';
import { SN_BASE_METADATA } from '../../../smart-nodes';
import { SnActionsService, SnDOMService } from '../../../smart-nodes/services';
import { SnNodeSchema, SnSectionClickEvent } from '../../../smart-nodes/dto';
import { SnATNodeComponent } from '../sn-at-node/sn-at-node.component';
import { SnATNodeUtilsService } from '../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnParam } from '../../../smart-nodes/models';

@Component({
    template: `
    ${SN_BASE_METADATA.template}
    <sn-select-key-value
        *ngIf="top"
        [(top)]="top"
        direction="out"
        [snView]="snView"
        [node]="node"
        [showMultiple]="true"
        (addParam)="onAddParam($event)">
    </sn-select-key-value>
    `,
})
export class SnTransformNodeComponent extends SnATNodeComponent {

    top: number;

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        private snDOMService: SnDOMService,
        protected ref: ChangeDetectorRef) {
            super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        super.initialize(schema);
    }

    onSectionClicked(event: SnSectionClickEvent) {
        this.top = this.snDOMService.getRelativeTop(event.event.toElement || event.event.target, this.node) + 35;
    }

    onAddParam(param: SnParam) {
        const section = this.node.sections.find((s) => s.key === 'mapped-fields');
        if (section) {
            this.snActions.addParam(this.snView, this.node, param, section.params);
        }
    }
}
