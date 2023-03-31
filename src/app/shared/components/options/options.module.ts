import { DirectivesModule, PipesModule } from '@algotech-ce/angular';
import { WorkflowDebuggerModule } from '@algotech-ce/business';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { OptionsCheckboxComponent } from './components/options-checkbox/options-checkbox.component';
import { OptionsCopyTextComponent } from './components/options-copytext/options-copytext.component';
import { OptionsDateComponent } from './components/options-date/options-date.component';
import { OptionsInputComponent } from './components/options-input/options-input.component';
import { OptionsListComponent } from './components/options-list/options-list.component';
import { OptionsRadioComponent } from './components/options-radio/options-radio.component';
import { OptionsSourcesComponent } from './components/options-sources/options-sources.component';
import { OptionsContainerComponent } from './options-container/options-container.component';
import { CopyClipboardDirective } from '../../directives';
import { OptionsChipsComponent } from './components/options-chips/options-chips.component';
import { OptionsObjectListComponent } from './components/options-object-list/options-object-list.component';
import { OptionsObjectDetailComponent } from './components/options-object-detail/options-object-detail.component';
import { OptionsSearchComponent } from './components/options-search/options-search.component';
import { OptionsLoggerComponent } from './components/options-logger/options-logger.component';
import { OptionsInputMultilangComponent } from './components/options-input-multilang/options-input-multilang.component';
import { OptionMultilangPopUpComponent } from './components/options-input-multilang/option-multilang-pop-up/option-multilang-pop-up.component';
import { SnSelectParameterModule } from '../../modules/smart-nodes-custom';
import { PipeModule } from '../../pipes/pipe.module';
import { OptionsTextAreaMultilangComponent } from './components/options-text-area-multilang/options-text-area-multilang.component';
import { OptionsMarkdownMultilangComponent } from './components/options-markdown-multilang/options-markdown-multilang.component';
import { MarkdownModule } from 'ngx-markdown';
import { OptionsChipsListComponent } from './components/options-chips-list/options-chips-list.component';
import { OptionsPopoverComponent } from './components/options-popover/options-popover.component';
import { OptionsInputCheckboxComponent } from './components/options-input-checkbox/options-input-checkbox.component';
import { OptionsColorComponent } from './components/options-color/options-color.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ColorPopoverComponent } from './components/options-color/color-popover/color-popover.component';
import { OptionsMonitoringComponent } from './components/options-monitoring/options-monitoring.component';
import { OptionsToggleComponent } from './components/options-toggle/options-toggle.component';

@NgModule({
    declarations: [
        CopyClipboardDirective,
        OptionsCheckboxComponent,
        OptionsDateComponent,
        OptionsRadioComponent,
        OptionsSourcesComponent,
        OptionsContainerComponent,
        OptionsInputComponent,
        OptionsListComponent,
        OptionsCopyTextComponent,
        OptionsChipsComponent,
        OptionsObjectListComponent,
        OptionsObjectDetailComponent,
        OptionsSearchComponent,
        OptionsLoggerComponent,
        OptionsInputMultilangComponent,
        OptionMultilangPopUpComponent,
        OptionsTextAreaMultilangComponent,
        OptionsMarkdownMultilangComponent,
        OptionsChipsListComponent,
        OptionsPopoverComponent,
        OptionsInputCheckboxComponent,
        OptionsColorComponent,
        ColorPopoverComponent,
        OptionsMonitoringComponent,
        OptionsToggleComponent,
    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule,
        TranslateModule,
        DirectivesModule,
        WorkflowDebuggerModule,
        SnSelectParameterModule,
        PipeModule,
        MarkdownModule,
        ColorPickerModule,
    ],
    exports: [
        CopyClipboardDirective,
        OptionsCheckboxComponent,
        OptionsDateComponent,
        OptionsRadioComponent,
        OptionsSourcesComponent,
        OptionsContainerComponent,
        OptionsInputComponent,
        OptionsListComponent,
        OptionsCopyTextComponent,
        OptionsChipsComponent,
        OptionsObjectListComponent,
        OptionsObjectDetailComponent,
        OptionsSearchComponent,
        OptionsLoggerComponent,
        OptionsInputMultilangComponent,
        OptionsTextAreaMultilangComponent,
        OptionsMarkdownMultilangComponent,
        OptionsChipsListComponent,
        OptionsPopoverComponent,
        OptionsInputCheckboxComponent,
        OptionsColorComponent,
        OptionsMonitoringComponent,
        OptionsToggleComponent,
    ],
    entryComponents: [
        OptionMultilangPopUpComponent,
        ColorPopoverComponent,
    ],
})
export class OptionsModule { }
