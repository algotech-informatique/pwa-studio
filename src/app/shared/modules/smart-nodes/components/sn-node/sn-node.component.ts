import {
    Component, Input, ViewChild, OnChanges, Type,
    ElementRef, ChangeDetectorRef, SimpleChanges,
} from '@angular/core';
import { SnNode, SnView } from '../../models';
import { SnNodeBaseComponent } from '../sn-base/sn-node/sn-node-base.component';
import { SnDirective } from '../../directives/sn.directive';
import { SnEntryComponents, SnNodeSchema } from '../../dto';
import { SnLinksService, SnDOMService, SnEntryComponentsService, SnActionsService, SnSelectionService, SnTranslateService } from '../../services';
import { SnSettings } from '../../dto/sn-settings';
import * as _ from 'lodash';

@Component({
    selector: 'sn-node',
    templateUrl: './sn-node.component.html',
    styleUrls: ['./sn-node.component.scss'],
})
export class SnNodeComponent implements OnChanges {
    @ViewChild('layout') nodeLayout: ElementRef;
    @ViewChild('nameEdit') nameEdit: ElementRef;
    @ViewChild(SnDirective, { static: true }) taskHost: SnDirective;

    @Input()
    node: SnNode;

    @Input()
    snView: SnView;

    @Input() type: string;

    @Input()
    settings: SnSettings;

    snFilterComponents: SnEntryComponents;
    instance: SnNodeBaseComponent;

    expandVisible = false;
    defaultHeaderVarName = '--SN-NODE-HEADER-BACKGROUND';
    headerVarName = this.defaultHeaderVarName;

    constructor(
        private snDOMService: SnDOMService,
        private ref: ChangeDetectorRef,
        private snSelection: SnSelectionService,
        private snActionsService: SnActionsService,
        private snEntryComponents: SnEntryComponentsService,
        private snLinksService: SnLinksService,
        private snTranslate: SnTranslateService,) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.node && this.snView && this.settings) {
            if (this.node.type) {
                this.loadType();
                const entryComponent = this.snEntryComponents.findEntryComponent(this.snView, this.settings, this.node);
                const component = this.loadComponent();

                if (component && entryComponent) {
                    this.snActionsService.runPreventRecursive(() => {
                        component.initialize(entryComponent.schema);
                        component.calculate();
                    });

                    this.detectorDetectChanges();
                    this.ref.detach();
                }
            } else {
                this.taskHost.viewContainerRef.clear();
                this.snFilterComponents = this.snEntryComponents.filterSnComponents(this.snView, this.node, this.settings, 'node');
                if (this.snFilterComponents.groups.length === 1 && this.snFilterComponents.groups[0].components.length === 1) {
                    this.onChangeType(this.snFilterComponents.groups[0].components[0].schema);
                }
            }
        }
    }

    public detectorAttach(attach: boolean) {
        if (!this.node.type) {
            return;
        }
        if (attach) {
            this.ref.reattach();
        } else {
            this.ref.detach();
        }
        this._refreshExpand();
    }

    initialize() {
        const entryComponent = this.snEntryComponents.findEntryComponent(this.snView, this.settings, this.node);
        if (this.instance && this.node.type && entryComponent?.schema) {
            this.instance.initialize(entryComponent.schema);
        }
    }

    calculate() {
        const before = _.cloneDeep(this.node);
        if (this.instance && this.node.type) {
            this.instance.calculate();
            return !_.isEqual(before, this.node);
        }

        return false;
    }

    public detectorDetectChanges() {
        this.ref.detectChanges();
        this._refreshExpand();
    }

    private loadType() {
        this.headerVarName = this.snDOMService.getVarName(this.defaultHeaderVarName, this.node.type.toUpperCase());
    }

    private loadComponent() {

        const component = this.createNodeComponent(this.node);

        const viewContainerRef = this.taskHost.viewContainerRef;
        viewContainerRef.clear();

        const componentRef = viewContainerRef.createComponent(component);
        this.instance = (componentRef.instance as SnNodeBaseComponent);

        this.instance.node = this.node;
        this.instance.snView = this.snView;
        this.instance.settings = this.settings;

        return this.instance;
    }

    onChangeName(value: string) {
        if (this.node.displayState.edit) {
            this.snActionsService.renameNode(this.snView, this.node, value);
            this.ref.detectChanges();
        }
    }

    onEscapeEditName() {
        this.snActionsService.renameNode(this.snView, this.node);
        this.ref.detectChanges();
    }

    onChangeType(schema: SnNodeSchema) {
        this.node.type = schema.type;
        this.node.key = schema.key;

        this.loadType();
        const component = this.loadComponent();

        if (component) {
            this.snActionsService.mergedNode(this.snView, this.node, schema);
        }

        this.node.displayState.edit = !this.snTranslate.transform(this.node.displayName, false);
        this.ref.detectChanges();

        if (this.nameEdit && this.nameEdit.nativeElement) {
            this.nameEdit.nativeElement.focus();
            this.nameEdit.nativeElement.select();
        }

        this.snLinksService.drawTransitions(this.snView, this.node);
    }

    openClose() {
        this.node.open = !this.node.open;
        this.snActionsService.notifyHide(this.snView);
    }

    expand() {
        this.node.expanded = !this.node.expanded;
        this.snActionsService.notifyHide(this.snView);
    }

    select($event) {
        this.snSelection.select($event, this.snView, { element: this.node, type: 'node' });
    }

    private createNodeComponent(node: SnNode): Type<SnNodeBaseComponent> {
        const entryComponent = this.snEntryComponents.findEntryComponent(this.snView, this.settings, node);
        if (!entryComponent) {
            return SnNodeBaseComponent;
        }
        return entryComponent.component;
    }

    private _refreshExpand() {
        this.expandVisible = this.nodeLayout &&
            this.nodeLayout.nativeElement.offsetHeight >= this.snDOMService.nodeMaxHeight ? true : false;
        this.ref.detectChanges();
    }
}
