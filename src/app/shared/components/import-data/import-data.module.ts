import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionsModule } from '../options/options.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PopUpModule } from '../pop-ups/pop-up.module';
import { PipeModule } from '../../pipes/pipe.module';
import { ImportDataComponent } from './import-data.component';
import { GestionDataImportComponent } from './components/gestion-data-import/gestion-data-import.component';
import { ValidateDataComponent } from './components/validate-data/validate-data.component';
import { LaunchImportDataComponent } from './components/launch-import-data/launch-import-data.component';
import { ImportDataService } from './services/import-data.service';
import { GestionDataListComponent } from './components/gestion-data-list/gestion-data-list.component';
import { DialogMessageComponent } from '../dialog-message/dialog-message.component';
import { ExportDataFileService } from './services/export-data-file.service';
import { ImportDataFileService } from './services/import-data-file.service';
import { ImportValidateDataService } from '../../services/import-data/validate-import/validate-objects.service';
import { ImportDataUtilsService } from '../../services/import-data/import-data-utils.service';
import { ImportDocumentsDataService } from '../../services/import-data/validate-import/valildate-documents.service';
import { ImportLinksDataService } from '../../services/import-data/validate-import/validata-links.service';
import { ImportDataDocService } from '../../services/import-data/import-data-doc.service';
import { ValidateImportService } from '../../services/import-data/validate-import/validate-import.service';
import { ImportListsDataService } from '../../services/import-data/validate-import/validate-lists.service';
import { ImportObjectsDataService } from '../../services/import-data/launch-import/import-objects.service';
import { LaunchImportService } from '../../services/import-data/launch-import/launch-import.service';
import { ImportContainerTreeService } from './services/import-container-tree.service';

@NgModule({
    declarations: [
        ImportDataComponent,
        GestionDataImportComponent,
        ValidateDataComponent,
        LaunchImportDataComponent,
        GestionDataListComponent,
    ],
    imports: [
        CommonModule,
        OptionsModule,
        IonicModule,
        FormsModule,
        TranslateModule,
        PopUpModule,
        PipeModule,
    ],
    exports: [
        ImportDataComponent,
    ],
    entryComponents: [
        GestionDataImportComponent,
        ValidateDataComponent,
        LaunchImportDataComponent,
        GestionDataListComponent,
    ],
    providers: [
        ImportDataService,
        ExportDataFileService,
        ImportDataFileService,
        ImportDataDocService,
        DialogMessageComponent,
        ValidateImportService,
        ImportValidateDataService,
        ImportDataUtilsService,
        ImportDocumentsDataService,
        ImportLinksDataService,
        ImportListsDataService,
        ImportObjectsDataService,
        LaunchImportService,
        ImportContainerTreeService,
    ]
})
export class ImportDataModule { }
