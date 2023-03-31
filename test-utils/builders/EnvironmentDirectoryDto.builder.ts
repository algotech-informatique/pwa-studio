import { EnvironmentDirectoryDto } from '@algotech-ce/core';
import { UUID } from 'angular2-uuid';
import { MockBuilder } from './MockBuilder';

export class EnvironmentDirectoryDtoBuilder extends MockBuilder<EnvironmentDirectoryDto> {
    constructor(
        private uuid: string = UUID.UUID(),
        private name: string = 'mocked-directory',
        private subDirectories: EnvironmentDirectoryDto[] = []
    ) { super(); }

    withUuid(uuid: string): EnvironmentDirectoryDtoBuilder {
        this.uuid = uuid;
        return this;
    }

    withName(name: string): EnvironmentDirectoryDtoBuilder {
        this.name = name;
        return this;
    }

    withSubDirectories(subDirectories: EnvironmentDirectoryDto[]): EnvironmentDirectoryDtoBuilder {
        this.subDirectories = subDirectories;
        return this;
    }
}
