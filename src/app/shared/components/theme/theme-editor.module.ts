import { WorkflowDebuggerModule } from '@algotech/business';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PopUpModule } from '../pop-ups/pop-up.module';
import { ThemeColorPipe } from './theme-color.pipe';
import { ThemeEditorLayoutComponent } from './theme-editor-layout.component';
import { ThemeEditorComponent } from './theme-editor.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        PopUpModule,
        WorkflowDebuggerModule
    ],
    declarations: [
        ThemeEditorComponent,
        ThemeEditorLayoutComponent,
        ThemeColorPipe
    ],
    exports: [
        ThemeEditorComponent,
        ThemeEditorLayoutComponent,
        ThemeColorPipe,
    ],
    providers: [
    ]
})
export class ThemeEditorModule { }
