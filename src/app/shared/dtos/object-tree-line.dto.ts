import { ResourceType } from './resource.type';
import { CreateLineDto } from './create-line.dto';

export class ObjectTreeLineDto {
    type: ResourceType;
    host: string;
    customerKey: string;
    refUuid: string;
    openIcon: string;
    closeIcon: string;
    isFolder: boolean;
    isConnector?: boolean;
    state: boolean;
    icon: string;
    name: string;
    rightIcons: string[];
    action: string;
    children: ObjectTreeLineDto[];
    selectable: boolean;
    selected: boolean;
    creation?: CreateLineDto;
    renaming?: boolean;
    active?: boolean;
}
