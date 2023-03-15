import { ObjectTreeLineDto } from './object-tree-line.dto';
import { ResourceType } from './resource.type';

export class ModuleTreeLineDto {
    refUuid: string;
    type?: ResourceType;
    host: string;
    customerKey: string;
    name: string;
    icon?: string;
    state: boolean;
    hidden?: boolean;
    active?: boolean;
    selected?: boolean;
    class: 'objects' | 'modules' | 'module';
    childs: ObjectTreeLineDto[] | ModuleTreeLineDto[];
}
