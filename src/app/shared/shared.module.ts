import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
    PageNotFoundComponent, EnvironmentBarComponent, TabsComponent, ModalComponent,
    WorkflowEditorComponent, FlowEditorComponent, ModelEditorComponent,
    DataExplorerComponent, TabsMaterialComponent, TreeDebugComponent, EditorContentComponent,
    CursorsComponent, ConnectorParametersComponent, ConnectorParametersEditComponent,
    AppEditorComponent, DialogMessageComponent, CheckSettingsComponent, ManifestSettingsComponent, LocalSearchComponent,
} from './components/';
import { SmartNodesModule } from './modules/smart-nodes/smart-nodes.module';
import { FormsModule } from '@angular/forms';
import {
    MessageService, EnvironmentService, TabsService, ContextmenuService,
    SessionsService, SnModelsService, LangsService, DialogMessageService,
    IconsService, SmartModelsService, PatchesService, ClipboardService, UndoRedoService,
    PreferencesService, ConfigService, DatasService, CheckService, WatcherService, RulesEngine,
} from './services';
import { AngularSplitModule } from 'angular-split';
import { PopUpModule } from './components/pop-ups/pop-up.module';
import { KeyFormaterService, DirectivesModule, PipesModule, DataService } from '@algotech-ce/angular';
import { SmartNodesCustomModule } from './modules/smart-nodes-custom/smart-nodes-custom.module';
import { InspectorModule } from './modules/inspector/inspector.module';
import { WorkflowDebuggerModule } from '@algotech-ce/business';
import { TreeDebugService } from './components/tree-debug/tree-debug.service';
import { ReportTemplatesEditorComponent } from './components/report-templates-editor/report-templates-editor.component';
import { EditorFormComponent } from './components/editor-form/editor-form.component';
import { DocxTemplaterService } from './services/docx-templater/docx-templater.service';
import { ModelEditorService } from './components/model-editor/model-editor.service';
import { ExplorerModule } from './components/explorer/explorer.module';
import { StudioTranslationService } from './services/translation/studio-translation.service';
import { ATAppModule } from './modules/app/at-app.module';
import { SmartLinkModule } from './components/smart-link/smart-link.module';
import { SmartLinkAppModule } from './components/smart-link-app/smart-link-app.module';
import { OptionsModule } from './components/options/options.module';
import { ScheduledTaskModule } from './components/scheduled-task/scheduled-task.module';
import { ATAppCustomModule } from './modules/app-custom/app-custom.module';
import { ATAppToolboxModule } from './modules/app-custom/app-toolbox/app-toolbox.module';
import { GenericListsModule } from './components/generic-lists/generic-lists.module';
import { PipeModule } from './pipes/pipe.module';
import { ImportDataModule } from './components/import-data/import-data.module';
import { ImportMainDataModule } from './services/import-data/import-main-data.module';
import { DrawingModule } from '@algotech-ce/business/drawing';
import { SecurityModule } from './components/security/security.module';
import { ApplicationsSettingsModule } from './components/applications-settings/applications-settings.module';
import { SettingsModule } from './components/settings/settings.module';
import { MetadataModule } from './components/metadata/metadata.module';
import { SettingsUpdateService } from './services/settings/settings-update.service';
import { TagsListsModule } from './components/tags-lists/tags-lists.module';
import { ThemeEditorModule } from './components/theme/theme-editor.module';
import { DragTabSourceDirective } from './directives/drag-tab/drag-tab-source.directive';
import { DragTabTargetDirective } from './directives/drag-tab/drag-tab-target.directive';
import { AppDataBaseModule } from './components/database/app-data-base.module';
import { ManifestSettingsModule } from './components/manifest/manifest-settings.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DirectiveModule } from './directives/directive.module';
import { I18nEditorModule } from './components/i18n/i18n-editor.module';
import { ResourceSearchComponent } from './components/search/resource-search/resource-search.component';

@NgModule({
    declarations: [
        CheckSettingsComponent,
        ManifestSettingsComponent,
        CursorsComponent,
        ConnectorParametersComponent,
        ConnectorParametersEditComponent,
        TabsComponent,
        TabsMaterialComponent,
        EnvironmentBarComponent,
        PageNotFoundComponent,
        ModalComponent,
        TreeDebugComponent,
        EditorContentComponent,
        AppEditorComponent,
        ModelEditorComponent,
        WorkflowEditorComponent,
        FlowEditorComponent,
        DataExplorerComponent,
        ReportTemplatesEditorComponent,
        EditorFormComponent,
        DialogMessageComponent,
        DragTabSourceDirective,
        DragTabTargetDirective,
        LocalSearchComponent,
        ResourceSearchComponent
    ],
    imports: [
        PipesModule,
        CommonModule,
        FormsModule,
        TranslateModule,
        AngularSplitModule.forRoot(),
        InspectorModule,
        WorkflowDebuggerModule,
        SmartNodesCustomModule,
        SmartNodesModule,
        PopUpModule,
        DirectivesModule,
        ExplorerModule,
        ATAppModule,
        ATAppToolboxModule,
        ATAppCustomModule,
        SmartLinkModule,
        SmartLinkAppModule,
        OptionsModule,
        ScheduledTaskModule,
        GenericListsModule,
        PipeModule,
        ImportDataModule,
        DrawingModule.forRoot(),
        ImportMainDataModule,
        SecurityModule,
        ApplicationsSettingsModule,
        SettingsModule,
        ThemeEditorModule,
        MetadataModule,
        TagsListsModule,
        AppDataBaseModule,
        NgxDropzoneModule,
        ManifestSettingsModule,
        DirectiveModule,
        I18nEditorModule,
    ],
    exports: [
        CheckSettingsComponent,
        ManifestSettingsComponent,
        CursorsComponent,
        ConnectorParametersComponent,
        TabsComponent,
        TabsMaterialComponent,
        DataExplorerComponent,
        EnvironmentBarComponent,
        TranslateModule,
        SmartNodesModule,
        EditorContentComponent,
        ModelEditorComponent,
        WorkflowEditorComponent,
        FlowEditorComponent,
        FormsModule,
        ModalComponent,
        AngularSplitModule,
        ReportTemplatesEditorComponent,
        AppEditorComponent,
        EditorFormComponent,
        ExplorerModule,
        PopUpModule,
        SmartLinkModule,
        SmartLinkAppModule,
        OptionsModule,
        ThemeEditorModule,
        PipeModule,
        DialogMessageComponent,
        ResourceSearchComponent
    ],
})
export class SharedModule {
    public static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                LangsService,
                MessageService,
                EnvironmentService,
                TabsService,
                ContextmenuService,
                PatchesService,
                DataService,
                DatasService,
                SessionsService,
                ConfigService,
                SnModelsService,
                KeyFormaterService,
                DialogMessageService,
                IconsService,
                ModelEditorService,
                SmartModelsService,
                TreeDebugService,
                DocxTemplaterService,
                ClipboardService,
                UndoRedoService,
                PreferencesService,
                StudioTranslationService,
                SettingsUpdateService,
                WatcherService,
                CheckService,
                RulesEngine,
            ]
        };
    }
}
