import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { SnNodeSchema } from '../../../smart-nodes/dto';
import { SnCanvas, SnNode, SnSection, SnView } from '../../../smart-nodes/models';
import { SnActionsService, SnDOMService, SnNodeMergeService, SnUtilsService } from '../../../smart-nodes/services';
import { DocUtilsService, InOut } from '../doc-utils/doc-utils.service';
import * as d3 from 'd3';
import { concat, from, Observable, of } from 'rxjs';
import { LangDto } from '@algotech/core';
import { finalize, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { DocCsvService } from '../doc-csv/doc-csv.service';
import { FilesService } from '@algotech/business';
import { RxExtendService } from '@algotech/angular';

@Injectable()
export class DocGenerateService {

    nodeWidth = 250;
    circleR = 14;
    color = '#C94940';
    defaultOffsetX = 30;
    offsetX = 0;
    offsetY = 0;

    nodesDynamicTemplates = ['SnTextFormattingNode', 'SnFormulaNode', 'SnQueryBuilderNode'];
    nodesDynamicModels = ['SnFormNode', 'SnObjectAssignmentNode'];

    constructor(
        private docUtils: DocUtilsService,
        private snMerge: SnNodeMergeService,
        private snDOM: SnDOMService,
        private snUtils: SnUtilsService,
        private snAction: SnActionsService,
        private rxExtend: RxExtendService,
        private filesService: FilesService,
        private docCsv: DocCsvService,) { }

    renderNodes(snView: SnView, languages: LangDto[]) {
        const groups = this.docUtils.buildCmps(languages);
        let x = 0;
        for (const group of groups) {
            for (const cmp of group.components) {
                const node = this._createNode(cmp.schema, { x, y: 0 });
                for (const section of node.sections) {
                    section.open = true;
                }

                snView.nodes.push(node);
                x += this.nodeWidth + 100;
            }
        }

        this.snAction.notifyUpdate(snView);
    }

    generate(snView: SnView, nodes: SnNode[], languages: LangDto[]) {
        for (const node of nodes) {
            // force open section
            if (this.nodesDynamicTemplates.includes(node.type)) {
                continue;
            }
            for (const section of node.sections) {
                section.hidden = false;
            }

            // force show property smartModel of Form|Assign
            if (this.nodesDynamicModels.includes(node.type)) {
                node.params.find((p) => p.key === 'smartModel').displayState.hidden = false;
            }
        }
        this.snAction.notifyRefresh(snView);
        const generate$ = nodes.map((n) => this.generateNode(n, languages));

        const csv = [];
        const jsZip = require('jszip');
        const aZip = new jsZip();

        concat(...generate$).pipe(
            map((element: any) => {
                csv.push(...element.matrices);

                if (element.blob) {
                    const fileName = `${element.name}__description.png`;
                    aZip.file(fileName, this.filesService._toFile([element.blob], fileName, 'image/png'));
                }

                return ;
            }),
            finalize(() => {
                this.docCsv.generateCsv(csv);
                return aZip.generateAsync({ type: 'arrayBuffer' })
                    .then((content) => {
                        const file = this.filesService._toFile(content, 'images.zip', 'application/zip');
                        this.filesService.openDocument(file, 'images.zip');
                    });
            })
        ).subscribe();
    }

    private generateNode(node: SnNode, languages: LangDto[]) {
        return new Observable((observer) => {
            const entry = this.docUtils.findEntryComponent(node, languages);
            const schema = entry?.schema;
            const inputs = this.docUtils.getInputs(schema);
            const outputs = this.docUtils.getOutputs(schema);

            const nodeEle = d3.select(`.inner-custom[id*="${node.id}"]`)
                .style('width', '400px')
                .style('height', 'inherit')
                .style('display', 'flex')
                .style('justify-content', 'center')
                .select(`.node[id*="${node.id}"]`)
                .classed('selected', false)
                .style('background', '#000')
                .style('width', `${this.nodeWidth}px`);

            nodeEle.selectAll(`.collapse>.name`)
                .style('text-overflow', 'inherit');

            let offsetFactor = -1;
            let index = 1;
            let exclude = [];
            for (const inOuts of [inputs, outputs]) {
                offsetFactor = -1;
                index = 1;
                exclude = [];

                for (const inOut of inOuts) {
                    if (this.renderCircle(inOut, node, offsetFactor, index, nodeEle)) {
                        offsetFactor = offsetFactor * -1;
                        index++;
                    } else {
                        exclude.push(inOut);
                    }
                }
                _.remove(inOuts, ((item) => exclude.indexOf(item) > -1));
                if (exclude.length > 0) {
                    console.log(node.type, exclude.map((item) => `element missed ${item.elt} ${item.key}`));
                }
            }
            const matrices = [];
            const groups = this.docUtils.buildCmps(languages);
            const group = groups.find((g) => g.components.some((c) => _.isEqual(c.schema, schema)));
            this.docCsv.pushNode(matrices, entry, languages, group?.displayName, inputs, outputs);

            const htmlToImage = require('html-to-image');
            const innerEle: HTMLElement = document.querySelector(`.inner-custom[id*="${node.id}"]`);
            // observer.next({
            //     name: null,
            //     blob: null,
            //     matrices,
            // });
            // observer.complete();
            return from(htmlToImage.toBlob(innerEle))
                .pipe(
                    tap(() => console.log(`done : ${node.type}`)),
                    map((blob: Blob) => ({
                        name: entry.displayName,
                        blob,
                        matrices,
                    })),
                ).subscribe((res) => {
                    observer.next(res);
                    observer.complete();
                });
        });
    }

    private renderCircle(inOut: InOut, node: SnNode, offsetFactor: number, index: number, nodeEle) {
        const connector = this.findConnector(inOut, node);
        if (!connector) {
            return false;
        }

        const nodeCanvas = this.snDOM.getNodeCanvas(node);
        const canvas = inOut.elt === 'section' ? this.snDOM.getSectionCanvas(node, connector as SnSection) :
            this.snDOM.getConnectorCanvas(node, connector, 'in');

        if (!canvas) {
            return false;
        }

        const x = inOut.direction === 'in' ? -this.defaultOffsetX - (this.offsetX * offsetFactor) :
            (this.nodeWidth + this.defaultOffsetX) + (this.offsetX * offsetFactor);
        const y = (canvas.y - nodeCanvas.y) + (this.offsetY * offsetFactor);
        const zone = [[x, y], [inOut.direction === 'in' ?
            canvas.x - nodeCanvas.x : nodeCanvas.x + this.nodeWidth - canvas.x, canvas.y - nodeCanvas.y]];

        const svg = nodeEle.append('svg')
            .style('position', 'absolute')
            .style('overflow', 'visible')
            .style('top', 0);
        svg
            .append('path')
            .attr('d', this.renderLine()(zone))
            .style('stroke', this.color)
            .style('stroke-width', '3px')
            .style('fill', 'transparent');

        svg
            .append('circle')
            .attr('cx', inOut.direction === 'in' ? x - this.circleR : x + this.circleR)
            .attr('cy', y)
            .attr('r', this.circleR)
            .attr('fill', 'transparent')
            .attr('stroke-width', '3px')
            .attr('stroke', this.color);

        svg
            .append('foreignObject')
            .attr('x', inOut.direction === 'in' ? x - (this.circleR * 2) : x)
            .attr('y', y - this.circleR)
            .attr('width', this.circleR * 2)
            .attr('height', this.circleR * 2)
            .style('overflow', 'visible')
            .html(() =>
                `<b style='display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; color: ${this.color}'>
                    ${index}
                </b>`
            );

        return true;
    }

    private findConnector(inOut: InOut, node: SnNode) {
        switch (inOut.elt) {
            case 'param': {
                const find = this.snUtils.getParams(null, node).find((p) => {
                    if (inOut.key) {
                        return p.key === inOut.key;
                    }
                    if (inOut.name) {
                        return p.displayName === inOut.name;
                    }
                    return false;
                });
                if (find) {
                    return find;
                }
                if (inOut.direction === 'out') {
                    const outParams = this.snUtils.getParams(null, node).filter((p) => p.direction === 'out');
                    if (inOut.index < outParams.length) {
                        return outParams[inOut.index];
                    }
                }
                return null;
            }
            case 'flow':
                return this.snUtils.getFlows(null, node).find((f) => {
                    if (inOut.key) {
                        return f.key === inOut.key;
                    }
                    if (inOut.name) {
                        return f.displayName === inOut.name;
                    }
                    return false;
                });
            case 'section':
                return node.sections.find((s) => s.key === inOut.key);
        }
    }

    private _createNode(schema: SnNodeSchema, canvas: SnCanvas) {
        const node: SnNode = {
            id: UUID.UUID(),
            type: schema.type,
            key: schema.key,
            icon: schema.icon,
            displayName: schema.displayName,
            flows: [],
            params: [],
            sections: [],
            parentId: null,
            open: true,
            canvas,
        };
        this.snMerge.mergedNode(node as SnNode, schema);
        return node;
    }

    private renderLine() {
        return d3.line()
            .x((d) => d[0])
            .y((d) => d[1]);
    }
}

