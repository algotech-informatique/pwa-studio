import { EnvironmentDirectoryDto, EnvironmentDto } from '@algotech/core';
import { MockBuilder } from 'test-utils/builders/MockBuilder';

export class EnvironmentDtoBuilder extends MockBuilder<EnvironmentDto> {
    constructor(
        private uuid: string = '',
        private workflows: EnvironmentDirectoryDto[] = [],
        private smartmodels: EnvironmentDirectoryDto[] = [],
        private smartflows: EnvironmentDirectoryDto[] = [],
        private reports: EnvironmentDirectoryDto[] = [],
        private apps: EnvironmentDirectoryDto[] = [],
        private smartTasks: EnvironmentDirectoryDto[] = []
    ) { super(); }

    from(fixture: Partial<EnvironmentDto>): EnvironmentDtoBuilder {
        return super.from(fixture) as EnvironmentDtoBuilder;
    }

    withUUID(uuid: string): EnvironmentDtoBuilder {
        this.uuid = uuid;
        return this;
    }
}
