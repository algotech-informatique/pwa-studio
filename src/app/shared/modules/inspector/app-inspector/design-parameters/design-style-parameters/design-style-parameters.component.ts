import { SnAppDto, SnPageWidgetDto, SnPageWidgetRuleDto } from '@algotech-ce/core';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { StyleInterface } from '../../../../app-custom/models/design-style.interface';
import { AppActionsService, AppSelectionService, PageWidgetService } from '../../../../app/services';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'design-style-parameters',
    templateUrl: './design-style-parameters.component.html',
    styleUrls: ['./design-style-parameters.component.scss'],
})
export class DesignStyleParametersComponent implements OnDestroy, OnChanges {

    @Input() snApp: SnAppDto;
    @Input() widgets: SnPageWidgetDto[];
    @Output() changed = new EventEmitter();

    itterable = false;
    styles: StyleInterface[] = [];
    bordersStyles: StyleInterface[];
    strokeStyles: StyleInterface[] = [];
    subscription: Subscription;
    _type: 'page' | 'widget';
    activeRule: SnPageWidgetRuleDto;

    constructor(
        public appActions: AppActionsService,
        public appSelection: AppSelectionService,
        private widgetService: PageWidgetService) {
    }

    get currentWidgets() {
        return this.widgets ? this.widgets : this.appSelection.selections.widgets;
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.styles = [];
        if (!changes.snApp?.currentValue && !changes.widgets?.currentValue) {
            return;
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.selectionChange();
        if (this.widgets) {
            return ;
        }

        this.subscription = this.appSelection.onSelect(this.snApp).subscribe(() => {
            this.selectionChange();
        });

        this.subscription.add(this.appActions.onUpdate(this.snApp).subscribe(() => {
            this.activeRule = this.appSelection.selections.widgets.find((w) => w.displayState?.rule?.rule)?.displayState?.rule?.rule;
            if (!this._type) {
                this.styles = [];
                return;
            }
            const styles = this._type === 'page' ?
                this.widgetService.loadStylesPage() : this.widgetService.loadStylesWidget(this.currentWidgets);
            const bordersStyles = this.loadBordersStyles(styles);
            // affect styles only if detect changes
            if (!_.isEqual(styles, this.styles)) {
                this.styles = styles;
            }
            if (!_.isEqual(bordersStyles, this.bordersStyles)) {
                this.bordersStyles = bordersStyles;
            }
        }));
    }

    selectionChange() {
        this.activeRule = this.currentWidgets.find((w) => w.displayState?.rule?.rule)?.displayState?.rule?.rule;
        this._type = this.currentWidgets.length > 0 ? 'widget' :
            (this.appSelection.selections.pages.length > 0 ? 'page' : null);
        if (!this._type) {
            this.styles = [];
            this.bordersStyles = [];
            this.strokeStyles = [];
            return;
        }
        this.styles = this._type === 'page' ?
            this.widgetService.loadStylesPage() : this.widgetService.loadStylesWidget(this.currentWidgets);
        this.bordersStyles = this.loadBordersStyles(this.styles);
        this.strokeStyles = this.loadstrokeStyles(this.styles);
    }

    onChanged(value: { path?: string; value: any }, styleKey: string) {
        const style: StyleInterface = this.styles.find((s) => s.style === styleKey);
        for (const element of style.elements) {
            element.ref.css = this.widgetService.buildCss([{
                style: style.style,
                path: value.path ? `${element.path}.${value.path}` : element.path,
                value: value.value
            }], element.ref.css);
            this.widgetService.updateRule(element.widget);
        }
        if (!value.path) {
            style.value = value.value;
        }

        this.changed.emit();
    }

    onMultipleChanged(styles: StyleInterface[]) {
        for (const style of styles) {
            for (const element of style.elements) {
                element.ref.css = this.widgetService.buildCss([{
                    style: style.style,
                    path: element.path,
                    value: style.value
                }], element.ref.css);
                this.widgetService.updateRule(element.widget);
            }
        }

        this.changed.emit();
    }

    private loadBordersStyles(styles: StyleInterface[]) {
        return styles.reduce((result: StyleInterface[], style: StyleInterface) => {
            if (style.style.startsWith('border-')) {
                result.push(style);
            }
            return result;
        }, []);
    }

    private loadstrokeStyles(styles: StyleInterface[]) {
        return styles.reduce((result: StyleInterface[], style: StyleInterface) => {
            if (style.style.startsWith('stroke-')) {
                result.push(style);
            }
            return result;
        }, []);
    }


}
