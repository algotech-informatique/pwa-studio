
import { SnPageWidgetDto } from '@algotech/core';
export const footerWebSimple: SnPageWidgetDto = {
    id: 'ceeac8a9-7bc8-9346-7465-e5c461289302',
    typeKey: 'footer',
    name: 'Footer',
    isActive: false,
    css: {
        main: {
            'background-color': 'var(--ALGOTECH-SECONDARY)',
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
    },
    afterTemplatePlaced: {
        box: [
            {
                widgetName: 'Footer',
                anchors: ['right', 'left'],
            },
            {
                widgetName: 'Title',
                anchors: ['right', 'left'],
            },
        ],
    },
    box: {
        x: 0,
        y: 0,
        width: 500,
        height: 60
    },
    events: [
    ],
    rules: [
    ],
    group: {
        widgets: [
            {
                id: '47f66bfe-53d8-920a-5e93-0b2c282ba1f0',
                typeKey: 'text',
                name: 'Title',
                isActive: false,
                css: {
                    main: {
                        'background-color': '#FFFFFF00',
                        'border-radius': '4px 4px 4px 4px',
                        'box-shadow': 'unset',
                        'border-top': 'none',
                        'border-right': 'none',
                        'border-bottom': 'none',
                        'border-left': 'none'
                    },
                    text: {
                        color: 'var(--ALGOTECH-BACKGROUND)',
                        'font-size': '12px',
                        'justify-content': 'center',
                        'text-align': 'center',
                        'font-style': 'normal',
                        'text-decoration': 'none',
                        'font-weight': 'normal',
                        padding: '0px 5px 0px 5px',
                        margin: '0px 0px 0px 0px'
                    },
                    layout: {
                        'align-items': 'center'
                    }
                },
                custom: {
                    text: [
                        {
                            lang: 'fr-FR',
                            value: 'My App | Powered by Vision'
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
                    iterable: true,
                    disabled: false,
                    hidden: false,
                    locked: false
                },
                box: {
                    x: 80,
                    y: 10,
                    width: 320,
                    height: 40
                },
                events: [
                    {
                        id: '96e74f6c-4a67-4736-cb66-0e0241a3fe43',
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
            }
        ]
    },
};
