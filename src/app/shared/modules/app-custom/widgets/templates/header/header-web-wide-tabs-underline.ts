
import { SnPageWidgetDto } from '@algotech-ce/core';
export const headerWebWideTabsUnderline: SnPageWidgetDto = {
    id: '56bfd83d-97c5-3b22-041a-85e46713340e',
    typeKey: 'header',
    name: 'Header',
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
            },
            {
                widgetName: 'Tabs',
                anchors: ['right', 'left'],
            }
        ],
    },
    box: {
        x: 0,
        y: 0,
        width: 660,
        height: 60
    },
    events: [
    ],
    rules: [
    ],
    group: {
        widgets: [
            {
                id: '49ebb73a-1b46-a61c-6149-27bdb91ec538',
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
                        color: 'var(--ALGOTECH-TERTIARY)',
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
                        id: '15c9e482-7f30-facf-f16d-55932a20fe42',
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
                id: '21ac7998-ddf9-2ca8-b812-a5b230dfe3b1',
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
                        color: 'var(--ALGOTECH-PRIMARY)',
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
                    x: 540,
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
                id: '82553691-9599-bf95-6d47-08455c92d9ca',
                typeKey: 'profile',
                name: 'Profile',
                isActive: false,
                css: {
                    main: {
                        'background-color': 'var(--ALGOTECH-PRIMARY)',
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
                    icon: 'fa-solid fa-user'
                },
                box: {
                    x: 597,
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
                id: 'e0456d35-a286-c4ea-e451-810ab96b2e35',
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
                    selectedTabId: 'bf3833d6-b9c2-76bb-551c-82b4a305d88d'
                },
                box: {
                    x: 132,
                    y: 10,
                    width: 375,
                    height: 50
                },
                events: [
                ],
                rules: [
                ],
                group: {
                    widgets: [
                        {
                            id: '3ec4d1be-d51e-49b7-a202-52e4d6d9549d',
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
                                    'border-top': '5px solid #00000000',
                                    'border-right': 'none',
                                    'border-bottom': '5px solid #00000000',
                                    'border-left': 'none',
                                    'border-radius': '0px 0px 0px 0px',
                                    'box-shadow': 'unset'
                                },
                                icon: {
                                    'flex-direction': 'row',
                                    'font-size': '14px',
                                    color: 'var(--ALGOTECH-TERTIARY)',
                                    padding: '8px 8px 8px 8px',
                                    margin: '0px 0px 0px 0px'
                                },
                                tab: {
                                    'flex-direction': 'row',
                                    'justify-content': 'flex-start',
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
                            id: '38ce248c-51c0-4632-856b-69fc9a842c57',
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
                                    'border-top': '5px solid #00000000',
                                    'border-right': 'none',
                                    'border-bottom': '5px solid var(--ALGOTECH-PRIMARY)',
                                    'border-left': 'none',
                                    'border-radius': '0px 0px 0px 0px',
                                    'box-shadow': 'unset'
                                },
                                icon: {
                                    'flex-direction': 'row',
                                    'font-size': '14px',
                                    color: 'var(--ALGOTECH-PRIMARY)',
                                    padding: '8px 8px 8px 8px',
                                    margin: '0px 0px 0px 0px'
                                },
                                tab: {
                                    'flex-direction': 'row',
                                    'justify-content': 'flex-start',
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
                            id: 'bf3833d6-b9c2-76bb-551c-82b4a305d88d',
                            typeKey: 'tab',
                            name: 'Onglet',
                            isActive: false,
                            css: {
                            },
                            custom: {
                                tabId: 'bf3833d6-b9c2-76bb-551c-82b4a305d88d',
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
                                height: 70,
                                width: 90
                            },
                            events: [
                                {
                                    id: '13317a6b-6f92-440c-e3bd-6a6b875c95b7',
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
                            id: 'cf272d02-6767-5004-da2b-2d5622f9b95d',
                            typeKey: 'tab',
                            name: 'Onglet',
                            isActive: false,
                            css: {
                            },
                            custom: {
                                tabId: 'cf272d02-6767-5004-da2b-2d5622f9b95d',
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
                                height: 70,
                                width: 90
                            },
                            events: [
                                {
                                    id: 'b98e74d2-123b-3f1c-64df-4b26b6ba4475',
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
                            id: '82a6c92b-ad4a-80ce-4160-cdc88d283c9d',
                            typeKey: 'tab',
                            name: 'Onglet',
                            isActive: false,
                            css: {
                            },
                            custom: {
                                tabId: '82a6c92b-ad4a-80ce-4160-cdc88d283c9d',
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
                                height: 70,
                                width: 90
                            },
                            events: [
                                {
                                    id: 'aab3c0b4-5fd0-7705-5203-7686eb694f77',
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
