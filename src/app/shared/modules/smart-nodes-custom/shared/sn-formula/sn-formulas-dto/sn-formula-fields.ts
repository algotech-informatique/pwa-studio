export class SnFormulaFields {
    id: number;
    code: string;
    type: string; // 'string' | 'number' | 'date' | 'boolean' | 'any';
    isArray: boolean;
    isOptional: boolean;
    description?: string;
    color?: string;
    addedSource: boolean;
    disabled?: boolean;
}
