
import { SnPageWidgetDto } from '@algotech/core';
export const squareProfil: SnPageWidgetDto = {
	id: 'aadff123-f2d7-8014-1777-02b7992bf5e2',
    typeKey: 'profile',
	name: 'squareProfil',
	isActive: false,
	css: {
		main: {
			'background-color': 'var(--ALGOTECH-PRIMARY)',
			'border-radius': '4px 4px 4px 4px',
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
