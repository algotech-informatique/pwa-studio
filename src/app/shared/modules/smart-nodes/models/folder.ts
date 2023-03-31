import { EnvironmentDirectoryDto, SnModelDto } from '@algotech-ce/core';

export class Folder {
    type: string;
    directory: {
        directory: EnvironmentDirectoryDto;
        snModels: SnModelDto;
    };
}
