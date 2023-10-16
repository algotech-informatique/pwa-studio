import { NgModule } from '@angular/core';
import { ObjectTreeLineComponent } from '../object-tree-line/object-tree-line.component';
import { ObjectTreeInputComponent } from '../object-tree-input/object-tree-input.component';
import { ModuleTreeLineComponent } from '../module-tree-line/module-tree-line.component';
import { DragExplorerSourceDirective, DragExplorerTargetDirective } from '../../directives';
import { ExplorerComponent } from './explorer.component';
import { ExpanderComponent } from '../expander/expander.component';
import { CommonModule } from '@angular/common';
import { PipesModule, DirectivesModule } from '@algotech-ce/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SmartNodesModule } from '../../modules/smart-nodes/smart-nodes.module';
import { FormsModule } from '@angular/forms';
import { PipeModule } from '../../pipes/pipe.module';
import { ExplorerProfileSectionComponent } from './explorer-profile-section/explorer-profile-section.component';
import { InspectorModule } from '../../modules/inspector/inspector.module';
import { GlobalSearchComponent } from '../search/global-search/global-search.component';

@NgModule({
    declarations: [
        ObjectTreeLineComponent,
        ObjectTreeInputComponent,
        ModuleTreeLineComponent,
        GlobalSearchComponent,
        DragExplorerSourceDirective,
        DragExplorerTargetDirective,
        ExplorerComponent,
        ExpanderComponent,
        ExplorerProfileSectionComponent,
    ],
    imports: [
        PipesModule,
        CommonModule,
        FormsModule,
        TranslateModule,
        DirectivesModule,
        SmartNodesModule,
        PipeModule,
        InspectorModule,
    ],
    exports: [
        ExplorerComponent,
        ObjectTreeLineComponent,
        ModuleTreeLineComponent,
    ],
})
export class ExplorerModule { }

