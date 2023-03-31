import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService, SessionsService } from 'src/app/shared/services';
import { AppSelectionEvent, AppSettings } from '../../../app/dto';
import { AppActionsService, AppSelectionService, PageDragService, PageWidgetService } from '../../../app/services';
import { UITree } from './models/ui-tree';
import * as _ from 'lodash';
import { SnContextmenu } from '../../../smart-nodes';
import * as d3 from 'd3';
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'ui-tree',
    templateUrl: './ui-tree.component.html',
    styleUrls: ['ui-tree.component.scss'],
})
export class UITreeComponent implements OnChanges, OnDestroy {

    @Input() snApp: SnAppDto;
    @Input() settings: AppSettings;

    @Output() treeChanged = new EventEmitter();

    pagesSectionIsOpen = true;
    sharedSectionIsOpen = true;
    tree: UITree[];
    sharedTree: UITree[] = [];
    subscription: Subscription;
    showContextmenu = false;
    mouse: number[] = [0, 0];
    menu: SnContextmenu;
    lock = false;

    constructor(
        private appActions: AppActionsService,
        private appSelection: AppSelectionService,
        private sessionsService: SessionsService,
        private ref: ChangeDetectorRef,
        private messageService: MessageService,
        private pageDrag: PageDragService,
    ) { }

    ngOnChanges() {
        this.tree = this.buildTree([]);
        this.sharedTree = this.buildsharedTree();
        this.subscription = this.appSelection.onSelect(this.snApp).subscribe((data: AppSelectionEvent) => {
            if (this.lock) {
                return;
            }
            if (data?.element) {
                this.openSelectedWidgetParentLine(data);
            }
            this.ref.detectChanges();
        });
        this.subscription.add(this.appActions.onUpdate(this.snApp).subscribe(() => {
            if (this.lock) {
                return;
            }
            this.tree = this.buildTree(this.tree);
            this.sharedTree = this.buildsharedTree();
            this.ref.detectChanges();
            this.pageDrag.initializeSharedWidget(this.snApp, d3.select('#svg').select('#container'), this.settings);
        }));
        this.subscription.add(this.messageService.get('uitree.refresh').subscribe(() => {
            this.ref.detectChanges();
        }));
        this.subscription.add(this.messageService.get('uitree.dragstart').subscribe(() => {
            this.lock = true;
        }));
        this.subscription.add(this.messageService.get('uitree.dragend').subscribe(() => {
            this.lock = false;
            this.tree = this.buildTree(this.tree);
        }));
    }

    togglePagesSection() {
        this.pagesSectionIsOpen = !this.pagesSectionIsOpen;
    }

    toggleSharedSection() {
        this.sharedSectionIsOpen = !this.sharedSectionIsOpen;
    }

    addPage() {
        this.appActions.addPage(this.snApp, this.sessionsService.active.datas.read.customer.languages);
    }

    trackById(index: number, item: UITree) {
        return item.element.id;
    }

    trackBysharedId(index: number, item: UITree) {
        return (item.element as SnPageWidgetDto).sharedId;
    }


    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private buildTree(oldTree: UITree[]): UITree[] {
        const pages = [...this.snApp.pages].sort((a, b) =>
            a.canvas.x - b.canvas.x
        ).sort((a, b) =>
            (a.canvas.y + a.pageHeight) - b.canvas.y
        );
        const newTree = pages.map((page) => {
            const item: UITree = {
                element: page,
                type: 'page',
                open: false,
                snApp: this.snApp,
            };
            item.children = this.buildWidgetsTree(page.widgets, item);
            return item;
        });
        this.restoreState(newTree, oldTree);
        return newTree;
    }

    private buildsharedTree(): UITree[] {
        return this.buildWidgetsTree(this.snApp?.shared ? this.snApp?.shared : [], null);
    }

    private buildWidgetsTree(widgets: SnPageWidgetDto[], parent: UITree): UITree[] {
        return [...widgets]
            .filter((widget) => !PageWidgetService.getType(widget).hidden)
            .reverse()
            .map((widget) => {
            const item: UITree = {
                element: widget,
                type: 'widget',
                open: false,
                parent,
                snApp: this.snApp,
            };
            if (widget.group) {
                item.children = this.buildWidgetsTree(widget.group.widgets, item);
            }
            return item;
        });
    }

    private openSelectedWidgetParentLine(data: AppSelectionEvent) {
        const flatMapTree: UITree[] = this.flatDeepLines(this.tree);
        const widgetItem = flatMapTree.find(item => item.element.id === data.element.id);
        if (!widgetItem) { return; }
        const parents = this.findParents(widgetItem);
        for (const parent of parents) {
            parent.open = true;
        }
    }

    private restoreState(newTree: UITree[], oldTree: UITree[]) {
        const flatMapDeepNew: UITree[] = this.flatDeepLines(newTree);
        const flatMapDeepOld: UITree[] = this.flatDeepLines(oldTree);
        for (const newItem of flatMapDeepNew) {
            const oldItem = flatMapDeepOld.find(item => item.element.id === newItem.element.id);
            if (!oldItem) {
                if (newItem.parent && flatMapDeepOld.length > 0) {
                    newItem.parent.open = true;
                }
            } else {
                newItem.open = oldItem.open;
                if (newItem.parent?.element && (newItem.parent.element.id !== oldItem.parent?.element?.id)) {
                    newItem.parent.open = true;
                }
            }
        }
    }

    private flatDeepLines(tree: UITree[]): UITree[] {
        return tree.reduce((results: UITree[], item) => {
            results.push(item);
            if (item.children?.length > 0) {
                results.push(...this.flatDeepLines(item.children));
            }
            return results;
        }, []);
    }

    private findParents(item: UITree): UITree[] {
        const parents: UITree[] = [];
        if (item.parent) {
            parents.push(item.parent);
            parents.push(...this.findParents(item.parent));
        }
        return parents;
    }

}
