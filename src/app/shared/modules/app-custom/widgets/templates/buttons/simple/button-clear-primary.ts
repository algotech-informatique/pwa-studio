
import { SnPageWidgetDto } from '@algotech-ce/core';
export const buttonClearPrimary: SnPageWidgetDto = {
    id: '8c5fb90e-a0db-e051-3cfa-7888e700b2e4',
    typeKey: 'button',
    name: 'ButtonClearPrimary',
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
            id: '81b91cc8-83d4-5348-c039-c0c78f5b03c6',
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
