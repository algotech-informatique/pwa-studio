import { SnPageWidgetDto } from '@algotech-ce/core';
export const headerMobileBlank: SnPageWidgetDto = {
	id: '087aea5b-56ce-4b1c-97ff-8101ff0842ce',
    typeKey: 'header',
	name: 'Header',
	isActive: false,
	css: {
		main: {
			'background-color': 'var(--ALGOTECH-BACKGROUND)',
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
				anchors: ['left', 'right'],
			},
		],
	},
	box: {
		x: 0,
		y: 0,
		width: 300,
		height: 40
	},
	events: [
	],
	rules: [
	],
	group: {
		widgets: [
		]
	},
	};
