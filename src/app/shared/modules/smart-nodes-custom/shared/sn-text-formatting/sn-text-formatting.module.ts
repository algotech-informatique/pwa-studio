import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnEditButtonFormattingComponent } from './sn-edit-button-formatting/sn-edit-button-formatting.component';
import { SnEditTextFormattingComponent } from './sn-edit-text-formatting/sn-edit-text-formatting.component';
import { SnPreviewTextFormattingComponent } from './sn-preview-text-formatting/sn-preview-text-formatting.component';
import { FormsModule } from '@angular/forms';
import { SmartNodesModule } from '../../../smart-nodes/smart-nodes.module';
import { TranslateModule } from '@ngx-translate/core';
import { SnTextFormattingService } from './sn-preview-text-formatting.service';
import { SnTextFormattingNodeComponent } from './sn-text-formatting-node.component';
import { SnSelectParameterModule } from '../sn-select-parameter/sn-select-parameter.module';

@NgModule({
    declarations: [
        SnTextFormattingNodeComponent,
        SnEditButtonFormattingComponent,
        SnEditTextFormattingComponent,
        SnPreviewTextFormattingComponent,
    ],
    imports: [
        SnSelectParameterModule,
        TranslateModule,
        SmartNodesModule,
        CommonModule,
        FormsModule,
    ],
    exports: [
        SnTextFormattingNodeComponent,
        SnEditButtonFormattingComponent,
        SnEditTextFormattingComponent,
        SnPreviewTextFormattingComponent,
    ],
    providers: [
        SnTextFormattingService
    ]
})
export class SnTextFormattingNodeModule { }
