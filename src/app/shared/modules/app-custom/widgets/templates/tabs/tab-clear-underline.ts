
import { SnPageWidgetDto } from '@algotech-ce/core';
export const tabClearUnderline: SnPageWidgetDto = {
    id: '51b1949e-ac51-1b0b-9620-50453d1c5c86',
    typeKey: 'tabs',
    name: 'TabClearUnderline',
    isActive: false,
    css: {
        tabs: {
            'flex-direction': 'row',
            'justify-content': 'flex-start',
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
        selectedTabId: '53b8c55d-5e4e-f58a-d6da-da5144660831'
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
				id: 'fd0b20c3-e404-49b1-a9bd-813180c8ad54',
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
                        margin: '0px'
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
				id: 'bafef0f9-e379-451d-9c07-60d6a3c4f21c',
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
                        margin: '0px'
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
                id: '53b8c55d-5e4e-f58a-d6da-da5144660831',
                typeKey: 'tab',
                name: 'Onglet',
                isActive: false,
                css: {
                },
                custom: {
                    tabId: '53b8c55d-5e4e-f58a-d6da-da5144660831',
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
                id: '6a11b4d0-b4a1-304b-d67a-49b1791a758c',
                typeKey: 'tab',
                name: 'Onglet',
                isActive: false,
                css: {
                },
                custom: {
                    tabId: '6a11b4d0-b4a1-304b-d67a-49b1791a758c',
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
                id: 'a99a116c-11fc-a094-2d12-5724ba029985',
                typeKey: 'tab',
                name: 'Onglet',
                isActive: false,
                css: {
                },
                custom: {
                    tabId: 'a99a116c-11fc-a094-2d12-5724ba029985',
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
