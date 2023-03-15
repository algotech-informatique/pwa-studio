
import { SnPageWidgetDto } from '@algotech/core';
export const buttonIconPlus: SnPageWidgetDto = {
    id: '913f2faf-42fc-5127-be8b-3e30cbd634ed',
    typeKey: 'button',
    name: 'ButtonIconPlus',
    isActive: false,
    css: {
        button: {
            'background-color': 'var(--ALGOTECH-BACKGROUND)',
            'border-radius': '50px 50px 50px 50px',
            'box-shadow': 'unset',
            'border-top': '1px solid var(--ALGOTECH-PRIMARY)',
            'border-right': '1px solid var(--ALGOTECH-PRIMARY)',
            'border-bottom': '1px solid var(--ALGOTECH-PRIMARY)',
            'border-left': '1px solid var(--ALGOTECH-PRIMARY)'
        },
        text: {
            color: 'var(--ALGOTECH-PRIMARY)',
            'font-size': '35px',
            'font-style': 'normal',
            'text-decoration': 'none',
            'font-weight': 'bold',
            padding: '0px 0px 0px 0px',
            margin: '0px 0px 0px 0px'
        },
        icon: {
            color: 'var(--ALGOTECH-PRIMARY)',
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
        icon: 'fa-solid fa-plus'
    },
    box: {
        x: 0,
        y: 0,
        width: 80,
        height: 80
    },
    events: [
        {
            id: '42d64119-4e65-2dc9-7df6-a922659fbd06',
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
