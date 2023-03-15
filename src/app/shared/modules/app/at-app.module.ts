import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { PageWidgetDirective } from './directives/page-widget.directive';
import { WidgetComponent } from './components/widget/widget.component';
import { SmartNodesModule } from './../smart-nodes/smart-nodes.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import {
    PageAddWidgetService, PageDragLandmarkService, PageDragService, PageDragWidgetService,
    PageResizeWidgetService, AppSelectionService, PageUtilsService, PageWidgetService,
    AppZoomService, AppContextmenuService, AppActionsService, AppClipboardService, AppSelectorService,
    AppDragPageService, AppLinksService, AppResizePageService
} from './services';
import { ElementSelectedPipe } from './pipes/widget-selected.pipe';
import { ScaleZoomPipe } from './pipes/scale-zoom.pipe';
import { ShowAppErrorsPipe } from './pipes/show-app-errors.pipe';
import { AppResizeComponent } from './components/app-resize/app-resize.component';
import { DrawingModule } from '@algotech/business/drawing';
import { AppSelectionComponent } from './components/app-selection/app-selection.component';
import { AppTitleComponent } from './components/app-title/app-title.component';
import { ResolveRulePipe } from './pipes/resolve-rule.pipe';
import { ShowAppErrorsContainsPipe } from './pipes/show-app-errors-contains.pipe';
import { BuildPageHandlerIdPipe } from './pipes/build-page-handler-id.pipe';
import { WidgetsWithIconPipe } from './pipes/widget-with-icon.pipe';
import { SharedComponentsPipe } from './pipes/shared-components.pipe';
import { LockedComponentsPipe } from './pipes/locked-components.pipe';
import { WidgetTypePipe } from './pipes/widget-type.pipe';

@NgModule({
    imports: [
        CommonModule,
        SmartNodesModule,
        IonicModule,
        TranslateModule,
        FormsModule,
        DrawingModule,
    ],
    declarations: [
        AppLayoutComponent,
        AppTitleComponent,
        AppSelectionComponent,
        AppResizeComponent,
        WidgetComponent,
        ElementSelectedPipe,
        PageWidgetDirective,
        ScaleZoomPipe,
        ShowAppErrorsPipe,
        ResolveRulePipe,
        ShowAppErrorsContainsPipe,
        BuildPageHandlerIdPipe,
        WidgetsWithIconPipe,
        SharedComponentsPipe,
        LockedComponentsPipe,
        WidgetTypePipe
    ],
    exports: [
        AppLayoutComponent,
        WidgetComponent,
        ElementSelectedPipe,
        ShowAppErrorsPipe,
        AppResizeComponent,
        ResolveRulePipe,
        ShowAppErrorsContainsPipe,
        BuildPageHandlerIdPipe,
        WidgetsWithIconPipe,
        SharedComponentsPipe,
        LockedComponentsPipe,
        WidgetTypePipe
    ],
    providers: [
        AppZoomService,
        AppSelectorService,
        AppSelectionService,
        AppContextmenuService,
        AppActionsService,
        AppClipboardService,
        AppDragPageService,
        AppLinksService,
        PageUtilsService,
        PageDragService,
        PageDragWidgetService,
        PageResizeWidgetService,
        AppResizePageService,
        PageAddWidgetService,
        PageDragLandmarkService,
        PageWidgetService
    ],
})
export class ATAppModule { }
