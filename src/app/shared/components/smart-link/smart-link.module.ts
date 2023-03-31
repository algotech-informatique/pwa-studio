import { DirectivesModule, PipesModule } from '@algotech-ce/angular';
import { WorkflowDebuggerModule } from '@algotech-ce/business';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OptionsModule } from '../options/options.module';
import { SmartLinkComponent } from './smart-link/smart-link.component';
import { SmartLinkExService } from './smart-link.service';
import { SmartLinkCreationComponent } from './smart-link/smart-link-creation/smart-link-creation.component';
import { SmartLinkShareComponent } from './smart-link/smart-link-share/smart-link-share.component';
import { InspectorModule } from '../../modules/inspector/inspector.module';

@NgModule({
    declarations: [
        SmartLinkComponent,
        SmartLinkCreationComponent,
        SmartLinkShareComponent,
    ],
    imports: [
        FormsModule,
        CommonModule,
        PipesModule,
        TranslateModule,
        DragDropModule,
        DirectivesModule,
        OptionsModule,
        WorkflowDebuggerModule,
        InspectorModule,
    ],
    exports: [
        SmartLinkComponent,
    ],
    providers: [
         SmartLinkExService,
    ],
    entryComponents: [
        SmartLinkCreationComponent,
        SmartLinkShareComponent,
    ]
})
export class SmartLinkModule { }
