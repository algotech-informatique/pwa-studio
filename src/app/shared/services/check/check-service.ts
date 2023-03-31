import { SnAppDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { CheckEvent, ValidationReportDto } from '../../dtos';
import { AppCheckService } from '../../modules/app-custom/services';
import { SnActionsService, SnView } from '../../modules/smart-nodes';
import { SnCheckService } from '../../modules/smart-nodes-custom/service/sn-check/sn-check.service';
import { AppActionsService } from '../../modules/app/services';
import * as _ from 'lodash';
import { debounceTime, tap } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';

@Injectable()
export class CheckService {

  _snViewSubscription: Subscription;
  _appSubscription: Subscription;
  _workFlowReports: ValidationReportDto[] = [];
  _smartFlowReports: ValidationReportDto[] = [];
  _smartModelReports: ValidationReportDto[] = [];
  _appReports: ValidationReportDto[] = [];
  _currentView;
  _currentApp;


  constructor(
    private snCheck: SnCheckService,
    private appCheck: AppCheckService,
    private snActions: SnActionsService,
    private appActions: AppActionsService,
    private configService: ConfigService,
  ) { }


  subscribeView(snView: SnView, snModelUuid: string) {
    this.unSubscribeView();
    this._currentView = { snView, snModelUuid };

    this._snViewSubscription = this.snActions.onCheck(this._currentView.snView).pipe(debounceTime(2000)).subscribe((data) => {
      if (this.configService.config.preferences.checkOptions.checkOnDesign) {
        this.dosnViewCheck(data.type, 'onDesign').subscribe();
      }
    });
  }


  subscribeApp(snApp: SnAppDto, snModelUuid: string) {
    this.unSubscribeApp();
    this._currentApp = { snApp, snModelUuid };
    this._appSubscription = this.appActions.onCheck(this._currentApp.snApp).pipe(debounceTime(2000)).subscribe((data) => {
      if (this.configService.config.preferences.checkOptions.checkOnDesign) {
        this.dosnAppCheck('onDesign').subscribe();
      }
    });
  }

  dosnViewCheck(type, checkEvent: CheckEvent): Observable<boolean> {
    return (this._currentView) ? this._pushReport(this.snCheck.check(this._currentView.snView,
      this._currentView.snModelUuid, checkEvent), type).pipe(
        tap(() => {
          this.snActions.notifyChecked(this._currentView.snView);
          this.snActions.notifyRefresh(this._currentView.snView);
        })
      ) : of(false);
  }

  dosnAppCheck(checkEvent: CheckEvent) {
    return (this._currentApp) ? this._pushReport(this.appCheck.check(this._currentApp.snApp,
      this._currentApp.snModelUuid, checkEvent), 'APP').pipe(
        tap(() => {
          this.appActions.notifyChecked(this._currentApp.snApp);
          this.appActions.notifyRefresh(this._currentApp.snApp);
        })) : of(false);
  }


  unSubscribeView() {
    if (this._snViewSubscription) {
      this._snViewSubscription.unsubscribe();
    }
  }

  unSubscribeApp() {
    if (this._appSubscription) {
      this._appSubscription.unsubscribe();
    }
  }

  getReport(type: 'SF' | 'WF' | 'SM' | 'APP', id: string) {
    return _.clone(this._getReport(this._getReportArry(type), id));
  }

  _pushReport(report: ValidationReportDto, type: 'SF' | 'WF' | 'SM' | 'APP'): Observable<boolean> {
    this._push(this._getReportArry(type), report);
    return of(report.errors.length > 0);
  }

  _push(reports, report: ValidationReportDto) {
    const index = _.findIndex(reports, ['_id', report._id]);
    if (index !== -1) {
      reports.splice(index, 1, report);
    } else {
      reports.push(report);
    }
  }

  _getReport(reports, id: string): ValidationReportDto {
    return _.find(reports, ['_id', id]);
  }

  _getReportArry(type: 'SF' | 'WF' | 'SM' | 'APP') {
    return (type === 'SF') ? this._smartFlowReports :
      (type === 'WF') ? this._workFlowReports :
        (type === 'SM') ? this._smartModelReports :
          this._appReports;
  }
}
