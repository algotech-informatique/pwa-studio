import { Component, ChangeDetectorRef } from '@angular/core';
import { SnNodeSchema, SnSectionClickEvent } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';
import { SnActionsService, SnDOMService } from '../../../../smart-nodes/services';
import { SnATNodeUtilsService } from '../../../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import * as _ from 'lodash';

@Component({
    ...SN_TASK_METADATA,
    template: `${SN_TASK_METADATA.template}
    <sn-select-properties
        *ngIf="top && model"
        [snView]="snView"
        [(top)]="top"
        [type]="model"
        [selectedProperties]="selectedProperties"
        [nestable]="false"
        [pluggable]="false"
        [direction]="'in'"
        [displayable]="false"
        [multiModelMode]="model"
        (addProperties)="addProperties($event)"
        (removeProperties)="removeProperties($event)">
    </sn-select-properties>
    `
})
export class SnFormNodeComponent extends SnTaskNodeComponent {

    top: number;
    selectedProperties: string[];

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected snDOMService: SnDOMService,
        protected ref: ChangeDetectorRef
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        const objectType: string = this.snATNodeUtils.findType(this.snView, this.node, 'object');
        if (objectType) {
            this.checkModelProperties(objectType, 'options', true);
        }
        super.initialize(schema);
    }

    calculate() {
        this.calculateTags([], 'objectLinked');

        const objectType = this.snATNodeUtils.findType(this.snView, this.node, 'object');

        this.checkTypes('options', objectType, { multiModelMode: true });
        this.originalTypes = objectType;

        this.loadModelsByType(objectType, { sectionKeyProp: 'options', modelKeyProp: 'smartModel', composedModel: true });
        this.updateType(objectType, { hasSkill: false, typeIsFormated: false });

        this.hideSection('options', { multiModelMode: true });

        const sectionOption = this.node.sections.find((s) => s.key === 'options');
        if (!sectionOption) {
            return ;
        }

        for (const param of sectionOption.params) {
            if (param.value && (param.value.type)) {
                if (param.value.type === 'pluggable') {
                    param.pluggable = param.value.pluggable;
                    if (param.pluggable) {
                        param.multiple = true;
                        param.types = 'sys:glistvalue';
                    } else {
                        param.multiple = false;
                        param.types = 'string';
                    }
                    continue;
                }

                if (param.value.type === 'combobox' || param.value.type === 'dropdown') {
                    if (param.pluggable) {
                        continue ;
                    }
                    param.pluggable = true;
                    param.multiple = true;
                } else {
                    if (!param.pluggable) {
                        continue ;
                    }
                    param.pluggable = false;
                    param.toward = null;
                    param.multiple = false;
                }
            }

            this.snActions.notifyNode('chg', this.snView, this.node);
        }

        super.calculate();
    }

    onSectionClicked(section: SnSectionClickEvent) {
        this.selectedProperties = this.updateSelectedProperties('options');
        this.top = this.snDOMService.getRelativeTop(section.event.toElement || section.event.target, this.node) + 35;
    }
}
