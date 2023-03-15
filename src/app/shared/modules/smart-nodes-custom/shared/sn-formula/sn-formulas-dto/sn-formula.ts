import { SnFormulaFields } from './sn-formula-fields';

export class SnFormula {
    code: string;
    formula: string;
    fields: SnFormulaFields[];
    example: string;
    expectedResult: string;
    description: string;
    descriptionOpt?: string;
    outputType: string;
    outputIsArray: boolean;
    isFavorite: boolean;
}
