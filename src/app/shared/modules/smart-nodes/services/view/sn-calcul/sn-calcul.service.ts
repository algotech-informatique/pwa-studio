import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { SnView, SnNode, SnElement, SnCanvas, SnConnector, SnFlow, SnParam } from '../../../models';
import { SnUtilsService, SnDOMService, SnSmartConnectionsService } from '../../utils';
import { SnCustomFilterConnector } from '../../../dto';

@Injectable()
export class SnCalculService {

    constructor(
        private snUtils: SnUtilsService,
        private snDOM: SnDOMService) {
    }

    calculateConnection(snView: SnView) {
        const connectors = this.snUtils.getConnectors(snView);
        for (const connector of connectors) {
            connector.displayState.connected = connector.toward && connectors.find((c) => c.id === connector.toward) ? true : false;
            if (!connector.displayState.connected) {
                connector.displayState.connected = connectors.find((c) => c.toward === connector.id) !== undefined;
            }
        }
    }

    calculateCanvas(snView: SnView, parent: SnElement, canvas: SnCanvas) {
        const _canvas: SnCanvas = parent && this.snUtils.containerIsEmpty(snView, parent) ?
            {
                x: parent.canvas.x + this.snDOM.containerPadding,
                y: parent.canvas.y + this.snDOM.containerHeader + this.snDOM.containerPadding,
            } : canvas;
        return _canvas;
    }

    calculateHidden(snView: SnView) {
        for (const box of snView.box) {
            if (box.parentId) {
                const container = this.snUtils.getContainerById(snView, box.parentId);
                if (container) {
                    box.displayState.hidden = !container.open;
                }
            } else {
                box.displayState.hidden = false;
            }
        }
        for (const node of snView.nodes) {
            if (node.parentId) {
                const container = this.snUtils.getContainerById(snView, node.parentId);
                if (container) {
                    node.displayState.hidden = container.displayState.hidden || !container.open;
                }
            } else {
                node.displayState.hidden = false;
            }
        }
    }

    calculateNodes(snView: SnView) {
        for (const node of snView.nodes) {
            node.canvas = this.snDOM.getNodeCanvas(node);
        }
    }

    calculateContainers(snView: SnView) {
        for (const container of [
            ...snView.box,
            ...snView.groups,
        ]) {
            this._calculateContainer(snView, container);
        }
    }

    private _calculateContainer(snView: SnView, container: SnElement) {
        const nodes = this.snUtils.getNodesByContainer(snView, container);
        const boxes = this.snUtils.getBoxByContainer(snView, container);
        const matrice: { x1, x2, y1, y2 } = { x1: null, x2: null, y1: null, y2: null };

        const canvas = [
            ..._.map(nodes, (node: SnNode) => this.snDOM.getNodeCanvas(node)),
            ..._.map(boxes, (box: SnNode) => box.canvas)
        ];

        _.each(canvas, (canva: SnCanvas) => {
            const xMin = canva.x;
            const yMin = canva.y;
            const xMax = canva.x + canva.width;
            const yMax = canva.y + canva.height;

            if (!matrice.x1 || xMin < matrice.x1) {
                matrice.x1 = xMin;
            }
            if (!matrice.y1 || yMin < matrice.y1) {
                matrice.y1 = yMin;
            }
            if (!matrice.x2 || xMax > matrice.x2) {
                matrice.x2 = xMax;
            }
            if (!matrice.y2 || yMax > matrice.y2) {
                matrice.y2 = yMax;
            }
        });

        if (container.open) {
            if (matrice.x1) {
                const addingWidth = canvas.length < 2 ? (this.snDOM.containerSize / 2) : this.snDOM.containerMarginBottom;
                const addingHeight = canvas.length === 0 ? (this.snDOM.containerSize / 2) : this.snDOM.containerMarginBottom;

                container.canvas.x = matrice.x1 - this.snDOM.containerPadding;
                container.canvas.y = matrice.y1 - this.snDOM.containerHeader - this.snDOM.containerPadding;
                container.canvas.width = matrice.x2 - matrice.x1 + (this.snDOM.containerPadding * 2) + addingWidth;
                container.canvas.height = matrice.y2 - matrice.y1 + this.snDOM.containerHeader +
                    (this.snDOM.containerPadding * 2) + addingHeight;
            } else {
                container.canvas.width = this.snDOM.containerSize;
                container.canvas.height = this.snDOM.containerSize;
            }
        } else {
            container.canvas.width = this.snDOM.containerSize;
            container.canvas.height = this.snDOM.containerSize;
        }

        snView.comments.map((comment) => {
            if (comment.parentId === container.id) {
                comment.canvas.x = container.canvas.x + this.snDOM.commentSpace;
                comment.canvas.y = container.canvas.y - this.snDOM.commentSpace;
            }
        });
    }
}
