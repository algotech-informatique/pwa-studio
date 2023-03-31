
import { SnPageWidgetDto } from '@algotech-ce/core';
export const board: SnPageWidgetDto = {
    id: 'fb445315-2953-0384-933e-03f3ead1b282',
    typeKey: 'board',
    returnData: [
        {
            key: 'smart-object-selected',
            multiple: false,
            type: 'so:*',
            name: 'BOARD.SMART-OBJECT-SELECTED'
        }
    ],
    name: 'Board',
    isActive: false,
    css: {
        main: {
            'background-color': '#FFFFFF00'
        }
    },
    custom: {
        imageUuid: '',
        iterable: false,
        instance: '',
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
            id: '61ffab76-1d93-1b5b-f026-0554c5e943f5',
            eventKey: 'onAddMagnet',
            pipe: [
            ],
            custom: {
                mode: 'list'
            }
        },
        {
            id: '34f21810-4dcc-83fd-7d74-5b94f9ca4881',
            eventKey: 'onActionMagnet',
            pipe: [
            ],
            custom: {
                mode: 'list'
            }
        },
        {
            id: '15463f0c-f281-d9f3-02f4-1cf9b4ed0765',
            eventKey: 'onMoveMagnet',
            pipe: [
            ],
            custom: {
                mode: 'list'
            }
        }
    ],
    rules: [
    ],
    group: {
        widgets: [
        ]
    },
    locked: false,
    lockedProperties: [],
};
