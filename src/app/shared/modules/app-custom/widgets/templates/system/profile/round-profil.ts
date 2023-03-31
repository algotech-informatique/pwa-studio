
import { SnPageWidgetDto } from '@algotech-ce/core';
export const roundProfil: SnPageWidgetDto = {
	id: '1863e100-8781-3d2a-b8db-a33f7cc0b4ca',
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
			padding: '10px',
			margin: '0px 6px'
		},
        layout: {
            'flex-direction': 'row',
            'justify-content': 'center',
            'align-items': 'center',
            gap: '0px',
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
		x: 0,
		y: 0,
		width: 40,
		height: 40
	},
	events: [
	],
	rules: [
	],
	locked: false,
	lockedProperties: [],
};
