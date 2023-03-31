import { PairDto, SmartLinkDto, WorkflowVariableModelDto } from '@algotech-ce/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListItem } from '../../../../modules/inspector/dto/list-item.dto';
import { OptionsElementDto } from '../../../../dtos/options-element.dto';

@Component({
    selector: 'smart-link-creation',
    templateUrl: './smart-link-creation.component.html',
    styleUrls: ['./smart-link-creation.component.scss'],
})
export class SmartLinkCreationComponent {

    @Input() variables: WorkflowVariableModelDto[] = [];
    @Input() linkInfo: SmartLinkDto;
    @Input() backupList: PairDto[];
    @Input() radioList: ListItem[];

    @Output() updateLinkInfo = new EventEmitter<SmartLinkDto>();

    constructor(
    ) { }

    onUpdateSources(sources: PairDto[]) {
        this.linkInfo.sources = sources;
        this.updateLinkInfo.emit(this.linkInfo);
    }

    onUpdateASAPEND(value: string) {
        this.linkInfo.backupType = (value === 'ASAP') ? 'ASAP' : 'END';
        this.updateLinkInfo.emit(this.linkInfo);
    }

    onUpdateDuration(value: OptionsElementDto) {
        this.linkInfo.duration = value.key;
        this.updateLinkInfo.emit(this.linkInfo);
    }

    onUpdateUnique(value: boolean) {
        this.linkInfo.unique = value;
        this.updateLinkInfo.emit(this.linkInfo);
    }

    onUpdateAuthentication(value: string) {
        this.linkInfo.authentication = (value === 'automatic') ? 'automatic' : 'manual';
        this.updateLinkInfo.emit(this.linkInfo);
    }

    onUpdatePassword(value: string) {
        if (this.linkInfo.automaticLogin) {
            this.linkInfo.automaticLogin.password = value;
            this.updateLinkInfo.emit(this.linkInfo);
        }
    }

    onUpdateUser(value: string) {
        if (this.linkInfo.automaticLogin) {
            this.linkInfo.automaticLogin.user = value;
            this.updateLinkInfo.emit(this.linkInfo);
        }
    }
}
