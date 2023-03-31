import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { SnView } from '../../../smart-nodes';
import { PairDto, SmartModelDto } from '@algotech-ce/core';
import { ParamEditorDto } from '../../dto/param-editor.dto';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'sn-param-inspector',
    templateUrl: './param-inspector.component.html',
    styleUrls: ['./param-inspector.component.scss'],
})
export class ParamInspectorComponent implements OnChanges {

    @Input() snModel;
    @Input() snView: SnView;
    @Input() smartmodel: SmartModelDto | SmartModelDto[];
    @Input() param: ParamEditorDto = null;
    @Output() changed = new EventEmitter<PairDto>();
    readOnly = false;

    constructor(
        private translate: TranslateService,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        this.readOnly = this.param.value?.pluggable;
    }

    onChanged(keyValue: PairDto) {
        this.param.value[keyValue.key] = keyValue.value;
        this.changed.emit(keyValue);
    }

    onConditionChanged(data: PairDto) {
        this.param.value[data.key] = data.value;
        this.changed.emit(data);
    }

    onChangedCheck(key, value) {
        this.param.value[key] = value;
        this.readOnly = value;
        this.changed.emit({ key, value });
        this.changed.emit({ key: 'type', value: 'pluggable' });
    }

}
