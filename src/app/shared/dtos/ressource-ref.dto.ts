import { ResourceType } from './resource.type';
import { SnNode } from '../modules/smart-nodes';
import { Folder } from '../modules/smart-nodes/models/folder';

export class RessourcesRefDto {
    key: string;
    storeUuid: string;
    refUuid: string;
    data?: SnNode | Folder;
    ressourceType: ResourceType;
}
