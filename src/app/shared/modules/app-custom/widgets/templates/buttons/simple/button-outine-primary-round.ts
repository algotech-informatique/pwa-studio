
import { SnPageWidgetDto } from '@algotech-ce/core';
export const buttonOutinePrimaryRound: SnPageWidgetDto = {
    id: '411df2b5-e5e2-ad27-81b4-f219e6ea2b9c',
    typeKey: 'button',
    name: 'ButtonOutinePrimaryRound',
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
            id: 'ff91b906-9e7c-71b6-9ca7-f0f6e4a40014',
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
