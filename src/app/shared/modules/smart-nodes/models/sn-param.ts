import { SnConnector } from './sn-connector';

export class SnParam extends SnConnector {
    types: string | string[];
    dynamic?: boolean;
    display?: 'input' | 'password' | 'select' | 'key-edit';
    multiple?: boolean;
    pluggable: boolean;
    master?: boolean;
    required?: boolean;
    hidden?: boolean;
    default?: any;
    value?: any;
    locked?: boolean;
}
