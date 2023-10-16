import { SnPageEventDto } from '@algotech-ce/core';
import { UUID } from 'angular2-uuid';
import { SnLang } from '../../../smart-nodes';
import * as _ from 'lodash';
import { WidgetCssSchemaInterface } from '../../models/widget-css-schema.interface';
import { WidgetTypeDto } from '../../../app/dto';

export const group: WidgetTypeDto = {
    displayName: 'APP-WIDGET-GROUP',
    isActive: true,
    minWidth: 10,
    minHeight: 10,
    typeKey: 'custom',
    icon: 'fa-solid fa-object-group',
    strictParents: [],
    display: [],
    unreloadable: true,
};

export const text: WidgetTypeDto = {
    displayName: 'APP-WIDGET-TEXT',
    isActive: false,
    minHeight: 20,
    minWidth: 20,
    defaultHeight: 20,
    defaultWidth: 100,
    typeKey: 'text',
    icon: 'fa-solid fa-font',
    display: ['mobile', 'web'],
};

export const button: WidgetTypeDto = {
    displayName: 'APP-WIDGET-BUTTON',
    isActive: false,
    minHeight: 30,
    minWidth: 30,
    defaultHeight: 50,
    defaultWidth: 100,
    typeKey: 'button',
    icon: 'fa-solid fa-hand-pointer',
    display: ['mobile', 'web'],
};

export const image: WidgetTypeDto = {
    displayName: 'APP-WIDGET-IMAGE',
    isActive: false,
    minHeight: 20,
    minWidth: 20,
    defaultHeight: 60,
    defaultWidth: 80,
    typeKey: 'image',
    icon: 'fa-solid fa-image',
    display: ['mobile', 'web'],
};

export const documents: WidgetTypeDto = {
    displayName: 'APP-WIDGET-DOCUMENTS',
    isActive: false,
    minHeight: 30,
    minWidth: 30,
    defaultHeight: 200,
    defaultWidth: 150,
    typeKey: 'document',
    icon: 'fa-solid fa-copy',
    display: ['mobile', 'web'],
};

export const gallery: WidgetTypeDto = {
    displayName: 'APP-WIDGET-GALLERY',
    isActive: false,
    minHeight: 30,
    minWidth: 30,
    defaultHeight: 200,
    defaultWidth: 150,
    typeKey: 'document',
    icon: 'fa-solid fa-copy',
    display: ['mobile', 'web'],
};

export const rectangle: WidgetTypeDto = {
    displayName: 'APP-WIDGET-RECTANGLE',
    isActive: false,
    minHeight: 5,
    minWidth: 5,
    defaultHeight: 50,
    defaultWidth: 100,
    typeKey: 'rectangle',
    icon: 'fa-solid fa-image',
    display: ['mobile', 'web'],
    unreloadable: true,
};

export const circle: WidgetTypeDto = {
    displayName: 'APP-WIDGET-CIRCLE',
    isActive: false,
    minHeight: 5,
    minWidth: 5,
    defaultHeight: 75,
    defaultWidth: 75,
    typeKey: 'circle',
    icon: 'fa-solid fa-circle',
    display: ['mobile', 'web'],
    unreloadable: true,
};

export const polyline: WidgetTypeDto = {
    displayName: 'APP-WIDGET-POLYLINE',
    isActive: false,
    minHeight: 5,
    minWidth: 5,
    defaultHeight: 50,
    defaultWidth: 50,
    typeKey: 'polyline',
    icon: 'fa-solid fa-minus',
    display: ['mobile', 'web'],
    unreloadable: true,
};

export const board: WidgetTypeDto = {
    displayName: 'APP-WIDGET-BOARD',
    isActive: false,
    minHeight: 200,
    minWidth: 200,
    defaultHeight: 200,
    defaultWidth: 200,
    typeKey: 'board',
    icon: 'fa-solid fa-chess-board',
    returnData: [
        {
            key: 'smart-object-selected',
            multiple: false,
            type: 'so:*',
            name: 'BOARD.SMART-OBJECT-SELECTED',
        }
    ],
    display: ['mobile', 'web'],
};

