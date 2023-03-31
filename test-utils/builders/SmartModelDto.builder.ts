import { ATSkillsActiveDto, LangDto, SmartModelDto, SmartPermissionsDto, SmartPropertyModelDto } from '@algotech-ce/core';
import { MockBuilder } from './MockBuilder';

export class SmartModelDtoBuilder extends MockBuilder<SmartModelDto> {
    constructor(
        private key: string = 'modelkey',
        private domainKey: string = 'domainkey',
        private system: boolean = false,
        private uniqueKeys: string[] = [],
        private displayName: LangDto[] = [{ lang: 'fr', value: 'Mocked Model' }],
        private properties: SmartPropertyModelDto[] = [],
        private skills: ATSkillsActiveDto = {},
        private permissions: SmartPermissionsDto = null,
    ) { super(); }

    withKey(key: string): SmartModelDtoBuilder {
        this.key = key;
        return this;
    }

    withProperties(properties: SmartPropertyModelDto[]): SmartModelDtoBuilder {
        this.properties = properties;
        return this;
    }
}
