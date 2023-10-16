import {
    Component, ChangeDetectorRef
} from '@angular/core';
import { SN_BASE_METADATA } from '../../../smart-nodes';
import { SnActionsService, SnDOMService } from '../../../smart-nodes/services';
import { SnNodeSchema, SnSectionClickEvent } from '../../../smart-nodes/dto';
import { SnFlow, SnParam, SnSection } from '../../../smart-nodes/models';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { SnATNodeComponent } from '../sn-at-node/sn-at-node.component';
import { SnATNodeUtilsService } from '../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { headers } from '../sn-select-parameter/sn-select-key-value/predefined-lists/headers';

@Component({
    template: `
    ${SN_BASE_METADATA.template}
    <sn-select-key-value
        *ngIf="top"
        [(top)]="top"
        direction="in"
        [snView]="snView"
        [node]="node"
        [section]="currentSection"
        [showMultiple]="predefinedList.length === 0"
        [showTypes]="predefinedList.length === 0"
        [predefinedList]="predefinedList"
        [customFastList]="customFastList"
        (addParam)="onAddParam($event)">
    </sn-select-key-value>
    `,
})
export class SnServiceNodeComponent extends SnATNodeComponent {

    top: number;
    activeSection: SnSection;
    predefinedList: string[] = [];
    currentSection: SnSection;

    paramListSysFile: SnParam;
    customFastList = ['sys:file'];

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected translate: TranslateService,
        private snDOMService: SnDOMService,
        protected ref: ChangeDetectorRef) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.load([{
            key: 'get',
            value: this.translate.instant('SN-SERVICE-GET')
        }, {
            key: 'post',
            value: this.translate.instant('SN-SERVICE-POST')
        }, {
            key: 'put',
            value: this.translate.instant('SN-SERVICE-PUT')
        }, {
            key: 'patch',
            value: this.translate.instant('SN-SERVICE-PATCH')
        }, {
            key: 'delete',
            value: this.translate.instant('SN-SERVICE-DELETE')
        }], 'type');

        this.load([{
            key: 'json',
            value: this.translate.instant('SN-SERVICE-TYPE-JSON'),
        }, {
            key: 'text',
            value: this.translate.instant('SN-SERVICE-TYPE-TXT'),
        }, {
            key: 'blob',
            value: this.translate.instant('SN-SERVICE-TYPE-BLOB'),
        }], 'responseType');


        this.load([{
            key: 'json',
            value: this.translate.instant('SN-SERVICE-TYPE-JSON'),
        }, {
            key: 'text',
            value: this.translate.instant('SN-SERVICE-TYPE-TXT'),
        }], 'responseError');

        this.paramListSysFile = this.snATNodeUtils.findParamByKey(this.node, 'listSysFile');
        this.paramListSysFile.displayState.hidden = true;

        const done = this.node.flows.find((f) => f.key === 'done');
        if (done && done.params.length) {
            done.params[0].displayState.placeHolder = this.translate.instant('SN-SERVICE-RESULT');
            if (done.params.length === 2) {
                done.params[1].displayState.placeHolder = this.translate.instant('SN-SERVICE-HEADERS');
            }
        }
        const error = this.node.flows.find((f) => f.key === 'error');
        if (error && error.params.length === 2) {
            error.params[0].displayState.placeHolder = this.translate.instant('SN-SERVICE-CODE');
            error.params[1].displayState.placeHolder = this.translate.instant('SN-SERVICE-ERROR');
        }

        this.calculatePreview();
        super.initialize(schema);
    }

    onSectionClicked(event: SnSectionClickEvent) {
        this.currentSection = event.section;
        this.predefinedList = event.section.key === 'headers' ? headers : [];
        this.top = this.snDOMService.getRelativeTop(event.event.toElement || event.event.target, this.node) + 35;
        this.activeSection = event.section;
    }

    onAddParam(param: SnParam) {
        if (this.activeSection) {
            this.snActions.addParam(this.snView, this.node, param, this.activeSection.params);
        }
    }

    calculatePreview() {
        const done = this.node.flows.find((f) => f.key === 'done');
        if (done && done.params.length >= 2) {
            let returnHeaders;
            const advanced = this.node.sections.find((s) => s.key === 'advanced');
            if (advanced) {
                returnHeaders = advanced.params.find((p) => p.key === 'returnHeaders');
            }

            if (advanced?.params && advanced?.params.length) {
                done.params[1].displayState.hidden = !returnHeaders.value;
            }
        }

        const responseType: SnParam = this.node.params.find((p) => p.key === 'responseType');
        const propSection: SnSection = this.node.sections.find((s) => s.key === 'properties');
        const saveSection: SnSection = this.node.sections.find((s) => s.key === 'save');
        const type = (responseType.value === 'blob') ? 'sys:file' : responseType.value === 'text' ? 'string' : 'object';
        const flowOut: SnFlow = _.find(this.node.flows, { key: 'done' });

        propSection.hidden = (responseType.value !== 'blob');
        saveSection.hidden = (responseType.value !== 'blob');

        if (flowOut && flowOut.params.length > 0 && flowOut.params[0].types !== type) {
            flowOut.params[0].types = type;
        }

        const typeError = this.node.params.find((p) => p.key === 'responseError')?.value;
        const flowError: SnFlow = _.find(this.node.flows, { key: 'error' });
        if (flowError && flowError.params.length > 1 && flowError.params[1].types !== typeError) {
            flowError.params[1].types = typeError === 'text' ? 'string' : 'object';
        }
    }

    calculate() {
        this.calculatePreview();
        const bodySection: SnSection = this.node.sections.find((s) => s.key === 'body');
        const bodyObjectSection: SnSection = this.node.sections.find((s) => s.key === 'bodyObject');
        const paramMulti: SnParam = this.node.params.find((p) => p.key === 'multiVariable');

        if (paramMulti.value) {
            bodySection.hidden = false;
            bodyObjectSection.hidden = true;

            const listSysFile = _.reduce(bodySection.params, (result, p: SnParam) => {
                if (p.types === 'sys:file') {
                    result.push(p.key);
                }
                return result;
            }, []);
            this.snActions.editParam(this.snView, this.node, this.paramListSysFile,
                this.node.params, 'value', listSysFile);
        } else {
            bodySection.hidden = true;
            bodyObjectSection.hidden = false;
        }

        super.calculate();
    }

}
