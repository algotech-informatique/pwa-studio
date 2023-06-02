
import { SnPageWidgetDto } from '@algotech-ce/core';
export const italicTitle: SnPageWidgetDto = {
    id: '49397307-ac92-98e7-486c-b54ef1839c5b',
    typeKey: 'text',
    name: 'ItalicTitle',
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
            'font-style': 'italic',
            'text-decoration': 'none',
            'font-weight': 'normal',
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
                value: 'Un titre en italique'
            },
            {
                lang: 'en-US',
                value: 'A tile in italics'
            },
            {
                lang: 'es-ES',
                value: 'Un título en cursiva'
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
        width: 370,
        height: 75
    },
    events: [
        {
            id: '0ecd5286-888a-d10f-dbd2-d8140ed22ace',
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
