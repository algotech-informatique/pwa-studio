import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { LangDto, PairDto, SnModelDto } from '@algotech-ce/core';
import { SmartModelDto } from '@algotech-ce/core';
import { ParamEditorDto } from '../dto/param-editor.dto';
import { SnGroup, SnNode, SnParam, SnSelectionEvent, SnSelectionType, SnView } from '../../smart-nodes';
import { InspectorBarButton } from '../dto/inspector-bar-button.dto';
import { TranslateService } from '@ngx-translate/core';
import { InspectorLayoutService } from '../inspector-layout/inspector-layout.service';
import { OpenInspectorType } from '../../app/dto/app-selection.dto';

@Component({
    selector: 'sn-work-flow-inspector',
    templateUrl: './work-flow-inspector.component.html',
    styleUrls: ['./work-flow-inspector.component.scss'],
})
export class WorkFlowInspectorComponent implements OnChanges {

    @Input() snModel: SnModelDto;
    @Input() options: any;
    @Input() smartmodel: SmartModelDto | SmartModelDto[];
    @Input() snView: SnView;
    @Input() context: SnSelectionEvent;
    @Input() param: ParamEditorDto = null;
    @Input() forceOpenTab: OpenInspectorType;
    @Output() changed = new EventEmitter();

    sources = {
        'smart-object-selected': {
            value: null,
            title: 'WORKFLOW.SOURCES.SO_SELECTED',
            type: ['sk:', 'so:global', 'so:'],
            multiple: false
        },
        'smart-objects-selected': {
            value: null,
            title: 'WORKFLOW.SOURCES.SO_*_SELECTED',
            type: ['sk:', 'so:global', 'so:'],
            multiple: true
        },
        'document-selected': {
            value: null,
            title: 'WORKFLOW.SOURCES.DOC_SELECTED',
            type: ['sys:file'],
            multiple: false
        },
        'documents-selected': {
            value: null,
            title: 'WORKFLOW.SOURCES.DOC_*_SELECTED',
            type: ['sys:file'],
            multiple: true
        },
        'map-location': {
            value: null,
            title: 'WORKFLOW.SOURCES.MAP_LOCATION',
            type: ['sys:location'],
            multiple: false
        },
        'schedule-key': {
            value: null,
            title: 'WORKFLOW.SOURCES.SCHEDULE_KEY',
            type: ['sys:schedule', 'primitive.string'],
            multiple: null
        },
        'current-user': {
            value: null,
            title: 'WORKFLOW.SOURCES.CURRENT_USER',
            type: ['sys:user'],
            multiple: false
        },
        'schedule-selected': {
            value: null,
            title: 'WORKFLOW.SOURCES.SCHEDULE_SELECTED',
            type: ['sys:schedule'],
            multiple: false
        },
        'schedules-selected': {
            value: null,
            title: 'WORKFLOW.SOURCES.SCHEDULES_SELECTED',
            type: ['sys:schedule'],
            multiple: true
        },
        'old-magnet-zone': {
            value: null,
            title: 'WORKFLOW.SOURCES.OLD_MAGNET_ZONE',
            type: ['sys:magnet'],
            multiple: false
        },
        'magnet-zone': {
            value: null,
            title: 'WORKFLOW.SOURCES.MAGNET_ZONE',
            type: ['sys:magnet'],
            multiple: false
        }
    };

    buttons: InspectorBarButton[];
    selected = 'inspector';
    nodeContextElement: SnNode;
    inspectorOpened = true;
    constructor(
        private translateService: TranslateService,
        private inspectorLayoutService: InspectorLayoutService,
    ) {
        this.buttons = [
            { key: 'inspector', title: this.translateService.instant('INSPECTOR'), icon: 'fa-solid fa-diagram-project', color: '#2D9CDB' },
        ];
    }

    ngOnChanges(changes: SimpleChanges) {
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

    onParamChanged(data: PairDto) {
        if ((this.context.element as SnParam).value) {
            (this.context.element as SnParam).value[data.key] = data.value;
        } else {
            (this.context.element as SnParam).value = { [data.key]: data.value };
        }
        this.changed.emit();
    }

    onCloseInspector() {
        this.inspectorOpened = false;
    }

    onSelectButton(key: string) {
        this.selected = key;
        this.inspectorOpened = true;
    }

    private isSelectContext(): boolean {
        return !!this.param || this.inspectorLayoutService.contextIsWithoutName(this.context);
    }

    private updateBarButtonsAndSelection() {
        if (this.isSelectContext()) {
            this.inspectorOpened = true;
        }
        this.selected = this.context.type;
        this.inspectorLayoutService.updateBarButtons(this.buttons, this.context, this.nodeContextElement);
    }

}
