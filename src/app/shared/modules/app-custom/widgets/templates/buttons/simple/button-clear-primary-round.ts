
import { SnPageWidgetDto } from '@algotech-ce/core';
export const buttonClearPrimaryRound: SnPageWidgetDto = {
    id: '973f2255-15a6-8221-2f95-98b1ed1f1854',
    typeKey: 'button',
    name: 'ButtonClearPrimaryRound',
    isActive: false,
    css: {
        button: {
            'background-color': 'var(--ALGOTECH-BACKGROUND)',
            'border-radius': '50px 50px 50px 50px',
            'box-shadow': '0px 3px 8px 0px var(--ALGOTECH-BACKGROUND-SHADE)',
            'border-top': 'none',
            'border-right': 'none',
            'border-bottom': 'none',
            'border-left': 'none'
        },
        text: {
            color: 'var(--ALGOTECH-PRIMARY)',
            'font-size': '15px',
            'font-style': 'normal',
            'text-decoration': 'none',
            'font-weight': 'bold',
            padding: '0px 0px 0px 0px',
            margin: '0px 0px 0px 0px'
        },
        icon: {
            color: 'var(--ALGOTECH-PRIMARY)',
            'font-size': '15px',
            padding: '0px 0px 0px 0px',
            margin: '10px 10px 10px 10px'
        },
        layout: {
            'flex-direction': 'row',
            'justify-content': 'center',
            'align-items': 'center'
        }
    },
    custom: {
        title: [
            {
                lang: 'fr-FR',
                value: 'Click'
            },
            {
                lang: 'en-US',
                value: 'Click'
            },
            {
                lang: 'es-ES',
                value: 'Click'
            }
        ],
        action: '',
        iterable: true,
        disabled: false,
        hidden: false,
        locked: false
    },
    box: {
        x: 0,
        y: 0,
        width: 160,
        height: 50
    },
    events: [
        {
            id: 'f7ec3284-bfa1-0df0-45ee-c895d9de05b3',
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
