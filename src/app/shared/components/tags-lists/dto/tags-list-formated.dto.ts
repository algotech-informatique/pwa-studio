import { LangDto, TagDto } from '@algotech-ce/core';

export class TagsListFormatedLine {
    key: string;
    checked: boolean;
    color: string;
    defaultLang: LangDto;
    nextLangs: LangDto[];
    line: TagDto;
}
