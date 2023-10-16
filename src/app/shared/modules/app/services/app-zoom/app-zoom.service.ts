import { SnAppDto, SnCanvasDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { ChangeDetectorRef, ElementRef, Injectable } from '@angular/core';
import * as d3 from 'd3';
import { PageUtilsService } from '../page-utils/page-utils.service';
import { SnTransform } from './../../../smart-nodes/dto/sn-transform';
import * as _ from 'lodash';
import { SnTransforms } from '../../../smart-nodes';
import { Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

@Injectable()
export class AppZoomService {

    transforms: SnTransforms = [];
    zoomed = new Subject();
    ref: ChangeDetectorRef;

    private _transform: SnTransform = { k: 1, x: 0, y: 0 };
    private _enable = {
        mouse: true,
        wheel: true,
    };

    constructor(private pageUtils: PageUtilsService) {
    }

    public lockZoom(type: 'mouse' | 'wheel', lock: boolean) {
        this._enable[type] = !lock;
    }

    public initialize(view: ElementRef, snApp: SnAppDto, ref: ChangeDetectorRef) {
        this.ref = ref;
        this._enable = {
            mouse: true,
            wheel: true,
        };
        // zoom
        const findTransform = this.transforms.find((t) => t.viewId === snApp.id);
        if (findTransform) {
            this._transform = findTransform.transform;
            this.zoom(this._transform);

        } else {
            this._transform = this.getTransformPage(view, snApp);
            this.transforms.push({ transform: this.transform, viewId: snApp.id });

            this.center(view, snApp);
        }

        this.zoomed.pipe(
            tap(() =>
                this.ref.detach()
            ),
            debounceTime(400)
        ).subscribe(() => {
            this.ref.detectChanges();
            this.ref.reattach();
        });
    }

    get transform() {
        return this._transform;
    }
    set transform(value) {
        this._transform.k = value.k;
        this._transform.x = value.x;
        this._transform.y = value.y;
    }

    get scaleZoom() {
        return 1 / this.transform.k;
    }

    center(view: ElementRef, app: SnAppDto, page?: SnPageDto, widget?: SnPageWidgetDto, scale?: number) {
        const k = scale ? scale : this.transform.k;
        this.zoom(Object.assign(this.getTransformPage(view, app, page, widget), { k: 1 }));
        this.buildZoom().scaleTo(d3.select('#svg'), k);
    }

    zoom(transform?: SnTransform) {

        if (transform) {
            this.transform = transform;
        }
        /*
            zoom initialize
        */
        const zoom = this.buildZoom();
        d3.select('#svg').call(zoom.transform, d3.zoomIdentity.translate(this.transform.x, this.transform.y).scale(this.transform.k));
        d3.select('#container').attr('transform', `translate(${this.transform.x}, ${this.transform.y})scale(${this.transform.k})`);
        /**/
    }

    private buildZoom() {
        const self = this;
        const zoom = d3
            .zoom()
            .scaleExtent([0.1, 10])
            .wheelDelta(() => -d3.event.deltaY * (navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? 0.05 : 0.004))
            .filter(() => {
                if (d3.event.type === 'mousedown' && d3.event.which !== 2 && !d3.event.button && !self._enable.mouse) {
                    return false;
                }
                if (d3.event.type === 'wheel' && !self._enable.wheel) {
                    return false;
                }
                if (d3.event.ctrlKey) {
                    return false;
                }
                const scrollElements = [];
                document.querySelectorAll(':hover').forEach((element: HTMLElement) => {
                    if (element.classList.contains('scrollable')) {
                        scrollElements.push(element);
                    }
                });

                if (scrollElements.length === 0) {
                    return true;
                }

                return scrollElements.every((element: HTMLElement) => {
                    if (d3.event.type !== 'wheel') {
                        return false;
                    }
                    return element.offsetHeight === element.scrollHeight;
                });
            })
            .on('zoom', () => {
                self.transform = d3.event.transform;
                self.zoomed.next(d3.event.transform);
                d3.select('#container').attr('transform', d3.event.transform);
            });

        d3.select('#svg')
            .call(zoom)
            .on('dblclick.zoom', null);

        return zoom;
    }

    private getTransformPage(view: ElementRef, app: SnAppDto, page?: SnPageDto, widget?: SnPageWidgetDto) {
        const canvas = this.pageUtils.getHTMLContainerCanvas(view);
        if (app.pages.length === 0) {
            return;
        }
        const _page = page ? page : app.pages[0];

        if (!canvas) {
            return;
        }

        const bottomPage = this.pageUtils.findPageMostOnTheBottom(app);
        const height = bottomPage.canvas.y + bottomPage.pageHeight + 50;

        const rightPage = this.pageUtils.findPageMostOnTheRight(app);
        const width = rightPage.canvas.x + rightPage.pageWidth + 50;

        let k = 1;
        if (canvas.width < width || canvas.height < height) {
            k = Math.min((canvas.width / width), (canvas.height / height));
        }

        const widgetAbs = widget ? this.pageUtils.transformAbsolute(app, widget, true) : null;
        const eleCanvas = widgetAbs ? {
            x: _page.canvas.x + widgetAbs.box.x,
            y: _page.canvas.y + widgetAbs.box.y,
            height: widgetAbs.box.height,
            width: widgetAbs.box.width,
        } : {
                ..._page.canvas,
                height: app.pageHeight,
                width: app.pageWidth,
        };

        // TODO should page dimensions be taken in account instead of app dimensions ?
        return {
            k,
            x: -eleCanvas.x + Math.round((canvas.width - eleCanvas.width) / 2),
            y: -eleCanvas.y + Math.round((canvas.height - eleCanvas.height) / 2)
        };
    }
}
