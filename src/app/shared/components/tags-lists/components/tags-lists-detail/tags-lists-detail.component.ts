import { LangDto, SmartModelDto, TagDto, TagListDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { GenericFormatedLine } from '../../../generic-lists/dto/generic-formated-line.dto';
import * as _ from 'lodash';
import { TagsListFormatedLine } from '../../dto/tags-list-formated.dto';
import { TagsListsService } from '../../services/tags-lists.service';
import { OptionsElementDto } from '../../../../dtos/options-element.dto';
import { TranslateLangDtoService } from '@algotech/angular';
import { TagsListsDetailService } from '../../services/tags-lists-detail.service';
import { ToastService } from '../../../../services';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'tags-lists-detail',
    templateUrl: './tags-lists-detail.component.html',
    styleUrls: ['./tags-lists-detail.component.scss'],
})
export class TagsListsDetailComponent implements OnInit, OnChanges {

    @Input() tagsList: TagListDto;
    @Input() customerLangs: LangDto[] = [];
    @Input() smartModels: SmartModelDto[] = [];
    @Input() formatedDetailLines: TagsListFormatedLine[] = [];
    @Output() updateTagsList = new EventEmitter<{data: TagListDto; updateLine: boolean}>();
    @Output() removeLine = new EventEmitter<TagListDto>();

    activeAllLangs: boolean;
    mainLang = 'fr-FR';
    nextLangs: string[] = [];

    items: OptionsElementDto[] = [];
    inputList: OptionsElementDto[] = [];

    constructor(
        private tagsListService: TagsListsService,
        private tagsListDetailService: TagsListsDetailService,
        private toastService: ToastService,
        private translateLangService: TranslateLangDtoService,
        private translateService: TranslateService,
    ) { }

    ngOnInit() {
        this.mainLang = this.tagsListDetailService.getMainLang();
        this.nextLangs = this.tagsListService.getLangs(this.mainLang, this.customerLangs);
    }

    ngOnChanges() {
        this.items = _.map(this.tagsList.modelKeyApplication, (mKey) => {
            const fIndex = _.findIndex(this.smartModels, (sm: SmartModelDto) => sm.key.toUpperCase() === mKey);
            const opt: OptionsElementDto = {
                key: mKey,
                value: (fIndex !== -1) ?
                    this.translateLangService.transform(this.smartModels[fIndex].displayName) : mKey,
            };
            return opt;
        });
        this.inputList = _.reduce(this.smartModels, (result, sm: SmartModelDto) => {
            const fIndex = _.findIndex(this.items, (it: OptionsElementDto) => it.key.toUpperCase() === sm.key.toUpperCase());
            if (fIndex === -1) {
                const opt: OptionsElementDto = {
                    key: sm.key,
                    value: this.translateLangService.transform(sm.displayName),
                };
                result.push(opt);
            }
            return result;
        }, []);
    }

    updateName(data) {

        const list: TagListDto = _.cloneDeep(this.tagsList);
        list.displayName = data;
        this.updateTagsList.emit({data: list, updateLine: true});
    }

    onChecked(data, key) {

        const list: TagListDto = _.cloneDeep(this.tagsList);
        if (key === 'docs') {
            list.applyToDocuments = data;
        } else {
            list.applyToImages = data;
        }
        this.updateTagsList.emit({data: list, updateLine: true});
    }

    onSelectValue(data) {
        const list: TagListDto = _.cloneDeep(this.tagsList);
        list.modelKeyApplication = _.map(data, (dt: OptionsElementDto) => dt.key);
        this.updateTagsList.emit({data: list, updateLine: true});
    }

    onActiveAllLangs(event) {
        this.activeAllLangs = event;
    }

    onRemoveLines(lines: GenericFormatedLine[]) {

        const list: TagListDto = _.cloneDeep(this.tagsList);
        list.tags = _.reduce(list.tags, (newList, val: TagDto) => {
            const index = _.findIndex(lines, (line: GenericFormatedLine) => line.key === val.key);
            if (index === -1) {
                newList.push(val);
            }
            return newList;
        },  []);

        this.updateTagsList.emit({data: list, updateLine: true});
    }

    onDeleteList() {
        this.removeLine.emit(this.tagsList);
    }

    onUpdateLine(data: {data: TagsListFormatedLine; updateLine: boolean}) {

        if (this._validateNewLine(data)) {
            const list: TagListDto = _.cloneDeep(this.tagsList);
            const index = _.findIndex(this.tagsList.tags, (lst: TagDto) => lst.key === data.data.key);
            if (index === -1) {
                list.tags.push(this.tagsListDetailService.createTagValue(data.data));
            } else {
                this.tagsListDetailService.updateTagValue(data.data, list.tags[index]);
            }
            this.updateTagsList.emit({data: list, updateLine: data.updateLine});
        }
    }

    _validateNewLine(data: {data: TagsListFormatedLine; updateLine: boolean}): boolean {
        if (data.data.key === 'new-line') {
            const key = this.tagsListDetailService.updateKey(data.data, this.formatedDetailLines);
            if (!key) {
                this.toastService.addToast('error', '',
                    this.translateService.instant('TAGS-LISTS.UPDATE-ITEMS-LIST-KO'), 3000);
                return false;
            }
        }
        return true;
    }

}
