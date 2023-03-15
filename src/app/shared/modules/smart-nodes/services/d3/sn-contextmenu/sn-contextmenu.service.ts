import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as d3 from 'd3';
import { SnContextmenu, SnContextmenuAction, SnContextmenuActionExtension } from '../../../dto';
import { SnSelectionService, SnActionsService, SnRemoveService, SnUpDownService } from '../../view';
import { SnView, SnLang, SnBox, SnGroup, SnElement } from '../../../models';
import { SnUtilsService } from '../../utils';
import { SnSettings } from '../../../dto/sn-settings';
import { UUID } from 'angular2-uuid';
import { SnClipboardService } from '../../view/sn-clipboard/sn-clipboard.service';
import * as _ from 'lodash';

@Injectable()
export class SnContextmenuService {

    addGroup = ((snView: SnView, languages: SnLang[]) => {
        const menu: SnContextmenuAction = {
            id: 'add-group',
            icon: 'fa-solid fa-boxes-stacked',
            title: 'SN-CONTEXTMENU.SCHEMA.ADD-GROUP',
            onClick: (event) => {
                return this.snActionsService.createNewGroup(snView, { x: event.x, y: event.y }, languages);
            }
        };
        return menu;
    });

    addBox = ((snView: SnView, container: SnElement, languages: SnLang[]) => {
        const menu: SnContextmenuAction = {
            id: 'add-box',
            icon: 'fa-solid fa-box',
            title: 'SN-CONTEXTMENU.SCHEMA.ADD-BOX',
            onClick: (event) => {
                return this.snActionsService.createNewBox(snView, container, { x: event.x, y: event.y }, languages);
            }
        };
        return menu;
    });

    addNode = ((snView: SnView, container: SnElement) => {
        const menu: SnContextmenuAction = {
            id: 'add-node',
            icon: 'fa-solid fa-square',
            title: 'SN-CONTEXTMENU.SCHEMA.ADD-NODE',
            onClick: (event) => {
                return this.snActionsService.createNewNodeFromScratch(snView, container, { x: event.x, y: event.y });
            }
        };
        return menu;
    });

    paste = ((snView: SnView, disabled: boolean, container) => {
        const menu: SnContextmenuAction = {
            id: 'paste',
            title: 'SN-CONTEXTMENU.SCHEMA.PASTE',
            onClick: (event) => {
                this.snClipBoard.paste(snView, event, container);
            },
            content: 'SN-CONTEXTMENU.SCHEMA.PASTE.SHORTCUT',
            disabled
        };
        return menu;
    });

    copy = ((snView: SnView, settings: SnSettings, disabled: boolean) => {
        const menu: SnContextmenuAction = {
            id: 'copy',
            title: 'SN-CONTEXTMENU.SCHEMA.COPY',
            onClick: (event) => {
                this.snClipBoard.copy(snView, settings);
            },
            content: 'SN-CONTEXTMENU.SCHEMA.COPY.SHORTCUT',
            disabled
        };
        return menu;
    });

    remove = ((snView: SnView, settings: SnSettings, disabled: boolean) => {
        const menu: SnContextmenuAction = {
            id: 'remove',
            title: 'SN-CONTEXTMENU.SCHEMA.REMOVE',
            onClick: (event) => {
                this.snAction.remove(snView, settings);
            },
            content: 'SN-CONTEXTMENU.SCHEMA.REMOVE.SHORTCUT',
            disabled
        };
        return menu;
    });

    up = ((snView: SnView) => {
        const menu: SnContextmenuAction = {
            id: 'up',
            title: 'SN-CONTEXTMENU.SCHEMA.UP',
            onClick: (event) => {
                this.snAction.moveUpDown(snView, 'up');
            },
            content: 'SN-CONTEXTMENU.SCHEMA.UP.SHORTCUT',
        };
        return menu;
    });

    down = ((snView: SnView) => {
        const menu: SnContextmenuAction = {
            id: 'remove',
            title: 'SN-CONTEXTMENU.SCHEMA.DOWN',
            onClick: (event) => {
                this.snAction.moveUpDown(snView, 'down');
            },
            content: 'SN-CONTEXTMENU.SCHEMA.DOWN.SHORTCUT',
        };
        return menu;
    });

    expand = ((snView: SnView) => {
        const containers = this.snSelection.getSelectedContainers(snView);
        if (containers.length === 0) {
            return ;
        }
        const menu: SnContextmenuAction = {
            id: 'expand',
            title: this.snUtils.nodesExpanded(this.snUtils.getNodesByContainers(snView, containers, true)) ?
                'SN-CONTEXTMENU.SCHEMA.COLLAPSE' : 'SN-CONTEXTMENU.SCHEMA.EXPAND',
            onClick: (event) => {
                this.snAction.expandNodes(snView, containers);
            },
            content: 'SN-CONTEXTMENU.SCHEMA.EXPAND.SHORTCUT',
        };
        return menu;
    });

