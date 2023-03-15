
import { SnPageWidgetDto } from '@algotech/core';
export const squareNotification: SnPageWidgetDto = {
    id: 'c577b52b-adb7-29eb-f85d-7621d19de875',
    typeKey: 'notification',
    name: 'squareNotification',
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
            padding: '0px 0px 0px 0px',
            margin: '0px 0px 0px 0px'
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
        icon: 'fa-solid fa-bell'
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
