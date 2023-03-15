import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { OptionsModule } from '../options/options.module';
import { ApplicationsSettingsComponent } from './applications-settings.component';
import { ApplicationsSettingsDetailComponent } from './components/applications-settings-detail/applications-settings-detail.component';
import { ApplicationsSettingsMainComponent } from './components/applications-settings-main/applications-settings-main.component';

@NgModule({
    declarations: [
        ApplicationsSettingsComponent,
        ApplicationsSettingsMainComponent,
        ApplicationsSettingsDetailComponent,
    ],
    imports: [
        CommonModule,
        OptionsModule,
        TranslateModule,
    ],
    exports: [
        ApplicationsSettingsComponent,
    ],
})
export class ApplicationsSettingsModule { }