import { SnContextmenu, SnContextmenuAction } from '../../../modules/smart-nodes';
import { dumpDataBase, markAsDeletedDataBase, restoreDB } from '../../database/actions/actions';

export type click = (event?: any) => void;
export type GetContextmenuAction = (onClick: click, disabled?: boolean) => SnContextmenuAction;

type GetEnvironmentAppsContextmenu = (
    onPaste: click,
    onAddDirectory: click,
    onAddWebApp: click,
    onAddMobileApp: click,
    showPaste?: boolean,
    disablePaste?: boolean,
) => SnContextmenu;

type GetEnvironmentWorkflowsContextmenu = (
    onPasteWorkflows: click,
    onAddDirectory: click,
    onAddWorkflow: click,
    showPaste?: boolean,
    disablePaste?: boolean,
) => SnContextmenu;

type GetEnvironmentSmartobjectsContextmenu = (onAddSmartobject: click) => SnContextmenu;

type GetEnvironmentSmartflowsContextmenu = (
    onAddConnector: click,
    onPaste: click,
    showPaste?: boolean,
    disablePaste?: boolean,
) => SnContextmenu;

type GetAppsContextmenu = (
    onPaste: click,
    onAddDirectory: click,
    onAddWebApp: click,
    onAddMobileApp: click,
    removeDirectory: click,
    renameDirectory: click,
    disableRemove?: boolean,
    showPaste?: boolean,
    disablePaste?: boolean,
) => SnContextmenu;

type GetWorkflowsContextmenu = (
    onPasteWorkflows: click,
    onAddDirectory: click,
    onAddWorkflow: click,
    removeDirectory: click,
    renameDirectory: click,
    disableRemove?: boolean,
    showPaste?: boolean,
    disablePaste?: boolean,
) => SnContextmenu;

type GetSmartflowsContextmenu = (
    onPasteSmartflows: click,
    onCopyConnector: click,
    onAddFlow: click,
    removeDirectory: click,
    renameDirectory: click,
    onEditParameters: click,
    onAddFolder: click,
    disableRemove?: boolean,
    showPaste?: boolean,
    disablePaste?: boolean,
    showCopy?: boolean,
    onShowParameters?: boolean,
) => SnContextmenu;

type GetDataBaseContextmenu = (
    oonmarkAsDeleted: click,
    onDumpDataBase: click,
    onRestoreDataBase: click,
) => SnContextmenu;

const addDirectory: GetContextmenuAction = (onClick: click, disabled?: boolean) => {
    const menu: SnContextmenuAction = {
        id: 'add-directory',
        title: 'SN-CONTEXTMENU.SCHEMA.ADD-DIRECTORY',
        onClick,
        disabled,
    };
    return menu;
};

const removeDirectory: GetContextmenuAction = (onClick: click, disabled?: boolean) => {
    const menu: SnContextmenuAction = {
        id: 'remove-directory',
        title: 'SN-CONTEXTMENU.SCHEMA.REMOVE',
        onClick,
        disabled,
    };
    return menu;
};

const renameDirectory: GetContextmenuAction = (onClick: click, disabled?: boolean) => {
    const menu: SnContextmenuAction = {
        id: 'rename-directory',
        title: 'SN-CONTEXTMENU.SCHEMA.RENAME',
        onClick,
        disabled,
    };
    return menu;
};

const showParameters: GetContextmenuAction = (onClick: click, disabled?: boolean) => {
    const menu: SnContextmenuAction = {
        id: 'tree-edit-parameters',
        title: 'SN-CONTEXTMENU.SCHEMA.EDIT-PARAMETERS',
        onClick,
        disabled,
    };
    return menu;
};

const paste: GetContextmenuAction = (onClick: click, disabled?: boolean) => {
    const menu: SnContextmenuAction = {
        id: 'paste',
        title: 'SN-CONTEXTMENU.SCHEMA.PASTE',
        onClick,
        disabled,
    };
    return menu;
};

