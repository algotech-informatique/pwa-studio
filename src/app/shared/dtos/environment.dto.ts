import { ModuleTreeLineDto } from './module-tree-line.dto';

export class EnvironmentDisplayDto {
    host: string;
    customerKey: string;
    name: string;
    modules: ModuleTreeLineDto[];
    state?: boolean;
}
