import { SnPageWidgetDto } from '@algotech-ce/core';
export const headerWebWideTabsSolid: SnPageWidgetDto = {
    id: '54d60317-4a7b-1785-95fe-a1006ff0248e',
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
        hideRevealEffect: false,
    },
    afterTemplatePlaced: {
        box: [
            {
                widgetName: 'Header',
                anchors: ['left', 'right'],
            },
            {
                widgetName: 'Profile',
                anchors: ['right'],
            },
            {
                widgetName: 'Notifications',
                anchors: ['right'],
            }
        ],
    },
    box: {
        x: 0,
        y: 0,
        width: 630,
        height: 60
    },
    events: [
    ],
    rules: [
    ],
    group: {
        widgets: [
            {
                id: '2e7f02d9-ec0f-e7a6-b041-8e7aea1546fa',
                typeKey: 'text',
                name: 'Title',
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
                        'font-size': '18px',
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
                            value: 'Header'
                        },
                        {
                            lang: 'en-US',
                            value: 'Header'
                        },
                        {
                            lang: 'es-ES',
                            value: 'Header'
                        }
                    ],
                    iterable: true,
                    disabled: false,
                    hidden: false,
                    locked: false
                },
                box: {
                    x: 20,
                    y: 10,
                    width: 80,
                    height: 40
                },
                events: [
                    {
                        id: 'ea4b8985-a76c-a778-8f90-ba9ed78b4b72',
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
                id: '07cc83ae-5c7f-f2e9-1663-ce42e4590aec',
                typeKey: 'tabs',
                name: 'TabClearVertical',
                isActive: false,
                css: {
                    tabs: {
                        'flex-direction': 'row',
                        'justify-content': 'flex-start',
                        gap: '5px'
                    },
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
                    iterable: true,
                    hidden: false,
                    locked: false,
                    selectedTabId: 'd76eb9ef-c7a1-0a81-e2e4-62e4be95ae91'
                },
                box: {
                    x: 120,
                    y: 15,
                    width: 300,
                    height: 30
                },
                events: [
                ],
                rules: [
                ],
                group: {
                    widgets: [
                        {
                            id: 'd80d8f60-681a-4098-afa6-4191c6bf1252',
                            typeKey: 'tabModel',
                            name: 'APP-WIDGET-TAB-MODEL',
                            isActive: false,
                            css: {
                                text: {
                                    color: 'var(--ALGOTECH-BACKGROUND)',
                                    'font-size': '12px',
                                    'justify-content': 'center',
                                    'align-items': 'center',
                                    'font-style': 'normal',
                                    'text-decoration': 'none',
                                    'font-weight': 'bold',
                                    margin: '0px 0px 0px 0px',
                                    padding: '0px 0px 0px 0px'
                                },
                                main: {
                                    'background-color': '#455d7a00',
                                    'border-top': 'none',
                                    'border-right': 'none',
                                    'border-bottom': 'none',
                                    'border-left': 'none',
                                    'border-radius': '8px 8px 8px 8px',
                                    'box-shadow': 'unset'
                                },
                                icon: {
                                    'flex-direction': 'row',
                                    'font-size': '15px',
                                    color: 'var(--ALGOTECH-PRIMARY)',
                                    padding: '10px 10px 10px 10px',
                                    margin: '0px 0px 0px 0px'
                                },
                                tab: {
                                    'flex-direction': 'row',
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
                            id: '533fd8b9-a04a-4924-a2e5-d765b57c8abb',
                            typeKey: 'tabModel',
                            name: 'APP-WIDGET-TAB-MODEL',
                            isActive: false,
                            css: {
                                text: {
                                    color: 'var(--ALGOTECH-PRIMARY)',
                                    'font-size': '12px',
                                    'justify-content': 'center',
                                    'align-items': 'center',
                                    'font-style': 'normal',
                                    'text-decoration': 'none',
                                    'font-weight': 'bold',
                                    margin: '0px 0px 0px 0px',
                                    padding: '0px 0px 0px 0px'
                                },
                                main: {
                                    'background-color': 'var(--ALGOTECH-BACKGROUND)',
                                    'border-top': 'none',
                                    'border-right': 'none',
                                    'border-bottom': 'none',
                                    'border-left': 'none',
                                    'border-radius': '5px 5px 5px 5px',
                                    'box-shadow': 'unset'
                                },
                                icon: {
                                    'flex-direction': 'row',
                                    'font-size': '15px',
                                    color: 'var(--ALGOTECH-BACKGROUND)',
                                    padding: '10px 10px 10px 10px',
                                    margin: '0px'
                                },
                                tab: {
                                    'flex-direction': 'row',
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
                            id: 'd76eb9ef-c7a1-0a81-e2e4-62e4be95ae91',
                            typeKey: 'tab',
                            name: 'Onglet',
                            isActive: false,
                            css: {
                            },
                            custom: {
                                tabId: 'd76eb9ef-c7a1-0a81-e2e4-62e4be95ae91',
                                disabled: false,
                                icon: '',
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
                                height: 50,
                                width: 80
                            },
                            events: [
                                {
                                    id: '379848b9-1355-3069-6e1d-22fc136637a4',
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
                            id: '6adec86a-481a-dfc7-96ce-b62496c91be3',
                            typeKey: 'tab',
                            name: 'Onglet',
                            isActive: false,
                            css: {
                            },
                            custom: {
                                tabId: '6adec86a-481a-dfc7-96ce-b62496c91be3',
                                disabled: false,
                                icon: '',
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
                                height: 40,
                                width: 80
                            },
                            events: [
                                {
                                    id: '67fc8a1f-a0f4-f2e9-4033-6791124029c4',
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
                            id: '6c76177f-43b1-b73a-a404-baa8b2d9fd2d',
                            typeKey: 'tab',
                            name: 'Onglet',
                            isActive: false,
                            css: {
                            },
                            custom: {
                                tabId: '6c76177f-43b1-b73a-a404-baa8b2d9fd2d',
                                disabled: false,
                                icon: '',
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
                                height: 40,
                                width: 80
                            },
                            events: [
                                {
                                    id: 'f6d1bfa0-9985-1b29-e66c-4049218fecb5',
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
            },
            {
                id: '4425f66a-49f2-6328-fb62-26bd4e66bb77',
                typeKey: 'notification',
                name: 'Notifications',
                isActive: false,
                css: {
                    main: {
                        'background-color': '#ffffff00',
                        'border-radius': '22px 22px 22px 22px',
                        'box-shadow': 'unset',
                        'border-top': 'none',
                        'border-right': 'none',
                        'border-bottom': 'none',
                        'border-left': 'none'
                    },
                    icon: {
                        color: 'var(--ALGOTECH-BACKGROUND)',
                        'font-size': '16px',
                        padding: '0px 0px 0px 0px',
                        margin: '0px 0px 0px 0px'
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
                    icon: 'fa-solid fa-bell'
                },
                box: {
                    x: 510,
                    y: 10,
                    width: 40,
                    height: 40
                },
                events: [
                ],
                rules: [
                ],
                locked: false,
                lockedProperties: [
                ],
            },
            {
                id: '3f36dc6b-f48c-cf16-45d3-c327972778e0',
                typeKey: 'profile',
                name: 'Profile',
                isActive: false,
                css: {
                    main: {
                        'background-color': 'var(--ALGOTECH-BACKGROUND)',
                        'border-radius': '22px 22px 22px 22px',
                        'box-shadow': 'unset',
                        'border-top': 'none',
                        'border-right': 'none',
                        'border-bottom': 'none',
                        'border-left': 'none'
                    },
                    icon: {
                        color: 'var(--ALGOTECH-PRIMARY)',
                        'font-size': '16px',
                        padding: '10px',
                        margin: '0px 6px'
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
                    icon: 'fa-solid fa-user'
                },
                box: {
                    x: 567,
                    y: 10,
                    width: 40,
                    height: 40
                },
                events: [
                ],
                rules: [
                ],
                locked: false,
                lockedProperties: [
                ],
            }
        ]
    },
};
