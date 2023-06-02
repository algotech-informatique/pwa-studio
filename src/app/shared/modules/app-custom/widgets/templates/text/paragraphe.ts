
import { SnPageWidgetDto } from '@algotech-ce/core';
export const paragraphe: SnPageWidgetDto = {
    id: '81933386-8de6-fc0b-1f86-f7b5db4b89f6',
    typeKey: 'text',
    name: 'Paragraphe',
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
            'font-style': 'normal',
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
                // eslint-disable-next-line max-len
                value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ultricies at mi quis tristique. Phasellus suscipit dapibus turpis, nec tincidunt ligula interdum eget. Duis a leo finibus, ornare dolor sed, vestibulum lorem. Nulla faucibus, tortor eu tempor mollis, orci nisl posuere sapien, eget ultrices augue arcu vitae augue. Sed tincidunt lacus non dolor scelerisque, vehicula luctus neque faucibus.'
            },
            {
                lang: 'es-ES',
                // eslint-disable-next-line max-len
                value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ultricies at mi quis tristique. Phasellus suscipit dapibus turpis, nec tincidunt ligula interdum eget. Duis a leo finibus, ornare dolor sed, vestibulum lorem. Nulla faucibus, tortor eu tempor mollis, orci nisl posuere sapien, eget ultrices augue arcu vitae augue. Sed tincidunt lacus non dolor scelerisque, vehicula luctus neque faucibus.'
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
            id: '47b370a9-7390-3c6e-1793-7a803c1a37aa',
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
