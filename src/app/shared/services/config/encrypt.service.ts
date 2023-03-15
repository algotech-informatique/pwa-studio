import { Injectable } from '@angular/core';

const SECRET_KEY = '2]eo?l!k1zH@WahWM_}(@,L-C+=xn1';

@Injectable()
export class EncryptService {

    encryptConnection(file: string): string {
        /* const Cryptr = require('cryptr');
        const cryptr = new Cryptr(SECRET_KEY);

        return cryptr.encrypt(file); */
        return '';
    }

    decryptConnection(file: string): string {
        /* const Cryptr = require('cryptr');
        const cryptr = new Cryptr(SECRET_KEY);

        try {
            return cryptr.decrypt(file);
        } catch (error) {
            return '';
        } */
        return '';
    }
}
