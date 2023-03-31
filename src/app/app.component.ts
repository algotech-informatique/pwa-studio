import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '@algotech-ce/angular';
import { ToastService, WorkflowLaunchService } from '@algotech-ce/business';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { from } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

    percentProgression = 0;
    downloading = false;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private authService: AuthService,
        private workflowLaunchService: WorkflowLaunchService,
        private updates: SwUpdate,
        private toastService: ToastService,
        private translate: TranslateService,
    ) {
    }

    ngOnInit() {
        // update
        if (this.updates.isEnabled) {
            this.updates.available.subscribe(event => {
                this.updates.activateUpdate().then(() => {

                    this.toastService.presentToast(this.translate.instant('UPDATE-COMPLETED'), 2000);
                    setTimeout(() => {
                        document.location.reload();
                    }, 2000);
                });
            });
            from(this.updates.checkForUpdate()).subscribe();
        }

        const self = this;

        // Download Progress
        const updatePercentage = (event, percent) => {
            self.percentProgression = percent;
            self.changeDetectorRef.detectChanges();
        };

        if (this.authService.isAuthenticated) {
            this.workflowLaunchService.setCurrentUser();
        }

        // ipcRenderer.on('download-progress', updatePercentage);

        // Update available
        const displayUpdatePopUp = (event, percent) => {
            self.downloading = true;
            self.changeDetectorRef.detectChanges();
        };

        // ipcRenderer.on('download-progress', displayUpdatePopUp);
    }
}
