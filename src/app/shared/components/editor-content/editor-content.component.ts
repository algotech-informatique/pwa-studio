import { Component, Input, ChangeDetectorRef, OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { CheckOptionsDto, CheckEvent, SnSearchDto } from '../../dtos';
import { ConfigService, MessageService, SessionsService } from '../../services';

@Component({
    selector: 'editor-content',
    templateUrl: './editor-content.component.html',
    styleUrls: ['./editor-content.component.scss']
})
export class EditorContentComponent implements OnDestroy, OnChanges {

    @Input()
    type: string;

    @Input()
    refUuid: string;

    @Input()
    customerKey: string;

    @Input()
    host: string;

    @Input()
    search: SnSearchDto;

    loaded = true;
    subscription: Subscription;
    openDebug: CheckEvent[] = ['onCheck', 'onDesign', 'onPublish'];
    checkOnDesign: boolean = true;

    constructor(
        public sessionsService: SessionsService,
        private ref: ChangeDetectorRef,
        private messageService: MessageService,
        private configService: ConfigService) {
        // optimization

        this.subscription = this.messageService.get('loaded').subscribe((data) => {
            if (data.host === this.host && data.customerKey === this.customerKey) {
                this.loaded = false;
                this.ref.detectChanges();

                this.loaded = true;
            }
        });
    }

    ngOnChanges() {
        if (this.configService.config?.preferences) {
            this.openDebug = this.configService.config.preferences.checkOptions.openDebug;
            this.checkOnDesign = this.configService.config.preferences.checkOptions.checkOnDesign;
        }
    }

    onSettingUpdated(checkOptions: CheckOptionsDto) {
        this.messageService.send('update.checkOptions', checkOptions);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
