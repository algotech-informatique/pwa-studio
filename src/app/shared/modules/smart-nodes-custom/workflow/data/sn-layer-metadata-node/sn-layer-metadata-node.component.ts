import { Component, ChangeDetectorRef } from '@angular/core';
import { SN_BASE_METADATA } from '../../../../smart-nodes';
import { SnNodeSchema, SnSectionClickEvent } from '../../../../smart-nodes/dto';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';
import { SnActionsService, SnDOMService } from '../../../../smart-nodes/services';
import { SnATNodeUtilsService } from '../../../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnParam } from '../../../../smart-nodes/models';

@Component({
    template: `${SN_BASE_METADATA.template}
    <sn-select-key-value
        *ngIf="top"
        [(top)]="top"
        direction="out"
        [snView]="snView"
        [node]="node"
        [showMultiple]="false"
        (addParam)="onAddParam($event)">
    </sn-select-key-value>
    `,
})
export class SnLayerMetadataNodeComponent extends SnTaskNodeComponent {

    top: number;
    paramType: SnParam;

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        private snDOMService: SnDOMService,
        protected ref: ChangeDetectorRef
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        super.initialize(schema);
        this.paramType = this.snATNodeUtils.findParamByKey(this.node, 'type');
        this.paramType.displayState.hidden = true;
    }

    calculate() {
        const type = this.snATNodeUtils.findType(this.snView, this.node, 'location');
        if (this.paramType) {
            this.snActions.editParam(this.snView, this.node, this.paramType, this.node.params, 'value', type);
        }
    }

    onSectionClicked(event: SnSectionClickEvent) {
        this.top = this.snDOMService.getRelativeTop(event.event.toElement || event.event.target, this.node) + 35;
    }

    onAddParam(param: SnParam) {
        const section = this.node.sections.find((s) => s.key === 'results');
        if (section) {
            this.snActions.addParam(this.snView, this.node, param, section.params);
        }
    }
}
