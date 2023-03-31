import { SmartModelDto, SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { AppActionsService, AppSelectionService, PageAddWidgetService, PageUtilsService } from '../../../../../app/services';
import * as d3 from 'd3';
import { Subscription } from 'rxjs';
import { SessionsService } from '../../../../../../services';
import { magnetProperty } from '../../../_data/data';
import { WidgetComponentInterface } from '../../../../../app/interfaces';

@Component({
    selector: 'widget-magnet',
    templateUrl: './widget-magnet.component.html',
    styleUrls: ['./widget-magnet.component.scss'],
})

export class WidgetMagnetComponent implements WidgetComponentInterface, OnDestroy {
    // custom params

    snApp: SnAppDto;
    widget: SnPageWidgetDto;

    subscription: Subscription;
    model: SmartModelDto;
    selected = false;

    constructor(
        private sessionsService: SessionsService,
        private appActions: AppActionsService,
        private appSelection: AppSelectionService,
        private pageAddWidget: PageAddWidgetService,
        private pageUtils: PageUtilsService,
        private ref: ChangeDetectorRef) { }

    initialize() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.selected = this.appSelection.selections.widgets.some((w) => w.id === this.widget.id);
        this.subscription = this.appSelection.onSelect(this.snApp).subscribe(() => {
            this.selected = this.appSelection.selections.widgets.some((w) => w.id === this.widget.id ||
                this.pageUtils.getChilds(this.widget).some((child) => child.id === w.id));
            if (!this.selected) {
                this.model = null;
            }
        });
    }

    activeEdition() {
        if (this.model) {
            this.model = null;
            return ;
        }
        this.model = this.sessionsService.active.datas.read.smartModels.find((sm) => sm.key === this.widget.custom.modelKey);
        this.ref.detectChanges();
        // d3
        const self = this;
        const container = d3.select('#svg').select(`#container`).select(`.widget-magnet-svg[id*="${this.widget.id}"]`);
        const parent = this.pageUtils.transformAbsolute(this.snApp, this.widget);
        d3.select('#svg').selectAll('.magnet-property')
            .call(
                d3.drag()
                    .filter(function () {
                        return !d3.event.button;
                    })
                    .on('start', function () {
                        self.pageAddWidget.startAddWidget(this, container, self.snApp, { type: magnetProperty });
                    })
                    .on('drag', function () {
                        self.pageAddWidget.addWidget(this, container, self.snApp, parent);
                    })
                    .on('end', function () {
                        const property = self.pageAddWidget.endAddWidget(this, self.snApp,
                                self.sessionsService.active.datas.read.customer.languages, self.widget);
                        if (property) {
                            property.custom.propName = d3.select(this).attr('id');
                            self.appActions.notifyUpdate(self.snApp);
                        }
                    })
            );
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
