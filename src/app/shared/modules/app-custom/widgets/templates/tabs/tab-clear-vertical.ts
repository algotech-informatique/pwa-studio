
import { SnPageWidgetDto } from '@algotech/core';
export const tabClearVertical: SnPageWidgetDto = {
    id: '50a9c2dd-3ff2-140d-6551-3275a0ce98c6',
    typeKey: 'tabs',
    name: 'TabClearVertical',
    isActive: false,
    css: {
        tabs: {
            'flex-direction': 'column',
            'justify-content': 'flex-start',
            gap: '5px'
        },
        main: {
            'background-color': '#45093200',
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
        selectedTabId: 'a47d7ca4-92f6-ff4b-4184-ad5283df9c4e'
    },
    box: {
        x: 0,
        y: 0,
        width: 40,
        height: 230
    },
    events: [
    ],
    rules: [
    ],
    group: {
        widgets: [

            {
				id: '7da982b7-f4bc-49a7-94f1-9e0c9283a703',
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
				id: '9e6a8856-f749-4c34-be5e-f35ede9c7e22',
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
                        'background-color': 'var(--ALGOTECH-PRIMARY)',
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
                        color: 'var(--ALGOTECH-BACKGROUND)',
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
                id: 'a47d7ca4-92f6-ff4b-4184-ad5283df9c4e',
                typeKey: 'tab',
                name: 'Onglet',
                isActive: false,
                css: {
                },
                custom: {
                    tabId: 'a47d7ca4-92f6-ff4b-4184-ad5283df9c4e',
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
                    height: 40,
                    width: 100
                },
                events: [
                    {
                        id: '379848b9-1355-3069-6e1d-22fc136637a4',
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
                id: '3afda07c-918f-44e6-c27a-83a5e619f141',
                typeKey: 'tab',
                name: 'Onglet',
                isActive: false,
                css: {
                },
                custom: {
                    tabId: '3afda07c-918f-44e6-c27a-83a5e619f141',
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
                    height: 40,
                    width: 100
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
                locked: false,
                lockedProperties: [],
            },
            {
                id: '03e5544a-c702-06ba-a448-3ec7545293f9',
                typeKey: 'tab',
                name: 'Onglet',
                isActive: false,
                css: {
                },
                custom: {
                    tabId: '03e5544a-c702-06ba-a448-3ec7545293f9',
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
                    height: 40,
                    width: 100
                },
                events: [
                    {
                        id: 'f6d1bfa0-9985-1b29-e66c-4049218fecb5',
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
