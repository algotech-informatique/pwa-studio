import { SmartModelDto, WorkflowModelDto } from '@algotech-ce/core';

export const themePreviewWorkflow: WorkflowModelDto = {
    tags: [],
    uuid: 'db4c2aec-4b17-894a-7f54-29007f13f596',
    updateDate: '2021-07-21T03:01:12.000+0000',
    viewId: '96b2e54a-8aa7-1604-2fff-aa1c2f2bb684',
    snModelUuid: 'db4c2aec-4b17-894a-7f54-29007f13f596',
    viewVersion: 0,
    key: 'theme-preview',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Aperçu du thème'
        },
        {
            lang: 'en-US',
            value: 'Theme Preview'
        },
        {
            lang: 'es-ES',
            value: 'Vista previa del tema'
        }
    ],
    parameters: [],
    variables: [],
    profiles: [
        {
            uuid: '5138126f-4252-46f3-8a1d-03369b671d4f',
            name: 'default'
        }
    ],
    steps: [
        {
            uuid: '8661ce07-3f0b-c2aa-471d-4ab031d866b1',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Aperçu du thème'
                },
                {
                    lang: 'en-US',
                    value: 'Theme Preview'
                },
                {
                    lang: 'es-ES',
                    value: 'Vista previa del tema'
                }
            ],
            key: 'apercu-du-theme',
            tasks: [
                {
                    uuid: '82a019b3-75dc-e4de-77b6-434e8a9eb3fa',
                    key: 'depart',
                    type: 'TaskLauncher',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'DÉPART'
                            },
                            {
                                lang: 'en-US',
                                value: 'START'
                            },
                            {
                                lang: 'es-ES',
                                value: 'COMIENZO'
                            }
                        ],
                        iconName: 'fa-solid fa-play-circle',
                        profil: '5138126f-4252-46f3-8a1d-03369b671d4f'
                    },
                    properties: {
                        transitions: [
                            {
                                uuid: 'db651f07-79d5-4a00-0d5c-ebbb26bdfe36',
                                key: 'done',
                                task: 'b6ca2199-fb06-cf40-badc-62f9a1140e1b',
                                data: [],
                                displayName: []
                            }
                        ],
                        custom: {},
                        expressions: [],
                        services: []
                    }
                },
                {
                    uuid: '36a6f00d-bb11-7fa4-9921-e464bfa2c22b',
                    key: 'creer-un-objet',
                    type: 'TaskObjectCreate',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Créer un objet'
                            },
                            {
                                lang: 'en-US',
                                value: 'Object Create'
                            },
                            {
                                lang: 'es-ES',
                                value: 'Creación (Smart Object)'
                            }
                        ],
                        iconName: 'fa-solid fa-cube',
                        profil: '5138126f-4252-46f3-8a1d-03369b671d4f'
                    },
                    properties: {
                        transitions: [
                            {
                                uuid: '057ed626-3a7d-3f3d-50bf-57bbcb846c1b',
                                key: 'done',
                                task: '27e60e07-7c00-3825-3a93-39bffdeea47d',
                                data: [
                                    {
                                        placeToSave: [],
                                        uuid: 'd9ae190e-3135-238a-e5ab-ae6ccdc915e8',
                                        key: 'creer-un-objet_done__1',
                                        multiple: false,
                                        type: 'so:preview'
                                    }
                                ],
                                displayName: []
                            }
                        ],
                        custom: {
                            smartModel: 'preview',
                            properties: [],
                            skills: []
                        },
                        expressions: [],
                        services: []
                    }
                },
                {
                    uuid: '27e60e07-7c00-3825-3a93-39bffdeea47d',
                    key: 'formulaire',
                    type: 'TaskForm',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Formulaire'
                            },
                            {
                                lang: 'en-US',
                                value: 'Form'
                            },
                            {
                                lang: 'es-ES',
                                value: 'Formulario'
                            }
                        ],
                        iconName: 'fa-solid fa-square-poll-horizontal',
                        profil: '5138126f-4252-46f3-8a1d-03369b671d4f'
                    },
                    properties: {
                        transitions: [
                            {
                                uuid: '89ed652b-5791-f9e2-4106-5e4410e3b41f',
                                key: 'done',
                                task: 'b6ca2199-fb06-cf40-badc-62f9a1140e1b',
                                data: [],
                                displayName: []
                            }
                        ],
                        custom: {
                            title: null,
                            object: '{{creer-un-objet_done__1}}',
                            smartModel: 'preview',
                            options: [
                                {
                                    model: 'preview',
                                    properties: [
                                        {
                                            key: 'TEXT',
                                            conditions: [],
                                            conditionMode: null,
                                            conditionOperator: null
                                        },
                                        {
                                            key: 'DATE',
                                            value: '2021-07-21T05:01:12+02:00',
                                            conditions: [],
                                            conditionMode: null,
                                            conditionOperator: null
                                        },
                                        {
                                            key: 'NUMBER',
                                            conditions: [],
                                            conditionMode: null,
                                            conditionOperator: null
                                        },
                                        {
                                            key: 'BOOLEAN',
                                            conditions: [],
                                            conditionMode: null,
                                            conditionOperator: null
                                        }
                                    ]
                                }
                            ],
                            description: null,
                            readOnly: null,
                            activeTag: false,
                            modelsTag: []
                        },
                        expressions: [],
                        services: []
                    }
                },
                {
                    uuid: 'ce7a884a-1527-007b-4dbd-7d0aa2edd4d7',
                    key: 'boucle',
                    type: 'TaskLoop',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Boucle'
                            },
                            {
                                lang: 'en-US',
                                value: 'Loop'
                            },
                            {
                                lang: 'es-ES',
                                value: 'Bucle'
                            }
                        ],
                        iconName: 'fa-solid fa-rotate-left',
                        profil: '5138126f-4252-46f3-8a1d-03369b671d4f'
                    },
                    properties: {
                        transitions: [
                            {
                                uuid: 'a7d12144-886b-b32c-c662-e3edf473e9e8',
                                key: 'done',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Fin'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Exit'
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: 'Final'
                                    }
                                ],
                                task: 'f7b0843e-03fb-15d8-684d-45b9b3907031',
                                data: []
                            },
                            {
                                uuid: '77cba920-2e6a-a038-ed33-978617f0e846',
                                key: 'next',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Suivant'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Next'
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: 'Próximo'
                                    }
                                ],
                                task: 'd7f6ed15-4ba3-9c44-da09-545b5f6f35de',
                                data: [
                                    {
                                        placeToSave: [],
                                        uuid: 'c7a92f2d-3184-d20a-89db-170553866d3f',
                                        key: 'i',
                                        multiple: false,
                                        type: 'number'
                                    }
                                ]
                            }
                        ],
                        custom: {
                            forEach: false,
                            count: 15,
                            items: []
                        },
                        expressions: [],
                        services: []
                    }
                },
                {
                    uuid: 'd7f6ed15-4ba3-9c44-da09-545b5f6f35de',
                    key: 'creer-un-objet',
                    type: 'TaskObjectCreate',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Créer un objet'
                            },
                            {
                                lang: 'en-US',
                                value: 'Object Create'
                            },
                            {
                                lang: 'es-ES',
                                value: 'Creación (Smart Object)'
                            }
                        ],
                        iconName: 'fa-solid fa-cube',
                        profil: '5138126f-4252-46f3-8a1d-03369b671d4f'
                    },
                    properties: {
                        transitions: [
                            {
                                uuid: '075656d3-3305-9df1-397b-326913e89458',
                                key: 'done',
                                task: '9385a67c-8856-9f9a-f027-d70a09d1a6f9',
                                data: [
                                    {
                                        placeToSave: [],
                                        uuid: '7285c9e7-48c1-946f-4caa-ee46941f0832',
                                        key: 'creer-un-objet_done__4',
                                        multiple: false,
                                        type: 'so:preview'
                                    }
                                ],
                                displayName: []
                            }
                        ],
                        custom: {
                            smartModel: 'preview',
                            properties: [
                                {
                                    key: 'TEXT',
                                    value: '{{d3e10149-a332-f71d-0ef0-81fc64d36ce7}}'
                                },
                                {
                                    key: 'DATE',
                                    value: '{{dca21885-e413-7816-12bd-9d317697dffe}}'
                                }
                            ],
                            skills: []
                        },
                        expressions: [
                            {
                                key: 'd3e10149-a332-f71d-0ef0-81fc64d36ce7',
                                type: 'string',
                                value: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Généré automatiquement ({{i}})'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Automatically generated'
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: 'Generada automáticamente'
                                    }
                                ]
                            },
                            {
                                key: 'dca21885-e413-7816-12bd-9d317697dffe',
                                type: 'datetime',
                                value: 'NOW()'
                            }
                        ],
                        services: []
                    }
                },
                {
                    uuid: 'f7b0843e-03fb-15d8-684d-45b9b3907031',
                    key: 'liste',
                    type: 'TaskList',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Liste'
                            },
                            {
                                lang: 'en-US',
                                value: 'List'
                            },
                            {
                                lang: 'es-ES',
                                value: 'Lista'
                            }
                        ],
                        iconName: 'fa-solid fa-bars',
                        profil: '5138126f-4252-46f3-8a1d-03369b671d4f'
                    },
                    properties: {
                        transitions: [
                            {
                                uuid: 'e7768d97-a87c-c3e9-d5e2-2e0188f91ea7',
                                key: 'select',
                                task: 'b6ca2199-fb06-cf40-badc-62f9a1140e1b',
                                data: [
                                    {
                                        placeToSave: [],
                                        uuid: '9bfebf25-820a-2b8f-c3db-4ffe581b0e72',
                                        key: 'liste_select__6',
                                        multiple: false,
                                        type: 'so:preview'
                                    }
                                ],
                                displayName: []
                            }
                        ],
                        custom: {
                            title: null,
                            items: [
                                '{{liste}}'
                            ],
                            columnsDisplay: [
                                'TEXT',
                                'DATE'
                            ],
                            multipleSelection: false,
                            pagination: true,
                            search: true,
                            searchValue: '',
                            cart: true,
                            loop: false,
                            filterProperty: null,
                            filterActive: true,
                            excludeObjects: null
                        },
                        expressions: [],
                        services: []
                    }
                },
                {
                    uuid: '9385a67c-8856-9f9a-f027-d70a09d1a6f9',
                    key: 'buffer-de-donnees',
                    type: 'TaskDataBuffer',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Buffer de données'
                            },
                            {
                                lang: 'en-US',
                                value: 'Data Buffer'
                            },
                            {
                                lang: 'es-ES',
                                value: 'Búfer de datos'
                            }
                        ],
                        iconName: 'fa-solid fa-sd-card',
                        profil: '5138126f-4252-46f3-8a1d-03369b671d4f'
                    },
                    properties: {
                        transitions: [
                            {
                                uuid: '1adcfe28-6215-dacd-e53c-2b41e5db3421',
                                key: 'done',
                                task: 'ce7a884a-1527-007b-4dbd-7d0aa2edd4d7',
                                data: [
                                    {
                                        placeToSave: [],
                                        uuid: '88b987fe-7902-c0e7-4302-e4377475c89a',
                                        key: 'liste',
                                        multiple: true,
                                        type: 'so:preview'
                                    }
                                ],
                                displayName: []
                            }
                        ],
                        custom: {
                            data: '{{creer-un-objet_done__4}}',
                            cumul: true
                        },
                        expressions: [],
                        services: []
                    }
                },
                {
                    uuid: '178075af-c341-cb73-f4b6-7d02fdaaa170',
                    key: 'alerter',
                    type: 'TaskAlert',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Alerter'
                            },
                            {
                                lang: 'en-US',
                                value: 'Alert'
                            },
                            {
                                lang: 'es-ES',
                                value: 'Aviso'
                            }
                        ],
                        iconName: 'fa-solid fa-triangle-exclamation',
                        profil: '5138126f-4252-46f3-8a1d-03369b671d4f'
                    },
                    properties: {
                        transitions: [
                            {
                                uuid: 'e160d8ad-bab4-f5c7-c055-8fb07e4f2d38',
                                key: 'done',
                                task: 'd3169e72-908c-2787-1357-5d6a089046ee',
                                data: [],
                                displayName: []
                            }
                        ],
                        custom: {
                            alertTitle: '{{c17ae62f-d54f-e013-d48f-0d7d054be364}}',
                            alertMessage: '{{9f61fe0f-29f1-d413-d0ee-41286066d9a2}}',
                            alertType: 'information'
                        },
                        expressions: [
                            {
                                key: 'c17ae62f-d54f-e013-d48f-0d7d054be364',
                                type: 'string',
                                value: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Information'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Information'
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: 'Información'
                                    }
                                ]
                            },
                            {
                                key: '9f61fe0f-29f1-d413-d0ee-41286066d9a2',
                                type: 'string',
                                value: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Message d\'information'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Information message'
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: 'Mensaje informativo'
                                    }
                                ]
                            }
                        ],
                        services: []
                    }
                },
                {
                    uuid: 'b6ca2199-fb06-cf40-badc-62f9a1140e1b',
                    key: 'choix-multiple',
                    type: 'TaskMultichoice',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Choix multiple'
                            },
                            {
                                lang: 'en-US',
                                value: 'Multi choices'
                            },
                            {
                                lang: 'es-ES',
                                value: 'Selección multiple'
                            }
                        ],
                        iconName: 'fa-solid fa-question',
                        profil: '5138126f-4252-46f3-8a1d-03369b671d4f'
                    },
                    properties: {
                        transitions: [
                            {
                                uuid: '8117486a-979d-761e-c04b-48744dc443c8',
                                key: 'fb4503ae-cbc2-d4aa-aecc-765dd2eac22f',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Formulaire'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Form'
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: 'Formulario'
                                    }
                                ],
                                task: '36a6f00d-bb11-7fa4-9921-e464bfa2c22b',
                                data: []
                            },
                            {
                                uuid: 'b4a63c31-dbe5-42f0-839c-0f4c819b4922',
                                key: '4d617b08-c953-5a6f-e18c-7b96b0f89a53',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Liste'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'List'
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: 'Lista'
                                    }
                                ],
                                task: 'ce7a884a-1527-007b-4dbd-7d0aa2edd4d7',
                                data: []
                            },
                            {
                                uuid: '3dc9fdad-19d6-3942-ebbb-ec7298587071',
                                key: '049bf610-4c8f-aa29-2df9-6d71d78d3f20',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Alerte'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Alert'
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: 'Alerta'
                                    }
                                ],
                                task: '178075af-c341-cb73-f4b6-7d02fdaaa170',
                                data: []
                            },
                            {
                                uuid: 'a396f585-05f4-a026-cca2-c3c1d1daab2f',
                                key: '269cc618-c672-bc81-4ee2-c87be7acb96b',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Chargement'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Loading'
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: 'Cargando'
                                    }
                                ],
                                task: '053e7257-4501-1942-d149-970613523fcc',
                                data: []
                            }
                        ],
                        custom: {
                            title: null,
                            description: null
                        },
                        expressions: [],
                        services: []
                    }
                },
                {
                    uuid: 'd3169e72-908c-2787-1357-5d6a089046ee',
                    key: 'alerter',
                    type: 'TaskAlert',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Alerter'
                            },
                            {
                                lang: 'en-US',
                                value: 'Alert'
                            },
                            {
                                lang: 'es-ES',
                                value: 'Aviso'
                            }
                        ],
                        iconName: 'fa-solid fa-triangle-exclamation',
                        profil: '5138126f-4252-46f3-8a1d-03369b671d4f'
                    },
                    properties: {
                        transitions: [
                            {
                                uuid: '9331ad69-9afa-482f-e729-5000a61f497b',
                                key: 'done',
                                task: '0befaf26-3f0c-982c-9756-4d19eb455318',
                                data: [],
                                displayName: []
                            }
                        ],
                        custom: {
                            alertTitle: '{{7f64fab3-6146-5242-a279-5a96cbccf3cd}}',
                            alertMessage: '{{bd28855b-f120-a16f-6ca7-80d2a888b9bf}}',
                            alertType: 'warning'
                        },
                        expressions: [
                            {
                                key: '7f64fab3-6146-5242-a279-5a96cbccf3cd',
                                type: 'string',
                                value: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Avertisssement'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Warning'
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: 'Advertencia'
                                    }
                                ]
                            },
                            {
                                key: 'bd28855b-f120-a16f-6ca7-80d2a888b9bf',
                                type: 'string',
                                value: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Message d\'avertissement'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Warning message'
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: 'Mensaje de advertencia'
                                    }
                                ]
                            }
                        ],
                        services: []
                    }
                },
                {
                    uuid: '0befaf26-3f0c-982c-9756-4d19eb455318',
                    key: 'alerter',
                    type: 'TaskAlert',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Alerter'
                            },
                            {
                                lang: 'en-US',
                                value: 'Alert'
                            },
                            {
                                lang: 'es-ES',
                                value: 'Aviso'
                            }
                        ],
                        iconName: 'fa-solid fa-triangle-exclamation',
                        profil: '5138126f-4252-46f3-8a1d-03369b671d4f'
                    },
                    properties: {
                        transitions: [
                            {
                                uuid: '3e73632a-c89e-ce2c-2b73-26ed4e7e05f3',
                                key: 'done',
                                task: 'b6ca2199-fb06-cf40-badc-62f9a1140e1b',
                                data: [],
                                displayName: []
                            }
                        ],
                        custom: {
                            alertTitle: '{{e0a4d959-4a6c-221f-071c-07c141251a49}}',
                            alertMessage: '{{63126a72-1f64-9db0-155a-8e942d355805}}',
                            alertType: 'error'
                        },
                        expressions: [
                            {
                                key: 'e0a4d959-4a6c-221f-071c-07c141251a49',
                                type: 'string',
                                value: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Erreur'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Error'
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: 'Error'
                                    }
                                ]
                            },
                            {
                                key: '63126a72-1f64-9db0-155a-8e942d355805',
                                type: 'string',
                                value: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Message d\'erreur'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Error message'
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: 'Mensaje de error'
                                    }
                                ]
                            }
                        ],
                        services: []
                    }
                },
                {
                    uuid: '053e7257-4501-1942-d149-970613523fcc',
                    key: 'boucle',
                    type: 'TaskLoop',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Boucle'
                            },
                            {
                                lang: 'en-US',
                                value: 'Loop'
                            },
                            {
                                lang: 'es-ES',
                                value: 'Bucle'
                            }
                        ],
                        iconName: 'fa-solid fa-rotate-left',
                        profil: '5138126f-4252-46f3-8a1d-03369b671d4f'
                    },
                    properties: {
                        transitions: [
                            {
                                uuid: 'fcc25ee8-1b39-2c29-bdb9-0f25b52b675d',
                                key: 'done',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Fin'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Exit'
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: 'Final'
                                    }
                                ],
                                task: 'f6c463f0-23ac-ec94-7ba9-ee87cc66dd24',
                                data: []
                            },
                            {
                                uuid: 'cc2dc34a-9d4e-3fe9-8214-15c9ce734be9',
                                key: 'next',
                                displayName: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Suivant'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Next'
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: 'Próximo'
                                    }
                                ],
                                task: '5a9da229-719c-f6eb-7a7a-d51f0a76be0a',
                                data: [
                                    {
                                        placeToSave: [],
                                        uuid: '44315a63-d0d8-4c90-ed14-f92557732f52',
                                        key: 'boucle_next__8',
                                        multiple: false,
                                        type: 'number'
                                    }
                                ]
                            }
                        ],
                        custom: {
                            forEach: false,
                            count: 500,
                            items: []
                        },
                        expressions: [],
                        services: []
                    }
                },
                {
                    uuid: 'f6c463f0-23ac-ec94-7ba9-ee87cc66dd24',
                    key: 'annuler',
                    type: 'TaskUndo',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Annuler'
                            },
                            {
                                lang: 'en-US',
                                value: 'Undo'
                            },
                            {
                                lang: 'es-ES',
                                value: 'Deshacer'
                            }
                        ],
                        iconName: 'fa-solid fa-rotate-left',
                        profil: '5138126f-4252-46f3-8a1d-03369b671d4f'
                    },
                    properties: {
                        transitions: [
                            {
                                uuid: '69ab8b24-0545-c860-12e6-632c19b1ca25',
                                key: 'done',
                                task: 'b6ca2199-fb06-cf40-badc-62f9a1140e1b',
                                data: [],
                                displayName: []
                            }
                        ],
                        custom: {},
                        expressions: [],
                        services: []
                    }
                },
                {
                    uuid: '5a9da229-719c-f6eb-7a7a-d51f0a76be0a',
                    key: 'creer-un-objet',
                    type: 'TaskObjectCreate',
                    general: {
                        displayName: [
                            {
                                lang: 'fr-FR',
                                value: 'Créer un objet'
                            },
                            {
                                lang: 'en-US',
                                value: 'Object Create'
                            },
                            {
                                lang: 'es-ES',
                                value: 'Creación (Smart Object)'
                            }
                        ],
                        iconName: 'fa-solid fa-cube',
                        profil: '5138126f-4252-46f3-8a1d-03369b671d4f'
                    },
                    properties: {
                        transitions: [
                            {
                                uuid: '349f1c4b-04aa-4744-bbb8-93937ec62409',
                                key: 'done',
                                task: '053e7257-4501-1942-d149-970613523fcc',
                                data: [
                                    {
                                        placeToSave: [],
                                        uuid: 'bb2ae14f-9a70-fefb-7afe-4985b90893b5',
                                        key: 'creer-un-objet_done__9',
                                        multiple: false,
                                        type: 'so:preview'
                                    }
                                ],
                                displayName: []
                            }
                        ],
                        custom: {
                            smartModel: 'preview',
                            properties: [
                                {
                                    key: 'TEXT',
                                    value: 'generate'
                                }
                            ],
                            skills: []
                        },
                        expressions: [],
                        services: []
                    }
                }
            ]
        }
    ]
};
export const themePreviewSmartModels = (groupKey: string): SmartModelDto[] => {
    return [{
        uniqueKeys: [],
        uuid: '86885f77-6a61-ff1d-b147-d2f87848f2f2',
        displayName: [
            {
                lang: 'fr-FR',
                value: 'Aperçu du thème'
            },
            {
                lang: 'en-US',
                value: 'Theme Preview'
            },
            {
                lang: 'es-ES',
                value: 'Vista previa del tema'
            }
        ],
        domainKey: 'undefined',
        key: 'preview',
        permissions: {
            R: [],
            RW: [
                groupKey
            ]
        },
        skills: {
            atDocument: false,
            atGeolocation: false,
            atSignature: false,
            atTag: false
        },
        system: false,
        properties: [
            {
                validations: [],
                uuid: 'c57e41eb-676d-308f-b59b-1216edd20320',
                key: 'TEXT',
                keyType: 'string',
                multiple: false,
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Texte'
                    },
                    {
                        lang: 'en-US',
                        value: 'Text'
                    },
                    {
                        lang: 'es-ES',
                        value: 'Texto'
                    }
                ],
                hidden: false,
                permissions: {
                    R: [],
                    RW: [
                        groupKey
                    ]
                },
                required: true,
                system: false
            },
            {
                validations: [],
                uuid: 'adefd9b5-d2c1-858b-3bfd-a002cbee1a63',
                key: 'DATE',
                keyType: 'date',
                multiple: false,
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Date'
                    },
                    {
                        lang: 'en-US',
                        value: 'Date'
                    },
                    {
                        lang: 'es-ES',
                        value: 'Fecha'
                    }
                ],
                hidden: false,
                permissions: {
                    R: [],
                    RW: [
                        groupKey
                    ]
                },
                required: false,
                system: false
            },
            {
                validations: [],
                uuid: '49b4978a-85cc-882e-a34f-23c99d4f14ea',
                key: 'NUMBER',
                keyType: 'number',
                multiple: false,
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Nombre'
                    },
                    {
                        lang: 'en-US',
                        value: 'Number'
                    },
                    {
                        lang: 'es-ES',
                        value: 'Número'
                    }
                ],
                hidden: false,
                permissions: {
                    R: [],
                    RW: [
                        groupKey
                    ]
                },
                required: false,
                system: false
            },
            {
                validations: [],
                uuid: 'd6cc6930-ca81-9a99-f21f-4fa4581e1b39',
                key: 'BOOLEAN',
                keyType: 'boolean',
                multiple: false,
                displayName: [
                    {
                        lang: 'fr-FR',
                        value: 'Booléen'
                    },
                    {
                        lang: 'en-US',
                        value: 'Boolean'
                    },
                    {
                        lang: 'es-ES',
                        value: 'Booleano'
                    }
                ],
                hidden: false,
                permissions: {
                    R: [],
                    RW: [
                        groupKey
                    ]
                },
                required: false,
                system: false
            }
        ]
    }];
};
