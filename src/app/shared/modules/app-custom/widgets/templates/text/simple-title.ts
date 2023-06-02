
import { SnPageWidgetDto } from '@algotech-ce/core';
export const simpleTitle: SnPageWidgetDto = {
    id: '4c5fe582-b7d7-ab95-3f80-5968cdad6809',
    typeKey: 'text',
    name: 'SimpleTitle',
    isActive: false,
    css: {
        main: {
            'background-color': '#FFFFFF00',
            'border-radius': '4px 4px 4px 4px',
            'box-shadow': 'unset',
            'border-top': 'none',
            'border-right': 'none',
            'border-bottom': 'none',
            'border-left': 'none'
        },
        text: {
            color: 'var(--ALGOTECH-TERTIARY)',
            'font-size': '30px',
            'justify-content': 'flex-start',
            'text-align': 'left',
            'font-style': 'normal',
            'text-decoration': 'none',
            'font-weight': 'normal',
            padding: '0px 5px 0px 5px',
            margin: '0px 0px 0px 0px'
        },
        layout: {
            'align-items': 'center'
        }
    },
    custom: {
        text: [
            {
                lang: 'fr-FR',
                value: 'Un titre simple'
            },
            {
                lang: 'en-US',
                value: 'A simple title'
            },
            {
                lang: 'es-ES',
                value: 'Un título simple'
            }
        ],
        iterable: true,
        disabled: false,
        hidden: false,
        locked: false
    },
    box: {
        x: 0,
        y: 0,
        width: 330,
        height: 75
    },
    events: [
        {
            id: '96e74f6c-4a67-4736-cb66-0e0241a3fe43',
            eventKey: 'onClick',
            pipe: [
            ],
            custom: {
                mode: 'sequence'
            }
        }
    ],
    rules: [
    ],
    locked: false,
    lockedProperties: [],
};
