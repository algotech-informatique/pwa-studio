
import { SnPageWidgetDto } from '@algotech-ce/core';
export const bigTitle: SnPageWidgetDto = {
    id: '0eb61f27-47e2-4824-9fd9-76fec91e2c5b',
    typeKey: 'text',
    name: 'BigTitle',
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
            'font-weight': 'bold',
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
                value: 'UN GROS TITRE'
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
        iterable: true,
        disabled: false,
        hidden: false,
        locked: false
    },
    box: {
        x: 0,
        y: 0,
        width: 360,
        height: 75
    },
    events: [
        {
            id: '51de51c9-f931-99db-4fcc-b6899bd7272a',
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
