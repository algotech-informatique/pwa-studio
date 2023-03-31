import { LangDto } from '@algotech-ce/core';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input,
    OnChanges, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { OptionsInputComponent } from '../../../options/components/options-input/options-input.component';
import * as _ from 'lodash';
import { TagsListsDetailService } from '../../services/tags-lists-detail.service';
import { TagsListFormatedLine } from '../../dto/tags-list-formated.dto';
import { DialogMessageService, ToastService } from '../../../../services';
import { TranslateService } from '@ngx-translate/core';
import { AlertMessageDto } from '../../../../dtos';

@Component({
    selector: 'tags-lists-detail-line',
    templateUrl: './tags-lists-detail-line.component.html',
    styleUrls: ['./tags-lists-detail-line.component.scss'],
})
export class TagsListsDetailLineComponent implements OnChanges {

    @ViewChildren('mainInput', {read: OptionsInputComponent}) mainInput: QueryList<OptionsInputComponent>;

    @Input() formatedDetailLines: TagsListFormatedLine[] = [];
    @Input() customerLangs: LangDto[] = [];
    @Input() mainLang = 'fr-FR';
    @Input() nextLangs: string[] = [];

    @Output() activeAllLangs = new EventEmitter();
    @Output() removeLines = new EventEmitter<TagsListFormatedLine[]>();
    @Output() updateLine = new EventEmitter<{data: TagsListFormatedLine; updateLine: boolean}>();
    @Output() updateLines = new EventEmitter();

    showAllLangs = false;
    removeItems: TagsListFormatedLine[] = [];
    activeLine: TagsListFormatedLine;
    activeButton = true;

    constructor(
        private tagsListDetailSercice: TagsListsDetailService,
        private toastService: ToastService,
        private translateService: TranslateService,
        private dialogMessageService: DialogMessageService,
        private ref: ChangeDetectorRef,
    ) { }


    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Escape' && this.formatedDetailLines.length !== 0 && this.formatedDetailLines[0].key === 'new-line') {
            this.formatedDetailLines.splice(0, 1);
            this.activeButton = true;
        }
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUpboardEvent(event: KeyboardEvent) {

        if (event.key === 'Enter' && this.showAllLangs) {
            if (this.tagsListDetailSercice.updateKey(this.activeLine, this.formatedDetailLines)) {
                this.updateLine.emit({data: this.activeLine, updateLine: true });
            } else {
                event.preventDefault();
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.activeButton = true;
    }

    onSelectedline(line) {
        if (this.formatedDetailLines.length !== 0
                && this.formatedDetailLines[0].key === 'new-line'
                && line.key !== 'new-line') {
            this.activeButton = true;
            this.formatedDetailLines.splice(0, 1);
        }
        this.activeLine = line;
    }

    onAddLine() {
        this.activeButton = false;
        this.activeLine = this.tagsListDetailSercice.createEmptyFormatedLine(this.customerLangs);
        this.formatedDetailLines.unshift(this.activeLine);
        this.ref.detectChanges();
        if (this.mainInput?.length > 0) {
            this.mainInput.first.focus();
        }
    }

    onActiveAllLangs() {
        this.showAllLangs = !this.showAllLangs;
        this.activeAllLangs.emit(this.showAllLangs);
    }

    onChecked(line: TagsListFormatedLine) {
        const index = _.findIndex(this.formatedDetailLines, (fline: TagsListFormatedLine) => fline.key === line.key);
        if (index !== -1) {
            this.formatedDetailLines[index].checked = !this.formatedDetailLines[index].checked;
        }
        this.removeItems = _.reduce(this.formatedDetailLines, (result, format: TagsListFormatedLine) => {
            if (format.checked) {
                result.push(format);
            }
            return result;
        }, []);
    }

    onColorChanged(color) {
        this.activeLine.color = color;
        if (this.activeLine.key !== 'new-line') {
            this.updateLine.emit({data: this.activeLine, updateLine: true});
        }
    }

    onRemoveLine() {
        if (this.removeItems.length === 0) {
            return;
        }

        const alertMessage: AlertMessageDto = {
            confirm: this.translateService.instant('DIALOGBOX.DELETE'),
            cancel: this.translateService.instant('DIALOGBOX.CANCEL'),
            message: this.translateService.instant('SETTINGS.TAGS.TAG_LIST_DELETE_CONFIRM'),
            title: this.translateService.instant('SETTINGS.TAGS.TAG_LIST_DELETE'),
            type: 'question',
            messageButton: true,
        };
        this.dialogMessageService.getMessageConfirm(alertMessage).pipe().subscribe((result: boolean) => {
            if (result) {
                this.formatedDetailLines = _.reduce(this.formatedDetailLines, (lines, line: TagsListFormatedLine) => {
                    const findIndex = _.findIndex(this.removeItems, (item: TagsListFormatedLine) => item.key === line.key);
                    if (findIndex === -1) {
                        lines.push(line);
                    }
                    return lines;
                }, []);
                this.removeLines.emit(this.removeItems);
            }
            this.removeItems = [];
        });
    }

    onUpdateText(data: string, lang: string) {

        if (this.activeLine.defaultLang.lang === lang) {
            this.activeLine.defaultLang.value = data;
            if (this.tagsListDetailSercice.updateKey(this.activeLine, this.formatedDetailLines)) {
                this.updateLine.emit({data: this.activeLine, updateLine: !this.showAllLangs});
                this.activeButton = true;
            } else {
                this.toastService.addToast('error', '',
                    this.translateService.instant('TAGS-LISTS.UPDATE-ITEMS-LIST-KO'), 3000);
                if (this.mainInput?.length > 0) {
                    this.mainInput.first.focus();
                }
            }
        } else {
            if (this.activeLine.nextLangs.length !== 0){
                const index = _.findIndex(this.activeLine.nextLangs, (lng: LangDto) => lng.lang === lang);
                if (index !== -1) {
                    this.activeLine.nextLangs[index].value = data;
                }

                this.updateLine.emit({data: this.activeLine,
                    updateLine: !this.showAllLangs || (index + 1 ) === this.activeLine.nextLangs.length});
                this.activeButton = true;
            }
        }
    }
}
