import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ATAngularModule, AuthService, EnvService } from '@algotech/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AuthServiceMock } from './auth.service.mock';
import { environment } from '../../src/environments/environment';
import { SharedModule } from '../../src/app/shared/shared.module';

export const envInitialize = (
    env: EnvService,
) => async () => await new Promise((resolve) => {
    env.initialize({
        API_URL: 'host',
    });
    resolve(true);
});

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        SharedModule.forRoot(),
        TranslateModule.forRoot(),
        ATAngularModule.forRoot()
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: envInitialize,
            deps: [EnvService],
            multi: true
        },
        { provide: AuthService, useClass: AuthServiceMock },
        AuthServiceMock,
    ],
})
export class AppModuleMock {
}
