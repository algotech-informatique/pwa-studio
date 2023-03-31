
import { SnPageWidgetDto } from '@algotech-ce/core';
export const footerMobileTabsIconOnly: SnPageWidgetDto = {
    id: '0a1767d8-ab1e-fdb4-a644-6f52f171cfe8',
    typeKey: 'footer',
    name: 'Footer',
    isActive: false,
    css: {
        main: {
            'background-color': 'var(--ALGOTECH-BACKGROUND-HOVER)',
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
        locked: false
    },
    afterTemplatePlaced: {
        box: [
            {
                widgetName: 'Footer',
                anchors: ['right', 'left'],
            },
            {
                widgetName: 'Tabs',
                anchors: ['right', 'left']
            },
        ],
    },
    box: {
        x: 0,
        y: 0,
        width: 300,
        height: 72
    },
    events: [
    ],
    rules: [
    ],
    group: {
        widgets: [
            {
                id: '55238501-b05f-1473-d41e-2ed2c6584d6d',
                typeKey: 'tabs',
                name: 'Tabs',
                isActive: false,
                css: {
                    tabs: {
                        'flex-direction': 'row',
                        'justify-content': 'center',
                        gap: '20px'
                    },
                    main: {
                        'background-color': '#FFFFFF00',
                        'border-top': 'none',
                        'border-right': 'none',
                        'border-bottom': 'none',
                        'border-left': 'none',
                        'border-radius': '0px 0px 0px 0px',
                        'box-shadow': 'unset'
                    }
                },
                custom: {
                    iterable: true,
                    hidden: false,
                    locked: false,
                    selectedTabId: '2e753905-d5ec-03ef-8621-ae206a1521e3'
                },
                box: {
                    x: 0,
                    y: 10,
                    width: 300,
                    height: 52
                },
                events: [
                ],
                rules: [
                ],
                group: {
                    widgets: [
                        {
                            id: 'e5fdcc84-9e63-0274-59c8-69b76dd9f771',
                            typeKey: 'tabModel',
                            name: 'APP-WIDGET-TAB-MODEL',
                            isActive: false,
                            css: {
                                text: {
                                    color: 'var(--ALGOTECH-TERTIARY)',
                                    'font-size': '14px',
                                    'justify-content': 'center',
                                    'align-items': 'center',
                                    'font-style': 'normal',
                                    'text-decoration': 'none',
                                    'font-weight': 'normal'
                                },
                                main: {
                                    'background-color': '#FFFFFF00',
                                    'border-top': 'none',
                                    'border-right': 'none',
                                    'border-bottom': 'none',
                                    'border-left': 'none',
                                    'border-radius': '0px 0px 0px 0px',
                                    'box-shadow': 'unset'
                                },
                                icon: {
                                    'flex-direction': 'row',
                                    'font-size': '20px',
                                    color: 'var(--ALGOTECH-TERTIARY-TINT)',
                                    padding: '5px 5px 5px 5px',
                                    margin: '0px'
                                },
                                tab: {
                                    'flex-direction': 'column',
                                    'justify-content': 'center',
                                    'align-items': 'center'
                                }
                            },
                            custom: {
                                selected: false,
                                icon: 'fa-solid fa-columns'
                            },
                            box: {
                                x: 0,
                                y: 0,
                                height: 0,
                                width: 0
                            },
                            events: [
                            ],
                            rules: [
                            ],
                            locked: false,
                            lockedProperties: [
                            ]
                        },
                        {
                            id: 'feab8186-5b20-bce5-96ab-82b9a36ee65e',
                            typeKey: 'tabModel',
                            name: 'APP-WIDGET-TAB-MODEL',
                            isActive: false,
                            css: {
                                text: {
                                    color: 'var(--ALGOTECH-SUCCESS)',
                                    'font-size': '14px',
                                    'justify-content': 'center',
                                    'align-items': 'center',
                                    'font-style': 'normal',
                                    'text-decoration': 'none',
                                    'font-weight': 'normal'
                                },
                                main: {
                                    'background-color': 'var(--ALGOTECH-SUCCESS)',
                                    'border-top': 'none',
                                    'border-right': 'none',
                                    'border-bottom': 'none',
                                    'border-left': 'none',
                                    'border-radius': '20px 20px 20px 20px',
                                    'box-shadow': 'unset'
                                },
                                icon: {
                                    'flex-direction': 'row',
                                    'font-size': '20px',
                                    color: 'var(--ALGOTECH-BACKGROUND)',
                                    padding: '5px 5px 5px 5px',
                                    margin: '0px'
                                },
                                tab: {
                                    'flex-direction': 'column',
                                    'justify-content': 'center',
                                    'align-items': 'center'
                                }
                            },
                            custom: {
                                selected: true,
                                icon: 'fa-solid fa-columns'
                            },
                            box: {
                                x: 0,
                                y: 0,
                                height: 0,
                                width: 0
                            },
                            events: [
                            ],
                            rules: [
                            ],
                            locked: false,
                            lockedProperties: [
                            ]
                        },
                        {
                            id: '2e753905-d5ec-03ef-8621-ae206a1521e3',
                            typeKey: 'tab',
                            name: 'Onglet',
                            isActive: false,
                            css: {
                            },
                            custom: {
                                tabId: '2e753905-d5ec-03ef-8621-ae206a1521e3',
                                disabled: false,
                                icon: 'fa-solid fa-home',
                                text: [
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
                                page: '',
                                pageInputs: [
                                ],
                                iterable: false,
                                hidden: false,
                                locked: false,
                            },
                            box: {
                                x: 0,
                                y: 0,
                                height: 82,
                                width: 50
                            },
                            events: [
                                {
                                    id: 'c5ff0b8f-d0aa-f3da-13d2-fb269f7f0fdf',
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
                            id: '8e6b9f50-72dd-d421-a2bc-44d85ec8841a',
                            typeKey: 'tab',
                            name: 'Onglet',
                            isActive: false,
                            css: {
                            },
                            custom: {
                                tabId: '8e6b9f50-72dd-d421-a2bc-44d85ec8841a',
                                disabled: false,
                                icon: 'fa-solid fa-circle-info',
                                text: [
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
                                page: '',
                                pageInputs: [
                                ],
                                iterable: false,
                                hidden: false,
                                locked: false,
                            },
                            box: {
                                x: 0,
                                y: 0,
                                height: 82,
                                width: 50
                            },
                            events: [
                                {
                                    id: '0edf3be3-e866-e4e8-56f9-181a2d01a219',
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
                            id: 'c2ff45d1-bfe5-951d-a703-b75f17d3258c',
                            typeKey: 'tab',
                            name: 'Onglet',
                            isActive: false,
                            css: {
                            },
                            custom: {
                                tabId: 'c2ff45d1-bfe5-951d-a703-b75f17d3258c',
                                disabled: false,
                                icon: 'fa-solid fa-ellipsis-vertical',
                                text: [
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
                                page: '',
                                pageInputs: [
                                ],
                                iterable: false,
                                hidden: false,
                                locked: false,
                            },
                            box: {
                                x: 0,
                                y: 0,
                                height: 82,
                                width: 50
                            },
                            events: [
                                {
                                    id: 'a4909b09-4881-7490-fb5f-85a7d81249df',
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
                lockedProperties : [
                    'selected.tabs'
                ],
            }
        ]
    },
};
