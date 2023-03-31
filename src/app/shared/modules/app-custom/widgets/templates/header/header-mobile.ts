import { SnPageWidgetDto } from '@algotech-ce/core';
export const headerMobile: SnPageWidgetDto = {
    id: '470b7970-a5d4-03a7-5809-7b42f44c488e',
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
                id: 'd6f69408-a0fe-5479-5305-856e3713e0cf',
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
                id: '49143b0e-9adf-1c99-81e9-46badfd3b03f',
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
            }
        ]
    },
};
