import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnFormula, SnFormulaFields, SnGroupFormula } from './sn-formulas-dto';
import { formulaList } from './formulas';
import * as _ from 'lodash';
import { SnDOMService } from '../../../smart-nodes/services';
import { Observable, of } from 'rxjs';
import { InterpretorFormulaParser } from '@algotech/business';

interface DescriptionFields {
    code: string;
    description: string;
}

@Injectable()
export class SnFormulaService {

    constructor(
        private translate: TranslateService,
        private snDOM: SnDOMService,
    ) {
    }

    _transformeForParse(oldFormula) {
        if (oldFormula == null) {
            return oldFormula;
        }
        const func = oldFormula.split('("');
        const formula = (func.length > 0) ? func[0] : '';
        const parameters = (func.length > 1) ? _.reduce(func[1].split('")')[0].split(','), (r, p) => {
            if (_.trim(p) !== '') {
                r.push(p);
            }
            return r;
        }, []) : [];
        return formula === 'PARSE' ? `${formula}("${parameters.map((param: string) => `${param.replace(/"/g, '”')}`).join(',')}")` :
            oldFormula;
    }

    parseFormula(formula) {
        let parserResult: { error?: string; result?: any };
        const customParser = new InterpretorFormulaParser();
        if (customParser.tryParseFormula(this._transformeForParse(formula), [{ key: 'value' }])) {
            parserResult = customParser.executeFormula();
        } else {
            const formulaParser = require('hot-formula-parser').Parser;
            const parser = new formulaParser();
            parserResult = parser.parse(formula);
        }

        return parserResult;
    }

    createFormulaGroups(): SnGroupFormula[] {
        const groups: string[] = _.uniqBy(formulaList, 'group');
        return _.reduce(groups, (result, group) => {
            const formulas: SnFormula[] = this._readJsonFile(group.group);
            if (formulas.length !== 0) {
                const groupFormula: SnGroupFormula = {
                    code: group.group,
                    description: this.translate.instant(group.group),
                    formulas,
                };
                result.push(groupFormula);
            }
            return result;
        }, []);
    }

    getFormula(code: string): SnFormula {
        const findIndex = _.findIndex(formulaList, (frm) => frm.code === code);
        if (findIndex !== -1) {
            return this._getFormula(formulaList[findIndex]);
        }
        return null;
    }

    replaceParams(formula: string, fieldId: any, fieldCode: any) {
        const replaceFrom = `{{${fieldId}}}`;
        const replaceTo = `{{${fieldCode}}}`;
        const value = formula.replace(replaceFrom, replaceTo);
        return value;
    }

    getFavoritesFormulas(groups: SnGroupFormula[]): SnGroupFormula[] {
        return _.reduce(groups, (result, groupFormula: SnGroupFormula) => {
            const formulas: SnFormula[] = groupFormula.formulas.filter((formula: SnFormula) => formula.isFavorite);
            if (formulas.length !== 0) {
                const group: SnGroupFormula = groupFormula;
                group.formulas = _.cloneDeep(formulas);
                result.push(group);
            }
            return result;
        }, []);
    }

    getFilterFormulas(groups: SnGroupFormula[], filter: string): Observable<SnGroupFormula[]> {
        const selectedGroups = _.reduce(groups, (result, groupFormula: SnGroupFormula) => {
            const formulas: SnFormula[] = groupFormula.formulas.filter((formula: SnFormula) =>
                formula.code.toLowerCase().startsWith(filter.toLowerCase()),
            );
            if (formulas.length !== 0) {
                const group: SnGroupFormula = groupFormula;
                group.formulas = _.cloneDeep(formulas);
                result.push(group);
            }
            return result;
        }, []);
        return of(selectedGroups);
    }

    getFormulaWithoutOptionals(formula: string, fields: SnFormulaFields[]): string {
        const optionalFields = fields.filter((field) => field.isOptional)?.map((field) => field.id)?.join('|');
        const regex = new RegExp('(, )?{\\{(' + optionalFields + ')}}', 'g');
        const value = formula.replace(regex, '');
        return value;
    }

    addOptionalParam(formula: string, fieldCode: any) {
        const add = `, {{${fieldCode}}}`;
        const value = formula.slice(0, formula.length - 1) + add + ')';
        return value;
    }

    private _readJsonFile(codeGroup: string): SnFormula[] {
        const objs: SnFormula[] = _.reduce(formulaList, (result, formulas) => {
            if (formulas.group === codeGroup) {
                result.push(this._getFormula(formulas));
            }
            return result;
        }, []);
        return objs;
    }

    private _getFormula(formulas): SnFormula {

        const obj: SnFormula = {
            code: formulas.code,
            description: this.translate.instant(formulas.description),
            fields: this._getFormulaFields(formulas.fields, formulas.descriptionOpt),
            formula: formulas.formula,
            example: formulas.example,
            expectedResult: formulas.expectedResult,
            outputType: formulas.returnType,
            outputIsArray: (formulas.returnMultiple) ? formulas.returnMultiple : false,
            isFavorite: (formulas.isFavorite) ? formulas.isFavorite : false,
        };
        return obj;
    }

    private _getFormulaFields(fields: string, descriptionOpt: string): SnFormulaFields[] {
        if (fields === '') {
            return [];
        }

        const descFields: DescriptionFields[] = this._descriptionOptions(descriptionOpt);
        const split: string[] = fields.split(';');
        let formulafields: SnFormulaFields[] = _.map(split, (sp: string) => {
            const splitField = sp.split(':');
            const field: SnFormulaFields = {
                id: parseInt(this._validateArrayPosition(splitField, 0), 10),
                code: this._validateArrayPosition(splitField, 1),
                type: this._validateArrayPosition(splitField, 2),
                isOptional: this._findArrayPosition(splitField, 3, '*'),
                isArray: this._findArrayPosition(splitField, 4, '[]'),
                description: this._getDescriptionField(this._validateArrayPosition(splitField, 1), descFields),
                color: this._defineColor(this._validateArrayPosition(splitField, 2)),
                addedSource: false,
            };
            return field;
        });
        formulafields = formulafields.map((field, index: number) => {
            field.disabled = field.isOptional && index > 0 && formulafields[index - 1].isOptional;
            return field;
        });
        return formulafields;
    }

    private _descriptionOptions(descriptionOpt): DescriptionFields[] {
        if (descriptionOpt === '' || !descriptionOpt) {
            return [];
        }
        const options: string = this.translate.instant(descriptionOpt);
        const arrayOptions = options.split(';');
        if (arrayOptions.length === 0) {
            return [];
        }
        return _.map(arrayOptions, (opt: string) => {
            const arrayOpt: string[] = opt.split(':');
            const desc: DescriptionFields = {
                code: this._validateArrayPosition(arrayOpt, 0),
                description: this._validateArrayPosition(arrayOpt, 1),
            };
            return desc;
        });
    }

    private _getDescriptionField(code: string, descFields: DescriptionFields[]): string {
        if (descFields.length === 0) {
            return '';
        }
        const findIndex = _.findIndex(descFields, (desc: DescriptionFields) => desc.code === code);
        if (findIndex !== -1) {
            return descFields[findIndex].description;
        }
        return '';
    }

    private _defineColor(type: string) {
        return this.snDOM.getVarName('--SN-NODE-PARAM-COLOR', type.toUpperCase().replace(':', ''), true);
    }

    private _findArrayPosition(elementsArray: string[], position: number, found: string): boolean {
        const value = this._validateArrayPosition(elementsArray, position);
        return (value !== '' && value === found);
    }

    private _validateArrayPosition(elementsArray: string[], position: number): string {
        return (elementsArray.length > position) ? elementsArray[position] : '';
    }

}
