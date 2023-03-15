import { SmartModelDto } from '@algotech/core';

export const machineModelFixture: SmartModelDto = {
    uniqueKeys: [
        'NAME',
        'DESIGNATION'
    ],
    uuid: '6adf8900-ca10-fd69-f90e-9f75fad50999',
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Machine'
        },
        {
            lang: 'en-US',
            value: 'Asset'
        },
        {
            lang: 'es-ES',
            value: ''
        }
    ],
    domainKey: 'undefined',
    key: 'machine',
    permissions: {
        R: [],
        RW: [
            'admin',
            'sadmin',
            'plan-editor',
            'viewer',
            'technicien',
            'process-manager',
            'admin-elec',
            'toto'
        ]
    },
    skills: {
        atDocument: true,
        atGeolocation: true,
        atSignature: true,
        atTag: true,
        atMagnet: true
    },
    system: false,
    properties: [
        {
            validations: [],
            uuid: '7c1e4f7a-bc25-acbd-944c-1941e54460d8',
            key: 'NAME',
            keyType: 'string',
            multiple: false,
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Nom'
                },
                {
                    lang: 'en-US',
                    value: 'CMMS ID'
                }
            ],
            hidden: false,
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'sadmin',
                    'plan-editor',
                    'viewer',
                    'technicien',
                    'process-manager',
                    'admin-elec',
                    'toto'
                ]
            },
            required: true,
            system: false
        },
        {
            validations: [],
            uuid: '313f31cb-039a-0e2e-6edb-d498d22a44b5',
            key: 'DESIGNATION',
            keyType: 'string',
            multiple: false,
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'DESIGNATION'
                },
                {
                    lang: 'en-US',
                    value: 'Designation'
                }
            ],
            hidden: false,
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'sadmin',
                    'plan-editor',
                    'viewer',
                    'technicien',
                    'process-manager',
                    'admin-elec',
                    'toto'
                ]
            },
            required: true,
            system: false
        },
        {
            validations: [],
            uuid: 'ae4c91b9-5a7a-ce81-956e-cc888d64cc54',
            key: 'LINE',
            keyType: 'string',
            multiple: false,
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Ligne'
                },
                {
                    lang: 'en-US',
                    value: 'Line'
                }
            ],
            hidden: false,
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'sadmin',
                    'plan-editor',
                    'viewer',
                    'technicien',
                    'process-manager',
                    'admin-elec',
                    'toto'
                ]
            },
            required: false,
            system: false
        },
        {
            validations: [],
            uuid: 'cdb4864c-e258-d0f0-44ec-616e733c7536',
            key: 'TEST',
            keyType: 'string',
            multiple: false,
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Test'
                },
                {
                    lang: 'en-US',
                    value: ''
                }
            ],
            hidden: false,
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'sadmin',
                    'plan-editor',
                    'viewer',
                    'technicien',
                    'process-manager',
                    'admin-elec',
                    'toto'
                ]
            },
            required: false,
            system: false
        },
        {
            validations: [],
            uuid: 'e9fb2806-a6c3-95a3-4fd4-fc18de8632c5',
            key: 'DATE',
            keyType: 'date',
            multiple: false,
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Date Mes'
                },
                {
                    lang: 'en-US',
                    value: ''
                }
            ],
            hidden: false,
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'sadmin',
                    'plan-editor',
                    'viewer',
                    'technicien',
                    'process-manager',
                    'admin-elec',
                    'toto'
                ]
            },
            required: false,
            system: false
        },
        {
            validations: [],
            uuid: 'ff2feef2-db22-a4b2-3c95-241ed729128f',
            key: 'UTILITE',
            keyType: 'string',
            multiple: false,
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Utilite'
                },
                {
                    lang: 'en-US',
                    value: ''
                }
            ],
            hidden: true,
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'sadmin',
                    'plan-editor',
                    'viewer',
                    'technicien',
                    'process-manager',
                    'admin-elec',
                    'toto'
                ]
            },
            required: false,
            system: false
        },
        {
            validations: [],
            uuid: 'ec535803-9d34-829d-7fc7-c7662f591c7a',
            key: 'TEST_NOM_FORMULE',
            keyType: 'string',
            multiple: false,
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'test_nom_formule'
                },
                {
                    lang: 'en-US',
                    value: ''
                }
            ],
            hidden: false,
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'sadmin',
                    'plan-editor',
                    'viewer',
                    'technicien',
                    'process-manager',
                    'admin-elec',
                    'toto'
                ]
            },
            required: false,
            system: false
        },
        {
            validations: [],
            uuid: 'be7e4687-a787-ca08-6cb2-54effed19349',
            key: 'SITE',
            keyType: 'string',
            multiple: false,
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Site'
                },
                {
                    lang: 'en-US',
                    value: ''
                }
            ],
            hidden: false,
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'sadmin',
                    'plan-editor',
                    'viewer',
                    'technicien',
                    'process-manager',
                    'admin-elec',
                    'toto'
                ]
            },
            required: false,
            system: false
        },
        {
            validations: [],
            uuid: 'e5f09aed-7e5b-2d27-1665-41bff910eafc',
            key: 'BATIMENT',
            keyType: 'string',
            multiple: false,
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Bâtiment'
                },
                {
                    lang: 'en-US',
                    value: ''
                }
            ],
            hidden: false,
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'sadmin',
                    'plan-editor',
                    'viewer',
                    'technicien',
                    'process-manager',
                    'admin-elec',
                    'toto'
                ]
            },
            required: false,
            system: false
        },
        {
            validations: [],
            uuid: '51fa8b19-fa11-4031-a1ac-0d6af79f5632',
            key: 'HTML',
            keyType: 'html',
            multiple: false,
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Infos HTML'
                },
                {
                    lang: 'en-US',
                    value: 'HTML Infos'
                }
            ],
            hidden: false,
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'sadmin',
                    'plan-editor',
                    'viewer',
                    'technicien',
                    'process-manager',
                    'admin-elec',
                    'toto'
                ]
            },
            required: false,
            system: false
        },
        {
            validations: [],
            uuid: '5248f7ce-5dfb-5fdd-9092-7258fa8a054d',
            key: 'MULTI',
            keyType: 'string',
            multiple: true,
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'multi'
                },
                {
                    lang: 'en-US',
                    value: ''
                },
                {
                    lang: 'es-ES',
                    value: ''
                }
            ],
            hidden: false,
            permissions: {
                R: [],
                RW: [
                    'admin',
                    'sadmin',
                    'plan-editor',
                    'viewer',
                    'technicien',
                    'process-manager',
                    'admin-elec',
                    'toto'
                ]
            },
            required: false,
            system: false
        }
    ],
    createdDate: '2021-05-19T07:58:51.980Z',
    updateDate: '2021-08-30T02:38:25.000Z'
};
