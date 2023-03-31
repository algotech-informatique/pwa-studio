import { LangDto, SmartModelDto, TagListDto } from '@algotech-ce/core';
import { ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import { SessionsService, ToastService } from '../../services';
import * as _ from 'lodash';
import { TagsListsService } from './services/tags-lists.service';
import { TagsListFormatedLine } from './dto/tags-list-formated.dto';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-tags-lists',
    templateUrl: './tags-lists.component.html',
    styleUrls: ['./tags-lists.component.scss'],
})
export class TagsListsComponent implements OnChanges {

    @Input() customerKey: string;
    @Input() host: string;

    customerLangs: LangDto[];
    selectedUuid: string;
    _tagsLists: TagListDto[] = [];
    selectedTagsList: TagListDto;
    smartModels: SmartModelDto[] = [];
    search = '';
    formatedDetailLines: TagsListFormatedLine[] = [];

    set tagsLists(value: TagListDto[]) {
        this._tagsLists = value;
        this.sessionService.active.datas.read.tags = this._tagsLists;
    }

    get tagsLists(): TagListDto[] {
        return this._tagsLists;
    }

    constructor(
        private sessionService: SessionsService,
        private tagsListsService: TagsListsService,
        private ref: ChangeDetectorRef,
        private toastService: ToastService,
        private translateService: TranslateService,
    ) { }

    ngOnChanges() {
        this.tagsListsService.getTagsList().subscribe({
            next: (tgList: TagListDto[]) => {
                this.tagsLists = tgList;
            },
            error: (err) => console.error(err)});

        this.smartModels = this.sessionService.active.datas.read.smartModels;
        this.customerLangs = this.sessionService.active.datas.read.customer.languages;
        this._restart();
    }

    onSelectedTagslist(data: TagListDto) {
        this._selectTagsList(data.uuid as string);
    }

    onCreateNewList() {
        const newTagList: TagListDto = this.tagsListsService.createNewTagsList(this.customerLangs);
        const index = _.findIndex(this.tagsLists, (tgList: TagListDto) => tgList.key === newTagList.key);
        if (index === -1) {
            this.tagsLists.unshift(newTagList);
            this.selectedTagsList = newTagList;
            this.selectedUuid = newTagList.key;
            this.formatedDetailLines = [];
        } else {
            this.toastService.addToast('error', '',
                this.translateService.instant('SETTINGS.DOCUMENTS.TAGS-LIST.ERROR-DUPLICATE', { key: newTagList.key }), 3000);
        }
    }

    onUpdateTagsList(data: {data: TagListDto; updateLine: boolean}) {

        if (data.data.key === 'new-tags-list') {
            this.tagsListsService.createTagsList(data.data).subscribe(
                (result: TagListDto) => {
                    if (result) {
                        const fIndex = _.findIndex(this.tagsLists, (tgList: TagListDto) => tgList.key === 'new-tags-list');
                        if (fIndex !== -1) {
                            this.tagsLists.splice(fIndex, 1);
                        }
                        this.tagsLists.push(result);
                        this.tagsLists = _.orderBy(this.tagsLists, 'key');
                        this.selectedTagsList = result;
                        this.selectedUuid = result.uuid as string;
                        this.ref.detectChanges();
                    }
            });
        } else {
            this.tagsListsService.updateTagsList(data.data).subscribe({
                next: (result: TagListDto) => {
                    if (result) {
                        const list = _.cloneDeep(this.tagsLists);
                        const fIndex = _.findIndex(list, (tgList: TagListDto) => tgList.uuid  === data.data.uuid);
                        if (fIndex !== -1) {
                            list[fIndex] = result;
                            this.tagsLists = list;
                            this.selectedTagsList = result;
                            this.selectedTagsList.tags = _.orderBy(this.selectedTagsList.tags, 'key');
                            if (data.updateLine) {
                                this._updateFormatedLines(this.selectedTagsList.tags);
                            }
                            this.ref.detectChanges();
                        }
                    }
                },
                error: (err) => {
                    this.toastService.addToast('error', '',
                        this.translateService.instant('TAGS-LISTS.UPDATE-LIST-KO'), 3000);
                },
            });
        }
    }

    _restart() {

        this.selectedUuid = '';
        this.selectedTagsList = null as any;
        this.search = '';
    }

    _selectTagsList(uuid: string) {
        const index = _.findIndex(this.tagsLists, (tgList: TagListDto) => tgList.uuid === uuid);
        if (index !== -1) {
            this.selectedUuid = uuid;
            this.selectedTagsList = this.tagsLists[index];
            this.selectedTagsList.tags = _.orderBy(this.selectedTagsList.tags, 'key');
            this.selectedTagsList.displayName = this.tagsListsService.getDisplayName(this.selectedTagsList.displayName, this.customerLangs);
            this._updateFormatedLines(this.selectedTagsList.tags);
        }
    }

    onRemoveLine(data: TagListDto) {
        this.tagsListsService.deleteTagsList(data.uuid as string).subscribe({
            next: (result) => {
                if (result) {
                    const fIndex = _.findIndex(this.tagsLists, (tgList: TagListDto) => tgList.uuid === data.uuid);
                    this.tagsLists.splice(fIndex, 1);
                    this._restart();
                }
            },
            error:  (err) => {
                this.toastService.addToast('error', '',
                        this.translateService.instant('TAGS-LISTS.DELETE-LIST-ERROR'), 3000);
            }
        });
    }

    _updateFormatedLines(lines) {
        this.formatedDetailLines = this.tagsListsService.returnFormatedLines(lines, this.customerLangs);
    }

}
