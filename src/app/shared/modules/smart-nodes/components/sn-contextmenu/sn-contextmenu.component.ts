import { Input, Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { SnUtilsService, SnDOMService } from '../../services';
import { SnView, SnBox, SnGroup } from '../../models';
import * as _ from 'lodash';
import { SnContextmenu, SnContextmenuAction } from '../../dto';

interface ContextMenu {
    menu: SnContextmenu;
    x: number;
    y: number;
    parentId: string;
}

@Component({
    selector: 'sn-contextmenu',
    templateUrl: './sn-contextmenu.component.html',
    styleUrls: ['./sn-contextmenu.component.scss'],
})
export class SnContextmenuComponent implements OnInit, OnDestroy {

    @Input() mouse: number[];
    @Input() container: DOMRect;
    @Input() snView: SnView;
    @Input() menu: SnContextmenu;
    @Input() position = 'absolute';
    @Output() close = new EventEmitter();

    endContainer: SnBox | SnGroup;
    xContextmenu: number;
    yContextmenu: number;
    xAction: number;
    yAction: number;
    contextMenu: ContextMenu[] = [];

    constructor (
        private snUtilsService: SnUtilsService,
        private snDOMService: SnDOMService,
    ) { }

    ngOnInit() {
        this.contextMenu.push({menu: this.menu, x: this.computeMenuX(), y: this.computeMenuY(this.menu), parentId: null});
        this.xAction = this.snDOMService.getLayoutCoordinates(this.mouse).x;
        this.yAction = this.snDOMService.getLayoutCoordinates(this.mouse).y;

        if (this.snView) {
            this.endContainer = this.snUtilsService.getEndpointContainer(this.xAction, this.yAction, this.snView);
            if (this.endContainer) {
                this.endContainer.displayState.dragHover = true;
            }
        }
    }

    playAction(action: SnContextmenuAction) {
        this.close.emit();
        if (this.endContainer) {
            this.endContainer.displayState.dragHover = false;
        }
        if (action.onClick) {
            action.onClick({ x: this.xAction, y: this.yAction });
        }
    }

    getMenuHeight(menu: SnContextmenu, parent?: boolean): number {
        const actionsHeight = _.flatten(menu.subMenus).length * this.snDOMService.cmActionHeight;
        const margin = parent ? 0 : this.snDOMService.cmMargin;
        const subMenuPadding = parent ?
            this.snDOMService.cmPaddingTopBottom * 2 * (menu.subMenus.length - 1) :
            this.snDOMService.cmPaddingTopBottom * 2 * menu.subMenus.length;
        const separators = this.snDOMService.cmSeparatorHeight * (menu.subMenus.length - 1);
        return actionsHeight + margin + subMenuPadding + separators;
    }

    showSubMenu(event: { menu: SnContextmenu, parentId: string }) {
        const alreadyShown = _.find(this.contextMenu, (cMenu: ContextMenu) => cMenu.menu.id === event.menu.id);
        if (!alreadyShown) {
            this.contextMenu.push({
                menu: event.menu,
                x: this.computeChildMenuX(),
                y: this.computeChildMenuY(event.menu, event.parentId),
                parentId: event.parentId,
            });
        }
    }

    hideMenu(action: SnContextmenuAction) {
        this.contextMenu = _.filter(this.contextMenu, (cMenu: ContextMenu) => {
            return !cMenu.parentId || cMenu.parentId === action.id || this.isChildActon(action.id) || this.isMenuAction(cMenu, action.id);
        });
    }

    isMenuAction(cMenu: ContextMenu, actionId: string): boolean {
        const menuActions: SnContextmenuAction[] = _.flatten(cMenu.menu.subMenus);
        return _.find(menuActions, { id: actionId });
    }

    isChildActon(actionId: string): boolean {
        const lastDisplayMenu: ContextMenu = this.contextMenu[this.contextMenu.length - 1];
        const actions: SnContextmenuAction[] = _.flatten(lastDisplayMenu.menu.subMenus);
        return _.find(actions, { id: actionId });
    }

    computeMenuX(): number {
        const width: number = this.snDOMService.cmWidth;
        const margin: number = this.snDOMService.cmMargin;
        const xEnd: number = (this.mouse[0] + width + margin);
        return this.container && (xEnd > this.container.width) ?
            this.mouse[0] - (xEnd - this.container.width) :
            this.mouse[0];
    }

    computeChildMenuX(): number {
        const parentDisplayMenu: ContextMenu = this.contextMenu[this.contextMenu.length - 1];
        const width: number = this.snDOMService.cmWidth;
        const parentWidth: number = parentDisplayMenu.x + width;
        const margin: number = this.snDOMService.cmMargin;
        const xEnd: number = (parentWidth + width + margin);
        return this.container && xEnd > this.container.width ?
            parentWidth - (width * 2) :
            parentWidth;
    }

    computeMenuY(menu: SnContextmenu): number {
        const height: number = this.getMenuHeight(menu);
        const yEnd: number = this.mouse[1] + height;
        return this.container && yEnd > this.container.height ?
            this.mouse[1] - (yEnd - this.container.height) :
            this.mouse[1];
    }

    computeChildMenuY(menu: SnContextmenu, parentActionId: string): number {
        const parentDisplayMenu: ContextMenu = this.contextMenu[this.contextMenu.length - 1];
        let actionIndex: number;
        const subMenuIndex: number = _.findIndex(parentDisplayMenu.menu.subMenus, (subMenu: SnContextmenuAction[]) => {
            actionIndex = _.findIndex(subMenu, (action: SnContextmenuAction) => action.id === parentActionId);
            return actionIndex > -1;
        });
        const truncatedSubMenus: SnContextmenuAction[][] = _.slice(parentDisplayMenu.menu.subMenus, 0, subMenuIndex + 1);
        truncatedSubMenus[subMenuIndex] = _.slice(truncatedSubMenus[subMenuIndex], 0, actionIndex);
        const truncatedMenu: SnContextmenu = { id: 'truncated', subMenus: truncatedSubMenus };

        const parentHeight: number = parentDisplayMenu.y + this.getMenuHeight(truncatedMenu, true);
        const height: number = this.getMenuHeight(menu);
        const yEnd: number = height + parentHeight;
        return this.container && yEnd > this.container.height ?
            parentHeight - (yEnd - this.container.height) :
            parentHeight;
    }

    ngOnDestroy() {
        if (this.endContainer) {
            this.endContainer.displayState.dragHover = false;
        }
    }
}
