
import { SnPageWidgetDto } from '@algotech-ce/core';
export const buttonIconMore: SnPageWidgetDto = {
    id: '6fa812b3-e085-7212-b5d6-6428e371d2a0',
    typeKey: 'button',
    name: 'ButtonIconMore',
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
        icon: 'fa-solid fa-ellipsis-vertical'
    },
    box: {
        x: 0,
        y: 0,
        width: 80,
        height: 80
    },
    events: [
        {
            id: 'dfa37a6b-2edd-9cdf-e7af-1d3fc71ad51c',
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
