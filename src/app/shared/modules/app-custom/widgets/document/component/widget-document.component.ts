import { SnAppDto, SnPageEventDto, SnPageWidgetDto, SysFile } from '@algotech-ce/core';
import { APP_BASE_HREF } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { WidgetComponentInterface } from '../../../../app/interfaces';

@Component({
    selector: 'widget-document',
    templateUrl: './widget-document.component.html',
    styleUrls: ['widget-document.component.scss'],
})
export class WidgetDocumentComponent implements WidgetComponentInterface {

    snApp: SnAppDto;
    widget: SnPageWidgetDto;
    event: SnPageEventDto;
    files = [];

    constructor(
        @Inject(APP_BASE_HREF) private baseHref: string,
    ) {}

    srcToFile(src, fileName, mimeType){
        return from(fetch(src)).pipe(
            mergeMap((res) => from(res.arrayBuffer())),
            map((buf) => new File([buf], fileName, {type:mimeType}))
        );
    }

    loadFiles() {
        this.srcToFile(this.baseHref + 'assets/images/picture.png', 'picture.png', 'image/png').subscribe((file) => {
            this.files = [{
                dateUpdated: null,
                documentID: '38f140c0-de4c-438f-a624-b938a3b88bcc',
                versionID: 'ae11dc35-6ea1-4864-bb61-bcb40cf5d05b',
                ext: 'pdf',
                metadatas: [],
                name: 'notice.pdf',
                reason: '',
                size: 852,
                tags: [],
                user: '',
            }, {
                dateUpdated: null,
                documentID: 'ece12ca5-48a8-4f8f-a842-6a08505ab3bf',
                versionID: '065d0910-df61-4c7f-8dec-f23e5ca339ca',
                ext: 'docx',
                metadatas: [],
                name: 'report.docx',
                reason: '',
                size: 536,
                tags: [],
                user: '',
            }, {
                dateUpdated: null,
                documentID: 'dd046748-688c-499c-b44a-63c6a684bb3d',
                versionID: 'dfd92c96-240f-4f20-b47e-4a86d338e9ce',
                ext: 'txt',
                metadatas: [],
                name: 'install.txt',
                reason: '',
                size: 58,
                tags: [],
                user: '',
            }, {
                dateUpdated: null,
                documentID: '75902351-bd40-4832-985b-4a8bfbbf7c4d',
                versionID: '56531167-ee4b-4103-912a-05cd270cdab2',
                ext: 'jpg',
                metadatas: [],
                name: 'site.jpg',
                reason: '',
                size: 412,
                tags: [],
                user: '',
                file
            }, {
                dateUpdated: null,
                documentID: '2cdaaac9-81d8-4036-8b9b-df2527dc0c46',
                versionID: '906512f5-0218-4aee-9980-da89834bf132',
                ext: 'png',
                metadatas: [],
                name: 'location.png',
                reason: '',
                size: 521,
                tags: [],
                user: '',
                file
            }, {
                dateUpdated: null,
                documentID: '04549130-87f6-4536-803c-f3c3ad595861',
                versionID: 'd6192a57-6ec6-4119-ac7d-7fdd2a8511c0',
                ext: 'png',
                metadatas: [],
                name: 'team.png',
                reason: '',
                size: 384,
                tags: [],
                user: '',
                file
            }];
        });
    }

    initialize() {
        this.loadFiles();
        this.event = this.widget.events.find((ev) => ev.eventKey === 'onActionDocument');
    }
}
