import { SnView, SnElement, SnGroup, SnBox, SnNode } from '../../../models';
import { SnUtilsService } from '../../utils/sn-utils/sn-utils.service';
import { SnSelectionService } from '../sn-selection/sn-selection.service';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { SnActionsService } from '../sn-actions/sn-actions.service';
import { SnSettings } from '../../../dto/sn-settings';
import { from } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';

@Injectable()
export class SnClipboardService {

    clipboard: {
        key: string;
        module: string;
        groups: SnGroup[];
        box: SnBox[];
        nodes: SnNode[];
        x: number;
        y: number;
    } = {
            key: null,
            module: null,
            groups: [],
            box: [],
            nodes: [],
            x: null,
            y: null,
        };
    constructor(
        private snUtilsService: SnUtilsService,
        private snSelectionService: SnSelectionService,
        private snActionsService: SnActionsService,
        private clipboardService: Clipboard,
    ) {
        window.addEventListener('focus', () => {
            if(!navigator.clipboard?.readText) {
                return ;
            }
            from(navigator.clipboard.readText()).subscribe((text) => {
                try {
                    const object = JSON.parse(atob(text));
                    if (object?.key === 'at-smart-nodes') {
                        this.clipboard = object;
                    }
                } catch (e) {
                }
                return null;
            });
        });
    }

    canCopy(snView: SnView) {
        const selections = this.snSelectionService.getSelections(snView);
        return !!(selections && selections.length > 0 && _.some(selections, (s) => s.type === 'group' ||
            s.type === 'box' || s.type === 'node'));
    }

    canPaste(settings: SnSettings, context?) {
        // component not find
        if (settings.module !== this.clipboard.module) {
            return false;
        }

        if (this.clipboard.groups.length > 0) {
            return context !== 'group' && context !== 'box';
        }
        if (this.clipboard.box.length > 0) {
            return context !== 'box';
        }

        return this.clipboard.nodes.length > 0;
    }

    copy(snView: SnView, settings: SnSettings) {

        const snViewClone = _.cloneDeep(snView);

        this.clipboard = {
            key: 'at-smart-nodes',
            module: settings.module,
            groups: [],
            box: [],
            nodes: [],
            x: null,
            y: null
        };

        const selections = this.snSelectionService.getSelections(snViewClone);

        _.each(selections, (selection) => {

            // Find Origin
            if (selection.element.canvas) {
                if (!this.clipboard.x || this.clipboard.x > selection.element.canvas.x) {
                    this.clipboard.x = selection.element.canvas.x;
                }
                if (!this.clipboard.y || this.clipboard.y > selection.element.canvas.y) {
                    this.clipboard.y = selection.element.canvas.y;
                }
            }

            // Clone selection content
            if (selection.type === 'group') {
                this.clipboard.groups.push(_.cloneDeep(selection.element));
            }

            if (selection.type === 'box') {
                this.clipboard.box.push(_.cloneDeep(selection.element));
            }

            if (selection.type === 'node') {
                this.clipboard.nodes.push(_.cloneDeep(selection.element));
            }
        });

        // get groups
        _.each(this.clipboard.groups, (group) => {
            // get boxes associated with group
            _.each(snViewClone.box, (box) => {
                if (box.parentId === group.id) {
                    this.clipboard.box.push(box);
                }
            });

            // get nodes associated with group
            const nodes = this.snUtilsService.getNodesByContainer(snViewClone, group, true);
            this.clipboard.nodes.push(...nodes);
        });

        // get nodes associated with selected boxes
        _.each(this.clipboard.box, (box) => {
            const nodes = this.snUtilsService.getNodesByContainer(snViewClone, box, true);
            this.clipboard.nodes.push(...nodes);
        });

        this.clipboard.groups = _.uniqBy(this.clipboard.groups, 'id');
        this.clipboard.box = _.uniqBy(this.clipboard.box, 'id');
        this.clipboard.nodes = _.uniqBy(this.clipboard.nodes, 'id');

        this.clipboardService.copy(btoa(JSON.stringify(this.clipboard)));
    }

    paste(snView: SnView, event, container?: SnElement) {

        const clipBoardClone = _.cloneDeep(this.clipboard);

        this.snActionsService.changeId(clipBoardClone);

        // graphical translation elements
        const deltaX = event.x - clipBoardClone.x;
        const deltaY = event.y - clipBoardClone.y;

        const translate = (element) => {

            element.canvas.x += deltaX;
            element.canvas.y += deltaY;

            return element;
        };

        clipBoardClone.groups.map(translate);
        clipBoardClone.box.map(translate);
        clipBoardClone.nodes.map(translate);

        // attach nodes|box without parentID to the container
        const attachOrphanToContainer = (element) => {

            if (!element.parentId) {
                element.parentId = container?.id;
            }

            return element;
        };

        if (container && container.id) {
            clipBoardClone.box.map(attachOrphanToContainer);
            clipBoardClone.nodes.map(attachOrphanToContainer);
        }

        // push elements to the view
        snView.groups.push(...clipBoardClone.groups);
        snView.box.push(...clipBoardClone.box);
        snView.nodes.push(...clipBoardClone.nodes);

        this.snActionsService.notifyPaste(snView);
    }

    directCopy(snView: SnView, settings: SnSettings) {
        if (this.canCopy(snView)) {
            this.copy(snView, settings);
        }
    }

    directPaste(snView: SnView, settings: SnSettings, coords: { x: number; y: number }) {
        const container = this.snUtilsService.getEndpointContainer(coords.x, coords.y, snView);
        let context;

        if (snView.groups.indexOf(container as SnGroup) > -1) {
            context = 'group';
        } else if (snView.box.indexOf(container as SnBox) > -1) {
            context = 'box';
        } else {
            context = null;
        }

        if (!this.canPaste(settings, context)) {
            return;
        }
        this.paste(snView, coords, container);
    }
}
