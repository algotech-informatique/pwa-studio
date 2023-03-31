import {
    Component,
    ChangeDetectorRef,
    OnDestroy,
    Input,
    OnChanges,
    HostListener,
    Output,
    EventEmitter,
    SimpleChanges
} from '@angular/core';
import { DataExplorerModel } from '../data-explorer/data-explorer.model';
import { WorkflowSubjectService, InterpretorSubjectDto } from '@algotech-ce/business';
import { Subscription } from 'rxjs';
import { WorkflowInstanceDto, WorkflowDataDto, WorkflowModelDto } from '@algotech-ce/core';
import * as _ from 'lodash';
import { TreeDebugService } from './tree-debug.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidationReportDto } from '../../dtos';
import { SnActionsService, SnZoomService } from '../../modules/smart-nodes';
import { AppActionsService } from '../../modules/app/services';
import { WatcherService } from '../../services';

@Component({
    selector: 'app-tree-debug',
    styleUrls: ['./tree-debug.component.scss'],
    templateUrl: './tree-debug.component.html',
})
export class TreeDebugComponent implements OnChanges, OnDestroy {

    @Input() workflow: WorkflowModelDto;
    @Input() report: ValidationReportDto;
    @Output() closeTab = new EventEmitter();
    tabs = [];
    alltabs = [];
    selectedKey = 'variables';
    reportStack: DataExplorerModel[] = [];
    stackVariables: DataExplorerModel[];
    metrics: DataExplorerModel[];
    watchers: DataExplorerModel[];
    transactions: DataExplorerModel[];

    instance: WorkflowInstanceDto;
    subscription: Subscription;
    hideProblems = false;

    constructor(
        private treeDebugService: TreeDebugService,
        private ref: ChangeDetectorRef,
        private translate: TranslateService,
        private workflowSubject: WorkflowSubjectService,
        private appActions: AppActionsService,
        private snZoomService: SnZoomService,
        private snActions: SnActionsService,
        private watcherService: WatcherService) {
        this.alltabs = [{
            key: 'problems',
            name: this.translate.instant('TREE-DEBUG-PROBLEMS'),
            visible: false,
        }, {
            key: 'variables',
            name: this.translate.instant('TREE-DEBUG-VARIABLES'),
            visible: true,
        }, {
            key: 'watcher',
            name: this.translate.instant('TREE-DEBUG-WATCHER'),
            visible: false,
        }, {
            key: 'metrics',
            name: this.translate.instant('TREE-DEBUG-METRICS'),
            visible: false,
        }, {
            key: 'db_transactions',
            name: this.translate.instant('TREE-DEBUG-DB TRANSACTIONS'),
            visible: false,
        }];

        this.tabs = [...this.alltabs];

        this.subscription = this.workflowSubject.subject.subscribe((data: InterpretorSubjectDto) => {
            this.calculateData(data.value);
        });

        this.subscription.add(this.watcherService.onUpdate().subscribe(() => {
            this.calculateData();
        }));
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.workflow?.currentValue) {
            if (this.stackVariables) {
                this.stackVariables = [];
            }

            if (this.metrics) {
                this.metrics = [];
            }

            if (this.transactions) {
                this.transactions = [];
            }
        }

        if (changes.report?.currentValue) {
            this.refrechCheckReport();
        }

        this.hideProblems = this.report?.errors?.length === 0 &&
            this.report?.warnings?.length === 0 &&
            this.report?.infos?.length === 0;

        this.alltabs.forEach((tab, index) => {
            if (tab.key !== 'problems') {
                tab.disabled = !this.workflow;
            } else {
                tab.disabled = this.hideProblems;
            }
            if (!this.workflow) {
                if (!this.hideProblems) {
                    tab.visible = (tab.key === 'problems');
                }
                if (tab.visible) {
                    this.selectedKey = tab.key;
                }
            }
            tab.hidden = tab.key === 'problems' && this.hideProblems;
        });
        if (this.alltabs.find((t) => t.key === this.selectedKey)?.hidden) {
            this.selectedKey = this.alltabs.find((t) => !t.hidden)?.key;
        }

        this.tabs = [...this.tabs];
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    refrechCheckReport() {
        this.reportStack = this.treeDebugService.pushCheckReport(this.report, this.reportStack);
        this.ref.detectChanges();
    }

    calculateData(instance?: WorkflowInstanceDto) {
        if (instance) {
            this.instance = instance;
        }
        if (!this.instance) {
            return ;
        }
        const datas = this.instance.data;
        this.stackVariables = this.treeDebugService.restore(this.instance, _.compact(_.map(datas, (data: WorkflowDataDto) => (
            this.treeDebugService.treatedData(this.instance, data)
        ))), this.stackVariables);

        this.metrics = this.treeDebugService.treatedMetrics(this.instance);

        this.transactions = this.treeDebugService.restore(this.instance,
            this.treeDebugService.treatedTransactions(this.instance),
            this.transactions
        );

        this.treeDebugService.treatedWatchers(this.instance).subscribe(watchers => {
            this.watchers = this.treeDebugService.restore(this.instance, watchers, this.watchers);
        });

        this.ref.detectChanges();
    }


    expandNode(node: DataExplorerModel) {
        this.treeDebugService.expand(this.instance, node);


        if (node?.data?.view) {
            if (node.data.node) {
                this.snZoomService.centerNode(node.data.node, 0.7);
                this.snActions.select(node.data.view, node.data.node, 'node');
            }
            if (node.data.openInspector) {
                this.snActions.notifyShowInspector(node.data.view, node.data.openInspector);
            }

            if (node.data.page) {
                this.appActions.notifyZoomPage(node.data.view, node.data.page, 0.4);
                if (node.data.widget) {
                    this.appActions.select(node.data.view, node.data.widget, 'widget', node.data.openInspector);
                } else {
                    this.appActions.select(node.data.view, node.data.page, 'page', node.data.openInspector);
                }
            }
            if (node.data.openInspector) {
                this.appActions.notifyShowLeftInspector(node.data.view, node.data.openInspector);
            }

        }
    }

    handleClose(event) {
        this.closeTab.emit();
    }

}
