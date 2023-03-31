
import { SnPageWidgetDto } from '@algotech-ce/core';
export const squareSelector: SnPageWidgetDto = {
    id: 'bee6f15d-fa9f-08de-1d9f-dcac85975705',
    typeKey: 'selector',
    name: 'squareSelector',
    isActive: false,
    css: {
        main: {
            'background-color': 'var(--ALGOTECH-PRIMARY)',
            'border-radius': '4px 4px 4px 4px',
            'box-shadow': 'unset',
            'border-top': 'none',
            'border-right': 'none',
            'border-bottom': 'none',
            'border-left': 'none'
        },
        icon: {
            color: 'var(--ALGOTECH-BACKGROUND)',
            'font-size': '16px',
            padding: '10px',
            margin: '0px 6px'
        },
        layout: {
            'flex-direction': 'row',
            'justify-content': 'center',
            'align-items': 'center',
            gap: '0px',
        }
    },
    custom: {
        action: '',
        iterable: false,
        disabled: false,
        hidden: false,
        locked: false,
        icon: 'fa-solid fa-bars'
    },
    box: {
        x: 0,
        y: 0,
        width: 40,
        height: 40
    },
    events: [
    ],
    rules: [
    ],
    locked: false,
    lockedProperties: [],
};
