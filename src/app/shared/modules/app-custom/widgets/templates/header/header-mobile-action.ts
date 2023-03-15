
import { SnPageWidgetDto } from '@algotech/core';
export const headerMobileAction: SnPageWidgetDto = {
    id: '4e66010a-91e8-0178-3780-b8ed53c88974',
    typeKey: 'header',
    name: 'Header',
    isActive: false,
    css: {
        main: {
            'background-color': 'var(--ALGOTECH-PRIMARY)',
            'border-top': 'none',
            'border-right': 'none',
            'border-bottom': 'none',
            'border-left': 'none',
            'border-radius': '0px 0px 0px 0px',
            'box-shadow': 'unset'
        }
    },
    custom: {
        iterable: false,
        hidden: false,
        locked: false,
        hideRevealEffect: false
    },
    afterTemplatePlaced: {
        box: [
            {
                widgetName: 'Header',
                anchors: ['left', 'right'],
            },
            {
                widgetName: 'Button',
                anchors: ['right'],
            }
        ],
    },
    box: {
        x: 0,
        y: 0,
        width: 300,
        height: 40
    },
    events: [
    ],
    rules: [
    ],
    group: {
        widgets: [
            {
                id: '5c882914-e535-2302-a383-ee1c5c342d64',
                typeKey: 'selector',
                name: 'mobileSelector',
                isActive: false,
                css: {
                    main: {
                        'background-color': '#ffffff00',
                        'border-radius': '4px 4px 4px 4px',
                        'box-shadow': 'unset',
                        'border-top': 'none',
                        'border-right': 'none',
                        'border-bottom': 'none',
                        'border-left': 'none'
                    },
                    icon: {
                        color: 'var(--ALGOTECH-BACKGROUND)',
                        'font-size': '16px',
                        padding: '10px 10px 10px 10px',
                        margin: '0px 6px 0px 6px'
                    },
                    layout: {
                        'flex-direction': 'row',
                        'justify-content': 'center',
                        'align-items': 'center',
                        gap: '0px'
                    }
                },
                custom: {
                    action: '',
                    iterable: false,
                    disabled: false,
                    hidden: false,
                    locked: false,
                    icon: 'fa-solid fa-bars'
                },
                box: {
                    x: 0,
                    y: 0,
                    width: 40,
                    height: 40
                },
                events: [
                ],
                rules: [
                ],
            },
            {
                id: 'a5a9c679-46a2-eb03-9c06-aef2228e4c3f',
                typeKey: 'text',
                name: 'SimpleTitle',
                isActive: false,
                css: {
                    main: {
                        'background-color': '#ffffff00',
                        'border-radius': '4px 4px 4px 4px',
                        'box-shadow': 'unset',
                        'border-top': 'none',
                        'border-right': 'none',
                        'border-bottom': 'none',
                        'border-left': 'none'
                    },
                    text: {
                        color: 'var(--ALGOTECH-BACKGROUND)',
                        'font-size': '20px',
                        'justify-content': 'flex-start',
                        'text-align': 'left',
                        'font-style': 'normal',
                        'text-decoration': 'none',
                        'font-weight': 'normal',
                        padding: '0px 5px 0px 5px',
                        margin: '0px 0px 0px 0px'
                    },
                    layout: {
                        'align-items': 'center'
                    }
                },
                custom: {
                    text: [
                        {
                            lang: 'fr-FR',
                            value: '{{system.page-name}}'
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
                    iterable: true,
                    disabled: false,
                    hidden: false,
                    locked: false,
                    preview: [
                        {
                            lang: 'fr-FR',
                            value: 'Titre de la page'
                        },
                        {
                            lang: 'en-US',
                            value: ''
                        },
                        {
                            lang: 'es-ES',
                            value: ''
                        }
                    ]
                },
                box: {
                    x: 40,
                    y: 5,
                    width: 220,
                    height: 30
                },
                events: [
                    {
                        id: '96e74f6c-4a67-4736-cb66-0e0241a3fe43',
                        eventKey: 'onClick',
                        pipe: [
                        ],
                        custom: {
                            mode: 'sequence'
                        }
                    }
                ],
                rules: [
                ],
            },
            {
                id: '7bdd8d91-1dbf-366d-cc78-aca38441e133',
                typeKey: 'button',
                name: 'Button',
                isActive: false,
                css: {
                    button: {
                        'background-color': '#ffffff00',
                        'border-radius': '50px 50px 50px 50px',
                        'box-shadow': 'unset',
                        'border-top': 'none',
                        'border-right': 'none',
                        'border-bottom': 'none',
                        'border-left': 'none'
                    },
                    text: {
                        color: 'var(--ALGOTECH-PRIMARY)',
                        'font-size': '35px',
                        'font-style': 'normal',
                        'text-decoration': 'none',
                        'font-weight': 'bold',
                        padding: '0px 0px 0px 0px',
                        margin: '0px 0px 0px 0px'
                    },
                    icon: {
                        color: 'var(--ALGOTECH-BACKGROUND)',
                        'font-size': '16px',
                        padding: '0px 0px 0px 0px',
                        margin: '10px 10px 10px 10px'
                    },
                    layout: {
                        'flex-direction': 'row',
                        'justify-content': 'center',
                        'align-items': 'center'
                    }
                },
                custom: {
                    title: [
                        {
                            lang: 'fr-FR',
                            value: ''
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
                    action: '',
                    iterable: true,
                    disabled: false,
                    hidden: false,
                    locked: false,
                    icon: 'fa-solid fa-ellipsis-vertical'
                },
                box: {
                    x: 260,
                    y: 0,
                    width: 40,
                    height: 40
                },
                events: [
                    {
                        id: 'dfa37a6b-2edd-9cdf-e7af-1d3fc71ad51c',
                        eventKey: 'onClick',
                        pipe: [
                        ],
                        custom: {
                            mode: 'sequence'
                        }
                    }
                ],
                rules: [
                ],
                locked: false,
                lockedProperties: [
                ]
            }
        ]
    },
};