    constructor(
        private snActionsService: SnActionsService,
        private snRemoveService: SnRemoveService,
        private snSelection: SnSelectionService,
        private snUpDown: SnUpDownService,
        private snAction: SnActionsService,
        private snUtils: SnUtilsService,
        private snClipBoard: SnClipboardService,
    ) {
    }

    showingContextmenu: Subject<boolean> = new Subject;

    showContextmenu(show: boolean) {
        this.showingContextmenu.next(show);
    }

    contextmenu(snView: SnView, settings: SnSettings, container, onShow: (menu: SnContextmenu) => void, onClose: () => void) {

        let bySelection = true;
        let menu: SnContextmenu = null;
        const self = this;

        container.selectAll('.group')
            .on('contextmenu', function () {
                const group = self.snUtils.getContainerById(snView, d3.select(this).attr('id'));
                if (!group.open) {
                    onClose();
                    d3.event.stopPropagation();
                    return;
                }
                bySelection = false;
                menu = {
                    id: 'group-content',
                    subMenus: [
                        self.getDefaultMenu([
                            self.addBox(snView, group, settings.languages),
                            self.addNode(snView, group),
                            self.paste(snView, !self.snClipBoard.canPaste(settings, 'group'), group)
                        ], settings),
                    ]
                };
            });

        container.selectAll('.box')
            .on('contextmenu', function () {
                const box = self.snUtils.getContainerById(snView, d3.select(this).attr('id'));
                if (!box.open) {
                    onClose();
                    d3.event.stopPropagation();
                    return;
                }
                bySelection = false;
                menu = {
                    id: 'box-content',
                    subMenus: [
                        self.getDefaultMenu([
                            self.addNode(snView, box),
                            self.paste(snView, !self.snClipBoard.canPaste(settings, 'box'), box)
                        ], settings),
                    ]
                };
            });

        /*
            Selection
        */
        container.selectAll('.draggable-group')
            .on('contextmenu', function () {
                const element = self.snUtils.getContainerById(snView, d3.select(this).attr('id'));
                self.snSelection.select(d3.event, snView, { element, type: 'group', rightClickMode: true });
            });

        container.selectAll('.draggable-box')
            .on('contextmenu', function () {
                const element = self.snUtils.getContainerById(snView, d3.select(this).attr('id'));
                self.snSelection.select(d3.event, snView, { element, type: 'box', rightClickMode: true });
            });

        container.selectAll('.draggable-node')
            .on('contextmenu', function () {
                const element = snView.nodes.find((n) => n.id === d3.select(this).attr('id'));
                self.snSelection.select(d3.event, snView, { element, type: 'node', rightClickMode: true });
            });

        container
            .on('contextmenu', () => {
                if ((bySelection && d3.event.srcElement.id !== 'svg') || d3.event.ctrlKey) {
                    onShow(this.getMenuForSelection(snView, settings));
                } else {
                    this.snSelection.unselect(snView);
                    menu = menu ? menu : {
                        id: 'layout-content',
                        subMenus: [
                            this.getDefaultMenu([
                                this.addGroup(snView, settings.languages),
                                this.addBox(snView, null, settings.languages),
                                this.addNode(snView, null),
                                this.paste(snView, !this.snClipBoard.canPaste(settings), null)
                            ], settings),
                        ]
                    };
                    onShow(menu);
                }

                bySelection = true;
                menu = null;
            })
            .on('mousedown', () => {
                onClose();
            });
    }

    getMenuForSelection(snView: SnView, settings: SnSettings) {
        const menu: SnContextmenu = {
            id: 'selection',
            subMenus: [
                _.compact([
                    this.copy(snView, settings, !this.snClipBoard.canCopy(snView)),
                    this.remove(snView, settings, !this.snRemoveService.canRemove(snView)),
                    this.expand(snView),
                    this.snUpDown.canUpDown(snView, 'up') ? this.up(snView) : null,
                    this.snUpDown.canUpDown(snView, 'down') ? this.down(snView) : null,
                ])
            ]
        };

        const extensions = this.getExtendedMenus(snView, settings);
        if (extensions.length > 0) {
            menu.subMenus.push(extensions);
        }

        return menu;
    }

    getDefaultMenu(menuactions: SnContextmenuAction[], settings: SnSettings):  SnContextmenuAction[] {
        if (!settings.contextmenus.default) {
            return menuactions;
        }

        return _.compact(settings.contextmenus.default.map((menu) => {
            if (!_.isString(menu)) {
                return menu as SnContextmenuAction;
            }

            return menuactions.find((m) => m.id === menu);
        }));
    }

    getExtendedMenus(snView: SnView, settings: SnSettings) {
        const selections = this.snSelection.getSelections(snView);
        const extensions = settings.contextmenus.extended.filter((ext: SnContextmenuActionExtension) => ext.filter(selections));
        return extensions.map((ext: SnContextmenuActionExtension) => {
            const menu: SnContextmenuAction = {
                id: UUID.UUID(),
                title: ext.title,
                icon: ext.icon,
                onClick: () => {
                    ext.onClick(selections);
                },
            };
            return menu;
        });
    }
}
