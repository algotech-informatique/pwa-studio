import { Component, ChangeDetectorRef } from '@angular/core';
import { SnNodeSchema, SnSectionClickEvent } from '../../../../smart-nodes/dto';
import { SnATNodeComponent } from '../../sn-at-node/sn-at-node.component';
import { SN_BASE_METADATA } from '../../../../smart-nodes/components';
import { TranslateService } from '@ngx-translate/core';
import { SnATNodeUtilsService } from '../../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnActionsService, SnDOMService } from '../../../../smart-nodes/services';
import { SnParam } from '../../../../smart-nodes/models';
import { SmartModelDto } from '@algotech-ce/core';

@Component({
    ...SN_BASE_METADATA,
    template: `${SN_BASE_METADATA.template}
    <sn-select-properties
        *ngIf="top && type"
        [snView]="snView"
        [(top)]="top"
        [type]="type"
        [direction]="'in'"
        [filter]="clickedSection === 'order' ? ['string', 'number', 'date', 'datetime', 'time', 'boolean'] : null"
        [selectedProperties]="selectedProperties"
        (addProperties)="addProperties($event)"
        (removeProperties)="removeProperties($event, clickedSection)">
    </sn-select-properties>
    `
})
export class SnServiceSmartObjectV2NodeComponent extends SnATNodeComponent {

    top: number;
    selectedProperties: string[];
    clickedSection: string;

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected ref: ChangeDetectorRef,
        private translate: TranslateService,
        private snDOMService: SnDOMService) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.loadModels('modelKey');
        super.initialize(schema);
    }

    calculate() {
        const modelKey = this.node.params.find((p) => p.key === 'modelKey');
        this.calculateTypeWithModel('modelKey');

        const outParam = this.snATNodeUtils.getOutParam(this.node);
        if (outParam && outParam.param) {
            this.checkTypes('filter', outParam.param.types, { multiModelMode: false });
            this.checkTypes('order', outParam.param.types, { multiModelMode: false });

            this.originalTypes = outParam.param.types;
            this.updateType(outParam.param.types, { hasSkill: false, typeIsFormated: false });
        }

        const search = this.node.params.find((p) => p.key === 'search');
        if (search) {
            search.displayState.hidden = !modelKey.value;
        }
        const searchParameters = this.node.params.find((p) => p.key === 'searchParameters');
        if (searchParameters) {
            searchParameters.displayState.hidden = !modelKey.value ||
                !this.snView.options.variables.some((v) => v.key === 'search-parameters');
        }
        for (const section of this.node.sections) {
            section.hidden = !modelKey.value;
        }

        const order = this.node.sections.find((s) => s.key === 'order');
        if (order) {
            for (const param of order.params) {
                param.displayState.items = [{
                    key: 'asc',
                    value: this.translate.instant('SN-ORDER-ASC')
                }, {
                    key: 'desc',
                    value: this.translate.instant('SN-ORDER-DESC')
                }];
            }
        }

        super.calculate();
    }

    onSectionClicked(ev: SnSectionClickEvent) {
        this.clickedSection = ev.section.key;
        this.selectedProperties = this.updateSelectedProperties(ev.section.key);
        this.top = this.snDOMService.getRelativeTop(ev.event.toElement || ev.event.target, this.node) + 35;
    }

    protected addProperties(params: SnParam[]) {
        switch (this.clickedSection) {
            case 'filter': {
                const section = this.node.sections.find((s) => s.key === 'filter');
                if (section && section.params) {
                    const _params = params.map((param) => {
                        const type = param.types as string;
                        const multiple = param.multiple;

                        param.custom = {
                            type,
                            multiple,
                        };
                        param.required = true;

                        if (type.startsWith('so:') || param.key.split('.').length > 1) {
                            const smartModel = this.snATNodeUtils.getSmartModel(this.node.params.find((p) => p.key === 'modelKey')?.value);
                            if (smartModel) {
                                param.custom.models = this.snATNodeUtils.getSmartModelsFromPath(smartModel, param.key.split('.'))
                                    .map((sm) => sm.key);
                            }
                        }

                        param.types = 'sys:filter';
                        return param;
                    });
                    this.snActions.addParam(this.snView, this.node, _params, section.params);
                }
            }
                break;
            case 'order': {
                const section = this.node.sections.find((s) => s.key === 'order');
                if (section && section.params) {
                    const _params = params.map((p) => {
                        p.types = 'string';
                        p.pluggable = false;
                        p.display = 'select';
                        p.value = 'asc';
                        p.required = true;
                        return p;
                    });
                    this.snActions.addParam(this.snView, this.node, _params, section.params);
                }
            }
                break;
        }
    }
}
