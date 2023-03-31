
import { SnPageWidgetDto } from '@algotech-ce/core';
export const footerMobileBlank: SnPageWidgetDto = {
    id: '8cb1b3ea-d9b9-4d9b-876e-4353d2c5f93d',
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
        width: 300,
        height: 82
    },
    events: [
    ],
    rules: [
    ],
    group: {
        widgets: [
        ]
    },
};
