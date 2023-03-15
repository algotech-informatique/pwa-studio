import { EventGroup } from '../../../../../dto/event-group.dto';

export const eventGroups: EventGroup[] = [
    {
        object: 'main',
        events: [
            {
                event: '*',
                types: [
                    'call::onLoad',
                    'workflow',
                    'smartflow',
                    'page',
                    'url',
                    'page::nav',
                ],
            },
        ],
    },
    {
        object: 'child',
        events: [
            {
                event: '*',
                types: [
                    'call::onLoad',
                    'workflow',
                    'smartflow',
                    'page',
                    'url',
                    'page::nav',
                ],
            },
        ],
    },
    {
        object: 'page',
        events: [
            {
                event: 'onLoad',
                types: [
                    'workflow',
                    'smartflow',
                    'page',
                    'url',
                ],
            },
            {
                event: 'datasources',
                types: [
                    'smartflow',
                    'smartobjects',
                ],
            },
            {
                event: '*',
                types: [
                    'call::onLoad',
                    'workflow',
                    'smartflow',
                    'page',
                    'url',
                    'page::nav',
                ],
            },
        ],
    }
];
