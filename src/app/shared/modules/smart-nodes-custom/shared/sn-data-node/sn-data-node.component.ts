import { Component, ChangeDetectorRef } from '@angular/core';
import { SN_BASE_METADATA } from '../../../smart-nodes';
import { SnNodeSchema, SnSectionClickEvent } from '../../../smart-nodes/dto';
import { SnATNodeComponent } from '../sn-at-node/sn-at-node.component';
import { SnActionsService, SnEntryComponentsService, SnDOMService } from '../../../smart-nodes/services';
import { SnATNodeUtilsService } from '../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';

@Component({
    ...SN_BASE_METADATA,
    template: `${SN_BASE_METADATA.template}
    <sn-select-properties
        *ngIf="top && type"
        [snView]="snView"
        [(top)]="top"
        [type]="type"
        [selectedProperties]="selectedProperties"
        (addProperties)="addProperties($event)"
        (removeProperties)="removeProperties($event)">
    </sn-select-properties>
    `
})
export class SnDataNodeComponent extends SnATNodeComponent {

    top: number;
    selectedProperties: string[];

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected snEntryComponent: SnEntryComponentsService,
        protected snDOMService: SnDOMService,
        protected ref: ChangeDetectorRef
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        const outParam = this.snATNodeUtils.getOutParam(this.node);
        if (outParam && outParam.param) {
            this.checkModelProperties(outParam.param.types, 'properties');
        }
        super.initialize(schema);
    }

    calculate() {
        const entryComponent = this.snEntryComponent.findEntryComponent(this.snView, this.settings, this.node);
        if (this.node && entryComponent) {
            this.snActions.mergedNode(this.snView, this.node, entryComponent.schema);
        }
        const outParam = this.snATNodeUtils.getOutParam(this.node);
        if (outParam && outParam.param) {
            this.checkTypes('properties', outParam.param.types, { multiModelMode: false });
            this.originalTypes = outParam.param.types;

            this.updateType(outParam.param.types, { hasSkill: false, typeIsFormated: false });
            this.hideSection('properties', { multiModelMode: false });
        }
        super.calculate();
    }

    onSectionClicked(section: SnSectionClickEvent) {
        this.selectedProperties = this.updateSelectedProperties('properties');
        this.top = this.snDOMService.getRelativeTop(section.event.toElement || section.event.target, this.node) + 35;
    }

}
