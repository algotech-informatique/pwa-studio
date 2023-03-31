import { I18nService, MonitoringService } from '@algotech-ce/angular';
import { ProcessMonitoringDto } from '@algotech-ce/core';
import { Component, Input, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
    selector: 'app-i18n-editor',
    styleUrls: ['./i18n-editor.component.scss'],
    templateUrl: './i18n-editor.component.html',
})
export class I18nEditorComponent implements OnDestroy {

    @Input() customerKey: string;
    @Input() host: string;

    subscription: Subscription;
    spinnerDisplay = true;
    imports: ProcessMonitoringDto[];
    refreshMonitoring = new Subject();

    constructor(
        private monitoring: MonitoringService,
        private i18nService: I18nService,
    ) {
        this._initActions();
        this.refreshMonitoring.next(null);
    }

    _initActions() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.refreshMonitoring.pipe(
            mergeMap(() => this.monitoring.getImportI18nProcesses(0, 10, {}))
        ).subscribe((monitors: ProcessMonitoringDto[]) => {
            this.imports = monitors;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    onActivateSpinner(active: boolean) {
        this.spinnerDisplay = active;
    }

    onLaunchImportation() {
        this.refreshMonitoring.next(null);
    }
}
