import { LangDto, SnModelDto, WorkflowApiModelDto, WorkflowVariableModelDto } from '@algotech-ce/core';
import { Component, Input, EventEmitter, Output, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/shared/services';
import { OpenInspectorType } from '../../app/dto/app-selection.dto';
import { SnGroup, SnNode, SnParam, SnSelectionEvent, SnSelectionType, SnView } from '../../smart-nodes';
import { InspectorBarButton } from '../dto/inspector-bar-button.dto';
import { ListItem } from '../dto/list-item.dto';
import { InspectorLayoutService } from '../inspector-layout/inspector-layout.service';

@Component({
    selector: 'sn-smart-flow-inspector',
    templateUrl: './smart-flow-inspector.component.html',
    styleUrls: ['./smart-flow-inspector.component.scss'],
})
export class SmartFlowInspectorComponent implements OnChanges {

    @Input() snModel: SnModelDto;
    @Input() options: any;
    @Input() snView: SnView;
    @Input() context: SnSelectionEvent;
    @Input() forceOpenTab: OpenInspectorType;
    @Output() changed = new EventEmitter();
    subscription: Subscription;

    sources = {
        'search-parameters': {
            value: null,
            title: 'SMARTFLOW.SOURCES.SEARCH-PARAMETERS',
            type: ['sys:query'],
            multiple: false
        },
        'current-user': {
            value: null,
            title: 'WORKFLOW.SOURCES.CURRENT_USER',
            type: ['sys:user'],
            multiple: false
        },
    };

    buttons: InspectorBarButton[];
    selected = 'inspector';
    preInspectorOpened = true;
    previewUrl: string;
    previewUrlColor: string;
    verbs: ListItem[];
    nodeContextElement: SnNode;
    inspectorOpened = true;

    constructor(
        private messageService: MessageService,
        private translateService: TranslateService,
        private inspectorLayoutService: InspectorLayoutService,
    ) {
        this.verbs = [
            { key: 'GET', value: 'GET', icon: 'fa-solid fa-circle', color: '#61affe' },
            { key: 'POST', value: 'POST', icon: 'fa-solid fa-circle', color: '#49cc90' },
            { key: 'PUT', value: 'PUT', icon: 'fa-solid fa-circle', color: '#fca130' },
            { key: 'PATCH', value: 'PATCH', icon: 'fa-solid fa-circle', color: '#50e3c2' },
            { key: 'DELETE', value: 'DELETE', icon: 'fa-solid fa-circle', color: '#f93e3e' },
        ];

        this.buttons = [
            { key: 'inspector', title: this.translateService.instant('INSPECTOR'), icon: 'fa-solid fa-atom', color: '#2D9CDB' },
            { key: 'openapi', title: this.translateService.instant('Open API'), img: 'openapis-icon' },
        ];

        this.subscription = this.messageService.get('debugger-change-state').subscribe((state) => {
            if (state === 'start') {
                this.preInspectorOpened = this.inspectorOpened;
                this.inspectorOpened = false;
            } else {
                this.inspectorOpened = this.preInspectorOpened;
            }
        });
    }

    @HostListener('scroll')
    onWindowScroll(event) {
        event.preventDefault();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.snModel?.currentValue) {
            this.buildPreviewUrl();
        }

        if (changes.context) {
            this.nodeContextElement = this.inspectorLayoutService.getNodeElement(this.context, this.snView);
        }

        if (changes.context && !changes.context.currentValue) {
            this.inspectorLayoutService.removeButtonsIfPresent(this.buttons, ['node', 'param', 'flow', 'group', 'box']);
            this.selected = 'inspector';
        }

        if (changes.context && changes.context.currentValue) {
            this.updateBarButtonsAndSelection();
        }

        if (changes.forceOpenTab?.currentValue) {
            this.inspectorOpened = true;
            this.selected = (this.forceOpenTab === 'inspector') ? 'inspector' : 'node';
        }
    }

    onChanged() {
        this.changed.emit();
    }

    onVariablesChanged(variables: WorkflowVariableModelDto[]) {
        this.options.variables = variables;
        this.buildPreviewUrl();
        this.changed.emit();
    }

    onApiChanged(api: WorkflowApiModelDto, buildPreviewUrl = true) {
        this.options.api = api;
        if (buildPreviewUrl) {
            this.buildPreviewUrl();
        }
        this.changed.emit();
    }

    onChangeElementDisplayName(data: LangDto[]) {
        (this.selected === 'node' ? this.nodeContextElement : this.context.element).displayName = _.cloneDeep(data);
        this.inspectorLayoutService.addButtonOrUpdate(
            this.buttons,
            (this.selected === 'node' ? this.nodeContextElement : this.context.element).displayName,
            this.selected as SnSelectionType,
            this.selected === 'node' ? this.nodeContextElement?.icon : (this.context.element as SnParam).types,
        );
        this.changed.emit();
    }

    onChangeElementColor(color: string) {
        (this.context.element as SnGroup).color = color;
        this.changed.emit();
    }

    onCloseInspector() {
        this.inspectorOpened = false;
    }

    onSelectButton(key: string) {
        this.selected = key;
        this.toggleInspector(true);
    }

    private toggleInspector(open: boolean) {
        this.inspectorOpened = open;
        this.preInspectorOpened = this.inspectorOpened;
    }

    private buildPreviewUrl() {
        if (this.snView.options.api) {
            const urlSegments = (this.options.variables as WorkflowVariableModelDto[]).reduce((res, variable) => {
                if (variable.use === 'url-segment' && variable.key) {
                    res = res.concat('/{', variable.key, '}');
                }
                return res;
            }, '');
            const queryParameters = (this.options.variables as WorkflowVariableModelDto[]).reduce((res, variable) => {
                if (variable.use === 'query-parameter' && variable.key) {
                    res = res.concat((res.length === 0 ? '?' : '&'), variable.key, '=');
                }
                return res;
            }, '');
            this.previewUrl = `${window.location.origin}/api/connectors/${(this.options.api as WorkflowApiModelDto)
                .route}${urlSegments}${queryParameters}`;
            this.previewUrlColor = this.verbs.find((verb) => verb.key === (this.options.api as WorkflowApiModelDto).type)?.color;
        }
    }

    private updateBarButtonsAndSelection() {
        if (this.inspectorLayoutService.contextIsWithoutName(this.context)) {
            this.inspectorOpened = true;
        }
        this.selected = this.context.type;
        this.inspectorLayoutService.updateBarButtons(this.buttons, this.context, this.nodeContextElement);
    }

}
