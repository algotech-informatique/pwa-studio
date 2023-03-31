
import { SnPageWidgetDto } from '@algotech-ce/core';
export const notification: SnPageWidgetDto = {
    id: 'cbc85a09-4ac4-9b03-f236-74052d836cec',
    typeKey: 'notification',
    name: 'Notification',
    isActive: false,
    css: {
        main: {
            'background-color': 'var(--ALGOTECH-BACKGROUND)',
            'border-radius': '4px 4px 4px 4px',
            'box-shadow': 'unset',
            'border-top': 'none',
            'border-right': 'none',
            'border-bottom': 'none',
            'border-left': 'none'
        },
        icon: {
            color: 'var(--ALGOTECH-PRIMARY)',
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
