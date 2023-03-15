import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { SnAppDto } from '@algotech/core';
import { SnContextmenu, SnContextmenuAction } from '../../../smart-nodes';
import { AppActionsService } from '../app-actions/app-actions.service';
import { PageUtilsService } from '../page-utils/page-utils.service';
import { AppSelectionService } from '../app-selection/app-selection.service';
import { AppClipboardService } from '../app-clipboard/app-clipboard.service';
import { AppContextmenuActionExtension, AppSettings } from '../../dto';
import { UUID } from 'angular2-uuid';

@Injectable()
export class AppContextmenuService {

    showingContextmenu: Subject<boolean> = new Subject();

    constructor(
        private appActions: AppActionsService,
        private appSelection: AppSelectionService,
        private appClipboard: AppClipboardService,
        private pageUtils: PageUtilsService) {
    }

    remove = ((snApp: SnAppDto, disabled: boolean) => {
        const menu: SnContextmenuAction = {
            id: 'remove',
            title: 'SN-CONTEXTMENU.SCHEMA.REMOVE',
            onClick: (event) => {
                this.appActions.remove(snApp);
            },
            content: 'SN-CONTEXTMENU.SCHEMA.REMOVE.SHORTCUT',
            icon: 'fa-solid fa-trash-can',
            disabled,
        };
        return menu;
    });

    group = ((snApp: SnAppDto) => {
        const menu: SnContextmenuAction = {
            id: 'group',
            title: 'SN-CONTEXTMENU.SCHEMA.GROUP',
            onClick: (event) => {
                this.appActions.group(snApp);
            },
            content: 'SN-CONTEXTMENU.SCHEMA.GROUP.SHORTCUT',
            icon: 'fa-solid fa-object-group',
        };
        return menu;
    });

    ungroup = ((snApp: SnAppDto) => {
        const menu: SnContextmenuAction = {
            id: 'ungroup',
            title: 'SN-CONTEXTMENU.SCHEMA.UNGROUP',
            onClick: (event) => {
                this.appActions.ungroup(snApp);
            },
            content: 'SN-CONTEXTMENU.SCHEMA.UNGROUP.SHORTCUT',
            icon: 'fa-solid fa-object-ungroup',
        };
        return menu;
    });

    paste = ((app: SnAppDto, disabled: boolean, pasteDeep = false) => {
        const parent = this.appClipboard.getEleIntersection(app, pasteDeep);
        const position = this.appClipboard.createPosition(app, parent);

        const menu: SnContextmenuAction = {
            id: 'paste',
            title: 'SN-CONTEXTMENU.SCHEMA.PASTE',
            onClick: () => {
                this.appClipboard.paste(app, { parent, position });
            },
            content: 'SN-CONTEXTMENU.SCHEMA.PASTE.SHORTCUT',
            icon: 'fa-solid fa-paste',
            disabled,
        };
        return menu;
    });

    copy = (() => {
        const menu: SnContextmenuAction = {
            id: 'copy',
            title: 'SN-CONTEXTMENU.SCHEMA.COPY',
            onClick: (event) => {
                this.appClipboard.copy();
            },
            content: 'SN-CONTEXTMENU.SCHEMA.COPY.SHORTCUT',
            disabled: false,
            icon: 'fa-solid fa-copy',
        };
        return menu;
    });

    copyStyle = ((disabled: boolean) => {
        const menu: SnContextmenuAction = {
            id: 'copy-style',
            title: 'SN-CONTEXTMENU.SCHEMA.COPY-STYLE',
            onClick: (event) => {
                this.appClipboard.copyStyle();
            },
            content: 'SN-CONTEXTMENU.SCHEMA.COPY-STYLE.SHORTCUT',
            disabled,
            icon: 'fa-solid fa-copy',
        };
        return menu;
    });

    pasteStyle = ((app: SnAppDto, disabled: boolean) => {
        const menu: SnContextmenuAction = {
            id: 'paste-style',
            title: 'SN-CONTEXTMENU.SCHEMA.PASTE-STYLE',
            onClick: (event) => {
                this.appClipboard.pasteStyle(app);
            },
            content: 'SN-CONTEXTMENU.SCHEMA.PASTE-STYLE.SHORTCUT',
            disabled,
            icon: 'fa-solid fa-paste',
        };
        return menu;
    });

