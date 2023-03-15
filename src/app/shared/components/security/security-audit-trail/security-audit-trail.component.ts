import { AuditSettingsDto } from '@algotech/core';
import { Component, Input, OnChanges } from '@angular/core';
import { SessionsService } from '../../../services';
import * as _ from 'lodash';
import { SettingsUpdateService } from '../../../services/settings/settings-update.service';
import { AuditTrailService } from '@algotech/angular';

@Component({
    selector: 'app-security-audit-trail',
    templateUrl: './security-audit-trail.component.html',
    styleUrls: ['./security-audit-trail.component.scss'],
})
export class SecurityAuditTrailComponent implements OnChanges {

    @Input() customerKey: string;
    @Input() host: string;

    generating = false;
    beginDate = '';
    endDate = '';

    _securityAuditTrail: AuditSettingsDto;
    set securityAuditTrail(value: AuditSettingsDto) {
        this._securityAuditTrail = value;
        this.sessionService.active.datas.read.settings.audit = value;
    }

    get securityAuditTrail(): AuditSettingsDto {
        return this._securityAuditTrail;
    }

    constructor(
        private sessionService: SessionsService,
        private settingsUpdateService: SettingsUpdateService,
        private auditTrailService: AuditTrailService,
    ) {

        this.settingsUpdateService.initialize(this.sessionService.active.datas.read.settings);
    }

    ngOnChanges() {
        this.onLoad();
    }

    onLoad() {
        this.securityAuditTrail = this.sessionService.active.datas.read.settings.audit;
    }

    onChangeTrail(data, key) {
        if (key === 'activated') {
            if ((!data) && this.securityAuditTrail.traceOriginal) {
                _.set(this.settingsUpdateService.settings.audit, 'traceOriginal', false);
            }
        }
        _.set(this.settingsUpdateService.settings.audit, key, data);
        this.settingsUpdateService.settingsUpdate().subscribe(() => {
            this.onLoad();
        });
    }

    onChangeDate(data, key) {
        if (key === 'endDate') {
            this.endDate = data;
        } else {
            this.beginDate = data;
        }
    }

    onGenerateAuditTrail() {
        this.generating = true;
        this.auditTrailService.generate(
            new Date(this.beginDate).toISOString(),
            new Date(this.endDate).toISOString()).subscribe((blob) => {
                this.generating = false;
                const a = document.createElement('a');
                const objectUrl = URL.createObjectURL(blob);
                a.href = objectUrl;
                a.download = `audit.csv`;
                a.click();
                URL.revokeObjectURL(objectUrl);
            },
            () => {
                this.generating = false;
            }
        );
    }
}
