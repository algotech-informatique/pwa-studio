import { CredentialsDto, UserDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { OptionsObjectDto } from '../../../dtos';
import moment from 'moment'; 
import * as _ from 'lodash';
import { UUID } from 'angular2-uuid';

const wsColor: string[] = [
    '#78909C',
    '#F4511E',
    '#A1887F',
    '#757575',
    '#43A047',
    '#558B2F',
    '#0091EA',
    '#0288D1',
    '#0097A7',
    '#E65100',
    '#009688',
    '#7E57C2',
    '#7986CB',
    '#1E88E5',
    '#EF5350',
    '#BA68C8',
    '#D50000',
    '#000000',
];

@Injectable()
export class SecurityUserService {

    constructor() {}

    getColor(id: number): string {
        let i: number = id;
        while (i > 18) {
            i -= 18;
        }
        return wsColor[i];
    }

    getUser(users: UserDto[], active: boolean): OptionsObjectDto[] {
        const options: OptionsObjectDto[] = _.reduce(users, (result, usr: UserDto, index) => {
            if (usr.enabled === active) {
                const option: OptionsObjectDto = {
                    title: usr.username,
                    mainLine: `${usr.firstName} ${usr.lastName}`,
                    uuid: usr.uuid,
                    labelIcon: {
                        color: this.getColor(index),
                        text: [usr.firstName, usr.lastName],
                    }
                };
                result.push(option);
            }
            return result;
        }, []);
        return options;
    }

    createEmptyUser(favLang: string): UserDto {
        const credentials: CredentialsDto = {
            login: '',
            credentialsType: 'password',
            creationDate: moment().format('YYYY-MM-DD[T]HH:mm:ss'),
        };
        const data: any = {
            uuid: UUID.UUID(),
            credentials,
            firstName: '',
            lastName: '',
            enabled: true,
        };
        return this.createNewUser(data, favLang);
    }

    createNewUser(data: UserDto, favLang: string) {
        const newUser: UserDto = {
            uuid: data.uuid,
            username: data.username,
            customerKey: '',
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.username,
            preferedLang: favLang,
            groups: data.groups ? data.groups : [],
            following: [],
            enabled: true,
            favorites: {
                documents: [],
                smartObjects: []
            },
        };
        return newUser;
    }
}

