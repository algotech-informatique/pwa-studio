import { DisplayInputPopUpComponent } from './display-input-pop-up/display-input-pop-up.component';
import { DisplayTextPopUpComponent } from './display-text-pop-up/display-text-pop-up.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePopUpComponent } from './base-pop-up/base-pop-up.component';
import { DisplayNamePopUpComponent } from './display-name-pop-up/display-name-pop-up.component';
import { PopUpService } from './pop-up.service';
import { FormsModule } from '@angular/forms';
import { ColorPopUpComponent } from './color-pop-up/color-pop-up.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { PipesModule } from '@algotech-ce/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { StorePublishPopoverComponent } from './store-publish-popover/store-publish-popover.component';
import { SnSelectParameterModule } from '../../modules/smart-nodes-custom';
import { DataInputsModule } from '../../modules/inspector/data-inputs/data-inputs.module';
import { IconPopUpComponent } from './icon-pop-up/icon-pop-up.component';
import { IconPopUpService } from './icon-pop-up/icon-pop-up.service';
import { ConnectorPopUpComponent } from './connector-pop-up/connector-pop-up.component';
import { OptionsModule } from '../options/options.module';
import { CheckListPopUpComponent } from './check-list-pop-up/check-list-pop-up.component';
import { SelectorPopUpComponent } from './selector-pop-up/selector-pop-up.component';
import { LangSelectorPopUpComponent } from './lang-selector-pop-up/lang-selector-pop-up.component';

@NgModule({
    declarations: [
        BasePopUpComponent,
        DisplayNamePopUpComponent,
        ColorPopUpComponent,
        StorePublishPopoverComponent,
        IconPopUpComponent,
        DisplayTextPopUpComponent,
        DisplayInputPopUpComponent,
        ConnectorPopUpComponent,
        CheckListPopUpComponent,
        SelectorPopUpComponent,
        LangSelectorPopUpComponent,
    ],
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        PipesModule,
        TranslateModule,
        ColorPickerModule,
        SnSelectParameterModule,
        DataInputsModule,
        OptionsModule,
    ],
    exports: [
        BasePopUpComponent,
        DisplayNamePopUpComponent,
        ColorPopUpComponent,
        StorePublishPopoverComponent,
        IconPopUpComponent,
        DisplayTextPopUpComponent,
        DisplayInputPopUpComponent,
        ConnectorPopUpComponent,
        CheckListPopUpComponent,
        SelectorPopUpComponent,
        LangSelectorPopUpComponent,
    ],
    providers: [
        PopUpService,
        IconPopUpService,
    ]
})
export class PopUpModule { }
