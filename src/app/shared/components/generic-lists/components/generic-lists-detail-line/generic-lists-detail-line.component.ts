import { LangDto } from '@algotech-ce/core';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges,
    Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { AlertMessageDto } from '../../../../dtos';
import { DialogMessageService } from '../../../../services';
import { OptionsInputComponent } from '../../../options/components/options-input/options-input.component';
import { GenericFormatedLine } from '../../dto/generic-formated-line.dto';
import { GenericListsDetailService } from '../services/generic-lists.detail.service';
import { GenericListService } from '../services/generic-lists.service';

@Component({
    selector: 'generic-lists-detail-line',
    templateUrl: './generic-lists-detail-line.component.html',
    styleUrls: ['./generic-lists-detail-line.component.scss'],
})
export class GenericListsDetailLineComponent implements OnChanges {

    @ViewChildren('mainInput', {read: OptionsInputComponent}) mainInput: QueryList<OptionsInputComponent>;

    @Input() formatedDetailLines: GenericFormatedLine[] = [];
    @Input() customerLangs: LangDto[] = [];
    @Input() mainLang = 'fr-FR';
    @Input() nextLangs: string[] = [];

    @Output() activeAllLangs = new EventEmitter();
    @Output() removeLines = new EventEmitter<GenericFormatedLine[]>();
    @Output() updateLine = new EventEmitter<{data: GenericFormatedLine; updateLine: boolean}>();
    @Output() updateLines = new EventEmitter<GenericFormatedLine[]>();

    showAllLangs = false;
    removeItems: GenericFormatedLine[] = [];
    activeLine: GenericFormatedLine;
    activeButton = true;

    constructor(
        private gListsDetailService: GenericListsDetailService,
        private gListService: GenericListService,
        private translateService: TranslateService,
        private dialogMessageService: DialogMessageService,
        private ref: ChangeDetectorRef,
    ) { }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Escape' && this.formatedDetailLines.length !== 0 && this.formatedDetailLines[0].key === 'new-line') {
            this.activeButton = true;
            this.formatedDetailLines.splice(0, 1);
        }
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUpboardEvent(event: KeyboardEvent) {

        if (event.altKey) {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                this._moveUpDown( (event.key === 'ArrowUp') ? true : false );
            }
        }

        if (event.key === 'Enter' && this.showAllLangs) {
            if (this.gListsDetailService.updateKey(this.activeLine, this.formatedDetailLines)) {
                this.updateLine.emit({data: this.activeLine, updateLine: true });
            } else {
                event.preventDefault();
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.activeButton = true;
    }

    _moveUpDown(up: boolean) {
        let index = -1;
        if (up && (this.activeLine.index > 0)) {
            index = this.activeLine.index - 1;
        }
        if (!up && (this.activeLine.index < this.formatedDetailLines.length - 1)) {
            index = this.activeLine.index + 1;
        }
        if (index !== -1) {
            const prevLine = this._updatePreviousLine(index, up);
            this.activeLine.index = index;
            this.updateLines.emit([this.activeLine, prevLine]);
        }
    }

    _updatePreviousLine(index, up: boolean): GenericFormatedLine {
        const ndx = _.findIndex(this.formatedDetailLines, (ln: GenericFormatedLine) => ln.index === index);
        if (ndx === -1) {
            return null;
        }
        this.formatedDetailLines[ndx].index = (up) ? index + 1 : index - 1;
        return this.formatedDetailLines[ndx];
    }

    onSelectedline(line: GenericFormatedLine) {
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
        this.activeLine = this.gListsDetailService.createEmptyFormatedLine(this.customerLangs);
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

    onChecked(line: GenericFormatedLine) {
        const index = _.findIndex(this.formatedDetailLines, (fline: GenericFormatedLine) => fline.key === line.key);
        if (index !== -1) {
            this.formatedDetailLines[index].checked = !this.formatedDetailLines[index].checked;
        }
        this.removeItems = _.reduce(this.formatedDetailLines, (result, format: GenericFormatedLine) => {
            if (format.checked) {
                result.push(format);
            }
            return result;
        }, []);
    }

    onRemoveLine() {
        if (this.removeItems.length === 0) {
            return;
        }

        const alertMessage: AlertMessageDto = {
            confirm: this.translateService.instant('DIALOGBOX.DELETE'),
            cancel: this.translateService.instant('DIALOGBOX.CANCEL'),
            message: this.translateService.instant('SETTINGS.GLIST.GLIST_LIST_DELETE_CONFIRM'),
            title: this.translateService.instant('SETTINGS.GLIST.GLIST_LIST_DELETE'),
            type: 'question',
            messageButton: true,
        };
        this.dialogMessageService.getMessageConfirm(alertMessage).pipe().subscribe((result: boolean) => {
            if (result) {
                this.formatedDetailLines = _.reduce(this.formatedDetailLines, (lines, line: GenericFormatedLine) => {
                    const findIndex = _.findIndex(this.removeItems, (item: GenericFormatedLine) => item.key === line.key);
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
            if (this.gListsDetailService.updateKey(this.activeLine, this.formatedDetailLines)) {
                this.updateLine.emit({data: this.activeLine, updateLine: !this.showAllLangs });
                this.activeButton = true;
            } else {
                this.gListService.sendErrorMessage('GENERIC-LIST.UPDATE-ITEMS-LIST-KO');
                if (this.mainInput?.length > 0) {
                    this.mainInput.first.focus();
                }
            }
        } else {
            if (this.activeLine.nextLangs.length !== 0) {
                const index = _.findIndex(this.activeLine.nextLangs, (lng: LangDto) => lng.lang === lang);
                if (index !== -1) {
                    this.activeLine.nextLangs[index].value = data;
                }
                this.updateLine.emit({data: this.activeLine,
                    updateLine: !this.showAllLangs || (index + 1) === this.activeLine.nextLangs.length });
                this.activeButton = true;
            }
        }
    }

}
