import { Component, ChangeDetectorRef } from '@angular/core';
import { SN_BASE_METADATA } from '../../../smart-nodes';
import { SnNodeSchema, SnSectionClickEvent } from '../../../smart-nodes/dto';
import { UUID } from 'angular2-uuid';
import { SnParam } from '../../../smart-nodes/models';
import * as _ from 'lodash';
import { SnATNodeComponent } from '../sn-at-node/sn-at-node.component';
import { SnActionsService, SnUtilsService } from '../../../smart-nodes/services';
import { SnATNodeUtilsService } from '../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';

@Component({
    template: SN_BASE_METADATA.template,
})
export class SnArrayNodeComponent extends SnATNodeComponent {

    defaultType: string | string[];


    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtilsService: SnATNodeUtilsService,
        protected snUtils: SnUtilsService,
        protected ref: ChangeDetectorRef
    ) {
        super(snActions, snATNodeUtilsService, ref);
    }

    initialize(schema: SnNodeSchema) {
        super.initialize(schema);
    }

    onSectionClicked(event: SnSectionClickEvent) {
        if (!this.validateSequential(event.section.params)) {
            event.section.params = this.recalculKey(event.section.params);
        }
        const key = event.section.params.length;
        this.creationParam('#' + (key + 1).toString(), event.section.params);
    }

    private recalculKey(params: SnParam[]): SnParam[] {
        let items = 1;
        return _.map(params, (param: SnParam) => {
            const key = '#' + items.toString();
            param.key = key;
            items++;
            return param;
        });
    }

    private creationParam(key: string, params: SnParam[]) {
        const param: SnParam = {
            id: UUID.UUID(),
            direction: 'in',
            key: key,
            toward: null,
            types: this.defaultType,
            multiple: null,
            pluggable: true,
            displayState: {},
            display: 'input',
        };
        this.snActions.addParam(this.snView, this.node, param, params);
    }

    calculate() {
        const calcTypes: string[] = this.getConnectedType();
        if (calcTypes.length !== 0) {
            this.defaultType = (calcTypes.length === 1) ? calcTypes[0] : calcTypes;
            this.recalculType(this.node.sections[0].params);
            this.calculOutputType();
        } else if (calcTypes.length === 0) {
            this.defaultType = ['string', 'number', 'date', 'time', 'datetime', 'boolean', 'so:', 'sys:'];
            this.recalculType(this.node.sections[0].params);
            this.calculOutputType();
        }
        super.calculate();
    }

    private validateSequential(items: SnParam[]): boolean {
        for (let v = 0; v < items.length; v++) {
            const itemVal = items[v].key.replace('#', '');
            if (itemVal !== (v + 1).toString()) {
                return false;
            }
        }
        return true;
    }

    private getConnectedType(): string[] {
        const outputType: string[] = this.getOutputType();
        const paramType: string[] = this.getNodeParamType();

        if (_.isEqual(outputType, ['any'])) {
            return ['any'];
        }
        if (paramType.length === 1) {
            return paramType;
        }
        if (outputType.length === 0) {
            return paramType;
        }
        if ((paramType.length !== 0) && (outputType.length > 1)) {
            return paramType;
        }
        return outputType;
    }

    private getOutputType(): string[] {
        const resultType = this.snATNodeUtilsService.findTypes(this.snView, this.node, 'result');
        return this.clearTypes(_.isArray(resultType) ? resultType as string[] : [resultType as string]);
    }

    private getNodeParamType(): string[] {
        const types =  _.map(this.node.sections[0].params, (p) => {
            return this.snATNodeUtilsService.findTypes(this.snView, this.node, p.key);
        });
        return this.clearTypes(types);
    }

    private clearTypes(types: string[]) {
        return _.uniqBy(_.compact(_.flatten(types)));
    }

    private recalculType(params: SnParam[]): SnParam[] {
        return _.each(params, (param: SnParam) => {
            this.snActions.editParam(this.snView, this.node, param, params, 'types', this.defaultType);
        });
    }

    private calculOutputType() {
        this.snActions.editParam(this.snView, this.node, this.node.params[0], this.node.params, 'types', this.defaultType);
    }
}
