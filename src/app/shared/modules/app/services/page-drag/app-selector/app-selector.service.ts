import { SnAppDto, SnPageBoxDto, SnPageDto, SnPageWidgetDto } from '@algotech/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { AppSelectionService } from '../../app-selection/app-selection.service';
import { PageUtilsService } from '../../page-utils/page-utils.service';

@Injectable()
export class AppSelectorService {

    constructor(private appSelection: AppSelectionService, private pageUtils: PageUtilsService) { }

    get container() {
        return d3.select('#container-selector');
    }
    clearLandmark() {
        this.container.selectAll('.selector').remove();
    }

    startSelect(d3Context, app: SnAppDto, container) {
        d3Context.originX = Math.round(d3.mouse(container.node())[0]);
        d3Context.originY = Math.round(d3.mouse(container.node())[1]);

        d3Context.selection = this.pageUtils.findPageIntersect(app, {
            x: d3Context.originX,
            y: d3Context.originY,
            width: 1,
            height: 1
        }) ? 'widget' : 'page';

        d3Context.dragged = false;
    }

    select(d3Context, app: SnAppDto, container) {
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

        const selectorBox: SnPageBoxDto = {
            x: Math.min(x, d3Context.originX),
            y: Math.min(y, d3Context.originY),
            width: Math.abs(x - d3Context.originX),
            height: Math.abs(y - d3Context.originY)
        };

        d3Context.selector.attr('x', selectorBox.x);
        d3Context.selector.attr('y', selectorBox.y);
        d3Context.selector.attr('height', selectorBox.height);
        d3Context.selector.attr('width', selectorBox.width);

        d3Context.intersection = app.pages.reduce((results, page) => {

            switch (d3Context.selection) {
                case 'widget':
                    for (const w of page.widgets) {
                        if (w.custom.locked) { continue; }

                        const wBox = _.cloneDeep(w.box);
                        wBox.x += page.canvas.x;
                        wBox.y += page.canvas.y;

                        if (this.pageUtils.overlap(selectorBox, wBox)) {
                            results.push(w);
                        }
                    }
                    break;
                case 'page':
                    if (this.pageUtils.overlap(
                        selectorBox,
                        {
                            x: page.canvas.x, y: page.canvas.y, height: page.pageHeight, width: page.pageWidth
                        }
                    )) {
                        results.push(page);
                    }
                    break;
            }

            return results;
        }, []);

        this.appSelection.selectElts(app, d3Context.intersection, d3Context.selection, false);
    }

    endSelect(d3Context, app: SnAppDto) {
        if (!d3Context.dragged) {
            return;
        }
        this.appSelection.selectElts(app, d3Context.intersection, d3Context.selection, true);
        this.clearLandmark();
    }
}
