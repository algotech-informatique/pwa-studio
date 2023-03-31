
import { SnPageWidgetDto } from '@algotech-ce/core';
export const buttonPlay: SnPageWidgetDto = {
    id: '2b882186-7563-6585-076c-96fa24cd8084',
    typeKey: 'button',
    name: 'ButtonPlay',
    isActive: false,
    css: {
        button: {
            'background-color': 'var(--ALGOTECH-PRIMARY)',
            'border-radius': '4px 4px 4px 4px',
            'box-shadow': 'unset',
            'border-top': 'none',
            'border-right': 'none',
            'border-bottom': 'none',
            'border-left': 'none'
        },
        text: {
            color: 'var(--ALGOTECH-PRIMARY-HOVER)',
            'font-size': '15px',
            'font-style': 'normal',
            'text-decoration': 'none',
            'font-weight': 'bold',
            padding: '0px 0px 0px 0px',
            margin: '0px 0px 0px 0px'
        },
        icon: {
            color: 'var(--ALGOTECH-PRIMARY-HOVER)',
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
                value: 'Play'
            },
            {
                lang: 'en-US',
                value: 'Play'
            },
            {
                lang: 'es-ES',
                value: 'Play'
            }
        ],
        action: '',
        iterable: true,
        disabled: false,
        hidden: false,
        locked: false,
        icon: 'fa-solid fa-play'
    },
    box: {
        x: 0,
        y: 0,
        width: 160,
        height: 50
    },
    events: [
        {
            id: '55360bb9-2887-0524-586b-5de3a39364e2',
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