export const cmEnvironmentreports = (onAddDirectory: click, onAddWorkflow: click) => {
    const menu = {
        id: 'tree-environment-reports',
        subMenus: [
            [
                {
                    id: 'tree-add-report',
                    title: 'SN-CONTEXTMENU.SCHEMA.ADD-REPORT',
                    onClick: onAddWorkflow,
                },
                addDirectory(onAddDirectory),
            ],
        ],
    };
    return menu;
};

export const cmEnvironmentApps: GetEnvironmentAppsContextmenu = (
    onPasteApps: click,
    onAddDirectory: click,
    onAddWebApp: click,
    onAddMobileApp: click,
    showPaste?: boolean,
    disablePaste?: boolean,
) => {
    const menu: SnContextmenu = {
        id: 'tree-environment-apps',
        subMenus: [
            [
                {
                    id: 'tree-add-web-app',
                    title: 'SN-CONTEXTMENU.SCHEMA.ADD-WEB-APP',
                    onClick: onAddWebApp,
                },
                {
                    id: 'tree-add-mobile-app',
                    title: 'SN-CONTEXTMENU.SCHEMA.ADD-MOBILE-APP',
                    onClick: onAddMobileApp,
                },
                addDirectory(onAddDirectory),
            ],
        ],
    };

    if (showPaste) {
        menu.subMenus.unshift([
            paste(onPasteApps, disablePaste),
        ]);
    }

    return menu;
};

export const cmEnvironmentWorkflows: GetEnvironmentWorkflowsContextmenu = (
    onPasteWorkflows: click,
    onAddDirectory: click,
    onAddWorkflow: click,
    showPaste?: boolean,
    disablePaste?: boolean,
) => {
    const menu: SnContextmenu = {
        id: 'tree-environment-workflows',
        subMenus: [
            [
                {
                    id: 'tree-add-workflow',
                    title: 'SN-CONTEXTMENU.SCHEMA.ADD-WORKFLOW',
                    onClick: onAddWorkflow,
                },
                addDirectory(onAddDirectory),
            ],
        ],
    };

    if (showPaste) {
        menu.subMenus.unshift([
            paste(onPasteWorkflows, disablePaste),
        ]);
    }

    return menu;
};

export const cmEnvironmentSmartobjects: GetEnvironmentSmartobjectsContextmenu = (onAddDomain: click) => {
    const menu: SnContextmenu = {
        id: 'tree-environment-smartobjects',
        subMenus: [
            [
                {
                    id: 'add-domain',
                    title: 'SN-CONTEXTMENU.SCHEMA.ADD-DOMAIN',
                    onClick: onAddDomain,
                },
            ],
        ],
    };
    return menu;
};

export const cmEnvironmentSmartflows: GetEnvironmentSmartflowsContextmenu = (
    onAddConnector: click,
    onPaste: click,
    showPaste?: boolean,
    disablePaste?: boolean,
) => {
    const menu: SnContextmenu = {
        id: 'tree-environment-smartflows',
        subMenus: [
            [
                {

                    id: 'tree-add-connector',
                    title: 'SN-CONTEXTMENU.SCHEMA.ADD-CONNECTOR',
                    onClick: onAddConnector,
                }
            ],
        ],
    };
    if (showPaste) {
        menu.subMenus.unshift([
            paste(onPaste, disablePaste),
        ]);
    }
    return menu;
};

export const cmTreeExpanderReports = (
    onAddDirectory: click,
    onAddWorkflow: click,
    onRemoveDirectory: click,
    onRenameDirectory: click,
    disableRemove?: boolean,
) => {
    const menu: SnContextmenu = {
        id: 'tree-expander-reports',
        subMenus: [
            [
                {
                    id: 'tree-add-reports',
                    title: 'SN-CONTEXTMENU.SCHEMA.ADD-REPORT',
                    onClick: onAddWorkflow,
                },
                addDirectory(onAddDirectory),
            ],
            [
                renameDirectory(onRenameDirectory),
                removeDirectory(onRemoveDirectory, disableRemove),
            ]
        ],
    };
    return menu;
};

