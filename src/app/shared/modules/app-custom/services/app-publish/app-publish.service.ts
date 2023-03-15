import { tap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { SnPageDto, SnModelDto, SnAppDto, SnPageEventDto, SnPageEventPipeDto, SnPageWidgetDto, ApplicationModelDto } from '@algotech/core';
import { Injectable } from '@angular/core';
import { ApplicationModelsService } from '@algotech/angular';
import * as _ from 'lodash';
import { DatasService, SessionsService, ToastService } from '../../../../services';
import { TranslateService } from '@ngx-translate/core';
import { AppCustomService } from '../app-custom/app-custom.service';
import { PageUtilsService } from '../../../app/services';
import { UUID } from 'angular2-uuid';
import moment from 'moment';

@Injectable()
export class AppPublishService {

    constructor(
        private datasService: DatasService,
        private translate: TranslateService,
        private toastService: ToastService,
        private sessionService: SessionsService,
        private pageUtils: PageUtilsService,
        private appCustom: AppCustomService,
        private applicationsModelsService: ApplicationModelsService,
    ) { }

    publish(
        snApp: SnAppDto,
        snModel: SnModelDto,
        host: string,
        customerKey: string,
    ) {
        this._publish(snApp, snModel, host, customerKey).subscribe((res: boolean) => {
            if (res === false) {
                this.toastService.addToast('info', this.translate.instant('NOTHING-TO-PUBLISH'), null, 2000);
            }

            if (res) {
                this.toastService.addToast('success', this.translate.instant('APP-PUBLISHED'), null, 2000);
                this.sessionService.refreshEnv();
            }
        });
    }

    // todo: publish App
    _publish(snApp: SnAppDto, snModel: SnModelDto, host: string, customerKey: string): Observable<any> {
        const version = snModel.versions.find((v) => v.view.id === snApp.id);
        if (!version) {
            return throwError('app not find on model');
        }

        const index = snModel.versions.filter((v) => !v.deleted).indexOf(version);
        const app = version.view as SnAppDto;
        snModel.publishedVersion = version.uuid;

        let publishApp: ApplicationModelDto;
        try {
            publishApp = this.getApp(app, snModel, index);
        } catch (e) {
            return throwError(e);
        }

        const publish$: Observable<ApplicationModelDto> = this.applicationsModelsService.put(publishApp);

        return publish$.pipe(
            tap(() => this.datasService.notifySNModel(snModel, customerKey, host)),
            map(() => true),
        );
    }

    transformApp(snApp: SnAppDto) {
        const _app: SnAppDto = _.cloneDeep(snApp);

        _app.pages = _.map(_app.pages, (page: SnPageDto) => {
            page.css.height = snApp.pageHeight;
            page.css.width = snApp.pageWidth;

            page.securityGroups = snApp.securityGroups;
            page.icon = snApp.icon;

            this.composeWidgets(page);
            this.replaceSmartflowExpr(page);

            return page;
        });

        delete _app.drawing;

        return _app;
    }
;
    getApp(snApp: SnAppDto, snModel: SnModelDto, appVersion: number): ApplicationModelDto {
        const _app: SnAppDto = this.transformApp(snApp);

        return {
            uuid: snModel.uuid,
            createdDate: snModel.createdDate,
            updateDate: moment().format(),
            appId: _app.id,
            snModelUuid: snModel.uuid,
            appVersion,
            key: snModel.key,
            displayName: snModel.displayName,
            environment: (snModel.versions[0].view as SnAppDto).environment,
            snApp: _app,
        };
    }

    composeWidgets(page: SnPageDto) {
        for (const widget of this.pageUtils.getWidgets(null, page)) {
            widget.group = widget.group ? widget.group : {
                widgets: [],
            };

            widget.events = this.composeInherits(page, widget, widget.events);
            for (const rule of widget.rules) {
                rule.events = this.composeInherits(page, widget, rule.events);
            }
        }

        page.header = this.pageUtils.getWidgets(null, page).find(widget => widget.typeKey === 'header');
        page.footer = this.pageUtils.getWidgets(null, page).find(widget => widget.typeKey === 'footer');
        if (page.footer) {
            page.footer.box.y = this.shiftWidgetFromHeader(page.footer, page.header);
        }

        page.widgets = page.widgets.reduce((res: SnPageWidgetDto[], widget) => {
            if (widget.typeKey === 'header' || widget.typeKey === 'footer') {
                return res;
            }

            const _widget: SnPageWidgetDto = _.cloneDeep(widget);

            if (widget.typeKey === 'list' || widget.typeKey === 'table') {
                if (!this.appCustom.paginable(page, _widget.custom.collection, ['page', 'limit'])) {
                    _widget.custom.paginate = {
                        limit: null,
                        mode: 'button'
                    };
                }
                if (!this.appCustom.paginable(page, _widget.custom.collection, ['filter'])) {
                    _widget.custom.search = null;
                }
            }

            _widget.box.y = this.shiftWidgetFromHeader(_widget, page.header);

            res.push(_widget);
            return res;
        }, []);
    }

    composeInherits(page: SnPageDto, widget: SnPageWidgetDto, events: SnPageEventDto[]) {
        return events.map((event) => {
            const _event: SnPageEventDto = _.cloneDeep(event);
            _event.pipe = this.composeInherit(page, widget, _event);
            return _event;
        });
    }

    composeInherit(page: SnPageDto, widget: SnPageWidgetDto, event: SnPageEventDto) {
        if (!event?.custom?.inherit) {
            return event.pipe;
        }

        const tree = this.pageUtils.getTree(null, widget, page);
        const inheritCmp = tree.find((item) => item.typeKey === event?.custom?.inherit);
        if (!inheritCmp) {
            return event.pipe;
        }

        const mainEvent = inheritCmp.events.find((ev) => ev.eventKey === event.eventKey);
        if (!mainEvent) {
            return event.pipe;
        }

        const actions = _.compact(
            _.cloneDeep(mainEvent.pipe).map((action: SnPageEventPipeDto) => {
                if (event.custom.disableActions?.includes(action.id)) {
                    return null;
                }
                return Object.assign(action, { id: UUID.UUID() });
            })
        );

        return [
            ...actions,
            ...event.pipe
        ];
    }

    replaceSmartflowExpr(page: SnPageDto) {
        const replaceExpr = (events: SnPageEventDto[]) => {
            let stringify = JSON.stringify(events);
            const pipe = events.reduce((results, ev: SnPageEventDto) => {
                results.push(..._.filter(ev.pipe, { type: 'smartflow' }));
                return results;
            }, []);
            for (const event of pipe) {
                stringify = stringify.replace(new RegExp(`{{smartflow.${event.action}`, 'g'), `{{smartflow.${event.id}`);
            }
            return JSON.parse(stringify);
        };

        page.events = replaceExpr(page.events);
        for (const widget of this.pageUtils.getWidgets(null, page)) {
            widget.events = replaceExpr(widget.events);
            widget.rules = widget.rules.map((r) => {
                r.events = replaceExpr(r.events);
                return r;
            });
        }
    }

    private shiftWidgetFromHeader(widget: SnPageWidgetDto, header?: SnPageWidgetDto): number {
        return header ? widget.box.y - header.box.height : widget.box.y;
    }

}
