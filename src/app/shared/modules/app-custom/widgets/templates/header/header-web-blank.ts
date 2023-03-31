
import { SnPageWidgetDto } from '@algotech-ce/core';
export const headerWebBlank: SnPageWidgetDto = {
    id: 'bb944560-c6b5-5915-5819-4d8656d4b0e1',
    typeKey: 'header',
    name: 'Header',
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
        hideRevealEffect: false
    },
    afterTemplatePlaced: {
        box: [
            {
                widgetName: 'Header',
                anchors: ['left', 'right'],
            },
        ],
    },
    box: {
        x: 0,
        y: 0,
        width: 630,
        height: 60
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
