
import { SnPageWidgetDto } from '@algotech-ce/core';
export const tabClearMobile: SnPageWidgetDto = {
    id: '5f9be152-acea-451f-6c15-3491fa9a244c',
    typeKey: 'tabs',
    name: 'TabClearMobile',
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
        selectedTabId: 'c4d56ac5-6009-7003-5651-c8890aabaf8b'
    },
    box: {
        x: 0,
        y: 0,
        width: 300,
        height: 70
    },
    events: [
    ],
    rules: [
    ],
    group: {
        widgets: [

            {
				id: '95982955-2e92-45f2-b6d8-ea98bf43d6ca',
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
                        color: 'var(--ALGOTECH-TERTIARY)',
                        padding: '5px 5px 5px 5px',
                        margin: '0px 0px 0px 0px'
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
				id: 'e6f3f1f6-0dab-4c62-81c2-8251456404f8',
				typeKey: 'tabModel',
				name: 'APP-WIDGET-TAB-MODEL',
				isActive: false,
				css: {
                    text: {
                        color: 'var(--ALGOTECH-PRIMARY)',
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
                        color: 'var(--ALGOTECH-PRIMARY)',
                        padding: '5px 5px 5px 5px',
                        margin: '0px 0px 0px 0px'
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
                id: 'c4d56ac5-6009-7003-5651-c8890aabaf8b',
                typeKey: 'tab',
                name: 'Onglet',
                isActive: false,
                css: {
                },
                custom: {
                    tabId: 'c4d56ac5-6009-7003-5651-c8890aabaf8b',
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
                    height: 70,
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
                locked: false,
                lockedProperties: [],
            },
            {
                id: '22077bc2-584a-6364-01d6-c6eb0919a1f2',
                typeKey: 'tab',
                name: 'Onglet',
                isActive: false,
                css: {
                },
                custom: {
                    tabId: '22077bc2-584a-6364-01d6-c6eb0919a1f2',
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
                    height: 70,
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
                locked: false,
                lockedProperties: [],
            },
            {
                id: '590978f3-bd6a-e86b-4b64-2c727331082b',
                typeKey: 'tab',
                name: 'Onglet',
                isActive: false,
                css: {
                },
                custom: {
                    tabId: '590978f3-bd6a-e86b-4b64-2c727331082b',
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
                    height: 70,
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
