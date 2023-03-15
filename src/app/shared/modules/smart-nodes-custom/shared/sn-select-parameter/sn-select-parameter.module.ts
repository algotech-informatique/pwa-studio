import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SmartNodesModule } from '../../../smart-nodes/smart-nodes.module';
import { TranslateModule } from '@ngx-translate/core';
import { SnSelectKeyValueComponent } from './sn-select-key-value/sn-select-key-value.component';
import { IonicModule } from '@ionic/angular';
import { SnSelectPropertiesComponent } from './sn-select-properties/sn-select-properties.component';
import { PipesModule } from '@algotech/angular';
import { SnSelectModalComponent } from './sn-select-modal/sn-select-modal.component';

@NgModule({
    declarations: [
        SnSelectModalComponent,
        SnSelectKeyValueComponent,
        SnSelectPropertiesComponent,
    ],
    imports: [
        IonicModule,
        TranslateModule,
        SmartNodesModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PipesModule,
    ],
    exports: [
        SnSelectModalComponent,
        SnSelectKeyValueComponent,
        SnSelectPropertiesComponent,
    ]
})
export class SnSelectParameterModule { }
