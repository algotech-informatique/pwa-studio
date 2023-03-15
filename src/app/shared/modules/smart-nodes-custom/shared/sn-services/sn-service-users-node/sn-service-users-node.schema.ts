import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_SERVICE_USERS_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
    return {
        type: 'SnServiceUsersNode',
        displayName: displayName,
        icon: 'fa-solid fa-users',
        custom: {
            service: {
                execute: 'start',
                type: 'GET',
                key: 'get-users',
                route: '{{SERVER}}/users',
                body : null,
                params: [],
                mappedParams: [],
                header: []
            }
        },
        flows: [],
        params: [
            {
                direction: 'out',
                key: 'result',
                types: 'sys:user',
                multiple: true,
                pluggable: true,
                master: true,
                displayName: 'SN-SERVICE-USERS-RESULT',
            }
        ],
        sections: []
    };
};
