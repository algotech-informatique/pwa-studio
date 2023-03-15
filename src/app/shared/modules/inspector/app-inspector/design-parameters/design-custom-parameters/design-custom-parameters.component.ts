import { SnAppDto, SnPageBoxDto, SnPageDto, SnPageWidgetDto } from '@algotech/core';
import {
    Component, ComponentRef, EventEmitter, Input, OnChanges, OnDestroy, Output,
    SimpleChanges,
    ViewChild, ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DesignWidgetDirective } from '../../../directives/design-widget.directive';
import * as WidgetsParams from '../../../../app-custom/widgets';
import { WidgetParametersInterface } from '../../../../app-custom/models/widget-parameters.interface';

@Component({
    selector: 'design-custom-parameters',
    template: `
        <ng-template designWidgetHost></ng-template>
    `
})
export class DesignCustomParametersComponent implements OnChanges, OnDestroy {

    @ViewChild(DesignWidgetDirective, { static: true }) widgetHost: DesignWidgetDirective;

    @Input() snApp: SnAppDto;
    @Input() page: SnPageDto;
    @Input() widget: SnPageWidgetDto;
    @Input() box: SnPageBoxDto;
    @Input() css: any;
    @Input() custom: any;
    @Output() changed = new EventEmitter();
    componentRef: ComponentRef<any>;
    subscription: Subscription;

    constructor(
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes?.widget) {
            this.loadSpecificDesignComponent();
        } else if ((changes?.css || changes?.box || changes?.custom) &&
            (this.componentRef?.instance as WidgetParametersInterface)?.widget) {
            (this.componentRef.instance as WidgetParametersInterface).widget = this.widget;
            (this.componentRef.instance as WidgetParametersInterface).initialize();
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onChanged() {
        this.changed.emit();
    }

    private loadSpecificDesignComponent() {
        const viewContainerRef: ViewContainerRef = this.widgetHost.viewContainerRef;
        viewContainerRef.clear();
        if (!this.widget) { return; }
        const component = (WidgetsParams as any)
        [`${this.widget.typeKey[0].toUpperCase() + this.widget.typeKey.slice(1)}WidgetDesignComponent`];
        if (!component) { return; }
        this.componentRef = viewContainerRef.createComponent(component);
        (this.componentRef.instance as WidgetParametersInterface).snApp = this.snApp;
        (this.componentRef.instance as WidgetParametersInterface).page = this.page;
        (this.componentRef.instance as WidgetParametersInterface).widget = this.widget;
        (this.componentRef.instance as WidgetParametersInterface).initialize();
        this.subscription = (this.componentRef.instance as WidgetParametersInterface).changed.subscribe(() => {
            this.onChanged();
        });
    }

}
