
import { SnPageWidgetDto } from '@algotech-ce/core';
export const footerWebBlank: SnPageWidgetDto = {
    id: '87b131c3-2e4a-40de-bad4-e1b3deb032f8',
    typeKey: 'footer',
    name: 'Footer',
    isActive: false,
    css: {
        main: {
            'background-color': 'var(--ALGOTECH-BACKGROUND)',
            'border-top': 'none',
            'border-right': 'none',
            'border-bottom': 'none',
            'border-left': 'none',
            'border-radius': '0px 0px 0px 0px',
            'box-shadow': 'unset'
        }
    },
    custom: {
        iterable: false,
        hidden: false,
        locked: false,
    },
    afterTemplatePlaced: {
        box: [
            {
                widgetName: 'Footer',
                anchors: ['right', 'left'],
            },
        ],
    },
    box: {
        x: 0,
        y: 0,
        width: 500,
        height: 60
    },
    events: [
    ],
    rules: [
    ],
    group: {
        widgets: []
    },
};