export const boardZone: WidgetTypeDto = {
    displayName: 'APP-WIDGET-ZONE',
    isActive: false,
    minHeight: 10,
    minWidth: 10,
    defaultHeight: 10,
    defaultWidth: 10,
    typeKey: 'zone',
    icon: 'fa-solid fa-draw-polygon',
    strictParents: ['board'],
    display: ['mobile', 'web'],
    unreloadable: true,
};

export const magnets: WidgetTypeDto = {
    displayName: 'APP-WIDGET-MAGNET',
    isActive: false,
    minHeight: 20,
    minWidth: 20,
    defaultHeight: 200,
    defaultWidth: 200,
    typeKey: 'magnet',
    icon: 'fa-solid fa-note-sticky',
    strictParents: ['board'],
    display: ['mobile', 'web'],
    unreloadable: true,
};

export const magnetProperty: WidgetTypeDto = {
    displayName: 'APP-WIDGET-MAGNET-PROPERTY',
    isActive: false,
    minHeight: 20,
    minWidth: 20,
    defaultHeight: 20,
    defaultWidth: 100,
    typeKey: 'magnetProperty',
    icon: 'fa-solid fa-font',
    strictParents: ['magnet'],
    display: ['mobile', 'web'],
    unreloadable: true,
};

export const list: WidgetTypeDto = {
    displayName: 'APP-WIDGET-LIST',
    isActive: false,
    minHeight: 30,
    minWidth: 30,
    defaultHeight: 50,
    defaultWidth: 100,
    typeKey: 'list',
    icon: 'fa-solid fa-list-ul',
    display: ['mobile', 'web'],
};

export const tabs: WidgetTypeDto = {
    displayName: 'APP-WIDGET-TABS',
    isActive: false,
    minHeight: 30,
    minWidth: 30,
    defaultHeight: 70,
    defaultWidth: 370,
    typeKey: 'tabs',
    icon: 'fa-solid fa-columns',
    display: ['mobile', 'web'],
    unreloadable: true,
};

export const header: WidgetTypeDto = {
    displayName: 'APP-WIDGET-HEADER',
    isActive: false,
    minHeight: 30,
    minWidth: 30,
    defaultHeight: 100,
    defaultWidth: 370,
    typeKey: 'header',
    icon: 'fa-solid fa-window-maximize',
    lockAxis: ['y'],
    unstrictGroup: true,
    display: ['mobile', 'web'],
    single: true,
    ungroupable: true,
    unreloadable: true,
};

export const footer: WidgetTypeDto = {
    displayName: 'APP-WIDGET-FOOTER',
    isActive: false,
    minHeight: 30,
    minWidth: 30,
    defaultHeight: 100,
    defaultWidth: 370,
    typeKey: 'footer',
    icon: 'fa-solid fa-window-maximize fa-rotate-180',
    lockAxis: ['y'],
    unstrictGroup: true,
    display: ['mobile', 'web'],
    single: true,
    ungroupable: true,
    unreloadable: true,
};

export const tab: WidgetTypeDto = {
    displayName: 'APP-WIDGET-TAB',
    isActive: false,
    minHeight: 30,
    minWidth: 30,
    defaultHeight: 70,
    defaultWidth: 120,
    typeKey: 'tab',
    icon: 'fa-solid fa-square',
    strictParents: ['tabs'],
    lockAxis: ['x', 'y'],
    display: ['mobile', 'web'],
    disabledBox: true,
};

export const tabModel: WidgetTypeDto = {
    displayName: 'APP-WIDGET-TAB-MODEL',
    isActive: false,
    minHeight: 30,
    minWidth: 30,
    typeKey: 'tabModel',
    icon: 'fa-solid fa-square',
    strictParents: ['tabs'],
    display: ['mobile', 'web'],
    disabledBox: true,
    hidden: true,
    unreloadable: true,
};

export const notification: WidgetTypeDto = {
    displayName: 'APP-WIDGET-NOTIFICATION',
    isActive: false,
    minHeight: 10,
    minWidth: 10,
    defaultHeight: 40,
    defaultWidth: 40,
    typeKey: 'notification',
    display: ['web'],
};

