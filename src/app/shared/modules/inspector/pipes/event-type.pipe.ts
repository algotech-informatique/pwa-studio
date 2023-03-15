import { TranslateService } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'eventType' })
export class EventTypePipe implements PipeTransform {

    constructor(
        private translateService: TranslateService,
    ) { }

    transform(type: string): string {
        // to translate
        switch (type) {
            case 'workflow':
                return this.translateService.instant('SN-APP.WIDGET.EVENT.TYPE.WORKFLOW');
            case 'call::onLoad':
                return this.translateService.instant('SN-APP.WIDGET.EVENT.TYPE.CALL::ONLOAD');
            case 'smartflow':
                return this.translateService.instant('SN-APP.WIDGET.EVENT.TYPE.SMARTFLOW');
            case 'page':
                return this.translateService.instant('SN-APP.WIDGET.EVENT.TYPE.PAGE');
            case 'url':
                return this.translateService.instant('SN-APP.WIDGET.EVENT.TYPE.URL');
            case 'smartobjects':
                return this.translateService.instant('SN-APP.WIDGET.EVENT.TYPE.SMARTOBJECTS');
            case 'page::nav':
                return this.translateService.instant('SN-APP.WIDGET.EVENT.TYPE.PAGE::NAV');
            default:
                return type;
        }
    }

}
