
import { SnPageWidgetDto } from '@algotech/core';
export const buttonEmail: SnPageWidgetDto = {
    id: '46207f63-09b8-9946-ab34-c8afc05b6377',
    typeKey: 'button',
    name: 'ButtonEmail',
    isActive: false,
    css: {
        button: {
            'background-color': 'var(--ALGOTECH-BACKGROUND)',
            'border-radius': '4px 4px 4px 4px',
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
                value: 'Email'
            },
            {
                lang: 'en-US',
                value: 'Email'
            },
            {
                lang: 'es-ES',
                value: 'Email'
            }
        ],
        action: '',
        iterable: true,
        disabled: false,
        hidden: false,
        locked: false,
        icon: 'fa-solid fa-envelope'
    },
    box: {
        x: 0,
        y: 0,
        width: 160,
        height: 50
    },
    events: [
        {
            id: '7f7e0dec-bd3f-54a1-85fe-9dd2fdf8d56c',
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
