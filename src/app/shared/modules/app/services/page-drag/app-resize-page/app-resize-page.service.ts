import { PageUtilsService } from '../../page-utils/page-utils.service';
import { SnAppDto, SnPageDto } from '@algotech/core';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { ResizeOrientation } from '../../page-utils/resize-orientation.enum';
import { AppActionsService } from '../../app-actions/app-actions.service';

@Injectable()
export class AppResizePageService {
    // TODO put these values somewhere else ? may be variable in function of web/mobile
    private readonly MAX_PAGE_WIDTH = 10000;
    private readonly MAX_PAGE_HEIGHT = 10000;
    private readonly APP_INFULENCE_DISTANCE = 5; // at which distance the page size will stick to the app size

    constructor(
        private pageUtils: PageUtilsService,
    ) { }

    startResizePage(d3Node: any, app: SnAppDto) {
        const current = d3.select(d3Node);
        const handler = this.pageUtils.getHandlerInfo(current.attr('id'));

        d3Node.deltaX = d3.event.x;
        d3Node.deltaY = d3.event.y;
        d3Node.page = this.pageUtils.findPageById(app, handler.pageId);
        d3Node.resized = false;
    }

    resizePage(d3Node: any, app: SnAppDto) {
        const current = d3.select(d3Node);
        const handler = this.pageUtils.getHandlerInfo(current.attr('id'));
        const page = app.pages.find((p) => p.id === handler.pageId);

        if (handler.orientation === ResizeOrientation.vertical || handler.orientation === ResizeOrientation.diagonal) {
            const newPageWidth = this.getNewDimension(
                app.pageWidth,
                d3.event.x,
                { min: app.pageWidth, max: this.MAX_PAGE_WIDTH },
                !d3.event.sourceEvent.altKey
            );
            if (newPageWidth !== page.pageWidth) {
                page.pageWidth = newPageWidth;
                d3Node.resized = true;
            }
        }
        if (handler.orientation === ResizeOrientation.horizontal || handler.orientation === ResizeOrientation.diagonal) {
            const newPageHeight = this.getNewDimension(
                app.pageHeight,
                d3.event.y,
                { min: app.pageHeight, max: this.MAX_PAGE_HEIGHT },
                !d3.event.sourceEvent.altKey
            );
            if (newPageHeight !== page.pageHeight) {
                page.pageHeight = newPageHeight;
                d3Node.resized = true;
            }
        }
    }

    endResizePage(d3Node: any, app: SnAppDto): boolean {
        if (d3Node.resized) {
            const current = d3.select(d3Node);
            const handler = this.pageUtils.getHandlerInfo(current.attr('id'));
            this.repositionWidgetsInsidePage(app.pages.find((p) => p.id === handler.pageId));
        }
        return d3Node.resized;
    }

    /**
     * Calculate the new value of a dimension given constraints and application dimensions
     *
     * @param appValue the dimension of the page's parent application
     * @param pageValue the dimension of the currently resized page
     * @param limits the minimum and maximum values the page's dimensions can be
     * @param snapToGrid if true then new dimension will stick to grid values (@See PageUtilsService.GRID_SIZE for step size)
     * @returns the new page dimension accordingly to a set of rules (limits, snapping, magnet to app dimensions..)
     */
    private getNewDimension(appValue: number, pageValue: number, limits: {min: number; max: number}, snapToGrid: boolean): number {
        let x = this.getClampedInt(pageValue, limits.min, limits.max);

        if (snapToGrid) {
            x = Math.round(x / this.pageUtils.GRID_SIZE) * this.pageUtils.GRID_SIZE;
        }

        return this.isInInfluenceArea(x, appValue) ? appValue : x;
    }

    /**
     * Determines if a given dimension is near another one
     *
     * @param pageDimension that is currently resized
     * @param appDimension is the fixed value of the page's parent application
     * @returns true if pageDimension is near enough to the pageDimension (determined by constant APP_INFULENCE_DISTANCE)
     */
    private isInInfluenceArea(pageDimension: number, appDimension: number): boolean {
        return _.inRange(
            pageDimension,
            appDimension - this.APP_INFULENCE_DISTANCE,
            appDimension + (this.APP_INFULENCE_DISTANCE + 1) // +1 because end value is not included in range
        );
    }

    /**
     * Keeps a number contained in a range and rounds it to nearest integer
     *
     * @param value to be transformed
     * @param min included minimum value
     * @param max excluded maximum value
     * @returns a number contained between two numbers and rounded it to the nearest integer
     */
    private getClampedInt(value: number, min: number, max: number): number {
        return Math.round(_.clamp(value, min, max));
    }

    /**
     * Moves widgets in page limits if they are overlapping the page's borders, like after a downsize of the page,
     * applies only to first level widgets (groups will be moved as one element and not each sub-widget individually)
     */
    private repositionWidgetsInsidePage(page: SnPageDto) {
        page.widgets.forEach((widget) => {
            if (this.pageUtils.roundXInsidePage(widget.box.x, widget.box.width, page.pageWidth).outside) {
                widget.box.x = page.pageWidth - widget.box.width;
            }
            if (this.pageUtils.roundYInsidePage(widget.box.y, widget.box.height, page.pageHeight).outside) {
                widget.box.y = page.pageHeight - widget.box.height;
            }
        });
    }
}
