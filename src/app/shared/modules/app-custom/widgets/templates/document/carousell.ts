
import { SnPageWidgetDto } from '@algotech/core';
export const carousell: SnPageWidgetDto = {
    id: 'bd715dc7-1c38-0eef-1e8f-56f321eae6a3',
    typeKey: 'document',
    name: 'Carousell',
    isActive: false,
    css: {
    },
    custom: {
        mode: 'carousel',
        type: [
            'images'
        ],
        search: false,
        tagFilter: false,
        metadatas: false,
        oldVersions: {
            active: false,
            groups: [
            ]
        },
        pagination: 0,
        input: null,
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
            id: 'e7ecfa08-fdbd-2924-e635-c5334ec5612a',
            eventKey: 'onActionDocument',
            pipe: [
            ],
            custom: {
                mode: 'list'
            }
        }
    ],
    rules: [
    ],
    locked: false,
    lockedProperties: [],
};
