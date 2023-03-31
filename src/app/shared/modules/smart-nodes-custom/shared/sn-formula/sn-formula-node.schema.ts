import { SnNodeSchema } from '../../../smart-nodes/dto';

export const SN_FORMULA_NODE_SCHEMA: SnNodeSchema = {
    displayName: 'SN-FORMULA',
    type: 'SnFormulaNode',
    icon: 'fa-solid fa-f',
    flows: [],
    params: [{
        direction: 'out',
        key: 'result',
        types: ['string', 'date', 'datetime', 'number', 'time', 'boolean'],
        dynamic: true,
        pluggable: true,
        master: true,
        displayName: 'SN-SERVICE-RESULT',
        default: ''
    }],
    sections: [{
        key: 'sources',
        displayName: 'SN-SOURCES',
        open: true,
        editable: true,
        params: [],
    }, {
        key: 'preview',
        displayName: 'SN-FORMULA-PREVIEW',
        open: true,
        editable: false,
        params: [],
        hidden: true,
    }],
};
