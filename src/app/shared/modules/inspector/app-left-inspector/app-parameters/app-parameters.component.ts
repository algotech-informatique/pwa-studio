import { ListItem } from './../../dto/list-item.dto';
import { SnAppDto, SnModelDto, LangDto } from '@algotech-ce/core';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MessageService } from '../../../../services';
import * as _ from 'lodash';

@Component({
    selector: 'app-parameters',
    templateUrl: './app-parameters.component.html',
    styleUrls: ['./app-parameters.component.scss'],
})
export class AppParametersComponent {

    @ViewChild('content') content: ElementRef;
    @Input() snApp: SnAppDto;
    @Input() snModel: SnModelDto;
    @Input() securityGroups: string[];
    @Output() changed = new EventEmitter();
    @Output() changedPageName = new EventEmitter();

    keyDuplicate = false;
    securityList: ListItem[];

    constructor(
        private messageService: MessageService,
    ) { }

    onChanged() {
        this.changed.emit();
    }

    onKeyChanged(value: string) {
        this.snModel.key = value;
        this.changed.emit();
    }

    onDisplayTranslateChanged(data: LangDto[]) {
        this.snModel.displayName = _.cloneDeep(data);
        this.changedPageName.emit();
    }

    onDeviceWidthChanged(width: number) {
        this.snApp.pages.forEach((page) => {
            if (page.pageWidth < width || page.pageWidth === this.snApp.pageWidth) {
                page.pageWidth = width;
            }
        });
        this.snApp.pageWidth = width;
        this.changed.emit();
    }

    onDeviceHeightChanged(height: number) {
        this.snApp.pages.forEach((page) => {
            if (page.pageHeight < height || page.pageHeight === this.snApp.pageHeight) {
                page.pageHeight = height;
            }
        });
        this.snApp.pageHeight = height;
        this.changed.emit();
    }

    onHiddenBarChanged(hiddenBar: boolean) {
        if (this.snApp.custom) {
            this.snApp.custom.hiddenBar = hiddenBar;
        } else {
            this.snApp.custom = {
                hiddenBar
            };
        }
        this.changed.emit();
    }

    onIconChanged(icon: string) {
        this.snApp.icon = icon;
        this.changed.emit();
    }

    onscroll() {
        this.messageService.send('inspector-scroll', this.content.nativeElement.scrollTop);
    }

}
