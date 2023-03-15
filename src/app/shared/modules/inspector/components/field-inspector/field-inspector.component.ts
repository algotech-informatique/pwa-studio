import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { SnView, SnUtilsService, SnNode, SnParam } from '../../../smart-nodes';
import { LangDto, SmartPermissionsDto, SnModelDto } from '@algotech/core';
import { DataModelInspectorService } from '../../data-model-inspector/data-model-inspector.service';
import { Params } from '@angular/router';
import { TypeVariable } from '../variables/dto/type-variable.dto';
import { VariablesServices } from '../variables/variables.service';
import { IconsService, SessionsService, ToastService } from '../../../../services';
import { SnPublishModelService } from '../../../smart-nodes-custom/service/sn-publish/sn-publish-model/sn-publish-model.service';
import { ListItem } from '../../dto/list-item.dto';
import { TranslateService } from '@ngx-translate/core';
import { SnLang } from '@algotech/business/src/lib/app/models';

@Component({
    selector: 'field-inspector',
    templateUrl: './field-inspector.component.html',
    styleUrls: ['./field-inspector.component.scss'],
})
export class FieldInspectorComponent implements OnChanges {

    @Input() fieldOptions: SnParam = null;
    @Input() snModel: SnModelDto;
    @Input() snView: SnView;
    @Output() changed = new EventEmitter();

    source = {
        'field-inspector-selected': {
            value: null,
            title: 'WORKFLOW.SOURCES.SO_SELECTED',
            type: ['primitive', 'html', 'sys:comment', 'so:'],
            multiple: false
        },
    };

    fieldProperties: { radioList: ListItem[]; selected: string[] };
    fieldComposition: { radioList: ListItem[]; selected: string[] };
    dataParams: Params[] = [];
    isSmartModel = false;
    isPrimitive = false;
    isDisplayItem = false;
    isExtendedField = false;
    isUniqueKey = false;

    types: TypeVariable[] = [];
    filteredTypes: ListItem[] = [];
    genericList: ListItem[] = [];

    constructor(
        private dataModelService: DataModelInspectorService,
        private snUtils: SnUtilsService,
        private variablesService: VariablesServices,
        private sessionsService: SessionsService,
        private publishService: SnPublishModelService,
        private iconsService: IconsService,
        private toastService: ToastService,
        private translate: TranslateService
    ) { }

    ngOnChanges() {
        this.types = this.variablesService.typeBuilder(this.publishService.createSmartModels(this.snView));
        this.filteredTypes = this.variablesService.filterList(this.source['field-inspector-selected'].type, this.types).map((type) => ({
            key: type.key,
            icon: type.icon,
            color: this.iconsService.getIconColor(type.key),
            value: type.value,
        }));
        this.genericList = this.variablesService.gListBuilder(this.sessionsService.active.datas.read.glists).map((list) => ({
            key: list.key,
            icon: list.icon,
            color: '#EB6317',
            value: list.value,
        }));

        this.dataParams = this.snUtils.getArrayOfParam(this.snView, this.fieldOptions);
        this.fieldProperties = this.dataModelService.createFieldProperties(this.fieldOptions);
        this.fieldComposition = this.dataModelService.createComposition(this.fieldOptions);

        this.refreshStates();
        this.isUniqueKey = this.isUniqueKeys();
    }

    refreshStates() {
        this.isExtendedField = (this.fieldOptions.key as string).startsWith('~__') ? true : false;
        this.isPrimitive = ((['string', 'number', 'date', 'datetime', 'time', 'boolean'].indexOf(this.fieldOptions.types as string) !== -1)
            && (this.fieldOptions.multiple === false)) ? true : false;
        this.isSmartModel = ((this.fieldOptions.types as string).startsWith('so:')) ? true : false;
        this.isDisplayItem = (this.fieldOptions.types === 'string') ? true : false;
    }


    isUniqueKeys() {
        const findParam = this.snUtils.getParamsWithNode(this.snView).find((p) => p.param.id === this.fieldOptions.id);
        if (!findParam) {
            return;
        }

        if (findParam.node.custom) {
            const data = findParam.node.custom.uniqueKeys;
            if (_.isArray(data) && data.length !== 0) {
                if (_.findIndex(data, (val) => val === this.fieldOptions.key) !== -1) {
                    return true;
                }
            }
        }

        return false;
    }

    onChangedDisplayKey(data: string) {
        this.fieldOptions.key = data;
        this.changed.emit();
    }

    onChangedDisplayName(data: LangDto[]) {
        this.fieldOptions.displayName =  data as SnLang[];
        this.changed.emit();
    }

    onPermissionsChanged(permissions: SmartPermissionsDto) {
        this.fieldOptions.value.permissions = permissions;
        this.changed.emit();
    }

    onPermissionsApplyAll(permissions: SmartPermissionsDto) {
        let node: SnNode = null;
        const findParam = this.snUtils.getParamsWithNode(this.snView).find((p) => p.param.id === this.fieldOptions.id);
        if (!findParam) {
            return;
        }
        node = findParam.node;

        const section = node.sections.find((s) => s.key === 'fields');
        if (!section) {
            return;
        }

        for (const param of section.params) {
            param.value.permissions = _.cloneDeep(permissions);
        }

        this.toastService.addToast('success', this.translate.instant('TOAST-MESSAGE.APPLY-PERMISSIONS-TO-ALL-SUCCESS'), null, 3000);

        this.changed.emit();
    }

    onDisplayRadioChanged(event: string) {
        const split = event.split('.');
        if (split.length === 1) {
            this.fieldOptions[event] = !this.fieldOptions[event];
        } else {
            this.fieldOptions[split[0]][split[1]] = !this.fieldOptions[split[0]][split[1]];
        }
        this.changed.emit();
    }

    onDataInputChanged(event) {
        this.fieldOptions.value[event.key] = event.value;
        this.changed.emit();
    }

    onDataItemChanged(event) {
        this.fieldOptions.display = event;
        this.changed.emit();
    }

    onTypeChanged(event: string) {
        this.fieldOptions.types = event;
        this.refreshStates();
        this.changed.emit();
    }

    onChangeDescription(description: string) {
        this.fieldOptions.value.description = description;
        this.changed.emit();
    }

    onTypeItemChanged(event: string) {
        if (event?.length === 0) {
            delete this.fieldOptions.value.items;
        } else {
            this.fieldOptions.value.items = event;
        }
        this.changed.emit();
    }
}
