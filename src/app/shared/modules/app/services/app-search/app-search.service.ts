import { SnAppDto } from '@algotech-ce/core';
import { ElementRef, Injectable } from '@angular/core';
import { SnSearchDto } from '../../../../dtos';
import { AppZoomService } from '../app-zoom/app-zoom.service';
import { PageUtilsService } from '../page-utils/page-utils.service';

@Injectable()
export class AppSearchService {

    constructor(private pageUtils: PageUtilsService, private appZoom: AppZoomService) {
    }

    applySearch(search: SnSearchDto, snApp: SnAppDto, svgElement: ElementRef) {
        this.clear(snApp);
        if (search?.elements) {
            for (const ele of search.elements) {
                const findEle = ele.type === 'widget' ?
                    this.pageUtils.findWidget(snApp, ele.elementUuid)?.widget : snApp.pages.find((p) => p.id === ele.elementUuid);
                if (findEle) {
                    findEle.displayState.search = true;
                    findEle.displayState.searchActive = ele === search.element;
                }
            }
            search.elements = null;
        }

        if (search?.element) {
            const widget = search.element.type === 'widget' ?
                this.pageUtils.findWidget(snApp, search.element.elementUuid)?.widget : null;
            const page = search.element.type === 'page' ? snApp.pages.find((p) => p.id === search.element.elementUuid) :
                widget ? this.pageUtils.findPage(snApp, widget) : null;

            this.appZoom.center(svgElement, snApp, page, widget, widget ? 0.8 : 0.4);
            search.element = null;
        }
    }

    clear(snApp: SnAppDto) {
        for (const ele of this.pageUtils.getAllElements(snApp)) {
            ele.displayState.search = false;
            ele.displayState.searchActive = false;
        }
    }
}
