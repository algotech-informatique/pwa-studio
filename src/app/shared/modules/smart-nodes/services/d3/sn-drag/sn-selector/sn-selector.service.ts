import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { SnCanvas, SnView } from '../../../../models';
import { SnActionsService, SnCalculService, SnSelectionService } from '../../../view';
import { SnUtilsService } from '../../../utils';

@Injectable()
export class SnSelectorService {

    constructor(
        private snSelection: SnSelectionService,
        private snUtils: SnUtilsService,
        private snCalcul: SnCalculService,
        private snAction: SnActionsService) { }

    get container() {
        return d3.select('#container-selector');
    }
    clearSelector() {
        this.container.selectAll('.selector').remove();
    }

    startSelect(d3Context, snView: SnView, container) {
        d3Context.originX = Math.round(d3.mouse(container.node())[0]);
        d3Context.originY = Math.round(d3.mouse(container.node())[1]);

        this.snSelection.applySelect(snView, false);
        this.snCalcul.calculateNodes(snView);

        d3Context.dragged = false;
    }

    select(d3Context, snView: SnView, container) {
        if (!d3Context.dragged) {
            d3Context.selector = this.container.append('rect')
                .classed('selector', true)
                .attr('x', d3Context.originX)
                .attr('y', d3Context.originY)
                .attr('width', 10)
                .attr('height', 10)
                .style('opacity', '0.5')
                .style('outline', '1px solid var(--SN-COLOR-SELECTION-SHADE)')
                .style('fill', 'var(--SN-COLOR-SELECTION)');
        }
        d3Context.dragged = true;

        const x = Math.round(d3.mouse(container.node())[0]);
        const y = Math.round(d3.mouse(container.node())[1]);

        const selectorBox: SnCanvas = {
            x: Math.min(x, d3Context.originX),
            y: Math.min(y, d3Context.originY),
            width: Math.abs(x - d3Context.originX),
            height: Math.abs(y - d3Context.originY)
        };

        d3Context.selector.attr('x', selectorBox.x);
        d3Context.selector.attr('y', selectorBox.y);
        d3Context.selector.attr('height', selectorBox.height);
        d3Context.selector.attr('width', selectorBox.width);

        let refresh = false;
        for (const node of snView.nodes) {
            if (!node.displayState?.hidden) {
                const selected = this.snUtils.overlap(selectorBox, node.canvas);
                if (node.displayState.selected !== selected) {
                    node.displayState.selected = this.snUtils.overlap(selectorBox, node.canvas);
                    refresh = true;
                }
            }
        }
        if (refresh) {
            this.snAction.notifyRefresh(snView);
        }
    }

    endSelect(d3Context, snView: SnView) {
        if (!d3Context.dragged) {
             return;
        }
        this.clearSelector();
        const selections = this.snSelection.getSelections(snView);
        if (selections.length > 0) {
            this.snSelection.notifySelect(snView, selections[selections.length - 1]);
        }
    }
}
