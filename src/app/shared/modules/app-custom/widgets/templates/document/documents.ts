
import { SnPageWidgetDto } from '@algotech-ce/core';
export const documents: SnPageWidgetDto = {
    id: 'de00607e-09ab-12c6-47c7-2d3ef8eeca32',
    typeKey: 'document',
    name: 'Documents',
    isActive: false,
    css: {
    },
    custom: {
        mode: 'list',
        type: [
            'images',
            'documents'
        ],
        search: true,
        tagFilter: false,
        metadatas: true,
        oldVersions: {
            active: true,
            groups: [
            ]
        },
        pagination: 10,
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
            id: '3c0ff899-21f7-092e-b174-381def914d25',
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
