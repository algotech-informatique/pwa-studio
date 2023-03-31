import { LangDto } from '@algotech-ce/core';

export class RessourcesDto {
    uuid?: string;
    ressourceType: 'workflow-model' | 'smartflow-model' | 'smart-model' | 'generic-list' | 'tag-list' | 'app' | 'report';
    key: string;
    display: LangDto[];
    publisher: string;
    data: any;
    ownerId: string;
}