export const cmTreeExpanderWorkflows: GetWorkflowsContextmenu = (
    onPasteWorkflows: click,
    onAddDirectory: click,
    onAddWorkflow: click,
    onRemoveDirectory: click,
    onRenameDirectory: click,
    disableRemove?: boolean,
    showPaste?: boolean,
    disablePaste?: boolean,
) => {
    const menu: SnContextmenu = {
        id: 'tree-expander-workflows',
        subMenus: [
            [
                {
                    id: 'tree-add-workflow',
                    title: 'SN-CONTEXTMENU.SCHEMA.ADD-WORKFLOW',
                    onClick: onAddWorkflow,
                },
                addDirectory(onAddDirectory),
            ],
            [
                renameDirectory(onRenameDirectory),
                removeDirectory(onRemoveDirectory, disableRemove),
            ]
        ],
    };

    if (showPaste) {
        menu.subMenus.unshift([
            paste(onPasteWorkflows, disablePaste),
        ]);
    }

    return menu;
};

export const cmTreeExpanderApps: GetAppsContextmenu = (
    onPaste: click,
    onAddDirectory: click,
    onAddWebApp: click,
    onAddMobileApp: click,
    onRemoveDirectory: click,
    onRenameDirectory: click,
    disableRemove?: boolean,
    showPaste?: boolean,
    disablePaste?: boolean,
) => {
    const menu: SnContextmenu = {
        id: 'tree-expander-apps',
        subMenus: [
            [
                {
                    id: 'tree-add-app-web',
                    title: 'SN-CONTEXTMENU.SCHEMA.ADD-WEB-APP',
                    onClick: onAddWebApp,
                },
                {
                    id: 'tree-add-app-mobile',
                    title: 'SN-CONTEXTMENU.SCHEMA.ADD-MOBILE-APP',
                    onClick: onAddMobileApp,
                },
                addDirectory(onAddDirectory),
            ],
            [
                renameDirectory(onRenameDirectory),
                removeDirectory(onRemoveDirectory, disableRemove),
            ]
        ],
    };

    if (showPaste) {
        menu.subMenus.unshift([
            paste(onPaste, disablePaste),
        ]);
    }

    return menu;
};

export const cmTreeExpanderSmartflows: GetSmartflowsContextmenu = (
    onPasteSmartflows: click,
    onCopyConnector: click,
    onAddFolder: click,
    onAddFlow: click,
    onRemoveConnector: click,
    onRenameConnector: click,
    onEditParameters: click,
    disableRemove?: boolean,
    showPaste?: boolean,
    disablePaste?: boolean,
    showCopy?: boolean,
    onShowParameters?: boolean,
) => {
    const menu: SnContextmenu = {
        id: 'tree-expander-smartflows',
        subMenus: [
            [
                {
                    id: 'tree-add-flow',
                    title: 'SN-CONTEXTMENU.SCHEMA.ADD-SMARTFLOW',
                    onClick: onAddFlow,
                },
                addDirectory(onAddFolder),
            ], [
                showParameters(onEditParameters, onShowParameters),
            ], [
                renameDirectory(onRenameConnector),
                removeDirectory(onRemoveConnector, disableRemove),
            ]
        ],
    };

    const subMenuCopyPaste = [];

    if (showCopy) {
        subMenuCopyPaste.push({
            id: 'copy-connector',
            title: 'SN-CONTEXTMENU.SCHEMA.COPY',
            onClick: onCopyConnector,
        });
    }

    if (showPaste) {
        subMenuCopyPaste.push(paste(onPasteSmartflows, disablePaste));
    }

    if (subMenuCopyPaste.length > 0) {
        menu.subMenus.unshift(subMenuCopyPaste);
    }
    return menu;
};


export const cmDataBaseExplorer: GetDataBaseContextmenu = (
    onmarkAsDeleted: click,
    onDumpDataBase: click,
    onRestoreDataBase: click,) => {
    const menu: SnContextmenu = {
        id: 'database-menu',
        subMenus: [
            [
                markAsDeletedDataBase(onmarkAsDeleted),
                dumpDataBase(onDumpDataBase),
                restoreDB(onRestoreDataBase),
            ]
        ],
    };
    return menu;
};

