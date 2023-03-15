import { SnDOMService } from './../../../smart-nodes/services/utils/sn-dom/sn-dom.service';
import { SnSectionClickEvent } from './../../../smart-nodes/dto/sn-section-click-event';
import { SnParam } from './../../../smart-nodes/models/sn-param';
import { SnSection } from './../../../smart-nodes/models/sn-section';
import { SnNodeSchema } from './../../../smart-nodes/dto/sn-node-schema';
import { SnATNodeUtilsService } from './../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnActionsService } from './../../../smart-nodes/services/view/sn-actions/sn-actions.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { SN_BASE_METADATA } from '../../../smart-nodes';
import * as _ from 'lodash';
import { SnATNodeComponent } from '../sn-at-node/sn-at-node.component';

@Component({
    ...SN_BASE_METADATA,
    template: `
        ${SN_BASE_METADATA.template}

        <sn-query-builder-query
            [section]="sectionQuery"
            [queryText]="plainQuery"
            (queryChange)="onQueryChanged($event)">
        </sn-query-builder-query>

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
export class SnQueryBuilderNodeComponent extends SnATNodeComponent {

    sectionQuery: SnSection;
    plainQueryParam: SnParam;
    plainQuery: string;
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
        this.sectionQuery = this.node.sections.find((s) => s.key === 'query');
        this.plainQueryParam = this.sectionQuery.params.find((p) => p.key === 'plainQuery');
        this.plainQuery = this.plainQueryParam.value;
        super.initialize(schema);
    }

    onQueryChanged(query: string) {
        this.snActions.editParam(this.snView, this.node, this.plainQueryParam, this.sectionQuery.params, 'value', query);
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
