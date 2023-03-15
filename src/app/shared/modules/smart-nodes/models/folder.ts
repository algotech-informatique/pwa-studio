import { EnvironmentDirectoryDto, SnModelDto } from '@algotech/core';

export class Folder {
    type: string;
    directory: {
        directory: EnvironmentDirectoryDto;
        snModels: SnModelDto;
    };
}
