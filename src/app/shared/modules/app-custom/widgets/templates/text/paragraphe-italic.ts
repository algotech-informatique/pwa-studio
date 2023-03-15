
import { SnPageWidgetDto } from '@algotech/core';
export const paragrapheItalic: SnPageWidgetDto = {
    id: '763b8116-c092-d8d1-d19f-ac002a068682',
    typeKey: 'text',
    name: 'ParagrapheItalic',
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
            'font-size': '18px',
            'justify-content': 'flex-start',
            'text-align': 'left',
            'font-style': 'italic',
            'text-decoration': 'none',
            'font-weight': 'normal',
            padding: '0px 5px 0px 5px',
            margin: '0px 0px 0px 0px'
        },
        layout: {
            'align-items': 'flex-start'
        }
    },
    custom: {
        text: [
            {
                lang: 'fr-FR',
                // eslint-disable-next-line max-len
                value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ultricies at mi quis tristique. Phasellus suscipit dapibus turpis, nec tincidunt ligula interdum eget. Duis a leo finibus, ornare dolor sed, vestibulum lorem. Nulla faucibus, tortor eu tempor mollis, orci nisl posuere sapien, eget ultrices augue arcu vitae augue. Sed tincidunt lacus non dolor scelerisque, vehicula luctus neque faucibus.'
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
        width: 300,
        height: 300
    },
    events: [
        {
            id: '83b0baa2-e5a1-0794-4679-f9691f5255e6',
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
