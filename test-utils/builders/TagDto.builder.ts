import { LangDto, TagDto } from '@algotech/core';
import { MockBuilder } from './MockBuilder';

export class TagDtoBuilder extends MockBuilder<TagDto> {
    constructor(
        private key: string = 'tag-key',
        private displayName: LangDto[] = [],
        private color: string = 'FAFAFA'
    ) { super(); }

    withKeyAndName(name: string): TagDtoBuilder {
        this.key = 'tag-' + name.toLowerCase();
        this.displayName = [{ lang: 'fr-FR', value: name }];
        return this;
    }
}
