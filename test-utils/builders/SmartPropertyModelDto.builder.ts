import { LangDto, SmartPermissionsDto, SmartPropertyModelDto } from '@algotech/core';
import { MockBuilder } from './MockBuilder';

export class SmartPropertyModelDtoBuilder extends MockBuilder<SmartPropertyModelDto> {
    constructor(
        private uuid: string = '123456',
        private key: string = 'propertykey',
        private displayName: LangDto[] = [{ lang: 'fr', value: 'Mocked Property' }],
        private keyType: string = 'string',
        private multiple: boolean = false,
        private required: boolean = false,
        private system: boolean = false,
        private hidden: boolean = false,
        private permissions: SmartPermissionsDto = null
    ) { super(); }

    withKey(key: string): SmartPropertyModelDtoBuilder {
        this.key = key;
        return this;
    }

    withKeyType(keyType: string): SmartPropertyModelDtoBuilder {
        this.keyType = keyType;
        return this;
    }
}
