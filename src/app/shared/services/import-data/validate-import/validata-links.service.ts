import { Injectable } from '@angular/core';
import { ImportDataFileDto, ImportDataModel } from '../../../components/import-data/dto/import-data-file.dto';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { ImportDataUtilsService } from '../import-data-utils.service';
import { ValidateData, ValidateDataFileDto, ValidateDataModel } from '../../../components/import-data/dto/validate-data-file.dto';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ImportLinksDataService {

    constructor(
        private translateService: TranslateService,
        private importUtilsService: ImportDataUtilsService,
    ) {}

    validateLinks(data: ImportDataFileDto, inputLog: string): Observable<ValidateDataFileDto> {

        this.importUtilsService.sendMessageService(inputLog,
            this.translateService.instant('IMPORT-DATA.VALIDATE-LINK'), false);

        return this._validateModels(data, inputLog).pipe(
            map((listModel: ValidateDataModel[]) => {
                const valide = !_.some(listModel, (imp: ValidateDataModel) => imp.valide === false);
                const validate: ValidateDataFileDto = {
                    type: 'link',
                    valide: valide,
                    importData: listModel,
                };
                return validate;
            })
        );
    }

    _validateModels(data: ImportDataFileDto, inputLog: string): Observable<ValidateDataModel[]> {
        const obj$: Observable<ValidateDataModel>[] = _.map(data.importData, (dt: ImportDataModel) => {

            if (dt.data.length === 0) {
                return of({valide: true, model: dt.model, data: []});
            }

            const links = this.importUtilsService.findLinks(dt.data[0]);
            return  (links.length === 0) ?
                of({ model: dt.model, data: [], valide: true}) :
                this._validateDataModel(links, data, dt, inputLog, 'IMPORT-DATA.VALIDATE-LINK-NO-EXTERNAL');
        });
        return this.importUtilsService.sequence(obj$);
    }

    _validateDataModel(links, data: ImportDataFileDto, dt, inputLog, message): Observable<ValidateDataModel> {
        return this._validateDataLinks(links, data, dt, inputLog, message).pipe(
            map((list: ValidateData[]) => {
                const valData: ValidateData[] = _.union.apply(null, list);
                const valide = !_.some(valData, (ds: ValidateData) => ds.valide === false);
                return { model: dt.model, data: list, valide};
            })
        );
    }

    _validateDataLinks(links, data: ImportDataFileDto, dt: ImportDataModel, inputLog: string, message: string): Observable<ValidateData[]> {
        const obj$: Observable<ValidateData[]>[] = _.map(links, (link) =>
            this.importUtilsService.validateDataLinks(link, data, dt, inputLog, message),
        );
        return this.importUtilsService.sequence(obj$);
    }
}
