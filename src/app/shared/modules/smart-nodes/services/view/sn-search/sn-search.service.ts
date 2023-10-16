import { SnSynoticSearchDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { SnZoomService } from '../../..';
import { SnSearchDto } from '../../../../../dtos';
import { SnView } from '../../../models';

@Injectable()
export class SnSearchService {

    constructor(private snZoom: SnZoomService) {
    }

    applySearch(search: SnSearchDto, snView: SnView): boolean {
        let beFocused = false;
        this.clear(snView);
        if (search?.elements) {
            for (const ele of search.elements) {
                const findEle = this.findEle(ele, snView);
                if (!findEle) {
                    continue;
                }
                findEle.displayState.search = true;
                if (search.element === ele) {
                    findEle.displayState.searchActive = true;
                }
            }
            search.elements = null;
        }

        if (search?.element) {

            switch (search.element.type) {
                case 'node':
                    const node = snView.nodes.find((n) => n.id === search.element.elementUuid);
                    if (node) {
                        beFocused = true;
                        this.snZoom.centerNode(node, 0.7);
                    }
                    break;
                default:
                    const element = this.findEle(search.element, snView);
                    if (element) {
                        beFocused = true;
                        this.snZoom.centerElement(element, element.canvas, 0.7);
                    }
                    break;
            }

            search.element = null;
        }

        return beFocused;
    }

    clear(snView: SnView) {
        for (const ele of [...snView.nodes, ...snView.box, ...snView.groups]) {
            ele.displayState.search = false;
            ele.displayState.searchActive = false;
        }
    }

    private findEle(element: SnSynoticSearchDto, snView: SnView) {
        switch (element.type) {
            case 'box':
                return snView.box.find((ele) => ele.id === element.elementUuid);
            case 'group':
                return snView.groups.find((ele) => ele.id === element.elementUuid);
            case 'node':
                return snView.nodes.find((n) => n.id === element.elementUuid);
            case 'comment': {
                const comment = snView.comments.find((ele) => ele.id === element.elementUuid);
                if (comment) {
                    return [...snView.box, ...snView.groups].find((ele) => ele.id === comment.parentId);
                }
            }
        }
    }
}
