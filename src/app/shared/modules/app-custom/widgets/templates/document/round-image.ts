
import { SnPageWidgetDto } from '@algotech/core';
export const roundImage: SnPageWidgetDto = {
    id: '98531a13-83cb-4b36-38b8-8b8f67ee5021',
    typeKey: 'image',
    name: 'RoundImage',
    isActive: false,
    css: {
        main: {
            'background-color': 'var(--ALGOTECH-BACKGROUND)',
            'box-shadow': 'unset'
        },
        image: {
            'border-radius': '150px 150px 150px 150px',
            'object-fit': 'unset',
            'border-top': 'none',
            'border-right': 'none',
            'border-bottom': 'none',
            'border-left': 'none'
        }
    },
    custom: {
        src: '',
        iterable: true,
        disabled: false,
        hidden: false,
        locked: false,
        typeSrc: 'file',
        imageUuid: ''
    },
    box: {
        x: 0,
        y: 0,
        width: 300,
        height: 300
    },
    events: [
        {
            id: '0ecab168-7277-045d-8e2d-2ad01ec57328',
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
