import { TranslateLangDtoService } from '@algotech/angular';
import { GroupDto, SnAppDto, SnModelDto } from '@algotech/core';
import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { OptionsElementDto } from '../../../../dtos/options-element.dto';
import { SessionsService } from '../../../../services';

@Component({
    selector: 'applications-settings-detail',
    templateUrl: './applications-settings-detail.component.html',
    styleUrls: ['./applications-settings-detail.component.scss'],
})
export class ApplicationsSettingsDetailComponent implements OnChanges {

    @Input() group: GroupDto;
    @Input() groups: GroupDto[];
    @Input() customerKey: string;
    @Input() host: string;
    @Output() updateGroup = new EventEmitter<GroupDto>();
    @Output() updateAllGroups = new EventEmitter<GroupDto[]>();

    listWebApplications: OptionsElementDto[] = [];
    listMobileApplications: OptionsElementDto[] = [];
    listApplications: OptionsElementDto[];
    authorizedApps: OptionsElementDto[];
    selected: { mobile?: OptionsElementDto; web?: OptionsElementDto } = {
        mobile: undefined,
        web: undefined,
    };

    constructor(
        private translateLangDtoService: TranslateLangDtoService,
        private sessionsService: SessionsService,
        private translateService: TranslateService
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.customerKey?.currentValue || changes.host?.currentValue) {
            this.listApplications = this.initListApplications();
            this.listMobileApplications = this.initListTypedApplications('mobile');
            this.listMobileApplications.unshift({ key: '', value: '' });
            this.listWebApplications = this.initListTypedApplications('web');
            this.listWebApplications.unshift({ key: '', value: '' });
        }

        if (changes.group?.currentValue) {
            this.authorizedApps = this.initAuthorizedApps();
            this.selected.web = _.find(this.listApplications, { key: this.group.application?.default?.web });
            this.selected.mobile = _.find(this.listApplications, { key: this.group.application?.default?.mobile });
        }
    }

    applyDefaultToAll(key: string, type: 'mobile' | 'web') {
        this.groups = this.groups.map((group) => {
            group.application.default[type] = key;
            this.updateGroupAuthorized(group, key);
            return group;
        });
        this.updateAllGroups.emit(this.groups);
    }

    onSelectDefaultApp(appElement: OptionsElementDto, type: 'mobile' | 'web') {
        this.selected[type] = appElement;
        this.group.application.default[type] = appElement.key;
        this.updateGroupAuthorized(this.group, appElement.key);
        this.updateAuthorizedItems(appElement);
        this.updateGroup.emit(this.group);
    }

    onAuthorizedAppsChanged(authorized: OptionsElementDto[]) {
        this.group.application.authorized = authorized.map((app) => app.key);
        this.updateGroup.emit(this.group);
    }

    private initAuthorizedApps(): OptionsElementDto[] {
        return this.listApplications.reduce((res: OptionsElementDto[], app) => {
            const appIndex = this.group.application.authorized.indexOf(app.key);
            if (appIndex > -1) {
                res.push(app);
            }
            return res;
        }, []);
    }

    private initListApplications(): OptionsElementDto[] {
        const list: OptionsElementDto[] = this.sessionsService.active.datas.write.snModels.reduce((
            res: OptionsElementDto[], snModel: SnModelDto) => {
            if (snModel.type === 'app' && snModel.publishedVersion) {
                const publishedVersion = snModel.versions.find((version) => version.uuid === snModel.publishedVersion);
                const element: OptionsElementDto = {
                    key: snModel.key,
                    value: this.translateLangDtoService.transform(snModel.displayName),
                    icon: (publishedVersion?.view as SnAppDto)?.icon,
                    custom: (publishedVersion?.view as SnAppDto)?.environment,
                    disabled: snModel.key === this.group.application.default.web || snModel.key === this.group.application.default.mobile,
                };
                res.push(element);
            }
            return res;
        }, []);
        list.push({
            key: 'plan',
            value: this.translateService.instant('SETTINGS.MENU.PLAN'),
            icon: 'fa-solid fa-map-location-dot',
            custom: 'both',
        });
        return _.orderBy(list, 'value');
    }

    private initListTypedApplications(type: string): OptionsElementDto[] {
        return _.filter(this.listApplications, (app: OptionsElementDto) =>
            app.custom === type || app.custom === 'both'
        );
    }

    private updateGroupAuthorized(group: GroupDto, appKey: string) {
        if (appKey.length > 0 && appKey !== 'plan' && group.application.authorized?.indexOf(appKey) === -1) {
            group.application.authorized.push(appKey);
        }
    }

    private updateAuthorizedItems(appElement: OptionsElementDto) {
        if (appElement.key.length > 0 && appElement.key !== 'plan' && _.findIndex(this.authorizedApps, { key: appElement.key }) === -1) {
            this.authorizedApps.push(appElement);
        }
        this.authorizedApps = this.authorizedApps.map((app) => {
            app.disabled = app.key === this.selected.mobile?.key || app.key === this.selected.web?.key;
            return app;
        });
    }

}