export const profile: WidgetTypeDto = {
    displayName: 'APP-WIDGET-PROFILE',
    isActive: false,
    minHeight: 10,
    minWidth: 10,
    defaultHeight: 40,
    defaultWidth: 40,
    typeKey: 'profile',
    icon: 'fa-solid fa-user',
    display: ['web'],
    unreloadable: true,
};

export const selector: WidgetTypeDto = {
    displayName: 'APP-WIDGET-SELECTOR',
    isActive: false,
    minHeight: 10,
    minWidth: 10,
    defaultHeight: 40,
    defaultWidth: 40,
    typeKey: 'selector',
    icon: 'fa-solid fa-th',
    display: ['web', 'mobile'],
    unreloadable: true,
};

export const table: WidgetTypeDto = {
    displayName: 'APP-WIDGET-TABLE',
    isActive: false,
    minHeight: 100,
    minWidth: 100,
    defaultHeight: 500,
    defaultWidth: 1000,
    typeKey: 'table',
    icon: 'fa-solid fa-table',
    display: ['mobile', 'web'],
    returnData: [
        {
            key: 'smart-object-selected',
            multiple: false,
            type: 'so:*',
            name: 'TABLE.SMART-OBJECT-SELECTED',
        }, {
            key: 'smart-objects-selected',
            multiple: true,
            type: 'so:*',
            name: 'TABLE.SMART-OBJECTS-SELECTED',
        }
    ],
};

export const column: WidgetTypeDto = {
    displayName: 'APP-WIDGET-COLUMN',
    isActive: false,
    minHeight: 100,
    minWidth: 100,
    defaultHeight: 500,
    defaultWidth: 200,
    typeKey: 'column',
    icon: 'fa-solid fa-columns',
    display: ['mobile', 'web'],
    strictParents: ['table'],
    disabledBox: true,
    lockAxis: ['x', 'y'],
    unreloadable: true,
};

export const allTypes: WidgetTypeDto[] = [
    group,
    text,
    button,
    image,
    documents,
    gallery,
    rectangle,
    circle,
    polyline,
    board,
    boardZone,
    magnets,
    magnetProperty,
    list,
    tabs,
    tab,
    tabModel,
    header,
    footer,
    notification,
    profile,
    selector,
    table,
    column,
];

