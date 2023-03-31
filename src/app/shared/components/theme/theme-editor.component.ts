import { ThemeEngloberService } from '@algotech-ce/business';
import { ThemeDto } from '@algotech-ce/core';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DialogMessageService, SessionsService } from '../../services';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { themePreviewWorkflow, themePreviewSmartModels } from './preview/data';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'theme-editor',
    templateUrl: './theme-editor.component.html',
    styleUrls: ['./theme-editor.component.scss']
})
export class ThemeEditorComponent implements OnInit, OnDestroy {
    @Input() theme: ThemeDto;
    @Input() showDebugger = true;

    @Output() themeChanged = new EventEmitter();

    keyProperties: string[];
    update$ = new Subject();

    top = {};
    detail = {};

    workflow = null;
    models = null;

    constructor(
        public sessionsService: SessionsService,
        private themeEnglober: ThemeEngloberService,
        private dialogMessageService: DialogMessageService,
        private translate: TranslateService) {
        this.update$.pipe(
            debounceTime(200),
            tap((theme: ThemeDto) => {
                if (theme.themeKey === 'custom') {
                    for (const key of this.keyProperties) {
                        if (!theme.customColors.some((ele) => ele.key === key)) {
                            theme.customColors.push({
                                key,
                                value: this.themeEnglober.lightTheme.find((ele) => ele.key === key).value,
                            });
                        }
                    }
                }
                this.theme = theme;
                this.themeChanged.next(theme);
                this.themeEnglober.theme.next(theme);
                this.runDebug();
            })
        ).subscribe();
    }

    ngOnInit() {
        this.keyProperties = this.themeEnglober.keyProperties;
        this.workflow = themePreviewWorkflow;
        this.models = themePreviewSmartModels(this.sessionsService.active.datas.read.localProfil.groups[0]);
    }

    ngOnDestroy() {
        this.workflow = null;
    }

    runDebug() {
        this.workflow = _.cloneDeep(themePreviewWorkflow);
        this.models = themePreviewSmartModels(this.sessionsService.active.datas.read.localProfil.groups[0]);
    }

    applyColors() {
        this.dialogMessageService.getMessageConfirm({
            title: this.translate.instant('COLOR-APPLY-CUSTOM'),
            message: this.translate.instant('COLOR-APPLY-CUSTOM-MESSAGE', {
                theme: this.translate.instant(`THEME-${this.theme.themeKey.toUpperCase()}`)
            }),
            confirm: this.translate.instant('SN-DELETE-CONFIRM'),
            cancel: this.translate.instant('SN-DELETE-CANCEL'),
            type: 'warning',
            messageButton: true,
        }).pipe()
            .subscribe((data) => {
                if (data) {
                    const theme: ThemeDto = _.cloneDeep(this.theme);
                    theme.customColors = _.cloneDeep(this.theme.themeKey === 'light' ?
                        this.themeEnglober.lightTheme : this.themeEnglober.darkTheme);
                    theme.themeKey = 'custom';

                    this.update$.next(theme);
                }
            });

    }

    changeTheme(theme: string) {
        this.update({
            themeKey: theme,
            customColors: this.theme.customColors,
        });
    }

    openColor(colorKey: string) {
        this.top[colorKey] = 10;
    }

    openDetail(ev, colorKey: string) {
        for (const color of this.keyProperties) {
            if (colorKey !== color) {
                this.detail[color] = false;
            } else {
                this.detail[color] = !this.detail[color];
            }
        }
        ev.stopPropagation();
    }

    changeColor(colorKey: string, colorValue: string) {
        const theme: ThemeDto = _.cloneDeep(this.theme);
        const find = theme.customColors.find((ele) => ele.key === colorKey);
        if (find) {
            find.value = colorValue;
        } else {
            theme.customColors.push({
                key: colorKey,
                value: colorValue,
            });
        }
        this.update(theme);
    }

    update(theme: ThemeDto) {
        this.update$.next(theme);
    }
}
