import { Injectable, ElementRef } from '@angular/core';
import { SnCanvas, SnNode, SnConnector, SnSection } from '../../../models';
import { SnTransform } from '../../../dto';

const CLASSNAME_NODE = 'node';
const CLASSNAME_CONNECTOR = 'connector';
const CLASSNAME_SECTION = 'section';
@Injectable()
export class SnDOMService {
    constructor() {
    }

    //
    private _view: ElementRef;
    private _transform: SnTransform = { k: 1, x: 0, y: 0 };

    public initialize(view: ElementRef, transform: SnTransform) {
        this._view = view;
        this._transform = transform;
    }

    get nodeMaxHeight() {
        return this.extractNumber('--SN-NODE-CONTENT-MAX-HEIGHT');
    }

    get nodeWith() {
        return this.extractNumber('--SN-NODE-WIDTH');
    }

    get nodeHeader() {
        return this.extractNumber('--SN-NODE-HEADER-HEIGHT');
    }

    get nodePadding() {
        return this.extractNumber('--SN-NODE-CONTENT-PADDING');
    }

    get containerHeader() {
        return this.extractNumber('--SN-CONTAINER-HEADER-HEIGHT');
    }

    get containerPadding() {
        return this.extractNumber('--SN-CONTAINER-PADDING');
    }

    get containerSize() {
        return this.extractNumber('--SN-CONTAINER-SIZE');
    }

    get containerMarginBottom() {
        return this.extractNumber('--SN-CONTAINER-MARGIN-BOTTOM');
    }

    get selector() {
        return this.extractNumber('--SN-SELECTOR-SEARCH-HEIGHT') / 2 + this.extractNumber('--SN-NODE-CONTENT-PADDING');
    }

    get cmWidth() {
        return this.extractNumber('--SN-CONTEXTMENU-WIDTH');
    }

    get cmMargin() {
        return this.extractNumber('--SN-CONTEXTMENU-MARGIN');
    }

    get cmActionHeight() {
        return this.extractNumber('--SN-CONTEXTMENU-ACTION-HEIGHT');
    }

    get cmPaddingTopBottom() {
        return this.extractNumber('--SN-CONTEXTMENU-PADDING-TOP-BOTTOM');
    }

    get cmSeparatorHeight() {
        return this.extractNumber('--SN-CONTEXTMENU-SEPARATOR-HEIGHT');
    }

    get commentSpace() {
        return this.extractNumber('--SN-COMMENT-SPACE');
    }

    public getColorNode(node: SnNode) {
        const varName = this.getVarName('--SN-NODE-HEADER-BACKGROUND', node.type.toUpperCase(), true);
        const regex = /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/ig;
        if (regex.test(varName)) {
            return regex.exec(varName)[0];
        } else {
            return 'var(--SN-COLOR-WARNING)';
        }
    }

    public getVarName(defaultVarName: string, varName?: string, returnValue = false) {
        const _varName = varName ? `${defaultVarName}-${varName.replace(':', '')}` : defaultVarName;
        const value = getComputedStyle(this._view.nativeElement).getPropertyValue(_varName);

        if (returnValue) {
            return value;
        }
        return value ? _varName : defaultVarName;
    }

    public getConnectorCanvas(node: SnNode, connector: SnConnector, direction: 'in' | 'out'): SnCanvas {
        const canvasNode = !node.displayState.hidden ? this.getHTMLElementNodeCanvas(node) : null;
        const canvasParam = node.open ? this.getHTMLElementConnectorCanvas(connector) : null;
        return this.getSvgCanvas(canvasParam, canvasNode, node, direction);
    }

    public getSectionCanvas(node: SnNode, section: SnSection): SnCanvas {
        const canvasNode = !node.displayState.hidden ? this.getHTMLElementNodeCanvas(node) : null;
        const canvasParam = node.open ? this.getHTMLElementSectionCanvas(section) : null;

        return this.getSvgCanvas(canvasParam, canvasNode, node, 'in');
    }

