import { Injectable } from '@angular/core';
import { SnLinkMatrice } from '../../../../dto/sn-link-matrice';
import { SnView, SnElement, SnCanvas, SnConnector } from '../../../../models';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { SnSettings } from '../../../../dto/sn-settings';
import { SnUtilsService, SnEntryComponentsService } from '../../../utils';

@Injectable()
export class SnDragUtilsService {

    constructor(
        private snUtils: SnUtilsService,
        private snEntryComponentsService: SnEntryComponentsService,
    ) {
    }

    getLinkMatrice(canvasOut: { x: number; y: number }, canvas: { x: number; y: number }): SnLinkMatrice {

        const linkMatrice: SnLinkMatrice = {
            x1: canvasOut.x,
            y1: canvasOut.y,
            x2: canvas.x,
            y2: canvas.y,
            link: {
                id: 'tmp',
                style: 'dash',
                lineSize: 2,
            },
            circles: []
        };
        return linkMatrice;
    }

    filterSchema(snView: SnView, connector: SnConnector, settings: SnSettings, type: 'flow' | 'param') {
        const filters = this.snEntryComponentsService.filterSnComponents(snView, connector, settings, type);

        if (filters.groups.length === 0) {
            return false;
        }

        return true;
    }

    dragSearchParent(d3Context, snView: SnView, element: SnElement | SnCanvas, type: 'node' | 'connector' | 'container') {

        // drag hover
        if (d3Context.newParent) {
            (d3Context.newParent as SnElement).displayState.dragHover = false;
        }
        d3Context.newParent = this.snUtils.getParent(element, snView, type);

        const overhead = d3Context.newParent && d3Context.parent && d3Context.newParent.id === d3Context.parent.parentId;
        if (d3.event.sourceEvent.ctrlKey) {
            if (!overhead) {
                d3Context.newParent = null;
            } else {
                (d3Context.newParent as SnElement).displayState.dragHover = true;
            }
            return;
        }

        if (!d3Context.newParent || overhead) {
            d3Context.newParent = d3Context.parent;
        }
        if (d3Context.newParent) {
            (d3Context.newParent as SnElement).displayState.dragHover = true;
        }
    }
}
