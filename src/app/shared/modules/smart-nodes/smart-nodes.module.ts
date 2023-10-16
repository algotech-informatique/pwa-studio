import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
    SnTranslatePipe, SnDragService, SnLinksService, SnDirective, SnFlowsComponent, SnFlowComponent, SnContainerComponent,
    SnLayoutComponent, SnNodeBaseComponent, SnNodeComponent, SnTranslateService, SnUtilsService,
    SnParamComponent, SnParamsComponent, SnSectionsComponent, SnParamConnectionComponent, SnMessageService, SnInputsComponent,
    SnInputTextComponent, SnInputNumberComponent, SnInputDatetimeComponent, SnInputBooleanComponent, SnInputDateComponent,
    SnInputTimeComponent, SnContextmenuComponent, SnContextmenuMenuComponent, SnInputSelectComponent, SnInputSelectMultipleComponent,
    SnInputKeyComponent,
    SnSearchService,
} from './index';
import {
    SnDOMService, SnActionsService, SnDragUtilsService, SnNodeMergeService, SnCalculService, SnSmartConnectionsService,
    SnEntryComponentsService, SnContextmenuService, SnDragContainersService, SnDragConnectorsService, SnDragNodesService,
    SnZoomService, SnSelectionService, SnRemoveService, SnClipboardService, SnUpDownService, SnSelectorService
} from './services';
import { SnSectionComponent, SnSelectorComponent, SnToolboxSubComponent, SnToolboxComponent,
    SnDarkLayoutComponent, SnLightLayoutComponent, SnMainLayoutComponent, SnCommentComponent,
    SnSpinnerComponent, SnWatcherSelectorComponent, } from './components';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { DrawingModule } from '@algotech-ce/business/drawing';
import { PipeModule } from '../../pipes/pipe.module';
import { SnIsWatchablePipe } from './pipes/sn-is-watchable.pipe';
import { PipesModule } from '@algotech-ce/angular';
import { SnHasCommentPipe } from './pipes/sn-comment.pipe';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        DrawingModule,
        PipeModule,
        PipesModule,
    ],
    declarations: [
        SnTranslatePipe,
        SnIsWatchablePipe,
        SnHasCommentPipe,
        SnDirective,
        SnFlowsComponent,
        SnFlowComponent,
        SnParamComponent,
        SnWatcherSelectorComponent,
        SnParamConnectionComponent,
        SnParamsComponent,
        SnSectionComponent,
        SnSectionsComponent,
        SnLayoutComponent,
        SnContainerComponent,
        SnNodeComponent,
        SnSelectorComponent,
        SnSpinnerComponent,
        SnNodeBaseComponent,
        SnInputsComponent,
        SnInputTextComponent,
        SnInputNumberComponent,
        SnInputTimeComponent,
        SnInputDatetimeComponent,
        SnInputBooleanComponent,
        SnInputDateComponent,
        SnInputSelectComponent,
        SnInputSelectMultipleComponent,
        SnInputKeyComponent,
        SnContextmenuComponent,
        SnContextmenuMenuComponent,
        SnToolboxSubComponent,
        SnToolboxComponent,
        SnDarkLayoutComponent,
        SnLightLayoutComponent,
        SnMainLayoutComponent,
        ClickOutsideDirective,
        SnCommentComponent,
    ],
    exports: [
        SnDirective,
        SnFlowsComponent,
        SnFlowComponent,
        SnParamComponent,
        SnParamConnectionComponent,
        SnParamsComponent,
        SnSectionComponent,
        SnSectionsComponent,
        SnNodeBaseComponent,
        SnContextmenuComponent,
        SnMainLayoutComponent,
        SnInputSelectComponent,
        ClickOutsideDirective,
        SnTranslatePipe,
        SnToolboxSubComponent,
        SnSpinnerComponent,
        SnWatcherSelectorComponent,
    ],
    entryComponents: [
        SnNodeBaseComponent
    ],
    providers: [
        SnActionsService,
        SnRemoveService,
        SnUpDownService,
        SnNodeMergeService,
        SnCalculService,
        SnSmartConnectionsService,
        SnEntryComponentsService,
        SnLinksService,
        SnZoomService,
        SnSearchService,
        SnSelectionService,
        SnDragService,
        SnSelectorService,
        SnDragConnectorsService,
        SnDragContainersService,
        SnDragNodesService,
        SnDragUtilsService,
        SnTranslateService,
        SnUtilsService,
        SnMessageService,
        SnDOMService,
        SnContextmenuService,
        SnClipboardService,
        SnTranslatePipe,
    ],
})
export class SmartNodesModule { }
