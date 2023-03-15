
import { SnPageWidgetDto } from '@algotech/core';
export const title: SnPageWidgetDto = {
    id: 'de7d52fe-2fb6-1f14-2f9f-70c524edd3f3',
    typeKey: 'text',
    name: 'Title',
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
                value: 'Un joli titre'
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
        width: 330,
        height: 75
    },
    events: [
        {
            id: 'ea4b8985-a76c-a778-8f90-ba9ed78b4b72',
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
