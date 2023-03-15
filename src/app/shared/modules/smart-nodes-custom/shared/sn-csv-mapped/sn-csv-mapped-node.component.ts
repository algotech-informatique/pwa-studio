import {
    ChangeDetectorRef,
    Component
} from '@angular/core';
import { SnNodeSchema, SnSectionClickEvent } from '../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../shared/sn-task-node/sn-task-node.component';
import * as _ from 'lodash';
import { SnActionsService, SnDOMService } from '../../../smart-nodes/services';
import { SnATNodeUtilsService } from '../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnParam } from '../../../smart-nodes/models';
@Component({
    template: `${SN_TASK_METADATA.template}
    <sn-select-properties
        *ngIf="top && type"
        [snView]="snView"
        [(top)]="top"
        [type]="type"
        [direction]="'in'"
        [filter]="['date', 'datetime', 'time']"
        [selectedProperties]="selectedProperties"
        (addProperties)="addProperties($event)"
        (removeProperties)="removeProperties($event, clickedSection)">
    </sn-select-properties>
    `
})
export class SnCsvMappedNodeComponent extends SnTaskNodeComponent {

    top: number;
    selectedProperties: string[];
    clickedSection: string;

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected ref: ChangeDetectorRef,
        private snDOMService: SnDOMService) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.loadModels();
        super.initialize(schema);
    }

    calculate() {
        this.calculateTypeWithModel();
        const outParam = this.snATNodeUtils.getOutParam(this.node);
        if (outParam && outParam.param) {
            this.originalTypes = outParam.param.types;
            this.updateType(outParam.param.types, { hasSkill: false, typeIsFormated: false });
        }

        super.calculate();
    }

    onSectionClicked(ev: SnSectionClickEvent) {
        this.clickedSection = ev.section.key;
        this.selectedProperties = this.updateSelectedProperties(ev.section.key);
        this.top = this.snDOMService.getRelativeTop(ev.event.toElement || ev.event.target, this.node) + 35;
    }


    protected addProperties(params: SnParam[], sectionKey?: string) {
        params.forEach((p) => {
            p.types = 'string';
        });

        return super.addProperties(params, sectionKey);
    }
}
