
import { SnPageWidgetDto } from '@algotech-ce/core';
export const tabSolidVertical: SnPageWidgetDto = {
    id: 'ee4a270f-559f-7301-7a60-c14efa80887e',
    typeKey: 'tabs',
    name: 'TabSolidVertical',
    isActive: false,
    css: {
        tabs: {
            'flex-direction': 'column',
            'justify-content': 'flex-start',
            gap: '0px'
        },
        main: {
            'background-color': 'var(--ALGOTECH-TERTIARY-SHADE)',
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
        selectedTabId: 'da55050f-2193-01fe-3b8c-11c1dbfd92fa'
    },
    box: {
        x: 0,
        y: 0,
        width: 130,
        height: 230
    },
    events: [
    ],
    rules: [
    ],
    group: {
        widgets: [

            {
				id: '82c19ce3-f2a7-4388-9f9e-6dbdfe98e82e',
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
                        'font-weight': 'normal',
                        margin: '0px 0px 0px 0px'
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
                        'font-size': '12px',
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
				id: 'c04f2c25-099e-452d-b19f-ee0cdb9259b1',
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
                        'font-weight': 'normal'
                    },
                    main: {
                        'background-color': '#ffffff24',
                        'border-top': 'none',
                        'border-right': 'none',
                        'border-bottom': 'none',
                        'border-left': 'none',
                        'border-radius': '0px 0px 0px 0px',
                        'box-shadow': 'unset'
                    },
                    icon: {
                        'flex-direction': 'row',
                        'font-size': '12px',
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
                id: 'da55050f-2193-01fe-3b8c-11c1dbfd92fa',
                typeKey: 'tab',
                name: 'Onglet',
                isActive: false,
                css: {
                },
                custom: {
                    tabId: 'da55050f-2193-01fe-3b8c-11c1dbfd92fa',
                    disabled: false,
                    icon: 'fa-solid fa-home',
                    text: [
                        {
                            lang: 'fr-FR',
                            value: 'Home'
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
                    height: 30,
                    width: 100
                },
                events: [
                    {
                        id: '8b9eae6c-40c3-f38d-7556-7d611f177c5f',
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
                id: '9c1b12c7-a400-d05d-e86f-807e660ff0c5',
                typeKey: 'tab',
                name: 'Onglet',
                isActive: false,
                css: {
                },
                custom: {
                    tabId: '9c1b12c7-a400-d05d-e86f-807e660ff0c5',
                    disabled: false,
                    icon: 'fa-solid fa-circle-info',
                    text: [
                        {
                            lang: 'fr-FR',
                            value: 'Info'
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
                    height: 30,
                    width: 100
                },
                events: [
                    {
                        id: '9803d1ea-5cc0-6ed2-9069-a02fbc9e687a',
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
                id: 'b0b23e09-6b82-02fe-9a10-b2ad9840a18b',
                typeKey: 'tab',
                name: 'Onglet',
                isActive: false,
                css: {
                },
                custom: {
                    tabId: 'b0b23e09-6b82-02fe-9a10-b2ad9840a18b',
                    disabled: false,
                    icon: 'fa-solid fa-ellipsis-vertical',
                    text: [
                        {
                            lang: 'fr-FR',
                            value: 'More'
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
                    height: 30,
                    width: 100
                },
                events: [
                    {
                        id: '53947ea6-88c6-46b5-2bf0-3c3b6c6ffab3',
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
