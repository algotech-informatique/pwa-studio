import { Component, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SN_BASE_METADATA } from '../../../smart-nodes';
import { SnTextFormattingService } from './sn-preview-text-formatting.service';
import { SnActionsService, SnDOMService } from '../../../smart-nodes/services';
import * as _ from 'lodash';
import { PopoverController } from '@ionic/angular';
import { SnEditTextFormattingComponent } from './sn-edit-text-formatting/sn-edit-text-formatting.component';
import { SnNodeSchema, SnSectionClickEvent } from '../../../smart-nodes/dto';
import { LangDto } from '@algotech-ce/core';
import { SessionsService } from '../../../../services';
import { SnSection, SnParam } from '../../../smart-nodes/models';
import { SnATNodeComponent } from '../sn-at-node/sn-at-node.component';
import { SnATNodeUtilsService } from '../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';

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

        <sn-edit-button-formatting
            (buttonClick)="onButtonClick($event)">
        </sn-edit-button-formatting>

        <sn-sections
            *ngIf="node.sections?.length > 0"
            [sections]="node.sections"
            [snView]="snView"
            [node]="node"
            (sectionClicked)="onSectionClicked($event)"
            >
        </sn-sections>

        <sn-preview-text-formatting
            [section]="sectionPreview"
            [previewText]="previewText"
            [activeLangs]="langs"
        >
        </sn-preview-text-formatting>

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
export class SnTextFormattingNodeComponent extends SnATNodeComponent implements OnDestroy {

    langs: LangDto[] = [];
    previewText = [];
    sectionPreview: SnSection;
    editionVisible = false;
    top: number;

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        private snDOMService: SnDOMService,
        private snTextFormattingService: SnTextFormattingService,
        protected popoverController: PopoverController,
        private sessionsService: SessionsService,
        protected ref: ChangeDetectorRef
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.langs = this.sessionsService.active.datas.read.customer.languages;

        if (this.node.params.length > 0) {
            if (!this.node.params[0].value) {
                this.node.params[0].value = this.snTextFormattingService.createParamValue();
            } else {
                this.node.params[0].value = this.snTextFormattingService.mergeParamValue(this.node.params[0].value);
            }
        }

        this.sectionPreview = this.node.sections.find((s) => s.key === 'preview');
        super.initialize(schema);
    }

    calculate() {
        this.calculatePreview();
        super.calculate();
    }

    calculatePreview() {
        if (!this.node.params || this.node.params.length === 0) {
            return ;
        }
        if (!this.node.sections || this.node.sections.length === 0) {
            return ;
        }
        this.previewText = this.snTextFormattingService.constructionMapPreview(this.node.params[0].value, this.node.sections[0].params);
    }

    async onButtonClick(ev) {
        const closePopup = new EventEmitter<any>();
        const modalPopover = await this.popoverController.create({
            component: SnEditTextFormattingComponent,
            componentProps: {
                closePopup: closePopup,
                sections: this.node.sections,
                editText: this.node.params[0].value,
                activeLangs: this.langs,
            },
            cssClass:  'popover_class_text_formatting',
            showBackdrop: true,
            backdropDismiss: true,
        });
        closePopup.subscribe((data) => {
            this.calculatePreview();
            this.snActions.editParam(this.snView, this.node, this.node.params[0], this.node.params, 'value', data);
            return modalPopover.dismiss();
        },
            err => console.error(`Change data failed: ${err}`)
        );
        return await modalPopover.present();
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
