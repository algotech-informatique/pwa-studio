import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { SnTransform, SnTransforms } from '../../../dto';
import { SnView, SnNode, SnBox, SnGroup, SnCanvas } from '../../../models';
import * as d3 from 'd3';
import { SnDOMService } from '../../utils';
import { Subject } from 'rxjs';

@Injectable()
export class SnZoomService {
    transforms: SnTransforms = [];
    private _transform: SnTransform = { k: 1, x: 0, y: 0 };
    private _enable = {
        mouse: true,
        wheel: true,
    };
    zoomed = new Subject();

    constructor(private snDOMService: SnDOMService) {
    }

    get transform() {
        return this._transform;
    }
    set transform(value) {
        this._transform.k = value.k;
        this._transform.x = value.x;
        this._transform.y = value.y;
    }

    public lockZoom(type: 'mouse' | 'wheel', lock: boolean) {
        this._enable[type] = !lock;
    }

    public initialize(snView: SnView): boolean {
        this._enable = {
            mouse: true,
            wheel: true,
        };
        // zoom
        const findTransform = this.transforms.find((t) => t.viewId === snView.id);
        let isSnViewFistShow = true;
        if (findTransform) {
            this._transform = findTransform.transform;
            isSnViewFistShow = false;
        } else {
            this._transform = { k: 1, x: 0, y: 0 };
            this.transforms.push({ transform: this.transform, viewId: snView.id });
        }
        return isSnViewFistShow;
    }

    buildZoom(enabled = true) {
        if (!enabled) {
            d3.select('#svg').on('.zoom', null);
            return;
        }

        const self = this;
        const zoom = d3
            .zoom()
            .scaleExtent([0.02, 10])
            .wheelDelta(function () {
                return -d3.event.deltaY * (navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? 0.05 : 0.004);
            })
            .filter(function () {
                if (d3.event.ctrlKey) {
                    return false;
                }
                if (d3.event.type === 'mousedown' && d3.event.which !== 2 && !d3.event.button && !self._enable.mouse) {
                    return false;
                }
                if (d3.event.type === 'wheel' && !self._enable.wheel) {
                    return false;
                }
                const scrollElements = [];
                let hasNode = false;
                document.querySelectorAll(':hover').forEach((element: HTMLElement) => {
                    if (element.classList.contains('scrollable')) {
                        scrollElements.push(element);
                    }
                    if (!hasNode) {
                        hasNode = element.classList.contains('node-content');
                    }
                });

                if (hasNode && d3.event.type !== 'wheel') {
                    return false;
                }

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
                this.zoomed.next(d3.event.transform);
                d3.select('#container').attr('transform', d3.event.transform);
            });

        d3.select('#svg')
            .call(zoom)
            .on('dblclick.zoom', null);

        return zoom;
    }

    centerNode(node: SnNode, scale?: number) {
        if (!node) {
            return;
        }

        const nodeCanvas = this.snDOMService.getNodeCanvas(node);
        this.centerElement(node, nodeCanvas, scale);
    }

    centerElement(element: SnNode | SnGroup | SnBox, eltCanvas: SnCanvas, scale?: number) {
        const canvas = this.snDOMService.getHTMLContainerCanvas();

        if (!canvas || !element.canvas) {
            return;
        }

        const height = Math.round((canvas.height - eltCanvas.height) / 2);
        const width = Math.round((canvas.width - eltCanvas.width) / 2);

        if (element) {
            const k = scale ? scale : this.transform.k;
            this.zoom({
                k: 1,
                x: -element.canvas.x + width,
                y: -element.canvas.y + height
            });

            this.buildZoom().scaleTo(d3.select('#svg'), k);
        }
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
}
