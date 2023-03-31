import { ProcessMonitoringDto } from '@algotech-ce/core';
import { Component, Input, OnDestroy } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-data-base-monitoring',
    templateUrl: './monitoring.component.html',
    styleUrls: ['./monitoring.component.scss']
})

export class AppDataBaseMonitoringComponent implements OnDestroy {

    @Input() imports: ProcessMonitoringDto[];
    @Input() deletions: ProcessMonitoringDto[];
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

    onSelectedImportMonitoring(event: ProcessMonitoringDto) { }

    onSelectedIndexMonitoring(event: ProcessMonitoringDto) { }

}
