import { Component, Input, ViewChild, ElementRef, OnChanges, OnInit } from '@angular/core';
import { SnModelDto, WorkflowVariableModelDto, SmartModelDto, SysFile, SnViewDto } from '@algotech-ce/core';
import { DocxTemplaterService } from '../../services/docx-templater/docx-templater.service';
import * as _ from 'lodash';
import { SessionsService, DatasService } from '../../services';
import { flatMap, tap, catchError } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import { TemplatesService } from '../../services/templates/templates.service';
import { of, zip } from 'rxjs';
import { FilesService, FileAssetDto } from '@algotech-ce/business';
import { TypeVariable } from '../../modules/inspector/components/variables/dto/type-variable.dto';
import { VariablesServices } from '../../modules/inspector/components/variables/variables.service';
import { SnModelsService } from '../../services';

interface Tag extends WorkflowVariableModelDto {
    isPrimitve: boolean;
    eligibleTypes: TypeVariable[];
}
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'report-templates-editor',
    templateUrl: './report-templates-editor.component.html',
    styleUrls: ['./report-templates-editor.component.scss'],
})
export class ReportTemplatesEditorComponent implements OnChanges {

    @ViewChild('file') fileInput: ElementRef<HTMLElement>;
    @Input() snModelUuid: string;
    @Input() customerKey: string;
    @Input() host: string;
    inputValue;
    template: SnModelDto;
    enabled: boolean;
    fileId: string;

    key: string;
    canReadOptions = false;
    fileLoaded = false;
    fileUploaded = false;
    uploadError = false;
    errors = [];
    fileName: string;
    fileSize: string;
    tags: Tag[] = [];
    types: TypeVariable[] = [];
    smartModels: SmartModelDto[];
    _allTypes = [
        'primitive',
        'html',
        'sys:comment',
        'so:global',
        'so:',
        'sk:',
        'sys:file',
        'sys:location',
        'sys:schedule',
        'sys:user'
    ];

    constructor(
        private docxTemplaterService: DocxTemplaterService,
        private sessionsService: SessionsService,
        private variablesService: VariablesServices,
        private filesService: FilesService,
        private templatesService: TemplatesService,
        private snModels: SnModelsService,
        private datasService: DatasService) { }

    ngOnChanges() {
        this.smartModels = this.sessionsService.active.datas.read.smartModels;
        this.template = _.find(this.sessionsService.active.datas.write.snModels,
            (snModel: SnModelDto) => snModel.uuid === this.snModelUuid);

        const snView = this.getSnView();
        this.canReadOptions = snView && snView.options;

        this.enabled = (this.canReadOptions) ?
            snView.options.enabled : false;

        this.fileId = (this.canReadOptions) ?
            snView.options.fileId : '';

        this.key = (this.template) ? this.template.key : '';
        this.types = this.variablesService.typeBuilder(this.smartModels);

        this.tags = (this.canReadOptions) ? [{
            uuid: '',
            key: '',
            type: '',
            multiple: false,
            required: true,
            eligibleTypes: [],
            isPrimitve: false,
        }, ..._.map(snView.options.variables, (v) => ({
            uuid: '',
            key: v.key,
            type: v.type,
            multiple: v.multiple,
            required: v.required,
            isPrimitve: v.isPrimitve,
            eligibleTypes: (v.isPrimitve) ? this.variablesService.filterList(
                ['primitive', 'sys:file'], this.types) : this.variablesService.filterList(this._allTypes, this.types),
        }))] : [];

        if (this.fileId !== '') {
            const sysFile: SysFile = {
                documentID: '',
                versionID: this.fileId,
                name: '',
                ext: '',
                size: 0,
                dateUpdated: '',
                reason: '',
                user: '',
                tags: [],
                metadatas: [],
            };

            this.filesService.downloadDocument(sysFile, false).subscribe((doc: FileAssetDto) => {
                this.fileLoaded = true;
                this.fileName = (this.canReadOptions) ?
                    snView.options.fileName : '';
                this.fileSize = `${_.divide(doc.file.size, 1000)} ko`;
            });
        } else {
            this.fileName = '';
            this.fileSize = '';
        }
    }

    openFile() {
        this.fileInput.nativeElement.click();
    }

    toggleChange(value: boolean) {
        this.enabled = value;
        this.updateSnModel();
    }

    onChange(type, tag: Tag) {
        tag.type = type;
        this.updateSnModel();
    }

    inputFile(files) {
        this.inputValue = undefined;
        this.fileUploaded = false;
        this.uploadError = false;
        if (files.length > 0) {
            const file = files.item(0);
            const update = (this.fileId !== '');
            const uuid = (update) ? this.fileId : UUID.UUID();

            this.docxTemplaterService.getReportTags(file).pipe(
                catchError((errors) => {
                    this.errors = errors;
                    return of({});
                }),
                flatMap(tags => {
                    const upload$ = (Object.keys(tags).length > 0) ? this.templatesService.upload(update, uuid, file) : of(false);
                    return zip(upload$, of(tags));
                }),
                flatMap(([uploaded, tags]) => {
                    this.fileId = (uploaded) ? uuid : '';
                    this.fileName = (uploaded) ? file.name : '';
                    this.fileSize = (uploaded) ? `${_.divide(file.size, 1000)} ko` : '';
                    this.fileLoaded = uploaded;
                    this.enabled = this.enabled && uploaded;
                    this.fileUploaded = uploaded;
                    this.uploadError = !uploaded;
                    return (uploaded) ? of(tags) : of({});
                }),
                tap(tags => {
                    const tmp = _.cloneDeep(this.tags);
                    this.tags = [{
                        uuid: '',
                        key: '',
                        type: '',
                        multiple: false,
                        required: true,
                        icon: [],
                        eligibleTypes: [],
                        isPrimitve: false,
                    }, ..._.map(Object.keys(tags), key => {
                        const oldTag = _.find(tmp, (t) => t.key === key);
                        return {
                            uuid: '',
                            key,
                            icon: (oldTag) ? oldTag.icon : (Object.keys(tags[key]).length > 0) ? ['fad', 'cube'] : ['far', 'strikethrough'],
                            type: (oldTag) ? oldTag.type : (Object.keys(tags[key]).length > 0) ? '*' : 'string',
                            multiple: (oldTag) ? oldTag.multiple : false,
                            required: (oldTag) ? oldTag.required : false,
                            eligibleTypes: (Object.keys(tags[key]).length > 0) ? this.variablesService.filterList(
                                this._allTypes, this.types) : this.variablesService.filterList(
                                    ['primitive', 'sys:file'], this.types),
                            isPrimitve: (Object.keys(tags[key]).length === 0),
                        };
                    })];
                    if (this.tags.length > 1) {
                        this.updateSnModel();
                    }
                })
            ).subscribe();
        }
    }

    updateSnModel() {
        if (this.canReadOptions) {
            const snView = this.getSnView();
            snView.options.enabled = this.enabled;
            snView.options.fileId = this.fileId;
            snView.options.fileName = this.fileName;
            snView.options.variables = _.map(_.slice(this.tags, 1), (t: Tag) => ({
                uuid: '',
                key: t.key,
                type: t.type,
                multiple: t.multiple,
                required: t.required,
                isPrimitve: t.isPrimitve,
            }));
            this.datasService.notifySNModel(this.template, this.customerKey, this.host);

        }
    }

    private getSnView(): SnViewDto {
        return this.snModels.getActiveView(this.template) as SnViewDto;
    }

}
