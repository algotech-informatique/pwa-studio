import { KeyFormaterService, TagsService } from '@algotech-ce/angular';
import { LangDto, TagDto, TagListDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import { DialogMessageService, ToastService } from '../../../services';
import * as _ from 'lodash';
import { TagsListFormatedLine } from '../dto/tags-list-formated.dto';
import { UUID } from 'angular2-uuid';
import { TagsListsDetailService } from './tags-lists-detail.service';
import { AlertMessageDto } from '../../../dtos';

@Injectable()
export class TagsListsService {

    constructor(
        private tagsService: TagsService,
        private keyFormater: KeyFormaterService,
        private translateService: TranslateService,
        private toastService: ToastService,
        private tagsListDetailService: TagsListsDetailService,
        private messageService: DialogMessageService,
    ) { }

    getTagsList() {
        return this.tagsService.list().pipe(
            map((tgList: TagListDto[]) => _.orderBy(tgList, 'key')),
        );
    }

    createNewTagsList(customerLangs: LangDto[]) {
        const newTagList: TagListDto = {
            key: 'new-tags-list',
            displayName: _.map(customerLangs, (lang: LangDto) => {
                const lng: LangDto = {
                    lang: lang.lang,
                    value: '',
                };
                return lng;
            }),
            modelKeyApplication: [],
            applyToDocuments: false,
            applyToImages: false,
            tags: []
        };
        return newTagList;
    }

    createTagsList(tagsList: TagListDto): Observable<TagListDto> {

        const key: string = this.keyFormater.format(this._defaultLangValue(tagsList.displayName).toLowerCase());
        tagsList.key = key;
        tagsList.uuid = UUID.UUID();

        if (key === '') {
            this.toastService.addToast('error', '', this.translateService.instant('TAGS-LISTS.CREATE-NEW-LIST-KO-KEY'), 2000);
            return of(null);
        }

        return this.tagsService.post(tagsList).pipe(
            catchError(() => {
                this.toastService.addToast('error', '',
                    this.translateService.instant('TAGS-LISTS.CREATE-NEW-LIST-KO', {key: tagsList.key}), 2000);
                return of(null);
            }),
            map((res: TagListDto ) => {
                this.toastService.addToast('success', '', this.translateService.instant('TAGS-LISTS.CREATE-NEW-LIST-OK'), 1500);
                return res;
            }),
        );
    }

    _defaultLangValue(langs: LangDto[]) {
        const index = _.findIndex(langs, (lang: LangDto) => lang.lang === this.translateService.getDefaultLang());
        return (index !== -1) ? langs[index].value : '';
    }

    updateTagsList(tagsList: TagListDto): Observable<TagListDto> {
        if (!tagsList) {
            return of(null);
        }
        return this.tagsService.put(tagsList);
    }

    deleteTagsList(uuid: string): Observable<any> {

        const alertMessage: AlertMessageDto = {
            confirm: this.translateService.instant('DIALOGBOX.DELETE'),
            cancel: this.translateService.instant('DIALOGBOX.CANCEL'),
            message: this.translateService.instant('SETTINGS.TAGS.TAG_DELETE_CONFIRM'),
            title: this.translateService.instant('SETTINGS.TAGS.TAG_DELETE'),
            type: 'question',
            messageButton: true,
        };

        return this.messageService.getMessageConfirm(alertMessage).pipe(
            flatMap((result: boolean) =>
                (result) ? this.tagsService.delete(uuid) : of(null),
            )
        );
    }

    returnFormatedLines(lines: TagDto[], customerLangs: LangDto[]): TagsListFormatedLine[] {

        return _.map(lines, (line: TagDto) =>
            this.tagsListDetailService.createFormatedLine(line, customerLangs));
    }

    getDisplayName(linelangs: LangDto[], customerLangs: LangDto[]): LangDto[] {

        return _.reduce(customerLangs, (result, csLang: LangDto) => {
            const index = _.findIndex(linelangs, (llang: LangDto) => llang.lang === csLang.lang);
            if (index !== -1) {
                result.push(linelangs[index]);
            } else {
                result.push({
                    lang: csLang.lang,
                    value: '',
                });
            }
            return result;
        }, []);
    }

    getLangs(defaultlang: string, langs: LangDto[]): string[] {

        return _.reduce(langs, (result, lng: LangDto) => {
            if (lng.lang !== defaultlang) {
                result.push(lng.lang);
            }
            return result;
        }, []);
    }
}
