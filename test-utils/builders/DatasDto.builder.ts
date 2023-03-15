import { SocketManager } from '../../src/app/shared/services';
import {
    SettingsDto, TagListDto, GenericListDto, GroupDto,
    SmartModelDto, WorkflowModelDto, UserDto, ApplicationModelDto, EnvironmentDto, SnModelDto
} from '@algotech/core';
import { DatasDto } from '../../src/app/shared/dtos';
import { MockBuilder } from './MockBuilder';
import { CustomerDtoBuilder, LocalProfilBuilder } from '.';

export class DatasDtoBuilder extends MockBuilder<DatasDto> {
    constructor(
        private socket: SocketManager = new SocketManager(),
        private host: string = 'host',
        private customerKey: string = 'customerKey',
        private read = {
            localProfil: new LocalProfilBuilder().build(),
            customer: new CustomerDtoBuilder().build(),
            settings: null as SettingsDto,
            tags: [] as TagListDto[],
            glists: [] as GenericListDto[],
            groups: [] as GroupDto[],
            smartModels: [] as SmartModelDto[],
            workflows: [] as WorkflowModelDto[],
            users: [] as UserDto[],
            apps: [] as ApplicationModelDto[]
        },
        private write = {
            previousState: {
                environment: null as EnvironmentDto,
                snModels: [] as SnModelDto[]
            },
            environment: null as EnvironmentDto,
            snModels: [] as SnModelDto[]
        },
        private status: number = 0
    ) { super(); }

    withSocket(socket: SocketManager): DatasDtoBuilder {
        this.socket = socket;
        return this;
    }

    withPreviousState(previousState: { environment: EnvironmentDto; snModels: SnModelDto[] }): DatasDtoBuilder {
        // FIXME maybe this can always copy what's written in current environment and snModels ?
        this.write.previousState = previousState;
        return this;
    }

    withEnvironment(environment: EnvironmentDto): DatasDtoBuilder {
        this.write.environment = environment;
        return this;
    }

    withSmartModels(...smartmodels: SmartModelDto[]): DatasDtoBuilder {
        this.read.smartModels = smartmodels;
        return this;
    }

    withSnModels(snModels: SnModelDto[]): DatasDtoBuilder {
        this.write.snModels = snModels;
        return this;
    }
}
