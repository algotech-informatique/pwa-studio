import { SnPageWidgetDto } from '@algotech-ce/core';
export const headerWebMin: SnPageWidgetDto = {
    id: 'd66bef5b-1178-426f-a86e-45113f16fecf',
    typeKey: 'header',
    name: 'Header',
    isActive: false,
    css: {
        main: {
            'background-color': '#455d7a00',
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
				anchors: ['right'],
			},
		],
	},
    box: {
        x: 0,
        y: 0,
        width: 180,
        height: 60
    },
    events: [
    ],
    rules: [
    ],
    group: {
        widgets: [
            {
                id:'9fa8c6e9-e9cb-4d4e-a040-c4f0ea1da801',
                typeKey: 'profile',
                name: 'roundProfil',
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
                    x: 120,
                    y: 10,
                    width: 40,
                    height: 40
                },
                events: [
                ],
                rules: [
                ],
            },
            {
                id: '068dc547-ca5f-4d9f-a191-3712dbcdc554',
                typeKey: 'notification',
                name: 'roundNotification',
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
                    x: 20,
                    y: 10,
                    width: 40,
                    height: 40
                },
                events: [
                ],
                rules: [
                ],
            },
            {
                id: 'aa42e18e-af5d-4c21-944d-5bee5b2efa9f',
                typeKey: 'selector',
                name: 'roundSelector',
                isActive: false,
                css: {
                    main: {
                        'background-color': 'var(--ALGOTECH-PRIMARY)',
                        'border-radius': '20px 20px 20px 20px',
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
                    x: 70,
                    y: 10,
                    width: 40,
                    height: 40
                },
                events: [
                ],
                rules: [
                ],
            }
        ]
    },
};
