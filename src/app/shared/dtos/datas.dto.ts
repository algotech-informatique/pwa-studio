import { SnModelDto, EnvironmentDto, CustomerDto, GenericListDto, TagListDto,
    SmartModelDto, SettingsDto, GroupDto, UserDto, WorkflowModelDto, ApplicationModelDto } from '@algotech-ce/core';
import { LocalProfil } from '@algotech-ce/angular';
import { SocketManager } from '../services/socket/socket-manager.service';

export class DatasDto {
    socket: SocketManager;
    host: string;
    customerKey: string;
    read: {
        localProfil: LocalProfil;
        customer: CustomerDto;
        settings: SettingsDto;
        tags: TagListDto[];
        glists: GenericListDto[];
        groups: GroupDto[];
        smartModels: SmartModelDto[];
        workflows: WorkflowModelDto[];
        users: UserDto[];
        apps: ApplicationModelDto[];
    };
    write: {
        previousState: {
            environment: EnvironmentDto;
            snModels: SnModelDto[];
        };
        environment: EnvironmentDto;
        snModels: SnModelDto[];
    };
    status: number;
}
