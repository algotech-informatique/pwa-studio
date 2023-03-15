
import { SnPageWidgetDto } from '@algotech/core';
export const buttonIconLauncher: SnPageWidgetDto = {
    id: '952dc532-b74c-611a-e90d-4d4a011dfc2a',
    typeKey: 'button',
    name: 'ButtonIconLauncher',
    isActive: false,
    css: {
        button: {
            'background-color': 'var(--ALGOTECH-PRIMARY)',
            'border-radius': '50px 50px 50px 50px',
            'box-shadow': 'unset',
            'border-top': 'none',
            'border-right': 'none',
            'border-bottom': 'none',
            'border-left': 'none'
        },
        text: {
            color: 'var(--ALGOTECH-PRIMARY-HOVER)',
            'font-size': '35px',
            'font-style': 'normal',
            'text-decoration': 'none',
            'font-weight': 'bold',
            padding: '0px 0px 0px 0px',
            margin: '0px 0px 0px 0px'
        },
        icon: {
            color: 'var(--ALGOTECH-PRIMARY-HOVER)',
            'font-size': '35px',
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
                value: ''
            },
            {
                lang: 'en-US',
                value: ''
            },
            {
                lang: 'es-ES',
                value: ''
            }
        ],
        action: '',
        iterable: true,
        disabled: false,
        hidden: false,
        locked: false,
        icon: 'fa-solid fa-rocket'
    },
    box: {
        x: 0,
        y: 0,
        width: 80,
        height: 80
    },
    events: [
        {
            id: 'f6d5aca7-f52c-69b7-482e-3571a5c7efab',
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
