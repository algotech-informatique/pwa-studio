import { CustomerDto, LangDto } from '@algotech-ce/core';
import { MockBuilder } from './MockBuilder';

export class CustomerDtoBuilder extends MockBuilder<CustomerDto> {
    constructor(
        private customerKey: string = 'customerKey',
        private name: string = 'customerKey',
        private logoUrl: string = 'trollface.jpg',
        private languages: Array<LangDto> = [{ lang: 'fr-FR', value: 'Français' }],
        private applicationsKeys: Array<string> = [],
        private licenceKey: string = 'ultra-secret',
    ) { super(); }
}
