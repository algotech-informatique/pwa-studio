import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { Subject, Subscription } from 'rxjs';
import { SnContextmenuAction } from '../../../modules/smart-nodes';
import { ConfigService, MessageService } from '../../../services';
import { add, DataBaseAction, downloadModel, importSOs, markAllAsdeleted, realDeleteAll, restoreSos } from '../actions/actions';
import { AppDataBaseContextMenuComponent } from '../context-menu/context-menu.component';
import { Model } from '../interfaces/model.interface';
import { Tab } from '../interfaces/tab.interface';


@Component({
    selector: 'app-data-base-list',
    styleUrls: ['./app-data-base-list.component.scss'],
    templateUrl: './app-data-base-list.component.html',
})

export class AppDataBaseListComponent implements OnChanges, OnDestroy {
    @Input() smartModels: Model[] = [];
    @Input() forceSelect = false;
    @Output() onSelectModel = new EventEmitter<Model>();
    @Output() actionClicked = new EventEmitter<DataBaseAction>();
    @Output() onMonitoring = new EventEmitter<boolean>();
    models;
    tabs: Tab[] = [
        { key: 'smartModels', display: 'INSPECTOR.DATABASE.SMARTMODELS' },
        { key: 'assets', display: 'INSPECTOR.DATABASE.ASSETS', disabled: true, hidden: true },
        { key: 'monitoring', display: 'INSPECTOR.DATABASE.MONITORING.CONSOLE', hidden: true }
    ];
    selectedTab = 'smartModels';
    selectedModel: Model;
    filter = '';
    showPopup = new Subject();
    dismissPopup = new Subject();
    actions: SnContextmenuAction[];
    subscription: Subscription;
    constructor(
        private messageService: MessageService,
        private configService: ConfigService
    ) {
        this._initActions();
        this.subscription = this.messageService.get('database-tab').subscribe({
            next: (data) => {
                this.onOpenTab(data.key);
            }
        });
    }

    _initActions() {
        if (this.selectedTab !== 'assets') {
            this.actions = [
                add(() => { this.actionClicked.emit({ key: 'add' }); }),
                markAllAsdeleted(() => { this.actionClicked.emit({ key: 'markAllAsdeleted' }); }),
                realDeleteAll(() => { this.actionClicked.emit({ key: 'realDeleteAll' }); }),
                restoreSos(() => { this.actionClicked.emit({ key: 'restoreSos' }); }),
                importSOs(() => { this.actionClicked.emit({ key: 'importSOs' }); }),
                downloadModel(() => { this.actionClicked.emit({ key: 'downloadModel' }); }),
            ];
        } else {
            this.actions = [];
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.smartModels) {
            this.smartModels = this.smartModels.sort(((a, b) => a.display.toLowerCase().localeCompare(b.display.toLowerCase())));
            this.models = _.cloneDeep(this.smartModels);

            if (!this.selectedModel  && this.configService.config.preferences?.dataBaseOptions?.lastSelectedModelKey) {
                this.selectModel({
                    key: this.configService.config.preferences?.dataBaseOptions?.lastSelectedModelKey,
                    display: '',
                    selected: true,
                });
            }
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    onOpenTab(key) {
        this.selectedTab = this.tabs.find(t => t.key === key && !t.disabled)?.key ?? 'smartModels';
        this._initActions();
        this.onMonitoring.emit(this.selectedTab === 'monitoring');
    }

    onfilterChanging() {
        if (this.filter) {
            const values = this.filter.split(' ');
            this.smartModels = this.models.filter((sm: Model) => _.every(values, val => sm.display?.toUpperCase()
                .includes(val?.toUpperCase())));
        } else {
            this.smartModels = _.clone(this.models);
        }
    }


    selectModel(sm: Model) {
        this.onOpenTab('smartModels');
        this.smartModels.forEach(m => {
            m.selected = m.key === sm?.key;
            if (m.selected) {
                this.messageService.send('update.dataBaseOptions', { lastSelectedModelKey: m.key });
                this.selectedModel = _.cloneDeep(m);
                this.onSelectModel.emit(m);
            }
        });
    }

    openPopup($event, sm: Model) {
        $event.stopPropagation();
        if (!this.selectedModel || this.selectedModel.key !== sm.key || this.forceSelect) {
            this.selectModel(sm);
        }
        this.showPopup.next({
            component: AppDataBaseContextMenuComponent,
            event: $event,
            width: 250,
            props: {
                dismiss: this.dismissPopup,
                actions: this.actions
            }
        });
    }

    onClickOutside() {
        this.dismissPopup.next(null);
    }
}
