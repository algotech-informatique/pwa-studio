import { PipesModule } from '@algotech-ce/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipeModule } from '../../pipes/pipe.module';
import { OptionsModule } from '../options/options.module';
import { PopUpModule } from '../pop-ups/pop-up.module';
import { MetadataDetailComponent } from './components/metadata-detail/metadata-detail.component';
import { MetadataMainComponent } from './components/metadata-main/metadata-main.component';
import { MetadataComponent } from './metadata.component';

@NgModule({
    declarations: [
        MetadataComponent,
        MetadataDetailComponent,
        MetadataMainComponent,
    ],
    imports: [
        CommonModule,
        OptionsModule,
        IonicModule,
        FormsModule,
        PipesModule,
        TranslateModule,
        PopUpModule,
        PipeModule,
    ],
    exports: [
        MetadataComponent
    ],
    entryComponents: [
        MetadataDetailComponent,
        MetadataMainComponent,
    ],
    providers: [
    ]
})
export class MetadataModule { }
