import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { SnView, SnNode, SnSelectionEvent, SnParam, SnSelectionType, SnGroup } from '../../smart-nodes';
import { SessionsService, ToastService } from '../../../services';
import { LangDto, SmartModelDto, SmartPermissionsDto, SnModelDto } from '@algotech-ce/core';
import { DataModelInspectorService } from './data-model-inspector.service';
import { ListItem } from '../dto/list-item.dto';
import { TranslateService } from '@ngx-translate/core';
import { InspectorBarButton } from '../dto/inspector-bar-button.dto';
import { InspectorLayoutService } from '../inspector-layout/inspector-layout.service';
import { OpenInspectorType } from '../../app/dto/app-selection.dto';

@Component({
    selector: 'sn-data-model-inspector',
    templateUrl: './data-model-inspector.component.html',
    styleUrls: ['./data-model-inspector.component.scss'],
})
export class DataModelInspectorComponent implements OnChanges {

    @Input() snModel: SnModelDto;
    @Input() options: any;
    @Input() custom: any;
    @Input() snView: SnView;
    @Input() context: SnSelectionEvent;
    @Input() fieldOptions: SnParam;
    @Input() forceOpenTab: OpenInspectorType;
    @Output() changed = new EventEmitter();

    nodeContextElement: SnNode;
    nodeModel: SnNode;
    propertiesList: ListItem[] = [];
    sources = {};
    enabledDisplayKey = false;
    skillsItems: { radioList: ListItem[]; selected: string[] };
    buttons: InspectorBarButton[] = [];
    selected: SnSelectionType;
    inspectorOpened = true

    constructor(
        private sessionService: SessionsService,
        private dataModelService: DataModelInspectorService,
        private toastService: ToastService,
        private translate: TranslateService,
        private inspectorLayoutService: InspectorLayoutService,
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        this.enabledDisplayKey = false;
        this.propertiesList = [];

        if (changes.context) {
            this.nodeContextElement = this.inspectorLayoutService.getNodeElement(this.context, this.snView);
        }

        if (changes.context && !changes.context.currentValue) {
            this.buttons = [];
            this.selected = null;
        }

        if (changes.context && changes.context.currentValue) {
            this.updateBarButtonsAndSelection();
        }

        if (this.nodeContextElement?.custom) {
            const models: SmartModelDto[] = this.sessionService.active.datas.read.smartModels;
            const model = _.find(models, (md: SmartModelDto) => md.key === this.nodeContextElement.custom.key);
            this.enabledDisplayKey = (model) ? true : false;
            this.propertiesList = this.dataModelService.createPropertiesList(this.nodeContextElement);
            this.skillsItems = this.dataModelService.createSkills(this.nodeContextElement);
        }

        if (changes.forceOpenTab?.currentValue) {
            this.inspectorOpened = true;
            this.selected = 'node';
        }
    }

    onChangeElementDisplayName(data: LangDto[]) {
        (this.selected === 'node' ? this.nodeContextElement : this.context.element).displayName = _.cloneDeep(data);
        this.inspectorLayoutService.addButtonOrUpdate(
            this.buttons,
            (this.selected === 'node' ? this.nodeContextElement : this.context.element).displayName,
            this.selected,
            this.selected === 'node' ? this.nodeContextElement?.icon : (this.context.element as SnParam).types,
        );
        this.changed.emit();
    }

    onChangeElementColor(color: string) {
        (this.context.element as SnGroup).color = color;
        this.changed.emit();
    }

    onChangeDescription(description: string) {
        this.nodeContextElement.custom.description = description;
        this.changed.emit();
    }

    onSkillsChanged(key: string) {
        this.nodeContextElement.custom.skills[key] = _.cloneDeep(!this.nodeContextElement.custom.skills[key]);
        this.changed.emit();
    }

    onChangeElementDisplayKey(data: string) {
        this.nodeContextElement.custom.key = data;
        this.changed.emit();
    }

    updateUniqueKeys(data: string[]) {
        if (!data) { return; }
        this.nodeContextElement.custom.uniqueKeys = data;
        this.changed.emit();
    }

    onPermissionsChanged(permissions: SmartPermissionsDto) {
        this.nodeContextElement.custom.permissions = permissions;
        this.changed.emit();
    }

    onPermissionsApplyAll(permissions: SmartPermissionsDto) {
        const section = this.nodeContextElement.sections.find((s) => s.key === 'fields');
        if (!section) {
            return;
        }

        for (const param of section.params) {
            param.value.permissions = _.cloneDeep(permissions);
        }

        this.toastService.addToast('success', this.translate.instant('TOAST-MESSAGE.APPLY-PERMISSIONS-TO-ALL-SUCCESS'), null, 3000);

        this.changed.emit();
    }

    onFieldsOptionChanged() {
        this.inspectorLayoutService.addButtonOrUpdate(this.buttons, this.context.element.displayName, 'param',
            (this.context.element as SnParam).types);
        this.changed.emit();
    }

    onCloseInspector() {
        this.inspectorOpened = false;
    }

    onSelectButton(key: SnSelectionType) {
        this.selected = key;
        this.inspectorOpened = true;
    }

    private updateBarButtonsAndSelection() {
        this.selected = this.context.type;
        this.inspectorOpened = true;

        this.inspectorLayoutService.updateBarButtons(this.buttons, this.context, this.nodeContextElement);

        if (this.context.type === 'param' && (this.context.element as SnParam).direction === 'out') {
            this.inspectorLayoutService.removeButtonsIfPresent(this.buttons, [this.context.type]);
            this.selected = 'node';
        }
    }
}
