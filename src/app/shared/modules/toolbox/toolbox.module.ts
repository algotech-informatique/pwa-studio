import { DirectivesModule, PipesModule } from '@algotech-ce/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SelectVersionsComponent } from './components/select-versions/select-versions.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        PipesModule,
        DirectivesModule,
    ],
    exports: [
        SelectVersionsComponent,
    ],
    declarations: [
        SelectVersionsComponent,
    ],
})
export class ToolBoxModule { }
