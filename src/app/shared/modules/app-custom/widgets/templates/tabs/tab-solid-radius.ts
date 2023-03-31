import { SnPageWidgetDto } from '@algotech-ce/core';
export const tabSolidRadius: SnPageWidgetDto = {
	id: '9171f209-046b-0aef-604a-ff0677d73696',
	typeKey: 'tabs',
	name: 'TabSolidRadius',
	isActive: false,
	css: {
		tabs: {
			'flex-direction': 'row',
			'justify-content': 'center',
			gap: '0px'
		},
		main: {
			'background-color': 'var(--ALGOTECH-BACKGROUND-SHADE)',
			'border-top': 'none',
			'border-right': 'none',
			'border-bottom': 'none',
			'border-left': 'none',
			'border-radius': '10px 10px 10px 10px',
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
		width: 280,
		height: 40
	},
	events: [
	],
	rules: [
	],
	group: {
		widgets: [
			{
				id: 'c7473db3-f0ee-8c0b-7841-752d3fb41727',
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
				id: 'bba55b65-4e75-cb5c-a866-5130e51cdbe9',
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
						'background-color': 'var(--ALGOTECH-PRIMARY)',
						'border-top': 'none',
						'border-right': 'none',
						'border-bottom': 'none',
						'border-left': 'none',
						'border-radius': '10px 10px 10px 10px',
						'box-shadow': 'unset'
					},
					icon: {
						'flex-direction': 'row',
						'font-size': '20px',
						color: 'var(--ALGOTECH-BACKGROUND)',
						padding: '5px 5px 5px 5px',
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
				id: '0c9d417e-83f7-2624-c41c-a424e10b077d',
				typeKey: 'tab',
				name: 'Onglet',
				isActive: false,
				css: {
				},
				custom: {
					tabId: 'c4d56ac5-6009-7003-5651-c8890aabaf8b',
					disabled: false,
					icon: '',
					text: [
						{
							lang: 'fr-FR',
							value: 'Actualités'
						},
						{
							lang: 'en-US',
							value: 'News'
						},
						{
							lang: 'es-ES',
							value: 'Noticias'
						}
					],
					page: '',
					pageInputs: [
					],
					iterable: false,
					hidden: false,
					locked: false
				},
				box: {
					x: 0,
					y: 0,
					height: 70,
					width: 140
				},
				events: [
					{
						id: 'e4b57b5c-1bc7-f128-0faa-163172327d93',
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
				locked: false,
				lockedProperties: [
				]
			},
			{
				id: 'ed588c6a-44c7-4204-5c5c-ddafa401d6ae',
				typeKey: 'tab',
				name: 'Onglet',
				isActive: false,
				css: {
				},
				custom: {
					tabId: '22077bc2-584a-6364-01d6-c6eb0919a1f2',
					disabled: false,
					icon: '',
					text: [
						{
							lang: 'fr-FR',
							value: 'Notifications'
						},
						{
							lang: 'en-US',
							value: 'Notifications'
						},
						{
							lang: 'es-ES',
							value: 'Notificaciones'
						}
					],
					page: '',
					pageInputs: [
					],
					iterable: false,
					hidden: false,
					locked: false
				},
				box: {
					x: 0,
					y: 0,
					height: 70,
					width: 140
				},
				events: [
					{
						id: '432b937f-d751-cbfc-fcbd-2555f971ca04',
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
				locked: false,
				lockedProperties: [
				]
			}
		]
	},
	locked: false,
	lockedProperties: [
		'selected.tabs'
	]
};
