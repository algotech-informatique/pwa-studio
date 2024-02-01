import { TranslateLangDtoService } from '@algotech-ce/angular';
import { GridConfigurationDto, SoUtilsService } from '@algotech-ce/business';
import { PairDto, SmartModelDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IconsService } from '../../../services';
import { Model } from '../interfaces/model.interface';
import { Row } from '../interfaces/row.interface';


@Injectable()
export class DataBaseImportService {


  constructor(
    private soUtils: SoUtilsService,
    private translate: TranslateService,
    private translateService: TranslateLangDtoService,
    private iconsService: IconsService) { }


  setConfigueration(mappings: PairDto[], smartModel): GridConfigurationDto {
    return {
      id: `Import_mapping_${smartModel.key}`,
      search: false,
      rowHeight: 40,
      headerEditable: false,
      reorder: false,
      hasActions: false,
      icons: this.iconsService.loadListIcons(),
      columns: [
        {
          key: 'property',
          name: this.translate.instant('INSPECTOR.DATABASE.PROPERTIES'),
          filter: false,
          multiple: false,
          sort: false,
          resize: true,
          sticky: 'none',
          type: 'string',
          width: 225,
          custom: {
            editable: false,
            multiple: false,
            items: []
          }

        },
        {
          key: 'column',
          name: this.translate.instant('INSPECTOR.DATABASE.COLUMN'),
          filter: false,
          multiple: false,
          sort: false,
          resize: true,
          sticky: 'none',
          type: 'string',
          width: 150,
          custom: {
            editable: mappings.length !== 0,
            multiple: false,
            items: mappings.map(m => ({ key: m.key, value: m.key }))
          }
        },
        {
          key: 'format',
          name: this.translate.instant('INSPECTOR.DATABASE.COLUMN.FORMAT'),
          filter: false,
          multiple: false,
          sort: false,
          resize: true,
          sticky: 'none',
          type: 'string',
          width: 150,
          custom: {
            editable: false,
            multiple: false,
          }
        }
      ]
    };
  }

  getData(mappings: PairDto[], smartModel): Row[] {
    return smartModel.properties
    .filter((prop) => !prop.keyType.startsWith('so:') && !prop.keyType.startsWith('sys:'))
    .map(prop => {
      const mapping = mappings.find(m => m.value && m.value.key === prop.key);
      const display = this.translateService.transform(prop.displayName, undefined, false);

      let format = '';
      switch (this.translate.currentLang) {
        case 'fr-FR':
        case 'es-ES': {
           format = prop.keyType === 'datetime' ? 'DD/MM/YYYY hh:mm' :
            prop.keyType === 'date' ? 'DD/MM/YYYY' :
              prop.keyType === 'time' ? 'hh:mm' : '';
        }
        break;
        default: {
            format = prop.keyType === 'datetime' ? 'MM/DD/YYYY h:mm a' :
             prop.keyType === 'date' ? 'MM/DD/YYYY' :
               prop.keyType === 'time' ? 'h:mm a' : '';
         }
         break;
      }

      return {
        id: '',
        properties: [{
          key: 'property',
          value: display ? display : prop.key,
          realValue : prop.key,
          editable: false
        }, {
          key: 'column',
          value: mapping ? mapping.key : '',
          editable: mappings.length !== 0,
        },
        {
          key: 'format',
          value: format,
          editable: (mappings.length !== 0 && ['datetime', 'date', 'time'].indexOf(prop.keyType) !== -1),
        }],
      } as Row;
    });
  }

  getPopertyMapping(file: File, model: Model, delimiter = ',', encoding = 'utf8'): Observable<{ configueration: GridConfigurationDto; data: Row[] }> {
    if (file && model?.sm) {
      return this.soUtils.csvColumns(file, model.sm, { delimiter, encoding }).pipe(
        mergeMap((mappings: PairDto[]) => of({
          configueration: this.setConfigueration(mappings, model.sm),
          data: this.getData(mappings, model.sm),
        })));
    }
    return of({ configueration: this.setConfigueration([], model.sm), data: [] });
  }
}
