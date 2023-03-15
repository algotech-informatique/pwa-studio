import { SnPageWidgetDto } from '@algotech/core';
export const headerMobileMin: SnPageWidgetDto = {
    id: '3f3ad200-6c7b-45f5-a6d7-fab57757e147',
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
				anchors: ['left'],
			},
		],
	},
    box: {
        x: 0,
        y: 0,
        width: 40,
        height: 40
    },
    events: [
    ],
    rules: [
    ],
    group: {
        widgets: [
            {
                id: 'd6174c28-f311-4c91-84c4-d9570056b3e4',
                typeKey: 'selector',
                name: 'mobileSelector',
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
                    icon: {
                        color: 'var(--ALGOTECH-PRIMARY)',
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
                    x: 0,
                    y: 0,
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
