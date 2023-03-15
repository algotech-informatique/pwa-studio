import { Component, ChangeDetectorRef } from '@angular/core';
import { SnNodeSchema, SnSectionClickEvent } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';
import { SnDOMService, SnActionsService } from '../../../../smart-nodes/services';
import { SnATNodeUtilsService } from '../../../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';

@Component({
    ...SN_TASK_METADATA,
    template: `${SN_TASK_METADATA.template}
    <sn-select-properties
        *ngIf="showSelectProperties"
        [snView]="snView"
        [(top)]="top"
        [type]="!showSkills ? model : type"
        [multiModelMode]="!showSkills ? model : null"
        [selectedProperties]="selectedProperties"
        [nestable]="false"
        [direction]="'in'"
        [skillsMode]="showSkills"
        (addProperties)="addProperties($event, clickedSection)"
        (removeProperties)="removeProperties($event, clickedSection)">
    </sn-select-properties>
    `
})
export class SnObjectAssignmentNodeComponent extends SnTaskNodeComponent {

    top: number;
    showSkills = false;
    clickedSection: string;
    selectedProperties: string[];
    showSelectProperties = false;

    constructor (
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected snDOMService: SnDOMService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        super(snActions, snATNodeUtils, changeDetectorRef);
    }

    initialize(schema: SnNodeSchema) {
        const objectType: string = this.snATNodeUtils.findType(this.snView, this.node, 'object');
        if (objectType) {
            this.checkModelProperties(objectType, 'properties', true);
        }
        super.initialize(schema);
    }

    calculate() {
        const objectType = this.snATNodeUtils.findType(this.snView, this.node, 'object');

        this.checkTypes('properties', objectType, { multiModelMode: true });
        this.checkTypes('skills', objectType, { multiModelMode: false });
        this.originalTypes = objectType;

        this.loadModelsByType(objectType, { sectionKeyProp: 'properties', modelKeyProp: 'smartModel', composedModel: false });
        this.updateType(objectType, { hasSkill: true, typeIsFormated: false });

        this.hideSection('properties', { multiModelMode: true });
        this.hideSection('skills', { multiModelMode: false });
        super.calculate();
    }

    onSectionClicked(section: SnSectionClickEvent) {
        this.showSelectProperties = false;
        this.changeDetectorRef.detectChanges();
        this.top = this.snDOMService.getRelativeTop(section.event.toElement || section.event.target, this.node) + 35;
        this.showSkills = section.section.key === 'skills';
        this.clickedSection = section.section.key;
        this.selectedProperties = this.updateSelectedProperties(section.section.key);
        this.showSelectProperties = section.section.key === 'skills' || this.model ? true : false;
    }
}
