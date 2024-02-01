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
        [filter]="filter"
        [selectedProperties]="selectedProperties"
        (addProperties)="addProperties($event, clickedSection)"
        (removeProperties)="removeProperties($event, clickedSection)">
    </sn-select-properties>
    `
})
export class SnCsvMappedNodeComponent extends SnTaskNodeComponent {

    top: number;
    selectedProperties: string[];
    clickedSection: string;
    filter: string[];

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected ref: ChangeDetectorRef,
        private snDOMService: SnDOMService) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.loadModels();
        this.load([
            { key: 'ascii', value: 'ascii' },
            { key: 'utf8', value: 'utf8' },
            { key: 'utf-8', value: 'utf-8' },
            { key: 'utf16le', value: 'utf16le' },
            { key: 'ucs2', value: 'ucs2' },
            { key: 'ucs-2', value: 'ucs-2' },
            { key: 'base64', value: 'base64' },
            { key: 'base64url', value: 'base64url' },
            { key: 'latin1', value: 'latin1' },
            { key: 'binary', value: 'binary' },
            { key: 'hex', value: 'hex' },
        ], 'encoding');
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
        this.filter = ev.section.key === 'dateFormat' ?
            ['date', 'datetime', 'time'] :
            ['string', 'number', 'date', 'datetime', 'time', 'boolean'];

        this.clickedSection = ev.section.key;
        this.selectedProperties = this.updateSelectedProperties(ev.section.key);
        this.top = this.snDOMService.getRelativeTop(ev.event.toElement || ev.event.target, this.node) + 35;
    }


    protected addProperties(params: SnParam[], sectionKey?: string) {
        params.forEach((p) => {
            p.types = 'string';
        });

        if (sectionKey === 'columns') {
            params.forEach((p) => p.value = p.value || p.key);
        }

        return super.addProperties(params, sectionKey);
    }
}
