import { SnPageWidgetDto } from '@algotech-ce/core';
export const tableColorHeader: SnPageWidgetDto = {
	id: '07c37993-36a3-7e7d-2a30-70c7b9617d3f',
	typeKey: 'table',
	name: 'Tableau',
	isActive: false,
	css: {
		main: {
			'background-color': 'var(--ALGOTECH-BACKGROUND)',
			'border-radius': '0px 0px 0px 0px',
			'border-top': '1px solid var(--ALGOTECH-BACKGROUND-SHADE)',
			'border-right': '1px solid var(--ALGOTECH-BACKGROUND-SHADE)',
			'border-bottom': '1px solid var(--ALGOTECH-BACKGROUND-SHADE)',
			'border-left': '1px solid var(--ALGOTECH-BACKGROUND-SHADE)'
		},
		cell: {
			color: 'var(--ALGOTECH-TERTIARY)',
			'font-size': '12px',
			'text-align': 'left',
			'font-style': 'normal',
			'text-decoration': 'none',
			'font-weight': 'normal',
			'justify-content': 'flex-start'
		},
		column: {
			width: '200px',
			'border-width': '0px',
			'border-color': 'var(--ALGOTECH-TERTIARY)'
		},
		row: {
			height: '40px',
			'border-width': '1px',
			'border-color': 'var(--ALGOTECH-BACKGROUND-SHADE)'
		},
		header: {
			color: 'var(--ALGOTECH-BACKGROUND)',
			'font-size': '12px',
			'text-align': 'left',
			'font-style': 'normal',
			'text-decoration': 'none',
			'font-weight': 'bold',
			'justify-content': 'flex-start',
			'background-color': 'var(--ALGOTECH-PRIMARY)',
			'border-bottom-width': '0px',
			'border-bottom-color': 'var(--ALGOTECH-TERTIARY)'
		}
	},
    returnData: [
        {
            key: 'smart-object-selected',
            multiple: false,
            type: 'so:*',
            name: 'TABLE.SMART-OBJECT-SELECTED',
        }, {
            key: 'smart-objects-selected',
            multiple: true,
            type: 'so:*',
            name: 'TABLE.SMART-OBJECTS-SELECTED',
        }
    ],
	custom: {
		iterable: false,
		hidden: false,
		locked: false,
		collection: '',
		collectionType: '',
		paginate: {
			limit: null,
			mode: 'infinite'
		},
		search: false,
		columns: [
			'Name',
			'Email',
			'Position',
            'City',
			'HireDate',
		],
		sort: true,
		filter: true,
		resize: true,
		reorder: false,
		multiselection: true,
		editable: true,
	},
	box: {
		x: 0,
		y: 0,
		width: 940,
		height: 400
	},
	events: [
		{
			id: '57eb342c-37bb-d147-0e11-29654294d1a1',
			eventKey: 'onRowClick',
			pipe: [
			],
			custom: {
				mode: 'sequence'
			}
		},
		{
			id: '94e8e565-e950-e1cb-a7aa-17767eb23535',
			eventKey: 'onRowDblClick',
			pipe: [
			],
			custom: {
				mode: 'sequence'
			}
		},
		{
			id: 'ab899ba1-afb0-6795-bf56-32cd92624049',
			eventKey: 'onRowSelection',
			pipe: [
			],
			custom: {
				mode: 'list'
			}
		}
	],
	rules: [
	],
	locked: false,
	lockedProperties: [
	],
	group: {
		widgets: [
			{
				id: '3501481b-a789-f8fd-6500-b70557873920',
				typeKey: 'column',
				name: 'Name',
				isActive: false,
				css: {
					main: {
						'background-color': '#FFFFFF00',
						'border-top': 'none',
						'border-right': 'none',
						'border-bottom': 'none',
						'border-left': 'none'
					},
					cell: {
						color: 'var(--ALGOTECH-TERTIARY)',
						'font-size': '12px',
						'text-align': 'left',
						'font-style': 'normal',
						'text-decoration': 'none',
						'font-weight': 'normal',
						'justify-content': 'flex-start'
					}
				},
				custom: {
					iterable: false,
					hidden: false,
					locked: false,
					propertyKey: 'Name',
					filter: true,
					resize: true,
					sort: true,
					display: [
						'text'
					],
					format: {
						key: '',
						custom: undefined
					},
					icon: '',
					overloadStyle: false,
					value: ''
				},
				box: {
					x: 0,
					y: 0,
					height: 500,
					width: 200
				},
				events: [
					{
						id: 'b46dfc27-a1f3-8b39-4cc6-ff41229eb97f',
						eventKey: 'onCellClick',
						pipe: [
						],
						custom: {
							mode: 'sequence'
						}
					},
					{
						id: '46c014e5-d477-a829-f871-f19ad4055dca',
						eventKey: 'onCellDblClick',
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
				id: '0243b9a3-0f46-e7d8-d9e5-e6d37299022e',
				typeKey: 'column',
				name: 'Email',
				isActive: false,
				css: {
					main: {
						'background-color': '#FFFFFF00',
						'border-top': 'none',
						'border-right': 'none',
						'border-bottom': 'none',
						'border-left': 'none'
					},
					cell: {
						color: 'var(--ALGOTECH-TERTIARY)',
						'font-size': '12px',
						'text-align': 'left',
						'font-style': 'normal',
						'text-decoration': 'none',
						'font-weight': 'normal',
						'justify-content': 'flex-start'
					}
				},
				custom: {
					iterable: false,
					hidden: false,
					locked: false,
					propertyKey: 'Email',
					filter: true,
					resize: true,
					sort: true,
					display: [
						'text'
					],
					format: {
						key: 'decimal',
						custom: undefined
					},
					icon: '',
					overloadStyle: false,
					value: ''
				},
				box: {
					x: 0,
					y: 0,
					height: 500,
					width: 200
				},
				events: [
					{
						id: '4183b1d2-f299-6839-ee72-c09d32460ead',
						eventKey: 'onCellClick',
						pipe: [
						],
						custom: {
							mode: 'sequence'
						}
					},
					{
						id: 'd82f2010-28da-90e4-5cc3-167a93511c9b',
						eventKey: 'onCellDblClick',
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
				id: 'ae0317a9-0ef5-0aeb-ccb4-62fb6981413c',
				typeKey: 'column',
				name: 'Position',
				isActive: false,
				css: {
					main: {
						'background-color': '#FFFFFF00',
						'border-top': 'none',
						'border-right': 'none',
						'border-bottom': 'none',
						'border-left': 'none'
					},
					cell: {
						color: 'var(--ALGOTECH-TERTIARY)',
						'font-size': '12px',
						'text-align': 'left',
						'font-style': 'normal',
						'text-decoration': 'none',
						'font-weight': 'normal',
						'justify-content': 'flex-start'
					}
				},
				custom: {
					iterable: false,
					hidden: false,
					locked: false,
					propertyKey: 'Position',
					filter: true,
					resize: true,
					sort: true,
					display: [
						'text'
					],
					format: {
						key: '',
						custom: undefined
					},
					icon: '',
					overloadStyle: false,
					value: ''
				},
				box: {
					x: 0,
					y: 0,
					height: 500,
					width: 200
				},
				events: [
					{
						id: '2d9185fe-9b45-9b17-f388-1c0d7b8987f8',
						eventKey: 'onCellClick',
						pipe: [
						],
						custom: {
							mode: 'sequence'
						}
					},
					{
						id: '3b2030df-d8fb-ffb6-fc23-dc04a15b8791',
						eventKey: 'onCellDblClick',
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
				id: '174b4e97-b584-f160-e7c8-a98dfa54abbd',
				typeKey: 'column',
				name: 'City',
				isActive: false,
				css: {
					main: {
						'background-color': '#FFFFFF00',
						'border-top': 'none',
						'border-right': 'none',
						'border-bottom': 'none',
						'border-left': 'none'
					},
					cell: {
						color: 'var(--ALGOTECH-TERTIARY)',
						'font-size': '12px',
						'text-align': 'left',
						'font-style': 'normal',
						'text-decoration': 'none',
						'font-weight': 'normal',
						'justify-content': 'flex-start'
					}
				},
				custom: {
					iterable: false,
					hidden: false,
					locked: false,
					propertyKey: 'City',
					filter: true,
					resize: true,
					sort: true,
					display: [
						'text'
					],
					format: {
						key: '',
						custom: undefined
					},
					icon: '',
					overloadStyle: false,
					value: ''
				},
				box: {
					x: 0,
					y: 0,
					height: 500,
					width: 200
				},
				events: [
					{
						id: '1da02527-7b47-da0e-6f8d-e11d3335f036',
						eventKey: 'onCellClick',
						pipe: [
						],
						custom: {
							mode: 'sequence'
						}
					},
					{
						id: 'e4770195-638f-858f-0171-2fc4c3cc9340',
						eventKey: 'onCellDblClick',
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
				id: 'fd83792f-2a2e-360c-9e2a-253cf826f1c5',
				typeKey: 'column',
				name: 'Hire date',
				isActive: false,
				css: {
					main: {
						'background-color': '#FFFFFF00',
						'border-top': 'none',
						'border-right': 'none',
						'border-bottom': 'none',
						'border-left': 'none'
					},
					cell: {
						color: 'var(--ALGOTECH-TERTIARY)',
						'font-size': '12px',
						'text-align': 'left',
						'font-style': 'normal',
						'text-decoration': 'none',
						'font-weight': 'normal',
						'justify-content': 'flex-start'
					}
				},
				custom: {
					iterable: false,
					hidden: false,
					locked: false,
					propertyKey: 'HireDate',
					filter: true,
					resize: true,
					sort: true,
					display: [
						'text'
					],
					format: {
						key: 'date',
						custom: undefined
					},
					icon: '',
					overloadStyle: false,
					value: ''
				},
				box: {
					x: 0,
					y: 0,
					height: 500,
					width: 200
				},
				events: [
					{
						id: 'dcb8b1be-6a44-c6cc-dfd1-a5ac9273dcc7',
						eventKey: 'onCellClick',
						pipe: [
						],
						custom: {
							mode: 'sequence'
						}
					},
					{
						id: '4c706348-b400-af27-3a31-a22c442a4ae7',
						eventKey: 'onCellDblClick',
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
	}
};
