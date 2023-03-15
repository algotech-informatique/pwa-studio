import { Pipe, PipeTransform } from '@angular/core';
import { SnPublishFlowTransformService } from '../../smart-nodes-custom';
import { SnNode, SnParam, SnSection, SnView } from '../models';

@Pipe({
    name: 'snIsWatchable'
})

export class SnIsWatchablePipe implements PipeTransform {
    constructor(private publishTransform: SnPublishFlowTransformService) {
    }

    transform(node: SnNode, element: SnParam|SnSection, type: 'param.in' | 'param.out' | 'section'): boolean {
        if (!node || !element) {
            return false;
        }

        if (node.flows.length > 0) {
            if (type === 'param.in' || type === 'param.out') {
                return !node.sections
                    .filter((s) => s.editable)
                    .some((s) => s.params.includes(element as SnParam)) &&
                    (element as SnParam).pluggable &&
                    (element as SnParam).key !== 'placeToSave';
            }
            return (element as SnSection).editable;
        }

        // service|expression
        if (this.publishTransform.isExpression(node) || this.publishTransform.isService(node)) {
            return type === 'param.out';
        }
    }
}