    bringForward = ((app: SnAppDto) => {
        const menu: SnContextmenuAction = {
            id: 'bring-forward',
            title: 'SN-CONTEXTMENU.SCHEMA.BRING-FORWARD',
            onClick: (event) => {
                this.appActions.changeZIndex(app, '+');
            },
            content: 'SN-CONTEXTMENU.SCHEMA.BRING-FORWARD.SHORTCUT',
            disabled: !this.appActions.canChangeZIndex(app, '+'),
            icon: 'fa-solid fa-forward-step',
        };
        return menu;
    });

    bringToFront = ((app: SnAppDto) => {
        const menu: SnContextmenuAction = {
            id: 'bring-to-front',
            title: 'SN-CONTEXTMENU.SCHEMA.BRING-TO-FRONT',
            onClick: (event) => {
                this.appActions.changeZIndex(app, '++');
            },
            content: 'SN-CONTEXTMENU.SCHEMA.BRING-TO-FRONT.SHORTCUT',
            disabled: !this.appActions.canChangeZIndex(app, '++'),
            icon: 'fa-solid fa-forward-fast',
        };
        return menu;
    });

    sendBackward = ((app: SnAppDto) => {
        const menu: SnContextmenuAction = {
            id: 'send-backward',
            title: 'SN-CONTEXTMENU.SCHEMA.SEND-BACKWARD',
            onClick: (event) => {
                this.appActions.changeZIndex(app, '-');
            },
            content: 'SN-CONTEXTMENU.SCHEMA.SEND-BACKWARD.SHORTCUT',
            disabled: !this.appActions.canChangeZIndex(app, '-'),
            icon: 'fa-solid fa-backward-step',
        };
        return menu;
    });

    sendToBack = ((app: SnAppDto) => {
        const menu: SnContextmenuAction = {
            id: 'bring-to-front',
            title: 'SN-CONTEXTMENU.SCHEMA.SEND-TO-BACK',
            onClick: (event) => {
                this.appActions.changeZIndex(app, '--');
            },
            content: 'SN-CONTEXTMENU.SCHEMA.SEND-TO-BACK.SHORTCUT',
            disabled: !this.appActions.canChangeZIndex(app, '--'),
            icon: 'fa-solid fa-backward-fast',
        };
        return menu;
    });

    lockUnlock = ((app: SnAppDto, lock: boolean) => {
        const menu: SnContextmenuAction = {
            id: 'lock-unlock',
            title: lock ? 'SN-CONTEXTMENU.SCHEMA.LOCK' : 'SN-CONTEXTMENU.SCHEMA.UNLOCK',
            onClick: () => {
                this.appActions.lockUnlock(app, lock);
            },
            icon: lock ? 'fa-solid fa-lock' : 'fa-solid fa-lock-open',
            content: 'SN-CONTEXTMENU.SCHEMA.LOCK-UNLOCK.SHORTCUT',
        };
        return menu;
    });

    showHide = ((app: SnAppDto, hide: boolean) => {
        const menu: SnContextmenuAction = {
            id: 'show-hide',
            title: hide ? 'SN-CONTEXTMENU.SCHEMA.HIDE' : 'SN-CONTEXTMENU.SCHEMA.SHOW',
            onClick: () => {
                this.appActions.showHide(app, hide);
            },
            icon: hide ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye',
        };
        return menu;
    });

    shareComponent = ((app: SnAppDto) => {
        const menu: SnContextmenuAction = {
            id: 'share-Component',
            title: 'SN-CONTEXTMENU.SCHEMA.SHARE',
            content: 'SN-CONTEXTMENU.SCHEMA.SHARE.SHORTCUT',
            onClick: () => {
                this.appActions.shareSelected(app);
            },
            icon: 'fa-solid fa-share-alt',
        };
        return menu;
    });

    renameSharedComp = ((app: SnAppDto) => {
        const menu: SnContextmenuAction = {
            id: 'rename-shared',
            title: 'SN-CONTEXTMENU.SCHEMA.RENAME.SHARED',
            content: 'SN-CONTEXTMENU.SCHEMA.RENAME.SHARED.SHORTCUT',
            onClick: () => {
                this.appActions.notifyRenameShared(app);
            },
            icon: 'fa-solid fa-pen',
        };
        return menu;
    });

