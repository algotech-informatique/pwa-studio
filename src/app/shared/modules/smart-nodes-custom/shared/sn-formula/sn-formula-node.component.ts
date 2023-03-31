import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { SN_BASE_METADATA } from '../../../smart-nodes';
import { SnActionsService, SnDOMService } from '../../../smart-nodes/services';
import * as _ from 'lodash';
import { PopoverController } from '@ionic/angular';
import { SnNodeSchema, SnSectionClickEvent } from '../../../smart-nodes/dto';
import { SnParam, SnSection } from '../../../smart-nodes/models';
import { TranslateService } from '@ngx-translate/core';
import { SnATNodeComponent } from '../sn-at-node/sn-at-node.component';
import { SnATNodeUtilsService } from '../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import moment from 'moment'; 
import { SnFormulaService } from './sn-formula.service';
import { SnFormula } from './sn-formulas-dto';

@Component({
    ...SN_BASE_METADATA,
    template: `
        <sn-params
            *ngIf="node.params?.length > 0"
            [params]="node.params"
            [snView]="snView"
            [node]="node">
        </sn-params>

        <sn-formula-input
            *ngIf="node.params?.length > 0"
            [formula]="node.params[0].value"
            [formulaHasError]="formulaHasError"
            [sources]="sources"
            [snView]="snView"
            (formulaChange)="updateFormula($event)"
            (createSource)="onAddParam($event)">
        </sn-formula-input>

        <sn-sections
            *ngIf="node.sections?.length > 0"
            [sections]="node.sections"
            [snView]="snView"
            [node]="node"
            (sectionClicked)="onSectionClicked($event)">
        </sn-sections>

        <sn-formula-preview
            [formula]="computedFormula"
            [hasKeyError]="hasKeyError"
            [section]="sectionPreview"
            (formulaError)="onFormulaError($event)">
        </sn-formula-preview>

        <sn-select-key-value
            *ngIf="top"
            [(top)]="top"
            direction="in"
            [snView]="snView"
            [node]="node"
            [showMultiple]="false"
            (addParam)="onAddParam($event)">
        </sn-select-key-value>
    `,
})
export class SnFormulaNodeComponent extends SnATNodeComponent implements OnDestroy {

    computedFormula = '';
    formulaHasError: boolean;
    hasKeyError: boolean;
    hasPreviewError: boolean;
    sectionPreview: SnSection;
    top: number;
    sources: SnParam[] = [];

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected popoverController: PopoverController,
        private snDOMService: SnDOMService,
        private translateService: TranslateService,
        private changeDetectorRef: ChangeDetectorRef,
        private formulaService: SnFormulaService,
    ) {
        super(snActions, snATNodeUtils, changeDetectorRef);
    }

    get formula() {
        return this.node.params[0].value;
    }

    initialize(schema: SnNodeSchema) {
        this.sectionPreview = this.node.sections.find((s) => s.key === 'preview');
        this.updateSources();
        super.initialize(schema);
    }

    updateSources() {
        const section = this.node.sections.find((s) => s.key === 'sources');
        if (section) {
            this.sources = section.params;
        }
    }

    calculate() {
        this.updatePreviewFormula();

        const formulaName = this.computedFormula.split('(')[0];
        const formula: SnFormula = this.formulaService.getFormula(formulaName);
        const type = (formula) ? formula.outputType : this._parseFormula();
        this.node.params[0].multiple = (formula) ? formula.outputIsArray : false;

        this.snActions.editParam(this.snView, this.node, this.node.params[0], this.node.params, 'types', type);
        this.updateSources();
        super.calculate();
    }

    _parseFormula() {
        const parserResult = this.formulaService.parseFormula(this.computedFormula);

        let type = _.isArray(this.node.params[0].types) ? 'string' : this.node.params[0].types;
        if (!parserResult.error) {
            if (_.isBoolean(parserResult.result)) {
                type = 'boolean';
            } else if (_.isDate(parserResult.result)) {
                type = 'datetime';
            } else if (_.isNumber(parserResult.result)) {
                type = 'number';
            } else {
                type = 'string';
            }
        }
        return type;
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

    onFormulaError(error: boolean) {
        this.hasPreviewError = error;
        this.formulaHasError = error;
        this.changeDetectorRef.detectChanges();
    }

    updatePreviewFormula() {
        this.formulaHasError = false;
        this.computeFormula();
    }

    updateFormula(formula: string) {
        this.computeFormula();
        this.snActions.editParam(this.snView, this.node, this.node.params[0], this.node.params, 'value', formula);
    }

    computeFormula() {
        this.hasKeyError = false;
        this.computedFormula = this.formula;
        const objects = this.computedFormula.match(/{{(?!\[)(.*?)}}/ig);
        _.forEach(objects, (object: string) => {
            const source: SnParam = _.find(this.node.sections[0].params, (section: SnParam) => '{{' + section.key + '}}' === object);
            if (source) {
                let value = source.types !== 'number' ? `"${source.value}"` : `${source.value}`;
                if (!source.value) {
                    switch (source.types) {
                        case 'number':
                            value = value === '0' ? value : undefined;
                            break;
                        case 'date':
                        case 'datetime':
                            value = `"${moment().format()}"`;
                            break;
                        default:
                            value = `""`;
                    }
                }
                this.computedFormula = _.replace(this.computedFormula, object, value);
            } else {
                this.computedFormula = this.translateService.instant('SN-FORMULA-ERROR-KEY', { key: object });
                this.hasKeyError = true;
                return false;
            }
        });
        this.formulaHasError = this.hasKeyError || this.hasPreviewError;
    }
}
