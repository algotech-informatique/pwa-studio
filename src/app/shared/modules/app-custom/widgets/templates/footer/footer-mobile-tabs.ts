
import { SnPageWidgetDto } from '@algotech-ce/core';
export const footerMobileTabs: SnPageWidgetDto = {
    id: '3f2ac324-a11d-c4a7-62eb-80098deb6542',
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
        locked: false,
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
        height: 82
    },
    events: [
    ],
    rules: [
    ],
    group: {
        widgets: [
            {
                id: '5887f38c-7c4c-38af-1d5b-c996a7b8f276',
                typeKey: 'tabs',
                name: 'Tabs',
                isActive: false,
                css: {
                    tabs: {
                        'flex-direction': 'row',
                        'justify-content': 'center',
                        gap: '0px'
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
                    selectedTabId: '32ea240e-99b4-ec6b-8548-851510cea8c0'
                },
                box: {
                    x: 0,
                    y: 0,
                    width: 300,
                    height: 82
                },
                events: [
                ],
                rules: [
                ],
                group: {
                    widgets: [

                        {
                            id: '42e36dce-8359-46a6-a93f-520c762964a0',
                            typeKey: 'tabModel',
                            name: 'APP-WIDGET-TAB-MODEL',
                            isActive: false,
                            css: {
                                text: {
                                    color: 'var(--ALGOTECH-TERTIARY-TINT)',
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
                            id: '5d875cfd-3dd6-42f9-bd45-b2fa500d6342',
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
                                    color: 'var(--ALGOTECH-SUCCESS)',
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
                            id: '32ea240e-99b4-ec6b-8548-851510cea8c0',
                            typeKey: 'tab',
                            name: 'Onglet',
                            isActive: false,
                            css: {
                            },
                            custom: {
                                tabId: '32ea240e-99b4-ec6b-8548-851510cea8c0',
                                disabled: false,
                                icon: 'fa-solid fa-home',
                                text: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Home'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Home'
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: 'Home'
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
                                width: 80
                            },
                            events: [
                                {
                                    id: 'c5ff0b8f-d0aa-f3da-13d2-fb269f7f0fdf',
                                    eventKey: 'onClick',
                                    pipe: [],
                                    custom: {
                                        mode: 'sequence'
                                    }
                                }
                            ],
                            rules: [
                            ],
                        },
                        {
                            id: '3f75fea5-bed2-ffb2-d18b-df8fc1aba69b',
                            typeKey: 'tab',
                            name: 'Onglet',
                            isActive: false,
                            css: {
                            },
                            custom: {
                                tabId: '3f75fea5-bed2-ffb2-d18b-df8fc1aba69b',
                                disabled: false,
                                icon: 'fa-solid fa-circle-info',
                                text: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'Info'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'Info'
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: 'Info'
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
                                width: 80
                            },
                            events: [
                                {
                                    id: '0edf3be3-e866-e4e8-56f9-181a2d01a219',
                                    eventKey: 'onClick',
                                    pipe: [],
                                    custom: {
                                        mode: 'sequence'
                                    }
                                }
                            ],
                            rules: [
                            ],
                        },
                        {
                            id: '2ae40d97-8aa1-427b-c346-b63e53940558',
                            typeKey: 'tab',
                            name: 'Onglet',
                            isActive: false,
                            css: {
                            },
                            custom: {
                                tabId: '2ae40d97-8aa1-427b-c346-b63e53940558',
                                disabled: false,
                                icon: 'fa-solid fa-ellipsis-vertical',
                                text: [
                                    {
                                        lang: 'fr-FR',
                                        value: 'More'
                                    },
                                    {
                                        lang: 'en-US',
                                        value: 'More'
                                    },
                                    {
                                        lang: 'es-ES',
                                        value: 'More'
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
                                width: 80
                            },
                            events: [
                                {
                                    id: 'a4909b09-4881-7490-fb5f-85a7d81249df',
                                    eventKey: 'onClick',
                                    pipe: [],
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
