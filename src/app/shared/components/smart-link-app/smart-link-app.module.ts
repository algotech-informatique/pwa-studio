import { DirectivesModule, PipesModule } from '@algotech-ce/angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OptionsModule } from '../options/options.module';
import { SmartLinkAppExService } from './smart-link-app.service';
import { SmartLinkAppShareComponent } from './smart-link-app/smart-link-app-share/smart-link-app-share.component';
import { SmartLinkAppComponent } from './smart-link-app/smart-link-app.component';

@NgModule({
    declarations: [
        SmartLinkAppComponent,
        SmartLinkAppShareComponent,
    ],
    imports: [
        FormsModule,
        CommonModule,
        PipesModule,
        TranslateModule,
        DragDropModule,
        DirectivesModule,
        OptionsModule,
    ],
    exports: [
        SmartLinkAppComponent,
    ],
    providers: [
        SmartLinkAppExService,
    ],
    entryComponents: [
        SmartLinkAppShareComponent,
    ]
})
export class SmartLinkAppModule { }