    deleteSharedComp = ((app: SnAppDto) => {
        const menu: SnContextmenuAction = {
            id: 'delete-shared',
            title: 'SN-CONTEXTMENU.SCHEMA.DELETE.SHARED',
            content: 'SN-CONTEXTMENU.SCHEMA.DELETE.SHARED.SHORTCUT',
            onClick: () => {
                this.appActions.deleteShared(app);
            },
            icon: 'fa-solid fa-trash-can',
        };
        return menu;
    });

    addSharedCompToallPage = ((app: SnAppDto) => {
        const menu: SnContextmenuAction = {
            id: 'show-hide',
            title: 'SN-CONTEXTMENU.SCHEMA.ADD.TO.ALL.PAGES',
            content: 'SN-CONTEXTMENU.SCHEMA.ADD.TO.ALL.PAGES.SHORTCUT',
            onClick: () => {
                this.appActions.addsharedtoallPages(app);
            },
            icon: 'fa-solid fa-file-circle-plus',
        };
        return menu;
    });

    updateSharedReferencesHard = ((app: SnAppDto) => {
        const menu: SnContextmenuAction = {
            id: 'show-hide',
            title: 'SN-CONTEXTMENU.SCHEMA.UPDATE.REFERENCES.HARD',
            content: 'SN-CONTEXTMENU.SCHEMA.UPDATE.REFERENCES.HARD.SHORTCUT',
            onClick: () => {
                this.appActions.hardUpdateShared(app);
            },
            icon: 'fa-solid fa-paint-roller',
        };
        return menu;
    });

    updateSharedReferencesMixed = ((app: SnAppDto) => {
        const menu: SnContextmenuAction = {
            id: 'show-hide',
            title: 'SN-CONTEXTMENU.SCHEMA.UPDATE.REFERENCES.MIXED',
            content: 'SN-CONTEXTMENU.SCHEMA.UPDATE.REFERENCES.MIXED.SHORTCUT',
            onClick: () => {
                this.appActions.mixedUpdateShared(app);
            },
            icon: 'fa-solid fa-arrows-rotate',
        };
        return menu;
    });

    showContextmenu(show: boolean) {
        this.showingContextmenu.next(show);
    }

    contextmenu(snApp: SnAppDto, container, settings: AppSettings,
        onContextMenu: () => void,
        onShow: (menu: SnContextmenu) => void,
        onClose: () => void) {

        const self = this;

        const onContextMenuForSelection = () => {
            onContextMenu();
            const menu = this.getMenuForSelection(snApp, settings);
            if (_.flatten(menu.subMenus).length > 0) {
                onShow(menu);
            }

            d3.event.stopPropagation();
        };

        /*
            selection
        */
        container.selectAll('.page, .page-selector')
            .on('contextmenu', function () {
                const findPage = snApp.pages.find((p) => p.id === d3.select(this).attr('id'));
                if (findPage) {
                    self.appSelection.select(d3.event, snApp, {
                        element: findPage, type: 'page',
                        rightClickMode: true, ignoreUnselect: true
                    });
                }

                onContextMenuForSelection();
            });

        container.selectAll('.widget, .widget-child')
            .on('contextmenu', function () {
                const findWidget = self.pageUtils.findWidget(snApp, d3.select(this).attr('id'));

                if (!findWidget) {
                    return;
                }

                const child = d3.select(this).attr('class').includes('widget-child');
                if (child && !self.appSelection.isSelected(snApp, findWidget?.widget, ['brother', 'master', 'childs'])) {

                    return;
                }

                if (child && !self.appSelection.isSelected(snApp, findWidget?.widget, ['brother'])) {
                    onContextMenuForSelection();
                    return;
                }

                self.appSelection.select(d3.event, snApp, {
                    element: findWidget.widget, type: 'widget',
                    rightClickMode: true, ignoreUnselect: true
                });
                onContextMenuForSelection();
            });

        /*
            svg
        */
        container
            .on('contextmenu', () => {
                onContextMenu();
                this.appSelection.unselect(snApp);
                onShow({
                    id: 'svg',
                    subMenus: [
                        [
                            this.paste(snApp, !this.appClipboard.canPaste(null, snApp))
                        ],
                    ]
                });
            }
            )
            .on('mousedown', () => {
                onClose();
            });
    }

