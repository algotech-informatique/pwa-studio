import { Component, AfterViewInit, ViewChild, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { ObjectTreeLineDto } from '../../dtos';
import { SessionsService, MessageService, DatasService } from '../../services';

@Component({
    selector: 'app-object-tree-input',
    styleUrls: ['./object-tree-input.component.scss'],
    templateUrl: './object-tree-input.component.html',
})
export class ObjectTreeInputComponent implements AfterViewInit {

    @ViewChild('inputName') input: ElementRef;
    @Input() line: ObjectTreeLineDto;
    error = false;

    constructor(
        private messageService: MessageService,
        private sessionsService: SessionsService,
        private datasService: DatasService,
        private ref: ChangeDetectorRef,
    ) { }

    ngAfterViewInit(): void {
        if (this.input) {
            this.input.nativeElement.focus();
            this.input.nativeElement.select();
        }
    }

    cancel($event) {
        $event.stopPropagation();
        this.error = false;
        // escap
        if ($event.keyCode === 27) {
            this.line.creation = null;
            this.line.renaming = false;

            this.sessionsService.refreshEnv(this.line.host, this.line.customerKey);
            this.ref.detectChanges();
        }
    }

    saveName($event) {
        $event.stopPropagation();
        this.error = false;
        const updatedName = this.input.nativeElement.value;

        if (updatedName && updatedName.length > 0) {

            this.line.name = updatedName;

            if (this.line.creation) {

                if (!this.datasService.notifyCreateEnv(this.line, this.line.creation)) {
                    this.error = true;
                    this.input.nativeElement.focus();
                    return;
                }

                this.line.creation = null;

                this.sessionsService.refreshEnv(this.line.host, this.line.customerKey);
                this.ref.detectChanges();

                // selection
                const env = this.sessionsService.getEnvByUUid(this.line.host, this.line.customerKey, this.line.refUuid);
                if (!env) {
                    return;
                }
                env.active = true;
                if (env.selectable) {
                    this.sessionsService.selectEnv(env);
                    this.messageService.send('explorer-tree-select', env);
                }

            } else if (this.line.renaming) {

                if (!this.datasService.notifyRenameEnv(this.line)) {
                    this.error = true;
                    this.input.nativeElement.focus();
                    return;
                }

                this.line.renaming = false;

                this.sessionsService.refreshEnv(this.line.host, this.line.customerKey);
                this.ref.detectChanges();

                const env = this.sessionsService.getEnvByUUid(this.line.host, this.line.customerKey, this.line.refUuid);
                if (!env) {
                    return;
                }
                env.active = true;
            }

        } else if (this.line.creation) {
            this.sessionsService.remove(this.line, this.line.creation.parent);
        } else if (this.line.renaming) {
            this.line.renaming = false;
        }
    }

}
