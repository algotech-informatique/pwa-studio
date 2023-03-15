import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ImportContainersDataService } from './validate-import/validate-containers.service';
import { ImportDocumentsDataService } from './validate-import/valildate-documents.service';
import { ImportLinksDataService } from './validate-import/validata-links.service';
import { ImportValidateDataService } from './validate-import/validate-objects.service';
import { ImportListsDataService } from './validate-import/validate-lists.service';
import { ValidateImportService } from './validate-import/validate-import.service';

import { ImportDataUtilsService } from './import-data-utils.service';

import { ImportObjectsDataService } from './launch-import/import-objects.service';
import { LaunchImportService } from './launch-import/launch-import.service';
import { ImportContainersService } from './launch-import/import-containers.service';
import { ImportListsService } from './launch-import/import-lists.service';
import { ImportRastersService } from './launch-import/import-rasters.service';
import { ImportDocumentsService } from './launch-import/import-documents.service';
import { ImportLinksService } from './launch-import/import-links.service';
import { ImportDataDocService } from './import-data-doc.service';

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        TranslateModule,
    ],
    exports: [
    ],
    entryComponents: [
    ],
    providers: [
        ImportMainDataModule,
        ImportObjectsDataService,
        ImportLinksDataService,
        ImportListsDataService,
        ImportContainersDataService,
        ImportDocumentsDataService,
        ImportValidateDataService,
        ImportDataUtilsService,
        LaunchImportService,
        ValidateImportService,
        ImportContainersService,
        ImportListsService,
        ImportRastersService,
        ImportDocumentsService,
        ImportLinksService,
        ImportDataDocService,
    ]
})
export class ImportMainDataModule { }