    getMenuForSharedComponents(snApp: SnAppDto): SnContextmenu {
        const hasPageWithNoRef = this.appSelection.hasPageWithNoRef(snApp);
        return {
            id: 'sharedComponents',
            subMenus: [_.compact([
                hasPageWithNoRef ? this.addSharedCompToallPage(snApp) : null,
                this.updateSharedReferencesHard(snApp),
                this.updateSharedReferencesMixed(snApp),
            ]), [
                this.renameSharedComp(snApp),
                this.deleteSharedComp(snApp),
            ]
            ],
        };
    }

    getMenuForSelection(snApp: SnAppDto, settings: AppSettings) {

        if (this.appSelection.hasSelections('sharedWidget')) {
            return this.getMenuForSharedComponents(snApp);
        }
        const intersect = this.appClipboard.getEleIntersection(snApp, false);
        const intersectDeep = this.appClipboard.getEleIntersection(snApp, true);

        const disabled = !this.appClipboard.canPaste(intersect, snApp) && !this.appClipboard.canPaste(intersectDeep, snApp);
        const pasteDeep = !this.appClipboard.canPaste(intersect, snApp) && this.appClipboard.canPaste(intersectDeep, snApp);
        const hasWidgets = this.appSelection.hasSelections('widget');
        const hasOnlyMaster = this.appSelection.hasOnlyMasterWidgets(snApp);
        const hasOnlyShared = this.appSelection.hasOnlySharedWidgets(snApp);
        const hasPageWithNoRef = this.appSelection.hasPageWithNoRef(snApp);

        const sharedACtions = hasWidgets ? _.compact([
            hasOnlyMaster ? this.shareComponent(snApp) : null,
            hasOnlyShared ? this.updateSharedReferencesHard(snApp) : null,
            hasOnlyShared ? this.updateSharedReferencesMixed(snApp) : null,
            (hasOnlyShared && hasPageWithNoRef) ? this.addSharedCompToallPage(snApp) : null,
        ]) : null;

        const menu: SnContextmenu = {
            id: 'selection',
            subMenus: _.compact([
                _.compact([
                    this.appActions.canGroup() ? this.group(snApp) : null,
                    this.appActions.canUngroup() ? this.ungroup(snApp) : null,
                    this.appActions.canRemove() ? this.remove(snApp, false) : null,
                    this.appClipboard.canCopy() ? this.copy() : null,
                    intersect ? this.paste(snApp, disabled, pasteDeep) : null,
                ]),
                hasWidgets ? _.compact([
                    this.appClipboard.canCopyStyle() ? this.copyStyle(false) : this.copyStyle(true),
                    this.appClipboard.canPasteStyle(snApp) ? this.pasteStyle(snApp, false) : this.pasteStyle(snApp, true),
                ]) : null,
                hasWidgets ? [
                    this.bringForward(snApp),
                    this.bringToFront(snApp),
                    this.sendBackward(snApp),
                    this.sendToBack(snApp)
                ] : null,
                hasWidgets ? _.compact([
                    this.lockUnlock(snApp, this.appActions.lockOrUnlock()),
                    this.showHide(snApp, this.appActions.showOrHide()),
                ]) : null,
            ])
        };

        if (sharedACtions?.length > 0) {
            menu.subMenus.push(sharedACtions);
        }

        const extensions = this.getExtendedMenus(settings);
        if (extensions.length > 0) {
            menu.subMenus.unshift(extensions);
        }
        return menu;
    }

    getExtendedMenus(settings: AppSettings) {
        const extensions = settings.contextmenus.extended.filter((ext: AppContextmenuActionExtension) => ext.filter());
        return extensions.map((ext: AppContextmenuActionExtension) => {
            const menu: SnContextmenuAction = {
                id: UUID.UUID(),
                title: ext.title,
                icon: ext.icon,
                content: ext.content,
                onClick: (position) => {
                    ext.onClick(position);
                },
            };
            return menu;
        });
    }

}
