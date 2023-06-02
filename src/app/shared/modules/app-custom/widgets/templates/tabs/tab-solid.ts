
import { SnPageWidgetDto } from '@algotech-ce/core';
export const tabSolid: SnPageWidgetDto = {
    id: '815a3883-a4ae-46c0-8558-4c7a81f6bd51',
    typeKey: 'tabs',
    name: 'TabSolid',
    isActive: false,
    css: {
        tabs: {
            'flex-direction': 'row',
            'justify-content': 'flex-start',
            gap: '0px'
        },
        main: {
            'background-color': 'var(--ALGOTECH-PRIMARY)',
            'border-top': 'none',
            'border-right': 'none',
            'border-bottom': 'none',
            'border-left': 'none',
            'border-radius': '0px 0px 0px 0px',
            'box-shadow': '0px 2px 5px 0px #000000a6'
        }
    },
    custom: {
        iterable: true,
        hidden: false,
        locked: false,
        selectedTabId: '65ab9fb2-d57a-f145-7752-1d98449084f1'
    },
    box: {
        x: 0,
        y: 0,
        width: 300,
        height: 50
    },
    events: [
    ],
    rules: [
    ],
    group: {
        widgets: [
            {
				id: '036e0b34-c373-4554-9171-a37a9162bffa',
				typeKey: 'tabModel',
				name: 'APP-WIDGET-TAB-MODEL',
				isActive: false,
				css: {
                    text: {
                        color: 'var(--ALGOTECH-BACKGROUND)',
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
                        'font-size': '14px',
                        color: 'var(--ALGOTECH-BACKGROUND)',
                        padding: '10px 10px 10px 10px',
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
				id: '99fbbe21-e69d-40ec-9f1d-e4ff6ed0389c',
				typeKey: 'tabModel',
				name: 'APP-WIDGET-TAB-MODEL',
				isActive: false,
				css: {
                    text: {
                        color: 'var(--ALGOTECH-BACKGROUND)',
                        'font-size': '14px',
                        'justify-content': 'center',
                        'align-items': 'center',
                        'font-style': 'normal',
                        'text-decoration': 'none',
                        'font-weight': 'normal'
                    },
                    main: {
                        'background-color': 'var(--ALGOTECH-PRIMARY-TINT)',
                        'border-top': 'none',
                        'border-right': 'none',
                        'border-bottom': 'none',
                        'border-left': 'none',
                        'border-radius': '0px 0px 0px 0px',
                        'box-shadow': 'unset'
                    },
                    icon: {
                        'flex-direction': 'row',
                        'font-size': '14px',
                        color: 'var(--ALGOTECH-BACKGROUND)',
                        padding: '10px 10px 10px 10px',
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
                id: '65ab9fb2-d57a-f145-7752-1d98449084f1',
                typeKey: 'tab',
                name: 'Onglet',
                isActive: false,
                css: {
                },
                custom: {
                    tabId: '65ab9fb2-d57a-f145-7752-1d98449084f1',
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
                    width: 100
                },
                events: [
                    {
                        id: '9f947407-bc60-a7fb-4128-15c5b1e0f383',
                        eventKey: 'onClick',
                        pipe: [],
                        custom: {
                            mode: 'sequence'
                        }
                    }
                ],
                rules: [
                ],
                locked: false,
                lockedProperties: [],
            },
            {
                id: 'ddb939a8-0fa0-e811-9f2b-e7331cb27329',
                typeKey: 'tab',
                name: 'Onglet',
                isActive: false,
                css: {
                },
                custom: {
                    tabId: 'ddb939a8-0fa0-e811-9f2b-e7331cb27329',
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
                    width: 100
                },
                events: [
                    {
                        id: '2df77533-d007-aed6-d5f7-68475bab4819',
                        eventKey: 'onClick',
                        pipe: [],
                        custom: {
                            mode: 'sequence'
                        }
                    }
                ],
                rules: [
                ],
                locked: false,
                lockedProperties: [],
            },
            {
                id: '4098a84e-9ef9-ca9e-333b-ff86091238ac',
                typeKey: 'tab',
                name: 'Onglet',
                isActive: false,
                css: {
                },
                custom: {
                    tabId: '4098a84e-9ef9-ca9e-333b-ff86091238ac',
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
                    width: 100
                },
                events: [
                    {
                        id: '0a66042c-3cf9-010f-8827-9252baf39311',
                        eventKey: 'onClick',
                        pipe: [],
                        custom: {
                            mode: 'sequence'
                        }
                    }
                ],
                rules: [
                ],
                locked: false,
                lockedProperties: [],
            }
        ]
    },
    locked: false,
    lockedProperties : [
        'selected.tabs'
    ],
};