    public getNodeCanvas(node: SnNode): SnCanvas {
        const domCanvas = this.getHTMLElementNodeCanvas(node);
        return {
            x: node.canvas.x,
            y: node.canvas.y,
            height: Math.round(domCanvas ? domCanvas.height / this._transform.k : 0),
            width: Math.round(domCanvas ? domCanvas.width / this._transform.k : 0),
        };
    }

    public getAbsolutNodeCanvas(node: SnNode): SnCanvas {
        const domCanvas = this.getHTMLElementNodeCanvas(node);
        return {
            x: domCanvas.x,
            y: domCanvas.y,
            height: Math.round(domCanvas ? domCanvas.height / this._transform.k : 0),
            width: Math.round(domCanvas ? domCanvas.width / this._transform.k : 0),
        };
    }

    public getValue(varName: string) {
        return getComputedStyle(this._view.nativeElement).getPropertyValue(varName);
    }

    public getLayoutCoordinates(mouse: number[]) {
        const x = (mouse[0] / this._transform.k) - (this._transform.x / this._transform.k);
        const y = (mouse[1] / this._transform.k) - (this._transform.y / this._transform.k);
        return { x, y };
    }

    public getRelativeTop(element: HTMLElement, node: SnNode) {
        return this.calculateRelativeY(this.getHTMLElementCanvas(element), this.getHTMLElementNodeCanvas(node), node, 0);
    }

    private calculateRelativeY(canvasElt: SnCanvas, canvasNode: SnCanvas,
        node: SnNode, eltHeight: number) {
        if (!node.open) {
            return this.nodeHeader / 2;
        } else if (!node.type) {
            return this.selector;
        } else if (canvasElt) {
            let y = null;
            y = canvasElt ? canvasElt.y : -1;
            y = Math.round(((y - canvasNode.y) / this._transform.k) + (eltHeight / 2));

            if (y < this.nodeHeader || (!node.expanded && y > this.nodeMaxHeight +
                this.nodePadding + (eltHeight / 2))) {
                return null;
            }

            return y;
        }
        return null;
    }

    private getSvgCanvas(canvasElt: SnCanvas, canvasNode: SnCanvas, node: SnNode, direction: 'in' | 'out') {

        if (!canvasNode) {
            return null;
        }

        const height = canvasElt ? Math.round(canvasElt.height / this._transform.k) : 0;
        const width = canvasElt ? Math.round(canvasElt.width / this._transform.k) : 0;

        const relativeY = this.calculateRelativeY(canvasElt, canvasNode, node, height);

        if (relativeY === null) {
            return null;
        }

        if (direction === 'out') {
            return {
                x: node.canvas.x + this.nodeWith - (node.type ? this.nodePadding : 0),
                y: node.canvas.y + relativeY,
                height,
                width
            };
        } else {
            return {
                x: node.canvas.x + (node.type ? this.nodePadding : 0),
                y: node.canvas.y + relativeY,
                height,
                width
            };
        }
    }

    public getHTMLContainerCanvas() {
        return this.getHTMLElementCanvas(this._view.nativeElement);
    }

    private getHTMLElementNodeCanvas(node: SnNode): SnCanvas {
        return this.getHTMLElementCanvas(document.querySelector(`#${CLASSNAME_NODE}-${node.id}`));
    }

    private getHTMLElementConnectorCanvas(connector: SnConnector): SnCanvas {
        return this.getHTMLElementCanvas(document.querySelector(`#${CLASSNAME_CONNECTOR}-${connector.id}`));
    }

    private getHTMLElementSectionCanvas(connector: SnConnector): SnCanvas {
        return this.getHTMLElementCanvas(document.querySelector(`#${CLASSNAME_SECTION}-${connector.id}`));
    }

    private getHTMLElementCanvas(element: Element): SnCanvas {
        if (!element) {
            return null;
        }
        const eltRect = element.getBoundingClientRect();
        return {
            x: eltRect.left,
            y: eltRect.top,
            width: eltRect.width,
            height: eltRect.height
        };
    }

    private extractNumber(varName: string) {
        if (!this._view || !this._view.nativeElement) {
            return 0;
        }
        return +getComputedStyle(this._view.nativeElement).getPropertyValue(varName).replace('px', '');
    }
}
