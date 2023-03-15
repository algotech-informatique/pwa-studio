import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_REVIEW_NODE_SCHEMA: (displayName: SnLang[], acceptText: SnLang[], refuseText: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[], acceptText: SnLang[], refuseText: SnLang[]) => {
        return {
            type: 'SnReviewNode',
            custom: {
                taskKey: 'TaskReview'
            },
            displayName: displayName,
            icon: 'fa-solid fa-binoculars',
            flowsEditable: true,
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'confirm',
                direction: 'out',
                paramsEditable: false,
                params: [],
                displayName: acceptText,
            }, {
                key: 'revision',
                direction: 'out',
                paramsEditable: false,
                params: [],
                displayName: refuseText,
            }],
            params: [{
                key: 'notification',
                direction: 'in',
                types: 'sys:notification',
                multiple: false,
                displayName: 'SN-REVIEW-NOTIFICATION',
                pluggable: true,
                required: true,
            }],
            sections: [{
                key: 'properties',
                displayName: 'SN-NODE-PROPERTIES',
                editable: false,
                open: true,
                params: [{
                    key: 'comment',
                    direction: 'in',
                    types: 'boolean',
                    displayName: 'SN-REVIEW-COMMENT',
                    pluggable: true,
                    required: true,
                    multiple: false,
                    default: true,
                    display: 'input'
                }, {
                    key: 'linkedFiles',
                    direction: 'in',
                    types: 'sys:file',
                    displayName: 'SN-REVIEW-LINKED-FILES',
                    pluggable: true,
                    required: false,
                }]
            }],
        };
    };
