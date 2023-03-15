import { SnAppDto } from '@algotech/core';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { AppLinksService } from '../../app-links/app-links.service';
import { AppSelectionService } from '../../app-selection/app-selection.service';
import { PageUtilsService } from '../../page-utils/page-utils.service';

@Injectable()
export class AppDragPageService {

    constructor(private pageSelections: AppSelectionService, private pageUtils: PageUtilsService,
            private appLinks: AppLinksService) { }

    startDragPage(d3Context, app: SnAppDto, container) {
        const current = d3.select(d3Context);

        d3Context.page = app.pages.find((p) => p.id === current.attr('id'));

        d3Context.deltaX = d3Context.page.canvas.x - d3.mouse(container.node())[0];
        d3Context.deltaY = d3Context.page.canvas.y - d3.mouse(container.node())[1];

        d3Context.dragged = false;
    }

    dragPage(d3Context, app: SnAppDto, container) {
        // initialize selections and context
        if (!d3Context.dragged) {
            this.pageSelections.select(d3.event, app, { element: d3Context.page, type: 'page', ignoreUnselect: true });

            // bring to front
            for (const page of this.pageSelections.selections.pages) {
                page.displayState.draghover = true;
                app.pages.splice(app.pages.indexOf(page), 1);
                app.pages.push(page);
            }
        }
        d3Context.dragged = true;

        const deltaX = this.pageUtils.round(d3Context.page.canvas.x - (d3.mouse(container.node())[0] + d3Context.deltaX), true);
        const deltaY = this.pageUtils.round(d3Context.page.canvas.y - (d3.mouse(container.node())[1] + d3Context.deltaY), true);

        for (const page of this.pageSelections.selections.pages) {
            page.canvas.x -= deltaX;
            page.canvas.y -= deltaY;
        }

        this.appLinks.drawTransitions(app);
    }

    endDragPage(d3Context, app: SnAppDto) {
        this.resetDraghover(app);
        return d3Context.dragged;
    }

    resetDraghover(app: SnAppDto) {
        for (const page of app.pages) {
            page.displayState.draghover = false;
        }
    }
}
