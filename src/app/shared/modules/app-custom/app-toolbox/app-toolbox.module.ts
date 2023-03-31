import { FormsModule } from '@angular/forms';
import { PipesModule } from '@algotech-ce/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { SmartNodesModule } from '../../smart-nodes/smart-nodes.module';
import { AppToolboxComponent } from './app-toolbox.component';
import { DrawingModule } from '@algotech-ce/business/drawing';
import { ThemeEditorModule } from '../../../components/theme/theme-editor.module';
import { ToolBoxModule } from '../../toolbox/toolbox.module';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        PipesModule,
        TranslateModule,
        ColorPickerModule,
        SmartNodesModule,
        FormsModule,
        DrawingModule,
        ThemeEditorModule,
        ToolBoxModule,
    ],
    declarations: [
        AppToolboxComponent,
    ],
    exports: [
        AppToolboxComponent,
    ],
})
export class ATAppToolboxModule { }
