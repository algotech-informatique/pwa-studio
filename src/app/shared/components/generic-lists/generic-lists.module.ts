import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionsModule } from '../options/options.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { GenericListsComponent } from './generic-lists.component';
import { GenericListsService, PipesModule } from '@algotech/angular';
import { PopUpModule } from '../pop-ups/pop-up.module';
import { GenericListsDetailComponent } from './components/generic-lists-detail/generic-lists-detail.component';
import { GenericListsMainComponent } from './components/generic-lists-main/generic-lists-main.component';
import { GenericListsDetailLineComponent } from './components/generic-lists-detail-line/generic-lists-detail-line.component';
import { GenericListService } from './components/services/generic-lists.service';
import { GenericListsDetailService } from './components/services/generic-lists.detail.service';
import { PipeModule } from '../../pipes/pipe.module';

@NgModule({
    declarations: [
        GenericListsComponent,
        GenericListsDetailComponent,
        GenericListsMainComponent,
        GenericListsDetailLineComponent,
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
        GenericListsComponent,
    ],
    entryComponents: [
        GenericListsDetailComponent,
        GenericListsMainComponent,
        GenericListsDetailLineComponent,
    ],
    providers: [
        GenericListService,
        GenericListsService,
        GenericListsDetailService,
    ]
})
export class GenericListsModule { }
