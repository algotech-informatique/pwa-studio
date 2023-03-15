import { NgModule } from '@angular/core';
import { SnFormulaPreviewComponent } from './sn-formula-preview/sn-formula-preview.component';
import { SnFormulaNodeComponent } from './sn-formula-node.component';
import { TranslateModule } from '@ngx-translate/core';
import { SmartNodesModule } from '../../../smart-nodes/smart-nodes.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SnFormulaInputComponent } from './sn-formula-input/sn-formula-input.component';
import { SnSelectParameterModule } from '../sn-select-parameter/sn-select-parameter.module';
import { SnFormulaService } from './sn-formula.service';
import { SnFormulaSearch } from './sn-formula-search/sn-formula-search.component';
import { SnFormulaElement } from './sn-formula-search/sn-formula-element/sn-formula-element.component';
import { DirectivesModule } from '@algotech/angular';
import { SnFormulaSelected } from './sn-formula-search/sn-formula-selected/sn-formula-selected.component';

@NgModule({
    declarations: [
        SnFormulaPreviewComponent,
        SnFormulaNodeComponent,
        SnFormulaInputComponent,
        SnFormulaSearch,
        SnFormulaElement,
        SnFormulaSelected,
    ],
    imports: [
        SnSelectParameterModule,
        TranslateModule,
        SmartNodesModule,
        CommonModule,
        FormsModule,
        DirectivesModule,
    ],
    exports: [
        SnFormulaNodeComponent,
    ],
    providers: [
        SnFormulaService
    ]
})
export class SnFormulaNodeModule { }
