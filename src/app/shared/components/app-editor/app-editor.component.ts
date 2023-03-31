import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { SessionsService } from '../../services/sessions/sessions.service';
import { SnModelDto, WorkflowModelDto, SmartModelDto, SnPageDto, SnPageWidgetDto, SnAppDto } from '@algotech-ce/core';
import { DatasService, CheckService, SnModelsService, ConfigService, MessageService } from '../../services';
import * as _ from 'lodash';
import { ParamEditorDto } from '../../modules/inspector/dto/param-editor.dto';
import { Subscription, Observable } from 'rxjs';
import { AppActionsService, AppSelectionService, AppZoomService, PageUtilsService } from '../../modules/app/services';
import { AppSelectionEvent, AppSettings } from '../../modules/app/dto';
import { WidgetBoardService, WidgetListService, WidgetTabsService } from '../../modules/app-custom/widgets';
import { AppCustomService, AppExportTemplateService } from '../../modules/app-custom/services';
import { ThemeEngloberService } from '@algotech-ce/business';
import { ValidationReportDto } from '../../dtos';

@Component({
    selector: 'app-editor',
    styleUrls: ['./app-editor.component.scss'],
    templateUrl: './app-editor.component.html',
})
export class AppEditorComponent implements OnChanges, OnDestroy {

    @Input() snModelUuid: string;
    @Input() customerKey: string;
    @Input() host: string;

    tabSelected = 2;

    context: {
        type: string;
        element: any;
    } = null;
    param: ParamEditorDto = null;

    settings: AppSettings = null;
    snModel: SnModelDto = null;
    snApp: SnAppDto;
    smartModel: SmartModelDto | SmartModelDto[];

    openDebug = false;
    treeDebugCLosed = false;
    report: ValidationReportDto;

    treeDebugSize = 300;
    workflowToDebug: WorkflowModelDto;
    appSubscriber: Subscription;
    subscribeCheck: Subscription;
    widgets: Observable<SnPageWidgetDto[]>;
    selectedPage: SnPageDto;
    selectedWidget: SnPageWidgetDto;
    showWidgetsSelector = false;
    openSmartLink = false;
    openInspector = null;

    constructor(
        public appZoom: AppZoomService,
        public sessionsService: SessionsService,
        private datasService: DatasService,
        private snModelsService: SnModelsService,
        private pageUtils: PageUtilsService,
        private appActions: AppActionsService,
        private appSelection: AppSelectionService,
        private widgetBoard: WidgetBoardService,
        private widgetList: WidgetListService,
        private appCustom: AppCustomService,
        private themeEnglober: ThemeEngloberService,
        private widgetTabs: WidgetTabsService,
        private appExportTemplate: AppExportTemplateService,
        private checkService: CheckService,
        private configService: ConfigService,
        private messageService: MessageService,
    ) {
    }

    ngOnDestroy() {
        if (this.appSubscriber) {
            this.appSubscriber.unsubscribe();
        }
        this.checkService.unSubscribeApp();
    }

    ngOnChanges() {
        this.openDebug = false;
        this.showWidgetsSelector = false;
        this.snModel = this.sessionsService.findModel(this.host, this.customerKey, this.snModelUuid);
        this.snApp = this.snModelsService.getActiveView(this.snModel) as SnAppDto;
        if (!this.snApp) {
            return;
        }
        this.loadApp();
    }

    loadApp() {
        this.createSubscription();
        this.appCustom.updateApp(this.snApp);
        this.selectedWidget = null;
        this.settings = {
            redo: () => {
                this.datasService.redo(this.snModel, this.customerKey, this.host);
            },
            undo: () => {
                this.datasService.undo(this.snModel, this.customerKey, this.host);
            },
            languages: this.sessionsService.active.datas.read.customer.languages,
            contextmenus: {
                extended: [
                    ...this.widgetBoard.extendedContextMenu(this.snApp),
                    ...this.widgetList.extendedContextMenu(this.snApp),
                    ...this.widgetTabs.extendedContextMenu(this.snApp),
                    ...this.appExportTemplate.extendedContextMenu(this.snApp),
                ],
            },
            shortcut: {
                extended: [
                    ...this.widgetList.extendedShortcut(this.snApp)
                ],
            }
        };

        this.themeEnglober.theme.next(this.snApp.theme);
        this.datasService.notifyChangeView(this.customerKey, this.host, this.snApp.id);
    }

    createSubscription() {
        // selections
        if (this.appSubscriber) {
            this.appSubscriber.unsubscribe();
        }
        this.appSubscriber = this.appSelection.onSelect(this.snApp).subscribe((data: AppSelectionEvent) => {
            this.appActions.update++;
            this.openInspector = data?.openInspector;
            if (!data) {
                this.selectedPage = null;
                this.selectedWidget = null;
                return;
            } // selection de l'app global
            if (data.type === 'page') {
                this.selectedPage = data.element as SnPageDto;
                this.selectedWidget = null;
                return;
            } // selection de la page
            if (data.type === 'widget') {
                this.selectedWidget = data.element as SnPageWidgetDto;
                this.selectedPage = this.pageUtils.findPage(this.snApp, this.selectedWidget);
                return;
            } // selection du widget
        });

        this.appSubscriber.add(this.appActions.onShowLeftInspector(this.snApp).subscribe((data: any) => {
            this.openInspector = data?.openInspector;
            return;
        }));

        this.appSubscriber.add(this.appActions.onShowWidgetSelector(this.snApp).subscribe((data: any) => {
            this.showWidgetsSelector = data.show;
        }));

        this.subscribeToCheck();
    }

    subscribeToCheck() {
        if (this.subscribeCheck) {
            this.subscribeCheck.unsubscribe();
        }
        this.subscribeCheck = this.appActions.onChecked(this.snApp).subscribe({
            next: () => {
                if (this.snApp) {
                    this.report = this.checkService.getReport('APP', this.snModelUuid);
                    this.treeDebugCLosed = this.configService.config.
                        preferences.checkOptions.openDebug.indexOf(this.report?.checkEvent) === -1;
                    this.openDebug = this.report?.errors?.length > 0 ||
                        this.report?.warnings?.length > 0 ||
                        this.report?.infos?.length > 0;
                }
            }
        });
        this.checkService.subscribeApp(this.snApp, this.snModelUuid);
    }

    changed(data: { app: SnAppDto }) {
        this.themeEnglober.theme.next(this.snApp.theme);
        this.appActions.notifyCheck(data ? data.app : this.snApp);
        this.datasService.notifySNView(data ? data.app : this.snApp, this.customerKey, this.host);
    }

    onDrawingActivate(drawing: boolean) {
        this.appActions.notifyDrawing(this.snApp, drawing);
    }

    onAppChanged(app: SnAppDto) {
        this.snApp = app;
        this.loadApp();
        this.selectedWidget = null;
    }

    onShared(event) {
        this.openSmartLink = true;
    }

    onCloseSmartLink(event) {
        this.openSmartLink = false;
    }

    handCloseTabs() {
        this.treeDebugCLosed = true;
    }
}
