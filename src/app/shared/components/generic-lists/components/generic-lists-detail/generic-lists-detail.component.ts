import { GenericListDto, GenericListValueDto, LangDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { GenericFormatedLine } from '../../dto/generic-formated-line.dto';
import { GenericListsDetailService } from '../services/generic-lists.detail.service';
import { GenericListService } from '../services/generic-lists.service';

@Component({
    selector: 'generic-lists-detail',
    templateUrl: './generic-lists-detail.component.html',
    styleUrls: ['./generic-lists-detail.component.scss'],
})
export class GenericListsDetailComponent implements OnInit {

    @Input() gList: GenericListDto;
    @Input() customerLangs: LangDto[] = [];
    @Input() formatedDetailLines: GenericFormatedLine[] = [];
    @Output() updateGList = new EventEmitter<{data: GenericListDto; updateLine: boolean}>();
    @Output() removeLine = new EventEmitter<GenericListDto>();

    activeAllLangs: boolean;
    mainLang = 'fr-FR';
    nextLangs: string[] = [];

    constructor(
        private gListService: GenericListService,
        private genericListsDetailService: GenericListsDetailService,
    ) { }

    ngOnInit() {
        this.mainLang = this.genericListsDetailService.getMainLang();
        this.nextLangs = this.genericListsDetailService.getLangs(this.mainLang, this.customerLangs);
    }

    updateName(data) {

        const list: GenericListDto = _.cloneDeep(this.gList);
        list.displayName = data;
        this.updateGList.emit({data: list, updateLine: true});
    }

    onChecked(data) {

        const list: GenericListDto = _.cloneDeep(this.gList);
        list.protected = data;
        this.updateGList.emit({data: list, updateLine: true});
    }

    onActiveAllLangs(event) {
        this.activeAllLangs = event;
    }

    onRemoveLines(lines: GenericFormatedLine[]) {

        const list: GenericListDto = _.cloneDeep(this.gList);
        list.values = _.reduce(list.values, (result, val: GenericListValueDto) => {
            const index = _.findIndex(lines, (line: GenericFormatedLine) => line.key === val.key);
            if (index === -1) {
                result.push(val);
            }
            return result;
        },  []);
        list.values = this._recalculIndex(list.values);
        this.updateGList.emit({data: list, updateLine: true});
    }

    _recalculIndex(values: GenericListValueDto[]) {
        const vals = _.sortBy(values, 'index');
        return _.map(vals, (val: GenericListValueDto, index) => {
            val.index = index;
            return val;
        });
    }

    onDeleteList() {
        this.removeLine.emit(this.gList);
    }

    onUpdateLine(data: {data: GenericFormatedLine; updateLine: boolean}) {

        if (data.data.key === 'new-line') {
            if (!this.genericListsDetailService.updateKey(data.data, this.formatedDetailLines)) {
                this.gListService.sendErrorMessage('GENERIC-LIST.UPDATE-ITEMS-LIST-KO');
                return;
            }
        }

        const list: GenericListDto = _.cloneDeep(this.gList);
        const index = _.findIndex(this.gList.values, (lst: GenericListValueDto) => lst.key === data.data.key);
        if (index === -1) {
            const indx = (this.gList.values.length !== 0) ? _.maxBy(this.gList.values, 'index').index + 1 : 0;
            list.values.push(this.genericListsDetailService.createGenericValue(data.data, indx ));
        } else {
            this.genericListsDetailService.updateGenericValue(data.data, list.values[index]);
        }
        this.updateGList.emit({data: list, updateLine: data.updateLine});
    }

    onUpdateLines(data: GenericFormatedLine[]) {
        const list: GenericListDto = _.cloneDeep(this.gList);
        this.genericListsDetailService.updateGenericValueIndex(list, data);
        this.updateGList.emit({data: list, updateLine: true});
    }
}
