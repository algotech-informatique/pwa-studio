import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionsModule } from '../options/options.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '@algotech/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PopUpModule } from '../pop-ups/pop-up.module';
import { StoreComponent } from './store.component';
import { StoreLoginComponent } from './components/store-login/store-login.component';
import { StorePreferencesService, StoreService } from '../../services';
import { StoreUploadComponent } from './components/store-upload/store-upload.component';
import { StoreDownloadComponent } from './components/store-download/store-download.component';
import { StoreDownloadListComponent } from './components/store-download-list/store-download-list.component';
import { StoreUploadListComponent } from './components/store-upload-list/store-upload-list.component';
import { StoreFrontService } from './services/store-front.service';

@NgModule({
    declarations: [
        StoreComponent,
        StoreLoginComponent,
        StoreUploadComponent,
        StoreDownloadComponent,
        StoreDownloadListComponent,
        StoreUploadListComponent,
    ],
    imports: [
        CommonModule,
        OptionsModule,
        IonicModule,
        FormsModule,
        PipesModule,
        TranslateModule,
        PopUpModule,
    ],
    exports: [
        StoreComponent,
    ],
    entryComponents: [
        StoreLoginComponent,
        StoreDownloadComponent,
        StoreUploadComponent,
        StoreUploadListComponent,
        StoreDownloadListComponent,
    ],
    providers: [
        StoreService,
        StorePreferencesService,
        StoreFrontService,
    ]
})
export class StoreModule { }
