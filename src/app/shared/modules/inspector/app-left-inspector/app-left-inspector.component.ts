import { PairDto, SnAppDto, SnModelDto } from '@algotech-ce/core';
import { Component, Input, OnChanges } from '@angular/core';
import { SessionsService } from 'src/app/shared/services';
import { AppSettings } from '../../app/dto';
import { OpenInspectorType } from '../../app/dto/app-selection.dto';
import { AppActionsService } from '../../app/services';

@Component({
    selector: 'app-left-inspector',
    templateUrl: './app-left-inspector.component.html',
    styleUrls: ['app-left-inspector.component.scss'],
})
export class AppLeftInspectorComponent implements OnChanges {

    @Input() snApp: SnAppDto;
    @Input() settings: AppSettings;
    @Input() snModel: SnModelDto;
    @Input() forceOpenTab: OpenInspectorType;

    tabs: PairDto[] = [
        { key: 'application', value: 'INSPECTOR.UI.GENERAL' },
        { key: 'widgets', value: 'INSPECTOR.UI.SELECTOR' },
        { key: 'layers', value: 'INSPECTOR.UI.TREE' },
    ];
    selectedTab = 'widgets';

    constructor(
        private appActions: AppActionsService,
        private sessionsService: SessionsService,
    ) { }

    onOpenTab(tabKey: string) {
        this.selectedTab = tabKey;
    }

    onChanged() {
        this.appActions.notifyUpdate(this.snApp);
    }

    ngOnChanges() {
        if (['application', 'layers'].includes(this.forceOpenTab)) {
            this.onOpenTab(this.forceOpenTab);
        }
    }

    onChangedPageName() {
        this.onChanged();
        this.sessionsService.refreshEnv();
    }

}