export const generateCustom = (type: string, initLangs: (text: string) => string | SnLang[]) => {
    let custom: any;
    switch (type) {
        case 'text':
            custom = {
                text: initLangs('Insérer du texte'),
                iterable: true,
                disabled: false,
                hidden: false,
                locked: false,
            };
            break;
        case 'button':
            custom = {
                title: initLangs('Titre'),
                action: '',
                iterable: true,
                disabled: false,
                hidden: false,
                locked: false,
            };
            break;
        case 'list':
            custom = {
                iterable: false,
                disabled: false,
                hidden: false,
                paginate: {
                    limit: null,
                    mode: 'infinite',
                },
                collection: '',
                search: false,
                direction: 'column',
                scrollbar: true,
                locked: false,
            };
            break;
        case 'image':
            custom = {
                src: '',
                iterable: true,
                disabled: false,
                hidden: false,
                locked: false,
            };
            break;
        case 'rectangle':
            custom = {
                src: '',
                iterable: true,
                hidden: false,
                locked: false,
            };
            break;
        case 'circle':
            custom = {
                src: '',
                iterable: true,
                hidden: false,
                locked: false,
            };
            break;
        case 'polyline':
            custom = {
                iterable: false,
                hidden: false,
                locked: false,
            };
            break;
        case 'board':
            custom = {
                imageUuid: '',
                iterable: false,
                instance: '',
                hidden: false,
                locked: false,
            };
            break;
        case 'magnet':
            custom = {
                imageUuid: '',
                iterable: false,
                modelKey: '',
                filter: null,
                permissions: [],
                hidden: false,
                locked: false,
            };
            break;
        case 'magnetProperty': {
            custom = {
                propName: null,
                iterable: false,
                hidden: false,
                locked: false,
            };
            break;
        }
        case 'zone':
            custom = {
                key: '',
                displayName: initLangs(''),
                iterable: false,
                hidden: false,
                locked: false,
            };
            break;
        case 'document':
            custom = {
                mode: 'list',
                type: ['images', 'documents'],
                search: true,
                tagFilter: false,
                metadatas: true,
                oldVersions: {
                    active: true,
                    groups: [],
                },
                pagination: 0,
                input: null,
                hidden: false,
                locked: false,
            };
            break;
        case 'tabs': {
            custom = {
                iterable: false,
                hidden: false,
                locked: false,
                selectedTabId: null,
            };
            break;
        }
        case 'tab':
            custom = {
                tabId: null,
                disabled: false,
                icon: '',
                text: initLangs('Onglet'),
                page: '',
                pageInputs: [],
                iterable: false,
                hidden: false,
                locked: false,
            };
            break;
        case 'tabModel':
            custom = {
                selected: false,
            };
            break;
        case 'profile':
            custom = {
                action: '',
                iterable: false,
                disabled: false,
                hidden: false,
                locked: false,
                icon: 'fa-solid fa-user'
            };
            break;
        case 'selector':
            custom = {
                action: '',
                iterable: false,
                disabled: false,
                hidden: false,
                locked: false,
                icon: 'fa-solid fa-bars'
            };
            break;
        case 'notification':
            custom = {
                action: '',
                iterable: false,
                disabled: false,
                hidden: false,
                locked: false,
                icon: 'fa-solid fa-bell'
            };
            break;
        case 'footer':
            custom = {
                iterable: false,
                hidden: false,
                locked: false,
            };
            break;
        case 'header':
            custom = {
                iterable: false,
                hidden: false,
                locked: false,
                hideRevealEffect: false,
            };
            break;
        case 'table':
            custom = {
                iterable: false,
                hidden: false,
                locked: false,
                collection: '',
                collectionType: '',
                paginate: {
                    limit: null,
                    mode: 'infinite',
                },
                search: false,
                columns: [],
                sort: true,
                filter: true,
                resize: true,
                reorder: false,
                multiselection: true,
                editable: true,
            };
            break;
        case 'column':
            custom = {
                iterable: false,
                hidden: false,
                locked: false,
                propertyKey: '',
                propertyType: '',
                filter: true,
                resize: true,
                sort: true,
                display: ['text'],
                format: undefined,
                icon: '',
                overloadStyle: false,
                formatted: true,
            };
            break;
        case 'custom':
            custom = {
                iterable: true,
                hidde: false,
                locked: false,
                disabled: false,
            };
            break;
        default: {
            custom = {
                iterable: true,
                hidden: false,
                locked: false,
            };
        }
            break;
    }
    return custom;
};

