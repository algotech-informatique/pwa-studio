import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@algotech/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { DataInputsComponent } from './data-inputs.component';
import { DataInputsTextComponent } from './data-inputs-text/data-inputs-text.component';
import { DataInputsBooleanComponent } from './data-inputs-boolean/data-inputs-boolean.component';
import { DataInputsDateComponent } from './data-input-date/data-inputs-date.component';
import { DataInputsDatetimeComponent } from './data-input-datetime/data-inputs-datetime.component';
import { DataInputsNumberComponent } from './data-inputs-number/data-inputs-number.component';
import { DataInputsTimeComponent } from './data-input-time/data-inputs-time.component';

@NgModule({
    declarations: [
        DataInputsComponent,
        DataInputsTextComponent,
        DataInputsBooleanComponent,
        DataInputsDateComponent,
        DataInputsDatetimeComponent,
        DataInputsNumberComponent,
        DataInputsTimeComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        PipesModule,
        TranslateModule,
    ],
    exports: [
        DataInputsComponent,
    ]
})
export class DataInputsModule { }
