import { SnAppDto, SnPageDto, SnPageEventDto, SnPageWidgetDto } from '@algotech/core';
import { Component,  ComponentRef, EventEmitter, Input,
    OnChanges, OnDestroy, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { WidgetParametersInterface } from '../../../../app-custom/models/widget-parameters.interface';
import { InspectorWidgetDirective } from '../../../directives/inspector-widget.directive';
import * as WidgetsParams from '../../../../app-custom/widgets';

@Component({
    selector: 'widget-parameters-properties',
    templateUrl: './widget-parameters-properties.component.html',
    styleUrls: ['./widget-parameters-properties.component.scss'],
})
export class WidgetParametersPropertiesComponent implements OnChanges, OnDestroy {

    @ViewChild(InspectorWidgetDirective, { static: true }) widgetHost: InspectorWidgetDirective;

    @Input() snApp: SnAppDto;
    @Input() page: SnPageDto;
    @Input() widget: SnPageWidgetDto;
    @Input() custom: any;
    @Input() events: SnPageEventDto[];

    @Output() changed = new EventEmitter();

    subscription: Subscription;
    componentRef: ComponentRef<any>;
    constrainRatio: { height?: number; width?: number; active: boolean} = { active: false };

    constructor(
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes?.widget) {
            this.loadParams();
            this.constrainRatio.active = false;
        } else if (changes?.events || changes?.custom) {
            (this.componentRef.instance as WidgetParametersInterface).widget = this.widget;
            (this.componentRef.instance as WidgetParametersInterface).initialize();
        }
    }

    loadParams() {
        if (this.subscription) { this.subscription.unsubscribe(); }
        const component = this._selectWidgetParamsComponent();
        const viewContainerRef: ViewContainerRef = this.widgetHost.viewContainerRef;
        viewContainerRef.clear();
        this.componentRef = viewContainerRef.createComponent(component);
        (this.componentRef.instance as WidgetParametersInterface).snApp = this.snApp;
        (this.componentRef.instance as WidgetParametersInterface).page = this.page;
        (this.componentRef.instance as WidgetParametersInterface).widget = this.widget;
        (this.componentRef.instance as WidgetParametersInterface).initialize();
        this.subscription = (this.componentRef.instance as WidgetParametersInterface).changed.subscribe(() => {
            this.changed.emit();
        });
    }

    _selectWidgetParamsComponent() {
        return (WidgetsParams as any)
            [`${this.widget.typeKey[0].toUpperCase() + this.widget.typeKey.slice(1)}WidgetParametersComponent`];
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onDisabledChanged(event) {
        this.widget.custom.disabled = event;
        this.changed.emit();
    }
}
