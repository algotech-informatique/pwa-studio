import { LocalProfil } from '@algotech/angular';
import { UserDto } from '@algotech/core';
import { MockBuilder } from './MockBuilder';

export class LocalProfilBuilder extends MockBuilder<LocalProfil> {
    constructor(
        private id: string = '0001',
        private key: string = 'profilkey',
        private login: string = 'toto',
        private email: string = 'toto@mail.fr',
        private firstName: string = 'Toto',
        private lastName: string = 'Tata',
        private pictureUrl: string = '',
        private preferedLang: string = 'fr-FR',
        private groups: string[] = [],
        private password: string = 'azerty',
        private user: UserDto = {
            customerKey: 'customerKey',
            email: 'toto@mail.fr',
            firstName: 'Toto',
            favorites: { documents: [], smartObjects: [] },
            following: [],
            groups: ['sadmin'],
            lastName: 'Tata',
            preferedLang: 'fr-FR',
            username: 'toto',
        }
    ) { super(); }
}