export const generateCss = (type: string): WidgetCssSchemaInterface[] => {

    switch (type) {
        case 'magnetProperty':
        case 'text':
            return [{
                style: 'background',
                path: 'main.background-color',
                value: '#FFFFFF00'
            }, {
                style: 'text',
                path: 'text',
                value: {
                    color: 'var(--ALGOTECH-TERTIARY)',
                    'font-size': '12px',
                    'text-align': 'left',
                    'font-style': 'normal',
                    'text-decoration': 'none',
                    'font-weight': 'normal',
                    'justify-content': 'flex-start',
                    padding: '0px 5px 0px 5px',
                    margin: '0px 0px 0px 0px',
                },
            }, {
                style: 'radius',
                path: 'main.border-radius',
                value: '4px 4px 4px 4px'
            }, {
                style: 'shadow',
                path: 'main.box-shadow',
                value: 'unset'
            }, {
                style: 'border-top',
                path: 'main.border-top',
                value: 'none'
            }, {
                style: 'border-right',
                path: 'main.border-right',
                value: 'none'
            }, {
                style: 'border-bottom',
                path: 'main.border-bottom',
                value: 'none'
            }, {
                style: 'border-left',
                path: 'main.border-left',
                value: 'none'
            }, {
                style: 'layout',
                path: 'layout',
                value: {
                    'align-items': 'flex-start',
                }
            }];
        case 'button':
            return [{
                style: 'background',
                path: 'button.background-color',
                value: 'var(--ALGOTECH-PRIMARY)'
            }, {
                style: 'text',
                path: 'text',
                value: {
                    color: 'var(--ALGOTECH-PRIMARY-HOVER)',
                    'font-size': '15px',
                    'font-style': 'normal',
                    'text-decoration': 'none',
                    'font-weight': 'bold',
                    padding: '0px 0px 0px 0px',
                    margin: '0px 0px 0px 0px',
                },
            }, {
                style: 'radius',
                path: 'button.border-radius',
                value: '4px 4px 4px 4px'
            }, {
                style: 'shadow',
                path: 'button.box-shadow',
                value: 'unset'
            }, {
                style: 'border-top',
                path: 'button.border-top',
                value: 'none'
            }, {
                style: 'border-right',
                path: 'button.border-right',
                value: 'none'
            }, {
                style: 'border-bottom',
                path: 'button.border-bottom',
                value: 'none'
            }, {
                style: 'border-left',
                path: 'button.border-left',
                value: 'none'
            }, {
                style: 'icon',
                path: 'icon',
                value: {
                    color: 'var(--ALGOTECH-PRIMARY-HOVER)',
                    'font-size': '15px',
                    padding: '6px 6px 6px 6px',
                    margin: '0px 0px 0px 0px',
                }
            }, {
                style: 'layout',
                path: 'layout',
                value: {
                    'flex-direction': 'row',
                    'justify-content': 'center',
                    'align-items': 'center',
                }
            }];
        case 'list':
            return [{
                style: 'background',
                path: 'main.background-color',
                value: '#FFFFFF00'
            }, {
                style: 'radius',
                path: 'main.border-radius',
                value: '4px 4px 4px 4px'
            }, {
                style: 'border-top',
                path: 'main.border-top',
                value: 'none'
            }, {
                style: 'border-right',
                path: 'main.border-right',
                value: 'none'
            }, {
                style: 'border-bottom',
                path: 'main.border-bottom',
                value: 'none'
            }, {
                style: 'border-left',
                path: 'main.border-left',
                value: 'none'
            }, {
                style: 'layout',
                path: 'layout',
                value: {
                    gap: '5px',
                }
            },];
        case 'image':
            return [{
                style: 'background',
                path: 'main.background-color',
                value: '#FFFFFF00'
            }, {
                style: 'radius',
                path: 'image.border-radius',
                value: '0px 0px 0px 0px'
            }, {
                style: 'object-fit',
                path: 'image.object-fit',
                value: 'unset'
            }, {
                style: 'shadow',
                path: 'main.box-shadow',
                value: 'unset'
            }, {
                style: 'border-top',
                path: 'image.border-top',
                value: 'none'
            }, {
                style: 'border-right',
                path: 'image.border-right',
                value: 'none'
            }, {
                style: 'border-bottom',
                path: 'image.border-bottom',
                value: 'none'
            }, {
                style: 'border-left',
                path: 'image.border-left',
                value: 'none'
            }];
        case 'rectangle':
            return [{
                style: 'background',
                path: 'main.background-color',
                value: 'var(--ALGOTECH-PRIMARY)'
            }, {
                style: 'radius',
                path: 'main.border-radius',
                value: '4px 4px 4px 4px'
            }, {
                style: 'shadow',
                path: 'main.box-shadow',
                value: 'unset'
            }, {
                style: 'border-top',
                path: 'main.border-top',
                value: 'none'
            }, {
                style: 'border-right',
                path: 'main.border-right',
                value: 'none'
            }, {
                style: 'border-bottom',
                path: 'main.border-bottom',
                value: 'none'
            }, {
                style: 'border-left',
                path: 'main.border-left',
                value: 'none'
            }];
        case 'board':
        case 'zone':
            return [{
                style: 'background',
                path: 'main.background-color',
                value: '#FFFFFF00'
            }];
        case 'circle':
            return [{
                style: 'background',
                path: 'main.background-color',
                value: 'var(--ALGOTECH-PRIMARY)'
            }, {
                style: 'shadow',
                path: 'main.box-shadow',
                value: 'unset'
            }, {
                style: 'border-top',
                path: 'main.border-top',
                value: 'none'
            }, {
                style: 'border-right',
                path: 'main.border-right',
                value: 'none'
            }, {
                style: 'border-bottom',
                path: 'main.border-bottom',
                value: 'none'
            }, {
                style: 'border-left',
                path: 'main.border-left',
                value: 'none'
            }];
        case 'polyline':
            return [{
                style: 'stroke-color',
                path: 'main.stroke',
                value: 'var(--ALGOTECH-PRIMARY)'
            }, {
                style: 'stroke-width',
                path: 'main.stroke-width',
                value: '3px'
            }, {
                style: 'stroke-dasharray',
                path: 'main.stroke-dasharray',
                value: 'none'
            }, {
                style: 'stroke-linecap',
                path: 'main.stroke-linecap',
                value: 'butt'
            }];
        case 'profile':
        case 'selector':
            return [{
                style: 'background',
                path: 'main.background-color',
                value: '#FFFFFF00'
            }, {
                style: 'icon',
                path: 'icon',
                value: {
                    color: 'var(--ALGOTECH-PRIMARY)',
                    'font-size': '11px',
                    padding: '10px',
                    margin: '0px 6px',
                }
            }, {
                style: 'radius',
                path: 'main.border-radius',
                value: '4px 4px 4px 4px'
            }, {
                style: 'shadow',
                path: 'main.box-shadow',
                value: 'unset'
            }, {
                style: 'border-top',
                path: 'main.border-top',
                value: 'none'
            }, {
                style: 'border-right',
                path: 'main.border-right',
                value: 'none'
            }, {
                style: 'border-bottom',
                path: 'main.border-bottom',
                value: 'none'
            }, {
                style: 'border-left',
                path: 'main.border-left',
                value: 'none'
            }];
        case 'notification':
            return [{
                style: 'background',
                path: 'main.background-color',
                value: '#FFFFFF00'
            }, {
                style: 'icon',
                path: 'icon',
                value: {
                    color: 'var(--ALGOTECH-PRIMARY)',
                    'font-size': '11px',
                    padding: '10px',
                    margin: '0px 6px',
                }
            }, {
                style: 'radius',
                path: 'main.border-radius',
                value: '4px 4px 4px 4px'
            }, {
                style: 'shadow',
                path: 'main.box-shadow',
                value: 'unset'
            }, {
                style: 'border-top',
                path: 'main.border-top',
                value: 'none'
            }, {
                style: 'border-right',
                path: 'main.border-right',
                value: 'none'
            }, {
                style: 'border-bottom',
                path: 'main.border-bottom',
                value: 'none'
            }, {
                style: 'border-left',
                path: 'main.border-left',
                value: 'none'
            }];
        case 'custom':
            return [{
                style: 'background',
                path: 'main.background-color',
                value: '#FFFFFF00'
            }, {
                style: 'radius',
                path: 'main.border-radius',
                value: '4px 4px 4px 4px'
            }, {
                style: 'border-top',
                path: 'main.border-top',
                value: 'none'
            }, {
                style: 'border-right',
                path: 'main.border-right',
                value: 'none'
            }, {
                style: 'border-bottom',
                path: 'main.border-bottom',
                value: 'none'
            }, {
                style: 'border-left',
                path: 'main.border-left',
                value: 'none'
            }];
        case 'tabs':
            return [{
                style: 'layout',
                path: 'tabs',
                value: {
                    'flex-direction': 'row',
                    'justify-content': 'flex-start',
                    gap: '0px',
                }
            }, {
                style: 'background',
                path: 'main.background-color',
                value: '#FFFFFF00'
            }, {
                style: 'border-top',
                path: 'main.border-top',
                value: 'none'
            }, {
                style: 'border-right',
                path: 'main.border-right',
                value: 'none'
            }, {
                style: 'border-bottom',
                path: 'main.border-bottom',
                value: 'none'
            }, {
                style: 'border-left',
                path: 'main.border-left',
                value: 'none'
            }, {
                style: 'radius',
                path: 'main.border-radius',
                value: '0px 0px 0px 0px'
            }, {
                style: 'shadow',
                path: 'main.box-shadow',
                value: 'unset'
            }];
        case 'tabModel':
            return [{
                style: 'text',
                path: 'text',
                value: {
                    color: 'var(--ALGOTECH-TERTIARY)',
                    'font-size': '14px',
                    'justify-content': 'center',
                    'align-items': 'center',
                    'font-style': 'normal',
                    'text-decoration': 'none',
                    'font-weight': 'normal',
                    padding: '0px 0px 0px 0px',
                    margin: '0px 0px 0px 0px',
                },
            }, {
                style: 'background',
                path: 'main.background-color',
                value: '#FFFFFF00'
            }, {
                style: 'border-top',
                path: 'main.border-top',
                value: 'none'
            }, {
                style: 'border-right',
                path: 'main.border-right',
                value: 'none'
            }, {
                style: 'border-bottom',
                path: 'main.border-bottom',
                value: 'none'
            }, {
                style: 'border-left',
                path: 'main.border-left',
                value: 'none'
            }, {
                style: 'radius',
                path: 'main.border-radius',
                value: '0px 0px 0px 0px'
            }, {
                style: 'icon',
                path: 'icon',
                value: {
                    'flex-direction': 'row',
                    'font-size': '14px',
                    color: 'var(--ALGOTECH-TERTIARY)',
                    padding: '10px 10px 10px 10px',
                    margin: '0px 0px 0px 0px',
                }
            }, {
                style: 'layout',
                path: 'tab',
                value: {
                    'flex-direction': 'row',
                    'justify-content': 'center',
                    'align-items': 'center',
                }
            }, {
                style: 'shadow',
                path: 'main.box-shadow',
                value: 'unset'
            }];
        case 'header':
        case 'footer':
            return [{
                style: 'background',
                path: 'main.background-color',
                value: '#FFFFFF00'
            }, {
                style: 'border-top',
                path: 'main.border-top',
                value: 'none'
            }, {
                style: 'border-right',
                path: 'main.border-right',
                value: 'none'
            }, {
                style: 'border-bottom',
                path: 'main.border-bottom',
                value: 'none'
            }, {
                style: 'border-left',
                path: 'main.border-left',
                value: 'none'
            }, {
                style: 'radius',
                path: 'main.border-radius',
                value: '0px 0px 0px 0px'
            }, {
                style: 'shadow',
                path: 'main.box-shadow',
                value: 'unset'
            }];
        case 'column':
            return [{
                style: 'background',
                path: 'main.background-color',
                value: '#FFFFFF00'
            }, {
                style: 'cell',
                path: 'cell',
                value: {
                    color: 'var(--ALGOTECH-TERTIARY)',
                    'font-size': '12px',
                    'text-align': 'left',
                    'font-style': 'normal',
                    'text-decoration': 'none',
                    'font-weight': 'normal',
                    'justify-content': 'flex-start',
                },
            }, {
                style: 'border-top',
                path: 'main.border-top',
                value: 'none'
            }, {
                style: 'border-right',
                path: 'main.border-right',
                value: 'none'
            }, {
                style: 'border-bottom',
                path: 'main.border-bottom',
                value: 'none'
            }, {
                style: 'border-left',
                path: 'main.border-left',
                value: 'none'
            }];
        case 'table':
            return [{
                style: 'background',
                path: 'main.background-color',
                value: 'var(--ALGOTECH-BACKGROUND)'
            }, {
                style: 'cell',
                path: 'cell',
                value: {
                    color: 'var(--ALGOTECH-TERTIARY)',
                    'font-size': '12px',
                    'text-align': 'left',
                    'font-style': 'normal',
                    'text-decoration': 'none',
                    'font-weight': 'normal',
                    'justify-content': 'flex-start',
                },
            }, {
                style: 'radius',
                path: 'main.border-radius',
                value: '0px 0px 0px 0px'
            }, {
                style: 'border-top',
                path: 'main.border-top',
                value: 'none'
            }, {
                style: 'border-right',
                path: 'main.border-right',
                value: 'none'
            }, {
                style: 'border-bottom',
                path: 'main.border-bottom',
                value: 'none'
            }, {
                style: 'border-left',
                path: 'main.border-left',
                value: 'none'
            }, {
                style: 'column',
                path: 'column',
                value: {
                    width: '200px',
                    'border-width': '0px',
                    'border-color': 'var(--ALGOTECH-TERTIARY)',
                },
            }, {
                style: 'row',
                path: 'row',
                value: {
                    height: '40px',
                    'border-width': '0px',
                    'border-color': 'var(--ALGOTECH-TERTIARY)',
                },
            }, {
                style: 'header',
                path: 'header',
                value: {
                    color: 'var(--ALGOTECH-TERTIARY)',
                    'font-size': '12px',
                    'text-align': 'left',
                    'font-style': 'normal',
                    'text-decoration': 'none',
                    'font-weight': 'normal',
                    'justify-content': 'flex-start',
                    'background-color': 'var(--ALGOTECH-BACKGROUND)',
                    'border-bottom-width': '0px',
                    'border-bottom-color': 'var(--ALGOTECH-TERTIARY)',
                },
            }];
        default:
            return [];
    }
};

