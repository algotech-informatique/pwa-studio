import { ResourceType } from './resource.type';

export class TabDto {
    icon: string;
    title: string;
    type: ResourceType;
    host: string;
    customerKey: string;
    refUuid: string;
    selected: boolean;
}
