import { SnAppDto, SnPageEventPipeDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { SnLinksService } from '../../../smart-nodes';
import * as d3 from 'd3';
import { SnLinkMatrice } from '../../../smart-nodes/dto/sn-link-matrice';
import { PageUtilsService } from '../page-utils/page-utils.service';
import * as _ from 'lodash';

@Injectable()
export class AppLinksService {

    // static
    constructor(private snLinks: SnLinksService, private pageUtils: PageUtilsService) { }

    drawTransitions(app: SnAppDto) {
        const container = d3.select('#container-links');
        this.snLinks.rmTransitions();
        if (!app.displayState?.linked) {
            return;
        }

        const matrices = this.getMatrices(app);

        for (const tr of matrices) {
            this.snLinks.draw(tr, 'selected', container);
        }
    }

    private getMatrices(app: SnAppDto): SnLinkMatrice[] {
        const widgets = this.pageUtils.getWidgets(app);

        return widgets.reduce((results, widget) => {

            const links: SnPageEventPipeDto[] = widget.events.reduce((actions, ev) => {
                actions.push(...ev.pipe);
                return actions;
            }, [])
            .filter((action: SnPageEventPipeDto) => action.type === 'page');

            results.push(...links.reduce((matrices: SnLinkMatrice[], link) => {
                const pageFrom = this.pageUtils.findPage(app, widget);
                const pageTo = app.pages.find((p) => p.id === link.action);

                if (pageFrom && pageTo && !matrices.some((m) => m.link.id === `${pageFrom.id}-${pageTo.id}`)) {

                    const parent = this.pageUtils.transformAbsolute(app, this.pageUtils.findParentWidget(app, widget));
                    const xWidget = pageFrom.canvas.x + widget.box.x + (parent ? parent.box.x : 0);
                    const yWidget = pageFrom.canvas.y + widget.box.y + (parent ? parent.box.y : 0);

                    const matrice = {
                        x1: xWidget + (widget.box.width / 2),
                        x2: xWidget + widget.box.width < pageTo.canvas.x + (pageTo.pageWidth / 2) ?
                        pageTo.canvas.x : pageTo.canvas.x + pageTo.pageWidth,
                        y1: yWidget + (widget.box.height / 2),
                        y2: pageTo.canvas.y + pageTo.pageHeight / 2,
                    };

                    // reverse
                    if (matrice.x1 > matrice.x2) {
                        const clone = _.cloneDeep(matrice);
                        matrice.x1 = clone.x2;
                        matrice.x2 = clone.x1;
                        matrice.y1 = clone.y2;
                        matrice.y2 = clone.y1;
                    }

                    matrices.push({
                        link: {
                            id: `${pageFrom.id}-${pageTo.id}`,
                            lineSize: 3,
                        },
                        x1: matrice.x1,
                        x2: matrice.x2,
                        y1: matrice.y1,
                        y2: matrice.y2,
                        circles: [{
                            x: matrice.x1,
                            y: matrice.y1,
                            r: 6,
                            stroke: pageFrom.css['background-color']
                        }, {
                            x: matrice.x2,
                            y: matrice.y2,
                            r: 6,
                            stroke: pageTo.css['background-color']
                        }]
                    });
                }

                return matrices;
            }, []));


            return results;

        }, []);
    }
}

