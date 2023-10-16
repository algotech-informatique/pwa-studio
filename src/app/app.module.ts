import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ATAngularModule, AuthModule, AuthService, EnvService, I18nService, SignInGuard } from '@algotech-ce/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfigService, ToastService } from './shared/services';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { HomePageModule } from './home/home.module';
import { AppPreviewModule, EncodeGuard, ThemeEngloberModule, WorkflowDebuggerModule } from '@algotech-ce/business';
import { NgxDropzoneModule } from 'ngx-dropzone';
import moment from 'moment';
import { KeycloakAngularModule } from 'keycloak-angular';
import { SnTranslateService } from './shared/modules/smart-nodes';
import { mergeMap } from 'rxjs/operators';
import { DocPageModule } from './doc/doc.module';
import { NotAuthorizedPageModule } from './notauthorized/notauthorized.module';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DocxTemplaterModulesService } from '@algotech-ce/business';
import { DocxTemplaterService } from './shared/services/docx-templater/docx-templater.service';

export const appInitialize = (
    env: EnvService,
    authService: AuthService,
    i18nService: I18nService,
    translateService: TranslateService,
    snTranslate: SnTranslateService,
    appBaseHref: string,
) => async () => {
    i18nService.init(environment.defaultLanguage, environment.supportedLanguages);
    moment.locale(i18nService.language);

    return await new Promise((resolve) => {
        env.initialize(environment);
        authService.appId = environment.APP_ID;
        authService.initialize('pwa-studio', window.location.origin + appBaseHref, environment.KC_URL).pipe(
                mergeMap(() => translateService.get('init')),
                mergeMap(() => snTranslate.initialize()),
            ).subscribe(() => {
                resolve(true);
            });
    });
};
@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot({animated: false}),
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        SharedModule.forRoot(),
        ThemeEngloberModule,
        HomePageModule,
        DocPageModule,
        NotAuthorizedPageModule,
        WorkflowDebuggerModule,
        AuthModule,
        TranslateModule.forRoot(),
        ATAngularModule.forRoot(),
        AppPreviewModule,
        NgxDropzoneModule,
        KeycloakAngularModule,
        ServiceWorkerModule.register('./studio/ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        BrowserAnimationsModule,
    ],
    providers: [
        I18nService,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitialize,
            deps: [EnvService, AuthService, I18nService, TranslateService, SnTranslateService, APP_BASE_HREF],
            multi: true
        },
        {
            provide: APP_BASE_HREF,
            useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
            deps: [PlatformLocation]
        },
        ToastService,
        SignInGuard,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        ConfigService,
        EncodeGuard,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
