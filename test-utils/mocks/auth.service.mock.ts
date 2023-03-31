import { UserDto, WorkflowInstanceDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { LocalProfil } from '@algotech-ce/angular';
import { Observable, of } from 'rxjs';
import { LocalProfilBuilder } from '../builders';

@Injectable()
export class AuthServiceMock {

    public initialize(clientId: string, origin: string, keyCloakurl?: string, realm?: string): Observable<boolean> {
        return of(true);
    }

    get localProfil(): LocalProfil {
        return new LocalProfilBuilder().build();
    }

    get isAuthenticated(): boolean {
        return false; // todo set to true and fix _initializeOutsideStudio
    }
}
