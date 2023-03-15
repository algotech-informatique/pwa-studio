
import { SnPageWidgetDto } from '@algotech/core';
export const gallery: SnPageWidgetDto = {
    id: 'c78efe26-a375-af55-b831-e3d67d9337ab',
    typeKey: 'document',
    name: 'Gallery',
    isActive: false,
    css: {
    },
    custom: {
        mode: 'grid',
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
        pagination: 30,
        input: null,
        hidden: false,
        locked: false
    },
    box: {
        x: 0,
        y: 0,
        width: 380,
        height: 380
    },
    events: [
        {
            id: '102c42f8-e0e1-8ac3-df68-1763ca950662',
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
