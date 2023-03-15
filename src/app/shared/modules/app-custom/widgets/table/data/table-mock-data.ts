import { PairDto, SmartModelDto, SmartObjectDto } from '@algotech/core';
import { UUID } from 'angular2-uuid';
import moment from 'moment'; 

export const mockData: { id: string; properties: PairDto[] }[] = [
    {
        id: UUID.UUID(),
        properties: [
            { key: 'Name', value: 'Julia Wirth'},
            { key: 'Email', value: 'juliawirth@gmail.com'},
            { key: 'Position', value: 'Sales assistant'},
            { key: 'City', value: 'Toronto'},
            { key: 'HireDate', value: moment('10/08/2020', 'DD/MM/YYYY').toISOString()},
        ]
    },
    {
        id: UUID.UUID(),
        properties: [
            { key: 'Name', value: 'Nicole Lange'},
            { key: 'Email', value: 'n.lange@gmail.com'},
            { key: 'Position', value: 'Structural engineer'},
            { key: 'City', value: 'Bordeaux'},
            { key: 'HireDate', value: moment('02/12/2010', 'DD/MM/YYYY').toISOString()},
        ]
    },
    {
        id: UUID.UUID(),
        properties: [
            { key: 'Name', value: 'Brice Boisclair'},
            { key: 'Email', value: 'brice.boisclair@emailcomp.com'},
            { key: 'Position', value: 'Marketing'},
            { key: 'City', value: 'Paris'},
            { key: 'HireDate', value: moment('25/06/2021', 'DD/MM/YYYY').toISOString()},
        ]
    },
    {
        id: UUID.UUID(),
        properties: [
            { key: 'Name', value: 'Joseph L. Molnar'},
            { key: 'Email', value: 'j.l.molnar@gmail.com'},
            { key: 'Position', value: 'Mechanic engineer'},
            { key: 'City', value: 'Paris'},
            { key: 'HireDate', value: moment('10/02/2007', 'DD/MM/YYYY').toISOString()},
        ]
    },
    {
        id: UUID.UUID(),
        properties: [
            { key: 'Name', value: 'Oscar Wrench'},
            { key: 'Email', value: 'oscarwrench12@gmail.com'},
            { key: 'Position', value: 'IT'},
            { key: 'City', value: 'Berlin'},
            { key: 'HireDate', value: moment('07/07/2020', 'DD/MM/YYYY').toISOString()},
        ]
    }
];

export const getMockType = (propertyKey: string): string => {
    switch (propertyKey) {
        case 'HireDate':
            return 'date';
        default:
            return 'string';
    }
};

export const comments = ['to do', 'wip', 'need to finish', 'need more information', 'ok'];
export const htmls = [
    '<li><a href="#">Clients</a></li>',
    '<label for="name">Text Input:</label>',
    '<li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>',
];
export const strings = [
    'Vision Studio',
    '7532 Olive St. North Miami Beach, FL 33160',
    'oscarwrench12@gmail.com',
    'Joseph L. Molnar',
    'Documentation',
];
export const numbers = [1, 25, 89450, 15.5, 8, 12];
export const booleans = [true, false];
export const generateSos = (model?: SmartModelDto): SmartObjectDto => {
    const properties = model?.properties.map(property =>
        ({ key: property.key, value: getPropertyValue(property.keyType) })
    ) || [];
    return {
        modelKey: model?.key || '',
        properties,
        skills: {},
    };
};

export const getPropertyValue = (type: string) => {
    switch (type) {
        case 'string':
            return strings[Math.floor(Math.random() * strings.length)];
        case 'boolean':
            return booleans[Math.floor(Math.random() * booleans.length)];
        case 'number':
            return numbers[Math.floor(Math.random() * numbers.length)];
        case 'html':
            return htmls[Math.floor(Math.random() * htmls.length)];
        case 'sys:comment':
            return comments[Math.floor(Math.random() * comments.length)];
        case 'datetime':
            return moment().toISOString();
        case 'time':
            return moment().toISOString();
        case 'date':
            return moment().toISOString();
        default:
            return null;
    }
};
