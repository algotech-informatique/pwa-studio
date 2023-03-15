import { PipesModule } from '@algotech/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipeModule } from '../../pipes/pipe.module';
import { OptionsModule } from '../options/options.module';
import { PopUpModule } from '../pop-ups/pop-up.module';
import { TagsListsDetailLineComponent } from './components/tags-lists-detail-line/tags-lists-detail-line.component';
import { TagsListsDetailComponent } from './components/tags-lists-detail/tags-lists-detail.component';
import { TagsListsMainComponent } from './components/tags-lists-main/tags-lists-main.component';
import { TagsListsComponent } from './tags-lists.component';
import { TagsListsService } from './services/tags-lists.service';
import { TagsListsDetailService } from './services/tags-lists-detail.service';

@NgModule({
    declarations: [
        TagsListsComponent,
        TagsListsDetailComponent,
        TagsListsDetailLineComponent,
        TagsListsMainComponent,
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
        TagsListsComponent,
    ],
    entryComponents: [
        TagsListsDetailComponent,
        TagsListsDetailLineComponent,
        TagsListsMainComponent
    ],
    providers: [
        TagsListsService,
        TagsListsDetailService,
    ]
})
export class TagsListsModule { }
