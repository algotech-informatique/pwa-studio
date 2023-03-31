import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionsModule } from '../options/options.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { I18nEditorComponent } from './i18n-editor.component';
import { GridModule, PopoverModule, WorkflowDebuggerModule } from '@algotech-ce/business';
import { DirectivesModule, PipesModule } from '@algotech-ce/angular';
import { PipeModule } from '../../pipes/pipe.module';
import { AngularSplitModule } from 'angular-split';
import { AppDataBaseModule } from '../database/app-data-base.module';
import { I18nValidateFileService } from './services/i18n-validate-file.service';
import { DirectiveModule } from '../../directives/directive.module';
import { I18nValidateComponent } from './i18n-validate/i18n-validate.component';
import { I18nMonitoringComponent } from './i18n-monitoring/i18n-monitoring.component';

@NgModule({
    declarations: [
        I18nEditorComponent,
        I18nValidateComponent,
        I18nMonitoringComponent,
    ],
    imports: [
        CommonModule,
        OptionsModule,
        FormsModule,
        PipesModule,
        TranslateModule,
        AngularSplitModule,
        GridModule,
        DirectivesModule,
        PopoverModule,
        WorkflowDebuggerModule,
        PipeModule,
        AppDataBaseModule,
        DirectiveModule,
    ],
    exports: [
        I18nEditorComponent,
    ],
    entryComponents: [
        I18nValidateComponent,
        I18nMonitoringComponent,
    ],
    providers: [
        I18nValidateFileService,
    ]
})
export class I18nEditorModule { }
