import { TranslateLangDtoService } from '@algotech/angular';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ListItem } from '../../dto/list-item.dto';

@Injectable()
export class InspectorOptionsService {

    listsTag = [
        {
            uuid: 'e8dfa860-01ff-11ea-8d71-362b9e155667',
            key: 'liste-1',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Liste 1',
                },
                {
                    lang: 'en-US',
                    value: 'List 1',
                },
                {
                    lang: 'es-ES',
                    value: 'Lista 1',
                },
            ],
            modelKeyApplication: ['armoire', 'machine'],
            applyToDocuments: false,
            applyToImages: false,
            tags: [
                {
                    uuid: 'f345861c-01ff-11ea-8d71-362b9e155667',
                    key: 'etude',
                    displayName: [
                        {
                            lang: 'fr-FR',
                            value: 'Etude',
                        },
                        {
                            lang: 'en-US',
                            value: 'Study',
                        },
                        {
                            lang: 'es-ES',
                            value: 'Estudio',
                        },
                    ],
                    color: '#2D9CDB',
                },
                {
                    uuid: 'ab485432-0201-11ea-9a9f-362b9e155667',
                    key: 'chantier',
                    displayName: [
                        {
                            lang: 'fr-FR',
                            value: 'Chantier',
                        },
                        {
                            lang: 'en-US',
                            value: 'Construction site',
                        },
                        {
                            lang: 'es-ES',
                            value: 'Sitio',
                        },
                    ],
                    color: '#009688',
                },
                {
                    uuid: 'af301292-0201-11ea-9a9f-362b9e155667',
                    key: 'reserve',
                    displayName: [
                        {
                            lang: 'fr-FR',
                            value: 'Reserve',
                        },
                        {
                            lang: 'en-US',
                            value: 'Reserve',
                        },
                        {
                            lang: 'es-ES',
                            value: 'Reserva',
                        },
                    ],
                    color: '#F95959',
                },
                {
                    uuid: 'b3b3d15a-0201-11ea-9a9f-362b9e155667',
                    key: 'exe',
                    displayName: [
                        {
                            lang: 'fr-FR',
                            value: 'Exé',
                        },
                        {
                            lang: 'en-US',
                            value: 'Exe',
                        },
                        {
                            lang: 'es-ES',
                            value: 'Exe',
                        },
                    ],
                    color: '#BB6BD9',
                },
                {
                    uuid: 'b74c4d10-0201-11ea-8d71-362b9e155667',
                    key: 'panne',
                    displayName: [
                        {
                            lang: 'fr-FR',
                            value: 'Panne',
                        },
                        {
                            lang: 'en-US',
                            value: 'Breakdown',
                        },
                        {
                            lang: 'es-ES',
                            value: 'Ruptura',
                        },
                    ],
                    color: '#D77B38',
                },
            ],
        },
        {
            key: 'etat',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Etat',
                },
                {
                    lang: 'en-US',
                    value: 'State',
                },
                {
                    lang: 'es-ES',
                    value: 'Estado',
                },
            ],
            modelKeyApplication: ['armoire', 'machine'],
            applyToDocuments: false,
            applyToImages: false,
            tags: [
                {
                    uuid: 'c7d9205a-020f-11ea-8d71-362b9e155667',
                    key: 'repare',
                    displayName: [
                        {
                            lang: 'fr-FR',
                            value: 'Reparé',
                        },
                        {
                            lang: 'en-US',
                            value: 'Repared',
                        },
                        {
                            lang: 'es-ES',
                            value: 'Reparado',
                        },
                    ],
                    color: '#12c474',
                },
                {
                    uuid: 'd0ce23a4-020f-11ea-8d71-362b9e155667',
                    key: 'casse',
                    displayName: [
                        {
                            lang: 'fr-FR',
                            value: 'Cassé',
                        },
                        {
                            lang: 'en-US',
                            value: 'Broken',
                        },
                        {
                            lang: 'es-ES',
                            value: 'Roto',
                        },
                    ],
                    color: '#d9563f',
                },
            ],
        }
    ];

    constructor(
        private translateLangDtoService: TranslateLangDtoService,
    ) { }

    creationDataList(): ListItem[] {
        return _.flatMap(this.listsTag, (list) => _.map(list.tags, (tag) => ({
            key: tag.key,
            value: this.translateLangDtoService.transform(tag.displayName),
            icon: 'fa-solid fa-circle',
            color: tag.color,
        })));
    }
}
