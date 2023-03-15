import { SnAppDto, SnPageWidgetDto } from '@algotech/core';
import {
    Component, Input, OnChanges, ViewContainerRef,
    ComponentRef, ViewChildren, QueryList, ChangeDetectorRef, SimpleChanges, ViewChild
} from '@angular/core';
import * as Widgets from '../../../app-custom/widgets';
import { AppSelectionService, AppZoomService } from '../../services';
import * as _ from 'lodash';
import { WidgetComponentInterface } from '../../interfaces';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'widget',
    template: `
        <div class="content"
            [ngClass]="{
                'isdisabled': widget.custom?.disabled,
                'hidden': widget.custom?.hidden,
                'error': (widget.displayState?.errors | showAppErrors) &&
                    (appSelection.selections.widgets | elementSelected:widget) === 'hidden',
                'highlight': widget.displayState?.highlight && (appSelection.selections.widgets | elementSelected:widget) === 'hidden'
            }"
            [style.--SN-SELECTION-BORDER]="((appZoom.transform.k | scaleZoom: '+/-') * 2) + 'px'"
        >
            <ng-template *ngIf="custom" #widget widgetHost></ng-template>
        </div>
    `,
    styleUrls: ['/widget.component.scss']
})
export class WidgetComponent implements OnChanges {

    @Input() snApp: SnAppDto;
    @Input() parent: SnPageWidgetDto;
    @Input() widget: SnPageWidgetDto;
    @Input() css: string;
    @Input() custom: any;
    @ViewChild('widget', { read: ViewContainerRef }) public widgetCmp: ViewContainerRef;
    @ViewChildren('list', { read: ViewContainerRef }) public widgetsParameters: QueryList<ViewContainerRef>;

    instance: any;
    instanceList: any[];

    constructor(
        public appZoom: AppZoomService,
        public appSelection: AppSelectionService,
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.widget?.currentValue && changes.widget?.previousValue?.id !== changes.widget?.currentValue?.id) {
            // widget change
            this.instance = null;
        }
        if (changes.widget?.currentValue || changes.css?.currentValue || changes.custom?.currentValue) {
            this.changeDetectorRef.detectChanges();
            this.loadWidget();
        }
    }

    loadWidget() {
        this.instanceList = null;
        this.instance = this.loadCmp(this.widgetCmp, true, this.instance);
        this.changeDetectorRef.detectChanges();
    }

    loadCmp(target, master: boolean, instance: WidgetComponentInterface) {
        if (instance && instance.initialize) {
            instance.widget = this.widget;
            instance.initialize();
            return instance;
        }
        const component = this.selectWidgetComponent();
        target.clear();
        const componentRef: ComponentRef<WidgetComponentInterface> = target.createComponent(component);
        componentRef.instance.snApp = this.snApp;
        componentRef.instance.parent = this.parent;
        componentRef.instance.widget = this.widget;
        componentRef.instance.master = master;
        componentRef.instance.initialize();

        return componentRef.instance;
    }

    calculate() {
        if (this.instance.calculate) {
            this.instance.calculate();
        }
    }

    private selectWidgetComponent() {
        return (Widgets as any)[`Widget${this.widget.typeKey[0].toUpperCase() + this.widget.typeKey.slice(1)}Component`];
    }

}
