import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InjectStylePipe } from './pipes/inject-style.pipe';
import { Uuid2ImagePipe } from './pipes/uuid2image.pipe';
import * as widgets from './widgets';
import { InspectorModule } from '../inspector/inspector.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@algotech/angular';
import { InputTransformPipe } from './pipes/input-transform.pipe';
import { ATAppModule } from '../app/at-app.module';
import { AppCheckService, AppCheckUtilsService, AppDebugService, AppExportTemplateService, AppPublishService } from './services';
import { SmartNodesModule } from '../smart-nodes/smart-nodes.module';
import { AppCustomService } from './services/app-custom/app-custom.service';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DataInputsModule } from '../inspector/data-inputs/data-inputs.module';
import { WhiteSpacePipe } from './pipes/white-space.pipe';
import { WidgetDocumentModule, SoInputModule, GridModule } from '@algotech/business';
import { GetTabModelsPipe } from './widgets/tabs/tab/pipe/get-tab-models.pipe';
import { DirectivesModule } from '@algotech/business';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        PipesModule,
        InspectorModule,
        TranslateModule,
        ATAppModule,
        SmartNodesModule,
        FormsModule,
        NgxDropzoneModule,
        DataInputsModule,
        WidgetDocumentModule,
        SoInputModule,
        GridModule,
        DirectivesModule
    ],
    declarations: [
        widgets.WidgetTextComponent,
        widgets.WidgetButtonComponent,
        widgets.WidgetImageComponent,
        widgets.WidgetPolylineComponent,
        widgets.WidgetRectangleComponent,
        widgets.WidgetCircleComponent,
        widgets.WidgetCustomComponent,
        widgets.WidgetBoardComponent,
        widgets.WidgetZoneComponent,
        widgets.WidgetMagnetComponent,
        widgets.WidgetMagnetPropertyComponent,
        widgets.WidgetDocumentComponent,
        widgets.WidgetListComponent,
        widgets.WidgetTabsComponent,
        widgets.WidgetTabComponent,
        widgets.WidgetNotificationComponent,
        widgets.WidgetProfileComponent,
        widgets.WidgetSelectorComponent,
        widgets.WidgetHeaderComponent,
        widgets.WidgetFooterComponent,
        widgets.WidgetTableComponent,
        widgets.TextWidgetParametersComponent,
        widgets.ButtonWidgetParametersComponent,
        widgets.ImageWidgetParametersComponent,
        widgets.CustomWidgetParametersComponent,
        widgets.BoardWidgetParametersComponent,
        widgets.ZoneWidgetParametersComponent,
        widgets.MagnetWidgetParametersComponent,
        widgets.MagnetPropertyWidgetParametersComponent,
        widgets.DocumentWidgetParametersComponent,
        widgets.ListWidgetParametersComponent,
        widgets.TabsWidgetParametersComponent,
        widgets.TabWidgetParametersComponent,
        widgets.TabWidgetDesignComponent,
        widgets.HeaderWidgetParametersComponent,
        widgets.FooterWidgetParametersComponent,
        widgets.NotificationWidgetParametersComponent,
        widgets.ProfileWidgetParametersComponent,
        widgets.SelectorWidgetParametersComponent,
        widgets.TableWidgetParametersComponent,
        widgets.TableWidgetDesignComponent,
        widgets.ColumnWidgetParametersComponent,
        widgets.ColumnWidgetDesignComponent,
        GetTabModelsPipe,
        InputTransformPipe,
        InjectStylePipe,
        Uuid2ImagePipe,
        WhiteSpacePipe,
    ],
    exports: [
        widgets.WidgetTextComponent,
        widgets.WidgetButtonComponent,
        widgets.WidgetImageComponent,
        widgets.WidgetPolylineComponent,
        widgets.WidgetRectangleComponent,
        widgets.WidgetCircleComponent,
        widgets.WidgetCustomComponent,
        widgets.WidgetBoardComponent,
        widgets.WidgetZoneComponent,
        widgets.WidgetMagnetComponent,
        widgets.WidgetMagnetPropertyComponent,
        widgets.WidgetDocumentComponent,
        widgets.WidgetListComponent,
        widgets.WidgetTabsComponent,
        widgets.WidgetTabComponent,
        widgets.WidgetNotificationComponent,
        widgets.WidgetProfileComponent,
        widgets.WidgetSelectorComponent,
        widgets.WidgetHeaderComponent,
        widgets.WidgetFooterComponent,
        widgets.WidgetTableComponent,
        widgets.TextWidgetParametersComponent,
        widgets.ButtonWidgetParametersComponent,
        widgets.ImageWidgetParametersComponent,
        widgets.CustomWidgetParametersComponent,
        widgets.BoardWidgetParametersComponent,
        widgets.ZoneWidgetParametersComponent,
        widgets.MagnetWidgetParametersComponent,
        widgets.MagnetPropertyWidgetParametersComponent,
        widgets.DocumentWidgetParametersComponent,
        widgets.ListWidgetParametersComponent,
        widgets.TabsWidgetParametersComponent,
        widgets.TabWidgetParametersComponent,
        widgets.TabWidgetDesignComponent,
        widgets.HeaderWidgetParametersComponent,
        widgets.FooterWidgetParametersComponent,
        widgets.NotificationWidgetParametersComponent,
        widgets.ProfileWidgetParametersComponent,
        widgets.SelectorWidgetParametersComponent,
        widgets.TableWidgetParametersComponent,
        widgets.TabWidgetDesignComponent,
        widgets.ColumnWidgetParametersComponent,
        widgets.ColumnWidgetDesignComponent,
    ],
    providers: [
        AppCustomService,
        AppCheckService,
        AppCheckUtilsService,
        AppDebugService,
        AppPublishService,
        AppExportTemplateService,
        widgets.WidgetListService,
        widgets.WidgetBoardService,
        widgets.PolylineDrawService,
        widgets.WidgetTabsService,
        widgets.WidgetTableService,
    ],
    entryComponents: []
})
export class ATAppCustomModule { }
