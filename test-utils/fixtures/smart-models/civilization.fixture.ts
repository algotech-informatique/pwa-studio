import { SmartModelDto } from '@algotech/core';

export const civilizationModelFixture: SmartModelDto = {
    uuid: '7dee8bee-5c94-ef7e-0f43-f9fb4d292bc7',
    createdDate: '2022-01-20T13:11:55.997Z',
    updateDate: '2022-03-09T15:45:11.310Z',
    key: 'civilization',
    system: true,
    uniqueKeys: [],
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Civilization'
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
    domainKey: '23d59765-e633-1112-8684-5cc0d141b3c4',
    properties: [
        {
            uuid: '73a3573c-eb78-c531-17ed-12cc33dccbda',
            key: 'ID',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'id'
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
            keyType: 'number',
            multiple: false,
            required: false,
            system: false,
            hidden: false,
            validations: [],
            permissions: {
                R: [],
                RW: [
                    'admin-elec',
                    'plan-editor',
                    'process-manager',
                    'sadmin',
                    'toto',
                    'viewer'
                ]
            }
        },
        {
            uuid: '3499b3f0-0bdf-e1fd-40c6-c6b7e752e2b6',
            key: 'NAME',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'name'
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
            keyType: 'string',
            multiple: false,
            required: false,
            system: false,
            hidden: false,
            validations: [],
            permissions: {
                R: [],
                RW: [
                    'admin-elec',
                    'plan-editor',
                    'process-manager',
                    'sadmin',
                    'toto',
                    'viewer'
                ]
            }
        },
        {
            uuid: '69a629f4-ef05-5c2b-1bae-253c67ea0002',
            key: 'EXPANSION',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'expansion'
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
            keyType: 'string',
            multiple: false,
            required: false,
            system: false,
            hidden: false,
            validations: [],
            permissions: {
                R: [],
                RW: [
                    'admin-elec',
                    'plan-editor',
                    'process-manager',
                    'sadmin',
                    'toto',
                    'viewer'
                ]
            }
        },
        {
            uuid: '2bced1a1-97dc-66de-216c-1f4e60f2d4f0',
            key: 'ARMY_TYPE',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'army_type'
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
            keyType: 'string',
            multiple: false,
            required: false,
            system: false,
            hidden: false,
            validations: [],
            permissions: {
                R: [],
                RW: [
                    'admin-elec',
                    'plan-editor',
                    'process-manager',
                    'sadmin',
                    'toto',
                    'viewer'
                ]
            }
        },
        {
            uuid: '4cfcfa80-9b61-2a6a-feba-c73bb45f449c',
            key: 'UNIQUE_UNIT',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'unique_unit'
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
            keyType: 'so:unit',
            multiple: true,
            required: false,
            system: false,
            hidden: false,
            validations: [],
            permissions: {
                R: [],
                RW: [
                    'admin-elec',
                    'plan-editor',
                    'process-manager',
                    'sadmin',
                    'toto',
                    'viewer'
                ]
            }
        },
        {
            uuid: 'cde72e82-2659-2797-da75-11c9fc39ac2f',
            key: 'UNIQUE_TECH',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'unique_tech'
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
            keyType: 'so:tech',
            multiple: true,
            required: false,
            system: false,
            hidden: false,
            validations: [],
            permissions: {
                R: [],
                RW: [
                    'admin-elec',
                    'plan-editor',
                    'process-manager',
                    'sadmin',
                    'toto',
                    'viewer'
                ]
            }
        },
        {
            uuid: '3e58b898-a125-3e7b-b9cd-c5763e4efb8a',
            key: 'TEAM_BONUS',
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'team_bonus'
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
            keyType: 'string',
            multiple: false,
            required: false,
            system: false,
            hidden: false,
            validations: [],
            permissions: {
                R: [],
                RW: [
                    'admin-elec',
                    'plan-editor',
                    'process-manager',
                    'sadmin',
                    'toto',
                    'viewer'
                ]
            }
        }
    ],
    skills: {
        atGeolocation: false,
        atDocument: false,
        atSignature: false,
        atTag: false,
        atMagnet: false
    },
    permissions: {
        R: [],
        RW: [
            'admin-elec',
            'plan-editor',
            'process-manager',
            'sadmin',
            'toto',
            'viewer'
        ]
    }
};
