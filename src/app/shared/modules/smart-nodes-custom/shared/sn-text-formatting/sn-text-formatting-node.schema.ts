import { SnNodeSchema } from '../../../smart-nodes/dto';

export const SN_TEXTFORMATTING_NODE_SCHEMA: SnNodeSchema = {
    displayName: 'SN-TEXT-FORMATTING',
    type: 'SnTextFormattingNode',
    icon: 'fa-solid fa-font',
    flows: [],
    params: [{
        direction: 'out',
        key: 'result',
        types: 'string',
        multiple: false,
        master: true,
        pluggable: true,
        displayName: 'SN-SERVICE-RESULT',
    }],
    sections: [{
        key: 'sources',
        displayName: 'SN-SOURCES',
        open: true,
        editable: true,
        params: [],
    }, {
        key: 'preview',
        displayName: 'SN-TEXT-FORMATTING-PREVIEW',
        open: true,
        editable: false,
        params: [],
        hidden: true,
    }],
};
