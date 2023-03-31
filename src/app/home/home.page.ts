import {
    Component, OnInit, ViewChild, AfterViewInit, ViewContainerRef,
    ChangeDetectorRef,
    OnDestroy
} from '@angular/core';
import {
    MessageService, TabsService, ContextmenuService, ToastService,
    DatasService, PreferencesService, ConfigService
} from '../shared/services';
import { TabDto, ObjectTreeLineDto, GroupConnectionDto } from '../shared/dtos';
import { SessionsService } from '../shared/services/sessions/sessions.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { AuthService, DataService } from '@algotech-ce/angular';
import { mergeMap, tap } from 'rxjs/operators';
import { SnContextmenu } from '../shared/modules/smart-nodes';
import { TabContextMenuEvent, tabsContextMenu } from '../shared/components/tabs/tabs-context-menu/tabs-context-menu';
import { StudioTranslationService } from '../shared/services/translation/studio-translation.service';
import { SnModelDto } from '@algotech-ce/core';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('toasts', { read: ViewContainerRef }) toasts: ViewContainerRef;

    expand = true;
    tabs: TabDto[] = [];
    draggedTab: TabDto = null;
    modalOpen;
    parametersOpen = false;
    selectedTab: TabDto = null;
    showContextmenu: boolean;
    connectorLine: ObjectTreeLineDto;
    isMac: boolean;

    display = false;
    preExpand = false;
    hasHistory = false;

    connections: GroupConnectionDto[];
    subscription: Subscription;

    constructor(
        public translate: TranslateService,
        public messageService: MessageService,
        public sessionsService: SessionsService,
        public datasService: DatasService,
        public tabsService: TabsService,
        private dataService: DataService,
        private contextmenuService: ContextmenuService,
        private toastService: ToastService,
        private ref: ChangeDetectorRef,
        private preferencesService: PreferencesService,
        private configService: ConfigService,
        private titleService: Title,
        private studioTranslate: StudioTranslationService,
        private authService: AuthService,
    ) {
        this.isMac = (navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    }

    ngOnInit(): void {
        if (!this.authService.isAuthenticated) {
            return;
        }
        this.subscription = this.dataService.Initialize().pipe(
            mergeMap(() => this.configService.load()),
            tap(() => this.preferencesService.restoreMandatory()),
            tap(() => this.display = true),
            mergeMap(() => this.sessionsService.connect()),
            mergeMap(() => this.studioTranslate.defineDefaultLang(this.sessionsService.active.datas.read.customer.languages)),
        ).subscribe(() => {
            const splitHost = window.location.host.split('.');
            const env = splitHost.length > 0 ? ` - ${splitHost[0]}` : '';

            this.titleService.setTitle(`${this.sessionsService.active.connection.customerKey}${env} Vision Studio`);
            this.hasHistory = this.configService.getTabs().length > 0;
            if (this.hasHistory) {
                if (!document.hidden) {
                    this.onReloadSession();
                } else {
                    const focus = () => {
                        window.removeEventListener('focus', focus);
                        this.onReloadSession();
                    };
                    window.addEventListener('focus', focus);
                }
            }
        });

        this.subscription.add(this.messageService.get('explorer-tree-select').subscribe((selectedLine: ObjectTreeLineDto) =>
            this.createOrSelectTab(selectedLine))
        );

        this.subscription.add(this.messageService.get('connections-manager.hide').subscribe(() => {
            this.modalOpen = false;
        }));

        this.subscription.add(this.messageService.get('save.preferences').subscribe(() => {
            this.preferencesService.save(this.tabs);
        }));

        this.subscription.add(this.messageService.get('update.checkOptions').subscribe((checkOptions) => {
            this.preferencesService.saveCheckOptions(checkOptions);
        }));

        this.subscription.add(this.messageService.get('update.dataBaseOptions').subscribe((dataBaseOptions) => {
            this.preferencesService.saveDataBaseOptions(dataBaseOptions);
        }));

        this.subscription.add(this.messageService.get('session-refresh-env').subscribe((objects: ObjectTreeLineDto[]) => {
            this.tabs = this.tabsService.updateTabs(this.tabs, objects);
        }));

        this.subscription.add(this.messageService.get('connector-parameters.open').subscribe((data: ObjectTreeLineDto) => {
            this.parametersOpen = true;
            this.connectorLine = data;
        }));

        this.subscription.add(this.messageService.get('open-tab').subscribe((snModel: SnModelDto) => {
            this.tabs = this.tabsService.createOrSelectSubWorkflowTab(this.tabs, snModel);
            this.selectTab(this.tabsService.getSelected(this.tabs));
        }));

        this.subscription.add(this.messageService.get('debugger-change-state').subscribe((state) => {
            if (state === 'start') {
                this.preExpand = this.expand;
                this.expand = false;
            } else {
                this.expand = this.preExpand;
            }
            this.ref.detectChanges();
        }));

        this.subscription.add(this.messageService.get('tabs.dragstart').subscribe((sourceTab: TabDto) => {
            this.draggedTab = sourceTab;
        }));

        this.subscription.add(this.messageService.get('tabs.dragend').subscribe(() => {
            this.draggedTab = null;
        }));

        this.subscription.add(this.messageService.get('tabs.drop').subscribe((target) => {
            if (this.draggedTab && this.draggedTab !== target.tab) {
                this.interperceTab(this.draggedTab, target.tab, target.side);
            }
        }));

        // optimization
        this.subscription = this.messageService.get('\\.dragstart').subscribe(() => {
            this.ref.detach();
        });

        this.subscription.add(this.messageService.get('\\.dragend').subscribe(() => {
            this.ref.reattach();
        }));

        this.subscription.add(this.messageService.get('session-refresh-env').subscribe(() => {
            this.ref.reattach();
        }));

        this.subscription.add(this.messageService.get('loaded').subscribe(() => {
            this.ref.reattach();
        }));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onReloadSession() {
        this.tabs = this.configService.getTabs();
        const selected = this.tabs.find((t) => t.selected);
        if (selected) {
            this.selectTab(selected);
        }
    }

    ngAfterViewInit() {
        this.toasts.clear();
        this.toastService.initialize(this.toasts);
    }

    handleExplorerMessage(msg) {
        console.log('home comp', msg);
    }

    createOrSelectTab(selectedLine: ObjectTreeLineDto) {
        this.tabs = this.tabsService.createOrSelectTab(this.tabs, selectedLine);
        this.selectedTab = this.tabsService.getSelected(this.tabs);
        this.messageService.send('save.preferences', {});
    }

    selectTab(tab: TabDto) {
        this.selectedTab = tab;
        this.tabs = this.tabsService.select(this.tabs, tab.host, tab.customerKey, tab.refUuid);
        this.sessionsService.selectEnvByUUid(tab.host, tab.customerKey, tab.refUuid);
        this.messageService.send('save.preferences', {});
    }

    openTabContextualMenu(tabContextMenuEvent: TabContextMenuEvent) {
        tabContextMenuEvent.event.preventDefault();
        tabContextMenuEvent.event.stopPropagation();
        this.contextmenuService.showContextmenu(false);

        const menu: SnContextmenu = tabsContextMenu(() => {
            // close tab
            this.closeTab(tabContextMenuEvent.tab);
        }, () => {
            // close all other tabs
            this.closeAllTabsExeptOne(tabContextMenuEvent.tab);
        }, () => {
            // close to the right
            this.closeTabsToTheRight(tabContextMenuEvent.tab);
        });
        const mouse: number[] = [
            tabContextMenuEvent.event.clientX,
            tabContextMenuEvent.event.clientY
        ];

        this.contextmenuService.setContextmenu(menu, mouse);
        this.contextmenuService.showContextmenu(true);
    }

    interperceTab(tabToMove: TabDto, targetTab: TabDto, side: 'left' | 'right') {
        const otherTabs: TabDto[] = this.tabs.filter((tab) => tab !== tabToMove);
        let destinationIndex = otherTabs.indexOf(targetTab);
        if (side === 'right') {
            destinationIndex++;
        }
        otherTabs.splice(destinationIndex, 0, tabToMove);
        this.tabs = otherTabs;
        this.persistTabsState();
    }

    closeTab(tab: TabDto) {
        this.tabs = this.tabsService.close(this.tabs, tab.host, tab.customerKey, tab.refUuid);
        this.persistTabsState();
    }

    closeAllTabsExeptOne(tabToKeep: TabDto) {
        const otherTabsUuid: string[] =
            this.tabs
                .map((tab) => tab.refUuid)
                .filter((tabUuid) => tabUuid !== tabToKeep.refUuid);

        this.tabs = this.tabsService.closeMultiple(
            this.tabs,
            tabToKeep.host,
            tabToKeep.customerKey,
            otherTabsUuid
        );
        this.persistTabsState();
    }

    closeTabsToTheRight(tabToKeep: TabDto) {
        const tabsUuidOnTheRight: string[] = this.tabs.slice(this.tabs.indexOf(tabToKeep) + 1).map((tab) => tab.refUuid);

        this.tabs = this.tabsService.closeMultiple(
            this.tabs,
            tabToKeep.host,
            tabToKeep.customerKey,
            tabsUuidOnTheRight
        );
        this.persistTabsState();
    }

    persistTabsState() {
        if (this.tabs.length > 0) {
            this.selectTab(this.tabs.find((t) => t.selected));
        } else {
            this.sessionsService.selectEnv(null);
            this.selectedTab = null;
            this.messageService.send('save.preferences', {});
        }
    }

    closeContextmenu() {
        this.contextmenuService.showContextmenu(false);
    }

}

