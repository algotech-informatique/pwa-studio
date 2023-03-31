import { SnPageDto, SnPageWidgetDto, SnAppDto, SnModelDto, PairDto, SnPageWidgetRuleDto } from '@algotech-ce/core';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { AppSettings } from '../../app/dto';
import { OpenInspectorType } from '../../app/dto/app-selection.dto';
import { AppActionsService, AppSelectionService, PageWidgetService } from '../../app/services';
import { PopupElementService } from '../components/popup-element/popup-element.service';
import { ListItem } from '../dto/list-item.dto';

interface CustomTab {
    tab: PairDto;
    active: boolean;
}

@Component({
    selector: 'sn-app-inspector',
    templateUrl: './app-inspector.component.html',
    styleUrls: ['./app-inspector.component.scss'],
})
export class AppInspectorComponent implements OnChanges, AfterViewInit {

    @ViewChild('content') content: ElementRef;
    @Input() settings: AppSettings;
    @Input() page: SnPageDto;
    @Input() widget: SnPageWidgetDto;
    @Input() snApp: SnAppDto;
    @Input() snModel: SnModelDto;
    @Input() forceOpenTab: OpenInspectorType;

    tabs: CustomTab[] = [
        { tab: { key: 'design', value: 'INSPECTOR.APP.TABS.DESIGN' }, active: true},
        { tab: { key: 'behavior', value: 'INSPECTOR.APP.TABS.BEHAVIOR' }, active: true},
    ];

    selectedTab = 'design';
    widgetStateList: ListItem[];

    constructor(
        public appActions: AppActionsService,
        private popupElement: PopupElementService,
        private translateService: TranslateService,
        private widgetsService: PageWidgetService,
        private appSelection: AppSelectionService,
    ) {
    }

    ngAfterViewInit() {
        this.popupElement.view = this.content;
    }

    ngOnChanges() {
        this.updateTabs();
        this.loadWidgetStateList();
        if (this.forceOpenTab) {
            this.selectedTab = (this.forceOpenTab === 'conditions') ? 'conditions' : 'behavior';
        } else if (this.page.displayState?.activeZone) {
            this.selectedTab = 'behavior';
        }
    }

    onChanged() {
        this.appActions.notifyUpdate(this.snApp);
    }

    onChangedPageSize() {
        this.appActions.notifyUpdate(this.snApp);
    }

    onChangedMain(page: SnPageDto) {
        if (page.main) {
            _.each(this.snApp.pages, (p: SnPageDto) => {
                if (p.id !== page.id) {
                    p.main = false;
                }
            });
        }
        this.appActions.notifyUpdate(this.snApp);
    }

    onOpenTab(tabKey: string) {
        this.selectedTab = tabKey;
    }

    onSelectState(ruleId: string) {
        const selectedRule = !ruleId || this.widget.displayState.rule?.rule?.id === ruleId ?
            undefined : this.widget.rules.find((rule) => rule.id === ruleId);
        this.widgetsService.enableRule(this.snApp, this.widget, selectedRule);
    }

    onRulesChanged(rules: SnPageWidgetRuleDto[]) {
        this.widget.rules = rules;
        this.loadWidgetStateList();
        this.onChanged();
    }

    handleChange(event) {
        this.appActions.lockWidgetProperty(this.snApp, event.section, event.locked);
    }

    private updateTabs() {
        const conditionTabIndex = this.tabs.findIndex(tab => tab.tab.key === 'conditions');
        if (this.widget && conditionTabIndex < 0) {
            this.tabs.push(
                { tab: { key: 'conditions', value: 'INSPECTOR.APP.TABS.CONDITIONS' }, active: true});
        } else if (!this.widget && conditionTabIndex > -1) {
            this.tabs.splice(conditionTabIndex, 1);
            this.selectedTab = this.selectedTab === 'conditions' ? 'design' : this.selectedTab;
        }
        this.activateTabs();
    }

    private activateTabs() {
        _.forEach(this.tabs, (tab: CustomTab) => {
            if (tab.tab.key !== 'design') {
                tab.active = !(this.appSelection.selections.pages.length > 1 || this.appSelection.selections.widgets.length > 1);
            }
        }
        );
        this.selectedTab =
            (this.appSelection.selections.pages.length > 1 || this.appSelection.selections.widgets.length > 1) ?
                'design' :
                this.selectedTab;
    }

    private loadWidgetStateList() {
        if (!(this.widget?.rules?.length > 0)) { return; }
        this.widgetStateList = this.widget.rules.map((rule) => ({
            key: rule.id,
            value: rule.name,
            icon: 'fa-solid fa-circle',
            color: rule.color
        }));
        this.widgetStateList.unshift({
            key: 'default',
            value: this.translateService.instant('INSPECTOR.WIDGET.RULE-DEFAULT-STATE'),
            icon: '',
        });
    }

}