export const generateEvents = (type: string): SnPageEventDto[] => {
    const events: SnPageEventDto[] = [];
    switch (type) {
        case 'button':
        case 'image':
        case 'tab':
        case 'text': {
            events.push({
                id: UUID.UUID(),
                eventKey: 'onClick',
                pipe: [],
                custom: {
                    mode: 'sequence',
                },
            });
        }
            break;
        case 'board': {
            events.push({
                id: UUID.UUID(),
                eventKey: 'onAddMagnet',
                pipe: [],
                custom: {
                    mode: 'list',
                },
            });
            events.push({
                id: UUID.UUID(),
                eventKey: 'onActionMagnet',
                pipe: [],
                custom: {
                    mode: 'list',
                },
            });
            events.push({
                id: UUID.UUID(),
                eventKey: 'onMoveMagnet',
                pipe: [],
                custom: {
                    mode: 'list',
                }
            });
        }
            break;
        case 'magnet': {
            events.push({
                id: UUID.UUID(),
                eventKey: 'onActionMagnet',
                pipe: [],
                custom: {
                    inherit: 'board',
                    disableActions: [],
                    mode: 'list',
                },
            });
            events.push({
                id: UUID.UUID(),
                eventKey: 'onMoveMagnet',
                pipe: [],
                custom: {
                    inherit: 'board',
                    disableActions: [],
                    mode: 'list',
                }
            });
        }
            break;
        case 'document': {
            events.push({
                id: UUID.UUID(),
                eventKey: 'onActionDocument',
                pipe: [],
                custom: {
                    mode: 'list',
                },
            });
        }
            break;
        case 'table': {
            events.push({
                id: UUID.UUID(),
                eventKey: 'onRowClick',
                pipe: [],
                custom: {
                    mode: 'sequence',
                },
            });
            events.push({
                id: UUID.UUID(),
                eventKey: 'onRowDblClick',
                pipe: [],
                custom: {
                    mode: 'sequence',
                },
            });
            events.push({
                id: UUID.UUID(),
                eventKey: 'onRowSelection',
                pipe: [],
                custom: {
                    mode: 'list',
                },
            });
        }
            break;
        case 'column': {
            events.push({
                id: UUID.UUID(),
                eventKey: 'onCellClick',
                pipe: [],
                custom: {
                    mode: 'sequence',
                },
            });
            events.push({
                id: UUID.UUID(),
                eventKey: 'onCellDblClick',
                pipe: [],
                custom: {
                    mode: 'sequence',
                },
            });
        }
            break;
    }

    return events; // todo events;
};

export const getAutoInputsEvents = (type: string, eventKey: string, exclude = true) => {

    const inputs = exclude ? ['current-user'] : [];
    if (type === 'smartflow') {
        inputs.push(...['filter', 'page', 'limit', 'search-parameters']);
    }

    switch (eventKey) {
        case 'onAddMagnet': {
            inputs.push(...['magnet-zone']);
        }
            break;
        case 'onActionMagnet': {
            inputs.push(...['smart-object-selected', 'magnet-zone']);
        }
            break;
        case 'onMoveMagnet': {
            inputs.push(...['smart-object-selected', 'magnet-zone', 'old-magnet-zone']);
        }
            break;
        case 'onActionDocument': {
            inputs.push(...['smart-object-selected', 'document-selected', 'documents-selected']);
        }
            break;
        case 'onRowSelection': {
            inputs.push(...['smart-object-selected', 'smart-objects-selected']);
        }
    }

    return inputs;
};
