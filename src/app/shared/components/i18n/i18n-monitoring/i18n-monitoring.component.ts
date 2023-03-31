import { ProcessMonitoringDto } from '@algotech-ce/core';
import { Component, Input, OnDestroy } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-i18n-monitoring',
    templateUrl: './i18n-monitoring.component.html',
    styleUrls: ['./i18n-monitoring.component.scss'],
})
export class I18nMonitoringComponent implements OnDestroy {

    @Input() imports: ProcessMonitoringDto[];
    @Input() refresh = new Subject<any>();

    subscription: Subscription;

    constructor() {
        this.subscription = interval(5000).subscribe({
            next: () => {
                this.refresh.next(null);
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onSelectedMonitoring(event: ProcessMonitoringDto) { }
}
