import { Component, ChangeDetectorRef } from '@angular/core';
import { SnDOMService, SnSectionClickEvent, SN_BASE_METADATA } from '../../../smart-nodes';
import { SnActionsService } from '../../../smart-nodes/services';
import { SnNodeSchema } from '../../../smart-nodes/dto';
import * as _ from 'lodash';
import { SnATNodeComponent } from '../sn-at-node/sn-at-node.component';
import { SnATNodeUtilsService } from '../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnParam, SnSection } from '../../../smart-nodes/models';

@Component({
    ...SN_BASE_METADATA,
    template: `
        <sn-params
            *ngIf="node.params?.length > 0"
            [params]="node.params"
            [snView]="snView"
            [node]="node"
        >
        </sn-params>
        <sn-sections
            *ngIf="node.sections?.length > 0"
            [sections]="node.sections"
            [snView]="snView"
            [node]="node"
            (sectionClicked)="onSectionClicked($event)"
            >
        </sn-sections>
        <sn-json-edit
            [node]="node"
            [section]="sectionJson"
            [jsonText]="jsonText"
            [params]="this.sectionSource.params"
            (changeJson)="onChangeJson($event)">
        </sn-json-edit>
        <sn-select-key-value
        *ngIf="top"
        [(top)]="top"
        direction="in"
        [snView]="snView"
        [node]="node"
        [showMultiple]="false"
        (addParam)="onAddParam($event)">
    </sn-select-key-value>
    `
})
export class SnJsonNodeComponent extends SnATNodeComponent {

    jsonText = '';
    sectionJson: SnSection;
    sectionSource: SnSection;
    snViewVariables = [];
    top: number;
    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected ref: ChangeDetectorRef,
        private snDOMService: SnDOMService,
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.sectionSource = this.node.sections.find((s) => s.key === 'sources');
        this.sectionJson = this.node.sections.find((s) => s.key === 'json');
        super.initialize(schema);
    }

    calculate() {
        this.calculateJson();
        super.calculate();
    }

    calculateJson() {
        if (!this.node.params || this.node.params.length === 0) {
            return;
        }
        if (!this.node.sections || this.node.sections.length === 0) {
            return;
        }
        this.jsonText = this.node.params[0].value;
    }

    onChangeJson(data) {
        this.snActions.editParam(this.snView, this.node, this.node.params[0], this.node.params, 'value', data);
    }

    onSectionClicked(event: SnSectionClickEvent) {
        this.top = this.snDOMService.getRelativeTop(event.event.toElement || event.event.target, this.node) + 35;
    }

    onAddParam(param: SnParam) {
        const section = this.node.sections.find((s) => s.key === 'sources');
        if (section) {
            this.snActions.addParam(this.snView, this.node, param, section.params);
        }
    }
}
