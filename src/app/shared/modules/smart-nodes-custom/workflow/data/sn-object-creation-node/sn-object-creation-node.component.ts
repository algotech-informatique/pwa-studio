import { Component, ChangeDetectorRef } from '@angular/core';
import { SnNodeSchema, SnSectionClickEvent } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';
import { SnActionsService, SnDOMService } from '../../../../smart-nodes/services';
import { SnATNodeUtilsService } from '../../../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';

@Component({
    ...SN_TASK_METADATA,
    template: `${SN_TASK_METADATA.template}
    <sn-select-properties
        *ngIf="showSelectProperties"
        [snView]="snView"
        [(top)]="top"
        [type]="type"
        [selectedProperties]="selectedProperties"
        [nestable]="false"
        [direction]="'in'"
        [skillsMode]="showSkills"
        (addProperties)="addProperties($event, clickedSection)"
        (removeProperties)="removeProperties($event, clickedSection)">
    </sn-select-properties>
    `
})
export class SnObjectCreationNodeComponent extends SnTaskNodeComponent {

    top: number;
    selectedProperties: string[];
    showSelectProperties = false;
    showSkills = false;
    clickedSection: string;

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected snDOMService: SnDOMService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        super(snActions, snATNodeUtils, changeDetectorRef);
    }

    initialize(schema: SnNodeSchema) {
        this.loadModels();
        const objectType: string = this.snATNodeUtils.findValue(this.node, 'smartModel');
        if (objectType) {
            this.checkModelProperties(objectType, 'properties', true, true);
        }
        super.initialize(schema);
    }

    calculate() {
        this.calculateTypeWithModel();
        const objectType = this.snATNodeUtils.findValue(this.node, 'smartModel');

        this.checkTypes('properties', objectType, { multiModelMode: false });
        this.checkTypes('skills', objectType, { multiModelMode: false });
        this.originalTypes = objectType;

        this.updateType(objectType, { hasSkill: true, typeIsFormated: true });

        this.hideSection('properties', { multiModelMode: false });
        this.hideSection('skills', { multiModelMode: false });
        super.calculate();
    }

    onSectionClicked(section: SnSectionClickEvent) {
        this.showSelectProperties = false;
        this.top = this.snDOMService.getRelativeTop(section.event.toElement || section.event.target, this.node) + 35;
        this.showSkills = section.section.key === 'skills';
        this.clickedSection = section.section.key;
        this.selectedProperties = this.updateSelectedProperties(section.section.key);
        this.changeDetectorRef.detectChanges();
        this.showSelectProperties = true;
    }
}
