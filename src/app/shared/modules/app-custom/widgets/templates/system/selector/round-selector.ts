
import { SnPageWidgetDto } from '@algotech-ce/core';
export const roundSelector: SnPageWidgetDto = {
    id: '8fd26838-780b-7ee2-6b6d-66cd07b50baf',
    typeKey: 'selector',
    name: 'roundSelector',
    isActive: false,
    css: {
        main: {
            'background-color': 'var(--ALGOTECH-PRIMARY)',
            'border-radius': '20px 20px 20px 20px',
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
