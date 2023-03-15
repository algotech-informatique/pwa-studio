import { LangDto, TagDto } from '@algotech/core';

export class TagsListFormatedLine {
    key: string;
    checked: boolean;
    color: string;
    defaultLang: LangDto;
    nextLangs: LangDto[];
    line: TagDto;
}
