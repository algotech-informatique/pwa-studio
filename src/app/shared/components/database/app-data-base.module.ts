import { AppDataBaseGridComponent } from './grid/grid.component';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { OptionsModule } from '../options/options.module';
import { AppDataBaseComponent } from './app-data-base.component';
import { AppDataBaseListComponent } from './smart-objects-list/app-data-base-list.component';
import { AngularSplitModule } from 'angular-split';
import { FormsModule } from '@angular/forms';
import { GridModule, PopoverModule, WorkflowDebuggerModule } from '@algotech-ce/business';
import { DirectivesModule, PipesModule } from '@algotech-ce/angular';
import { AppDataBaseContextMenuComponent } from './context-menu/context-menu.component';
import { AppDataBaseNavigationComponent } from './navigation/navigation.component';
import { AppDataBaseWarningComponent } from './info-message/warning.component';
import { DataBaseUtilsService } from './services/data-base-utils.service';
import { DataBaseImportService } from './services/data-base-import.service';
import { AppDataBaseImportMappingComponent } from './import/mapping-grid.component';
import { AppDataBaseMonitoringComponent } from './monitoring/monitoring.component';
import { PipeModule } from '../../pipes/pipe.module';
import { DirectiveModule } from '../../directives/directive.module';
import { AppDataBasePageCounterComponent } from './page-counter/page-counter.component';

@NgModule({
    declarations: [
        AppDataBaseComponent,
        AppDataBaseListComponent,
        AppDataBaseGridComponent,
        AppDataBaseContextMenuComponent,
        AppDataBaseNavigationComponent,
        AppDataBaseWarningComponent,
        AppDataBaseImportMappingComponent,
        AppDataBaseMonitoringComponent,
        AppDataBasePageCounterComponent,
    ],
    imports: [
        CommonModule,
        OptionsModule,
        TranslateModule,
        AngularSplitModule,
        FormsModule,
        GridModule,
        PipesModule,
        DirectivesModule,
        PopoverModule,
        WorkflowDebuggerModule,
        PipeModule,
        DirectiveModule,
    ],
    providers: [
        DataBaseUtilsService,
        DataBaseImportService,
        DatePipe
    ],
    exports: [
        AppDataBaseComponent,
    ],
})
export class AppDataBaseModule { }
