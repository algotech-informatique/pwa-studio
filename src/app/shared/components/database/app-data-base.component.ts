import { MonitoringService, SmartObjectsService } from '@algotech-ce/angular';
import { GridConfigurationDto, SoUtilsService, InputsSearchComponent, CustomResolverParams } from '@algotech-ce/business';
import { PairDto, ProcessMonitoringDto, SmartModelDto, SmartObjectDto, SmartPropertyModelDto, SysQueryDto } from '@algotech-ce/core';
import { ChangeDetectorRef, Component, EventEmitter, OnChanges, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { DialogMessageService, MessageService, SessionsService, ToastService } from '../../services';
import { Model } from './interfaces/model.interface';
import { Row } from './interfaces/row.interface';
import * as _ from 'lodash';
import { DBType, Tab } from './interfaces/tab.interface';
import { catchError, debounceTime, delay, map, mergeMap, tap } from 'rxjs/operators';
import { of, Subject, Subscription, TimeoutError, zip } from 'rxjs';
import { GridSelectionDto } from '@algotech-ce/business/src/lib/@components/grid/dto/grid-selection.dto';
import { SnContextmenuAction } from '../../modules/smart-nodes';
import { DataBaseAction, deleteLink, markAsDeleted, realDelete, realDeleteAllTrashSos, restoreSos } from './actions/actions';
import { AppDataBaseGridComponent } from './grid/grid.component';
import { TranslateService } from '@ngx-translate/core';
import { BreadCrumbLink } from './interfaces/link.interface';
import { DBreload } from './interfaces/data-base-reload.interface';
import { AppDataBaseWarningComponent } from './info-message/warning.component';
import { DataBaseUtilsService } from './services/data-base-utils.service';
import { AppDataBaseImportMappingComponent } from './import/mapping-grid.component';
import { UUID } from 'angular2-uuid';

@Component({
    selector: 'app-data-base',
    styleUrls: ['./app-data-base.component.scss'],
    templateUrl: './app-data-base.component.html',
})

export class AppDataBaseComponent implements OnChanges, OnDestroy {
    @ViewChild(AppDataBaseGridComponent) db: AppDataBaseGridComponent;
    breadCrumb: BreadCrumbLink[] = [];
    filter = '';
    data: Row[] = [];
    sos: SmartObjectDto[] = [];
    cache: SmartObjectDto[] = [];
    sysQuery: SysQueryDto;
    origin;
    paginate = 'none';
    soCount = 0;
    skip = 0;
    lastPage = 0;
    moreDataToLoad = true;
    actions: SnContextmenuAction[];
    reload = new Subject<DBreload>();
    loading = false;
    smartModels: Model[];
    selectedModel: Model;
    configuration: GridConfigurationDto;
    tabs: Tab[] = [
        { key: 'smartObjects', display: 'INSPECTOR.DATABASE.SMARTOBJECTS' },
        { key: 'deleted', display: 'INSPECTOR.DATABASE.SMARTOBJECTS-DELETED' },
    ];
    selectedTab: DBType = 'smartObjects';
    subscription: Subscription;
    popup = new Subject();
    dismiss = new Subject();
    showMonitoring = false;
    imports: ProcessMonitoringDto[];
    deletions: ProcessMonitoringDto[];
    refreshMonitoring = new Subject();
    /* Pour évter le pb de concurrence entre popup qui vient de l'action delete par exemple
    et dismiss du clickOutside à enclenché au click du menu contextuel de la liste des modèle */
    canDismiss = true;

    constructor(
        private sessionsService: SessionsService,
        private translate: TranslateService,
        private smartObjectsService: SmartObjectsService,
        private ref: ChangeDetectorRef,
        private soUtils: SoUtilsService,
        private toastService: ToastService,
        private messageService: MessageService,
        private dbUtils: DataBaseUtilsService,
        private dialogMsgService: DialogMessageService,
        private renderer: Renderer2,
        private monitoring: MonitoringService,
    ) {
        this._initActions('smartObjects');
        this._initQuery();
        this.smartModels = this.dbUtils.initSmartModelsList();
        this.configuration = this.dbUtils.setConfiguration('', []);
        this.refreshMonitoring.next(null);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    ngOnChanges() {
        this.filter = '';
    }

    _initQuery(keepfilters?) {
        const init = this.dbUtils.initQuery(this.data, this.sos, this.cache, this.sysQuery, this.soCount, this.filter, this.breadCrumb,
            keepfilters);
        this.data = init.data;
        this.sos = init.sos;
        this.cache = init.cache;
        if (!this.sysQuery) {
            this.sysQuery = init.sysQuery;
        }
        this.soCount = init.soCount;
        this.filter = init.filter;
        this.breadCrumb = init.breadCrumb;
    }

    _initFetchData(data: DBreload) {
        if (data.initQuery) {
            this._initQuery(data.keepfilters);
        }
        if (data.selectedModel) {
            if (!this.selectedModel ||
                this.selectedModel.key !== data.selectedModel.key ||
                (this.selectedModel && data.link && data.link.root)) {
                this.soCount = 0;
                this.configuration = this.dbUtils.setConfiguration(data.selectedModel.key,
                    this.dbUtils.initColumns(this.selectedTab, data.selectedModel.sm?.properties));
            }

            this.selectedModel = data.selectedModel;
            this.data = [];
            if (!data.link.root) {
                const sm = this.sessionsService.active.datas.read.smartModels.find(s => s.key === data.link.model);
                this.configuration = this.dbUtils.setConfiguration('no_save',
                    this.dbUtils.initColumns(this.selectedTab, sm ? sm.properties : [], true), false);
                this.soCount = data.link.uuids.length;
            }
            this.breadCrumb[0].display = data.selectedModel.display;
            this.breadCrumb[0].model = data.selectedModel.key;
            this.breadCrumb[0].path = data.selectedModel.key;
            this.loading = true;
            data.query = {
                modelKey: data.selectedModel.key,
                filter: [],
                order: [],
                deleted: false,
                notIndexed: false
            };
            switch (this.selectedTab) {
                case 'deleted':
                    data.query.deleted = true;
                    break;
            }

            data.query.searchParameters = this.sysQuery;
        }
    }

    _loadData(data: DBreload) {
        if (data.selectedModel) {
            const $data = data.link && !data.link.root ?
                of(_.reduce(data.link.uuids, (results, uuid) => {
                    const so = this.cache.find((s) => (s.uuid === uuid));
                    if (so) {
                        results.push(so);
                    }
                    return results;
                }, [])) : this.smartObjectsService.QuerySearchSO(data.query);

            this.subscription.add($data.pipe(
                mergeMap((sos: SmartObjectDto[]) => {
                    const params: PairDto[] = [
                        { key: 'deep', value: '0' },
                        { key: 'excludeRoot', value: '0' }
                    ];

                    return zip(of(sos), this.smartObjectsService.getSubDoc(sos.map(elem => elem.uuid as string), params));
                })
            ).subscribe({
                next: (sos: SmartObjectDto[][]) => {
                    if (data.link?.parentUuid && !data.link.root) {
                        this.origin = this.sos.find(so => so.uuid === data.link?.parentUuid);
                    } else {
                        this.origin = null;
                    }
                    const $count = (!data.link.root || this.soCount !== 0
                        ? of(this.soCount) :
                        this.smartObjectsService.countSos(data.query));
                    this.subscription.add($count.subscribe({
                        next: (count) => {
                            this.soCount = count;
                            this._getSkipState();
                            this.moreDataToLoad = this.sysQuery.skip < this.dbUtils.lastSkip(this.soCount, this.sysQuery.limit as number);
                        }
                    }));
                    this.sos = sos[0];
                    this.cache = _.unionWith(sos[1], this.cache, (arrVal, othVal) => arrVal.uuid === othVal.uuid);
                    this.data = sos[0].map(so => (this.dbUtils.transformSo(this.configuration.columns, so, this.cache)));
                    this.loading = false;
                    this.configuration.selection = this.selection;
                },
                error: () => {
                    this.toastService.addToast('error',
                        '',
                        this.translate.instant('INSPECTOR.DATABASE.LOAD.ACTION'));
                    this.loading = false;
                }
            }));
        }

    }

    _addAction() {
        if (this.selectedModel) {
            const so = this.soUtils.createInstance(this.selectedModel.sm as SmartModelDto);
            if (this.selectedTab === 'smartObjects') {
                this.sos.unshift(so);
                this.data.unshift(this.dbUtils.transformSo(this.configuration.columns, so, []));
                this.soCount++;
                if (so.properties[0]) {
                    this.ref.detectChanges();
                    setTimeout(() => {
                        this.db.grid.focus(so.uuid as string, so.properties[0].key, 'top');
                    }, 0);

                }
            }
            this.subscription.add(this.smartObjectsService.create(this.selectedModel.key, so).subscribe({
                error: () => {
                    this.toastService.addToast('error', '', this.translate.instant('INSPECTOR.DATABASE.ADD.ACTION'));
                    this.soCount = 0;
                    this.reloadDataBase(this.selectedModel);
                }
            }));
        }
    }
    _linkAnction() {
        const link = this.breadCrumb[this.breadCrumb.length - 1];
        const onChangeValue = new EventEmitter();
        this.popup.next({
            component: InputsSearchComponent,
            width: 500,
            height: 600,
            props: {
                multiple: link.multiple,
                items: [],
                getItems: (parms: CustomResolverParams) => {
                    const query = {
                        modelKey: link.model,
                        filter: [],
                        order: [],
                        deleted: false,
                        notIndexed: false,
                        searchParameters: parms.searchParameters
                    };
                    return this.smartObjectsService.QuerySearchSO(query);
                },
                searchVisible: true,
                listType: 'so:*',
                changeValue: onChangeValue
            }
        });
        this.subscription.add(onChangeValue.pipe(
            mergeMap((data) => {
                this.dismiss.next(null);
                if (data) {
                    let prop = this.origin.properties.find(p => p.key === link.key);
                    if (!prop) {
                        prop = {
                            key: link.key,
                            value: null
                        };
                        this.origin.properties.push(prop);
                    }
                    const value = Array.isArray(data) ? data.map(so => (so.uuid as string)) : data.uuid;
                    this._patchProperty(prop, link.multiple, value);
                    return zip(of(data), this.smartObjectsService.update(this.origin), this.smartObjectsService.getSubDoc(value));
                }
                return zip(of(data), of(null), of([]));
            })).subscribe({
                next: (sos) => {
                    const parent = sos[1];
                    if (parent) {
                        const data = sos[0];

                        this.cache = _.unionWith(sos[2], this.cache, (arrVal, othVal) => arrVal.uuid === othVal.uuid);
                        if (Array.isArray(data)) {
                            this.sos.unshift(...data);
                            this.data.unshift(...data.map(so => this.dbUtils.transformSo(this.configuration.columns, so, this.cache)));
                        } else {
                            if (link.multiple) {
                                this.sos.unshift(data);
                                this.data.unshift(this.dbUtils.transformSo(this.configuration.columns, data, this.cache));
                            } else {
                                this.sos = [data];
                                this.data = [this.dbUtils.transformSo(this.configuration.columns, data, this.cache)];
                            }
                        }
                        this.soCount = this.data.length;
                        this._getSkipState();
                    }
                },
                error: () => {
                    this.toastService.addToast('error', '', this.translate.instant('INSPECTOR.DATABASE.UPDATE.ACTION'));
                    this.soCount = 0;
                    this.reloadDataBase(this.selectedModel);
                }
            }));


    }
    _createLinkSoAction() {
        if (this.selectedTab === 'smartObjects' && this.breadCrumb.length > 1) {
            const link = this.breadCrumb[this.breadCrumb.length - 1];
            const parent = this.breadCrumb[this.breadCrumb.length - 2];
            const sm = this.sessionsService.active.datas.read.smartModels.find(s => s.key === link.model);
            const so = this.soUtils.createInstance(sm as SmartModelDto);
            const originModel = this.sessionsService.active.datas.read.smartModels.find(s => s.key === parent.model);
            const smProp = originModel ? originModel.properties.find(p => p.key === link.key) : null;
            this.subscription.add(this.smartObjectsService.create(this.selectedModel.key, so).pipe(
                catchError(() => {
                    this.toastService.addToast('error', '', this.translate.instant('INSPECTOR.DATABASE.ADD.ACTION'));
                    this.soCount = 0;
                    this.reloadDataBase(this.selectedModel);
                    return of(null);
                }),
                mergeMap((createSo) => {
                    if (createSo) {
                        so.uuid = createSo.uuid;
                        let soProp = this.origin.properties.find(p => p.key === link.key);
                        if (!soProp) {
                            soProp = {
                                key: link.key,
                                value: null
                            };
                            this.origin.properties.push(soProp);
                        }

                        if (smProp) {
                            this._patchProperty(soProp, smProp.multiple, createSo.uuid);
                            return this.smartObjectsService.update(this.origin);
                        }
                        return of(null);

                    }
                }),
            ).subscribe({
                next: (parentSo) => {
                    if (smProp && parentSo) {
                        if (smProp.multiple) {
                            this.sos.unshift(so);
                            this.data.unshift(this.dbUtils.transformSo(this.configuration.columns, so, []));
                            this.soCount++;
                        } else {
                            this.sos = [so];
                            this.data = [this.dbUtils.transformSo(this.configuration.columns, so, [])];
                        }
                        if (so.properties[0]) {
                            this.ref.detectChanges();
                            setTimeout(() => {
                                this.db.grid.focus(so.uuid as string, so.properties[0].key, 'top');
                            }, 0);

                        }
                    }
                    this.soCount = this.data.length;
                    this._getSkipState();
                },
                error: () => {
                    this.toastService.addToast('error', '', this.translate.instant('INSPECTOR.DATABASE.UPDATE.ACTION'));
                    this.soCount = 0;
                    this.reloadDataBase(this.selectedModel);
                }
            }));
        }
    }

    _getUuids(currentId?: string) {
        if (currentId) {
            return [currentId];
        } else {
            const selected = this.selection.selected;
            return Array.isArray(selected) ? selected : selected ? [selected] : [];
        }
    }

    _deleteLinkAction(currentId?: string) {
        if (this.origin) {
            const uuids: string[] = this._getUuids(currentId);
            const link = this.breadCrumb[this.breadCrumb.length - 1];
            const prop = this.origin.properties.find(p => p.key === link.key);
            if (prop) {
                if (Array.isArray(prop.value)) {
                    prop.value = prop.value.filter(uuid => uuids.indexOf(uuid) === -1);
                } else {
                    prop.value = null;
                }
            }
            this.subscription.add(this.smartObjectsService.update(this.origin).subscribe({
                next: (parent) => {
                    if (parent) {
                        this.sos = this.sos.filter(so => uuids.indexOf(so.uuid as string) === -1);
                        this.data = this.data.filter(so => uuids.indexOf(so.id) === -1);
                    }
                    this.soCount = this.data.length;
                    this._getSkipState();
                },
                error: () => {
                    this.toastService.addToast('error', '', this.translate.instant('INSPECTOR.DATABASE.DELETE_LINK.ACTION'));
                    this.reloadDataBase(this.selectedModel);
                }
            }));
        }

    }

    _patchProperty(prop, multiple, value) {
        if (multiple) {
            if (prop.value) {
                if (Array.isArray(value)) {
                    Array.prototype.push.apply(prop.value, value);
                } else {
                    prop.value.push(value);
                }
            } else {
                if (Array.isArray(value)) {
                    prop.value = value;
                } else {
                    prop.value = [value];
                }

            }
        } else {
            prop.value = value;
        }

    }

    _updateAction(key: string, row: Row, value: any) {
        if (this.selectedModel) {
            const so = this.sos.find(s => s.uuid === row.id);
            if (so) {
                let soProp = so.properties.find(p => p.key === key);
                if (!soProp) {
                    soProp = {
                        key,
                        value: null
                    };
                    so.properties.push(soProp);
                }
                const prop = row.properties.find(p => p.key === key);
                soProp.value = value;
                prop.value = value;

                this.subscription.add(this.smartObjectsService.update(so).subscribe({
                    error: () => {
                        this.toastService.addToast('error', '', this.translate.instant('INSPECTOR.DATABASE.UPDATE.ACTION'));
                        this.reloadDataBase(this.selectedModel);
                    }
                }));
            }
        }
    }

    _deleteAction(
        byUuids: boolean,
        real: boolean,
        empty: boolean,
        deleted: boolean,
        notIndexed: boolean,
        emptyDB: boolean,
        currentId?: string) {
        const onValidate = new EventEmitter();
        this.canDismiss = false;

        this.popup.next({
            component: AppDataBaseWarningComponent,
            width: 500,
            props: {
                message: real ? 'INSPECTOR.DATABASE.IRREVERSIBLE.ACTION' : 'INSPECTOR.DATABASE.DELETE.ACTION',
                action: real ? 'INSPECTOR.DATABASE.DELETE.DEFINITELY.ACTION' : '',
                validate: onValidate
            }
        });
        this.subscription.add(onValidate.pipe(
            mergeMap((ok: boolean) => {
                this.canDismiss = true;
                this.dismiss.next({});
                if (ok && (emptyDB || this.selectedModel)) {
                    const uuids: string[] = byUuids ? this._getUuids(currentId) : [];
                    if (emptyDB || empty) {
                        this.sos = [];
                        this.cache = [];
                        this.data = [];
                        this.soCount = 0;
                    } else {
                        this.sos = this.sos.filter(so => uuids.indexOf(so.uuid as string) === -1);
                        this.data = this.data.filter(row => uuids.indexOf(row.id) === -1);
                        this.soCount -= uuids.length;
                    }

                    return this.smartObjectsService.deleteSos({
                        uuid: (emptyDB || empty) ? 'empty' : uuids[0],
                        uuids,
                        real,
                        empty
                    }, emptyDB ? '' : this.selectedModel.key, deleted, notIndexed).pipe(
                        map(res => uuids.length === 0));
                }
                return of(ok);
            })
        ).subscribe({
            next: (openTab) => {
                if (openTab) {
                    this.onOpenTab('smartObjects');
                }
            },
            error: () => {
                this.toastService.addToast('error', '', this.translate.instant(real ? 'INSPECTOR.DATABASE.DELETE.DEFINITELY.ACTION' :
                    'INSPECTOR.DATABASE.DELETE.ACTION'));
                this.soCount = 0;
                this.reloadDataBase(this.selectedModel);
            }
        }));

    }

    _restoreAction(byUuids: boolean, allDB: boolean, currentId?: string) {
        if (allDB || this.selectedModel) {
            const uuids: string[] = byUuids ? this._getUuids(currentId) : [];
            if (uuids.length > 0) {
                this.sos = this.sos.filter(so => uuids.indexOf(so.uuid as string) === -1);
                this.data = this.data.filter(row => uuids.indexOf(row.id) === -1);
                this.soCount = this.data.length;
            }
            this.subscription.add(this.smartObjectsService.retoreObjects(uuids, allDB ? '' : this.selectedModel.key).subscribe({
                next: () => {
                    if (uuids.length === 0) {
                        this.onOpenTab('smartObjects');
                    } else {

                    }
                },
                error: () => {
                    this.toastService.addToast('error', '', this.translate.instant('INSPECTOR.DATABASE.RESTORESOS.ACTION'));
                    this.soCount = 0;
                    this.reloadDataBase(this.selectedModel);
                }
            }));
        }
    }

    _importSosAction(file) {
        if (file && this.selectedModel.sm) {
            this.subscription.add(this.monitoring.getImportSosProcesses(0, 1, { byProcessState: 'inProgress' }).pipe(
                tap((processes: ProcessMonitoringDto[]) => {
                    if (processes.length === 0) {
                        this.canDismiss = false;
                        const onDoImport = new EventEmitter<boolean>();
                        const importState = new Subject<'inProgress' | 'succeeded' | 'error'>();
                        this.popup.next({
                            component: AppDataBaseImportMappingComponent,
                            width: 550,
                            height: 500,
                            props: {
                                model: this.selectedModel,
                                file,
                                importState,
                                doImport: onDoImport
                            }
                        });

                        this.subscription.add(onDoImport.subscribe({
                            next: (data: {
                                canImport: boolean; columns: PairDto[];
                                propertiesFormat: PairDto[];
                                replaceExisting: boolean;
                                columnBreaker: string;
                                encoding: string;
                            }) => {
                                if (data.canImport) {
                                    importState.next('inProgress');
                                    this.subscription.add(this.smartObjectsService.import(file, {
                                        uuid: UUID.UUID(),
                                        modelKey: this.selectedModel.key,
                                        options: {
                                            columns: data.columns,
                                            propertiesFormat: data.propertiesFormat,
                                            delimiter: data.columnBreaker,
                                            encoding: data.encoding
                                        },
                                        replaceExisting: data.replaceExisting,
                                    }).pipe(
                                        catchError((error) => of((error instanceof TimeoutError))),
                                        mergeMap((succeeded) => {
                                            importState.next(succeeded ? 'succeeded' : 'error');
                                            return of(succeeded);
                                        }),
                                        delay(500),
                                    ).subscribe({
                                        next: (succeeded) => {
                                            if (!succeeded) {
                                                this.dismiss.next(null);
                                                this.toastService.addToast(
                                                    'error',
                                                    '',
                                                    this.translate.instant('INSPECTOR.DATABASE.IMPORTSOS.ACTION'));
                                                this.messageService.send('database-tab', { key: 'monitoring' });
                                                this.refreshMonitoring.next({});
                                            } else {
                                                this.reloadDataBase(this.selectedModel);
                                                this.dismiss.next(null);
                                                this.messageService.send('database-tab', { key: 'monitoring' });
                                                this.refreshMonitoring.next({});
                                            }
                                        }
                                    }));
                                } else {
                                    this.dismiss.next(null);
                                }

                            },
                            error: () => {
                                this.dismiss.next(null);
                                this.toastService.addToast('error', '', this.translate.instant('INSPECTOR.DATABASE.IMPORTSOS.ACTION'));
                                this.refreshMonitoring.next({});
                            }
                        }));
                    } else {
                        this.toastService.addToast('error', '', this.translate.instant('INSPECTOR.DATABASE.IMPORTSOS.INPROGRESS'));
                        this.messageService.send('database-tab', { key: 'monitoring' });
                        this.refreshMonitoring.next({});
                    }
                })
            ).subscribe());

        }
    }

    _downloadImportCsvModel() {
        if (this.selectedModel.sm) {
            const csv = `${this.selectedModel.sm.properties
                .filter((prop: SmartPropertyModelDto) => (!prop.keyType.startsWith('so:') && !prop.keyType.startsWith('sys:')))
                .map(prop => prop.key).join(',')}\n`;
            this.dialogMsgService.getSaveMessage(csv, 'text/csv;charset=utf-8;', this.selectedModel.key, '.csv');
        }
    }

    _initActions(key: string) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = this.reload.pipe(
            tap((data: DBreload) => {
                this._initFetchData(data);
            }),
            debounceTime(300)
        ).subscribe({
            next: (data: DBreload) => {
                this._loadData(data);
            }
        });

        this.subscription.add(this.refreshMonitoring.pipe(
            mergeMap(() => zip(
                this.monitoring.getImportSosProcesses(0, 10, {}),
                this.monitoring.getDeleteSosProcesses(0, 10, {}))),
            tap(processes => {
                this.imports = processes[0];
                this.deletions = processes[1];
            })
        ).subscribe());

        this.subscription.add(this.messageService.get('mark-db-as-deleted').subscribe(() => {
            this._deleteAction(false, false, false, false, false, true);
        }));
        this.subscription.add(this.messageService.get('dump-db').subscribe(() => {
            this._deleteAction(false, true, false, false, false, true);
        }));
        this.subscription.add(this.messageService.get('restore-db').subscribe(() => {
            this._restoreAction(false, true);
        }));

        if (key === 'smartObjects') {
            this.actions = this.breadCrumb.length < 2 ? [
                markAsDeleted((ev) => this._deleteAction(true, false, false, false, false, false, ev)),
                realDelete((ev) => this._deleteAction(true, true, false, false, false, false, ev)),
            ] : this.breadCrumb[this.breadCrumb.length - 1].isComposition ?
                [
                    markAsDeleted((ev) => this._deleteAction(true, false, false, false, false, false, ev)),
                    realDelete((ev) => this._deleteAction(true, true, false, false, false, false, ev))
                ]
                : [
                    markAsDeleted((ev) => this._deleteAction(true, false, false, false, false, false, ev)),
                    realDelete((ev) => this._deleteAction(true, true, false, false, false, false, ev)),
                    deleteLink((ev) => this._deleteLinkAction(ev))
                ];
        } else {
            this.actions = [
                realDelete((ev) => this._deleteAction(true, true, false, (key === 'deleted'), (key !== 'deleted'), false, ev)),
                realDeleteAllTrashSos((ev) => this._deleteAction(false, true, true, true, false, false, ev)),
            ];
            if (key === 'deleted') {
                this.actions.push(restoreSos((ev) => this._restoreAction(true, false, ev)));
            }
        }
    }



    get selection(): GridSelectionDto {
        const list = this.data.map((ele) => ele.id);
        let selected = this.configuration?.selection?.selected ? this.configuration.selection.selected : [];
        if (Array.isArray(selected)) {
            selected = selected.filter((id: string) => list.includes(id));
        } else {
            selected = list.includes(selected) ? selected : null;
        }

        return {
            multiselection: true,
            selected,
            list,
        };
    }

    reloadDataBase(selectedModel: Model, initQuery?: boolean, keepfilters?: boolean, initBreadCrumb?: boolean) {
        this._initActions(this.selectedTab);
        if (initBreadCrumb) {
            this.breadCrumb = this.dbUtils.initBreadCrumb();
        }
        this.reload.next({ selectedModel, initQuery, keepfilters, link: this.breadCrumb[this.breadCrumb.length - 1] });
    }

    reloadDataBaseTo(page: 'next' | 'previous' | 'last' | 'first') {

        switch (page) {
            case 'last':
                this.sysQuery.skip = this.dbUtils.lastSkip(this.soCount, this.sysQuery.limit as number);
                break;
            case 'first':
                this.sysQuery.skip = 0;
                break;
            case 'next':
                if (!this.sysQuery.skip) {
                    this.sysQuery.skip = 1;
                } else if (this.moreDataToLoad) {
                    this.sysQuery.skip++;
                }
                break;
            case 'previous':
                if (this.sysQuery.skip != null && this.sysQuery.skip > 0) {
                    this.sysQuery.skip--;
                }
                break;
        }
        this._getSkipState();
        this.reloadDataBase(this.selectedModel);
    }

    onReloadDataBasePage(pageNumber: number) {
        this.sysQuery.skip = pageNumber as number;
        this._getSkipState();
        this.reloadDataBase(this.selectedModel);
    }

    _getSkipState(){
        const state = this.dbUtils.getSkipState(this.soCount, this.sysQuery.skip, this.sysQuery.limit);
        this.skip = state.skip;
        this.lastPage = state.lastPage;
    }


    onOpenTab(key: string) {
        this.filter = '';
        this.selectedTab = this.tabs.find(t => t.key === key && !t.disabled)?.key as DBType ?? 'smartObjects';
        this._initActions(key);
        this.reloadDataBase(this.selectedModel, true);
    }

    executeAction(action: DataBaseAction) {
        switch (action.key) {
            case 'add':
                if (this.breadCrumb.length > 1) {
                    this._createLinkSoAction();
                } else {
                    this._addAction();
                }

                break;
            case 'update':
                this._updateAction(action.value?.key as string, action.value?.row as Row, action.value?.value);
                break;
            case 'markAllAsdeleted':
                this._deleteAction(false, false, true, false, false, false);
                break;
            case 'realDeleteAll':
                this._deleteAction(false, true, true, false, false, false);
                break;
            case 'restoreSos':
                this._restoreAction(false, false);
                break;
            case 'link':
                this._linkAnction();
                break;
            case 'importSOs':
                if (action.event?.target?.files[0]) {
                    const file = action.event.target.files[0];
                    this._importSosAction(file);
                } else {
                    this.renderer.selectRootElement('#fileInput', true).click();
                }
                break;
            case 'downloadModel':
                this._downloadImportCsvModel();
                break;
        }
    }

    onNavigate(link: BreadCrumbLink, add?) {
        if (add) {
            link.path = `${this.breadCrumb[this.breadCrumb.length - 1].path}.${link.path}`;
            this.breadCrumb = _.unionWith(this.breadCrumb, [link], (arrVal, othVal) => arrVal.path === othVal.path);
        } else {
            let index = _.findIndex(this.breadCrumb, (l: BreadCrumbLink) => l.path === link.path);
            if (index === 0) {
                this.breadCrumb = this.dbUtils.initBreadCrumb();
            } else if (index !== -1) {
                this.breadCrumb.splice(index++, this.breadCrumb.length - index);
            }
        }
        this.data = [];
        this._initActions(this.selectedTab);
        this.reload.next({ selectedModel: this.selectedModel, link });
    }


    onClickOutside() {
        if (this.canDismiss) {
            this.dismiss.next(null);
        }
    }

    handleDismiss() {
        try {
            const elem = this.renderer.selectRootElement('#fileInput', true);
            if (elem) {
                elem.value = '';
            }
        } catch (error) {

        }

    }

    handleMonitoring(showMonitoring) {
        this.showMonitoring = showMonitoring;
    }

}
