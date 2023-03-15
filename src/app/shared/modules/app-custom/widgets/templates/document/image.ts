
import { SnPageWidgetDto } from '@algotech/core';
export const image: SnPageWidgetDto = {
    id: '0e26e732-5af8-71fe-0049-526f6f09c3b6',
    typeKey: 'image',
    name: 'Image',
    isActive: false,
    css: {
        main: {
            'background-color': 'var(--ALGOTECH-BACKGROUND)',
            'box-shadow': 'unset'
        },
        image: {
            'border-radius': '0px 0px 0px 0px',
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
