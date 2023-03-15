
import { SnPageWidgetDto } from '@algotech/core';
export const buttonOutlinePrimary: SnPageWidgetDto = {
    id: '9baebf6c-08ce-86b1-046c-2a1573efbe31',
    typeKey: 'button',
    name: 'ButtonOutlinePrimary',
    isActive: false,
    css: {
        button: {
            'background-color': 'var(--ALGOTECH-BACKGROUND)',
            'border-radius': '4px 4px 4px 4px',
            'box-shadow': 'unset',
            'border-top': '1px solid var(--ALGOTECH-PRIMARY)',
            'border-right': '1px solid var(--ALGOTECH-PRIMARY)',
            'border-bottom': '1px solid var(--ALGOTECH-PRIMARY)',
            'border-left': '1px solid var(--ALGOTECH-PRIMARY)'
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
            id: '107b449b-2563-581f-8894-5cce767c3853',
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
