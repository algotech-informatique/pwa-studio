import { GenericListValueDto, LangDto } from '@algotech/core';

export class GenericFormatedLine {
    key: string;
    checked: boolean;
    defaultLang: LangDto;
    nextLangs: LangDto[];
    line: GenericListValueDto;
    index: number;
}
