import { WorkflowDebuggerModule } from '@algotech/business';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PopUpModule } from '../pop-ups/pop-up.module';
import { ThemeEditorModule } from '../theme/theme-editor.module';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        PopUpModule,
        WorkflowDebuggerModule,
        ThemeEditorModule
    ],
    declarations: [
    ],
    exports: [
    ],
    providers: [
    ]
})
export class SettingsModule { }
