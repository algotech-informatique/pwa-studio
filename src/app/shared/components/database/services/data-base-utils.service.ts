import { TranslateLangDtoService } from '@algotech-ce/angular';
import { GridColumnConfigurationDto } from '@algotech-ce/business/src/lib/@components/grid/dto/grid-column-configuration.dto';
import { GenericListDto, GenericListValueDto, SmartObjectDto, SmartPropertyModelDto, SysQueryDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { IconsService, SessionsService } from '../../../services';
import { BreadCrumbLink } from '../interfaces/link.interface';
import { Model } from '../interfaces/model.interface';
import { Row } from '../interfaces/row.interface';
import { DBType } from '../interfaces/tab.interface';


@Injectable()
export class DataBaseUtilsService {


  constructor(
    private sessionsService: SessionsService,
    private translateService: TranslateLangDtoService,
    private iconsService: IconsService,
  ) { }

  initBreadCrumb() {
    return [{ root: true, path: '', key: '', parentUuid: '', display: '', model: '', uuids: [], multiple: false, isComposition: false }];
  }

  initQuery(
    data: Row[],
    sos: SmartObjectDto[],
    cache: SmartObjectDto[],
    sysQuery: SysQueryDto,
    soCount: number,
    filter: string,
    breadCrumb: BreadCrumbLink[],
    keepfilters?): {
      data: Row[];
      sos: SmartObjectDto[];
      cache: SmartObjectDto[];
      sysQuery: SysQueryDto;
      soCount: number;
      filter: string;
      breadCrumb: BreadCrumbLink[];
    } {
    breadCrumb = this.initBreadCrumb();
    filter = keepfilters ? filter : '';
    soCount = 0;
    if (!sysQuery) {
      sysQuery = {};
    }
    sysQuery.skip = 0;
    sysQuery.limit = 15;
    sysQuery.search = filter;
    sysQuery.filter = keepfilters ? sysQuery.filter : undefined;
    sysQuery.order = keepfilters ? sysQuery.order : [{ key: 'sys:createdDate', value: 'asc' }];
    data = [];
    sos = [];
    cache = [];

    return { data, sos, cache, sysQuery, soCount, filter, breadCrumb };
  }

  getSos(sos: SmartObjectDto[], value: string | string[]): SmartObjectDto | SmartObjectDto[] {
    if (Array.isArray(value)) {
      return _.reduce(value, ((results, elem) => {
        const so = sos.find(s => s.uuid === elem) as SmartObjectDto;
        if (so) {
          results.push(so);
        }
        return results;
      }), []);
    }

    return sos.find(s => s.uuid === value) as SmartObjectDto;
  }


  transformSo(columns: GridColumnConfigurationDto[], so: SmartObjectDto, sos: SmartObjectDto[]): Row {
    return {
      id: so.uuid as string,
      properties: _.reduce(columns, (results, col: GridColumnConfigurationDto) => {
        if (col.key.startsWith('sys:')) {
          results.push({
            key: col.key,
            value: col.key === 'sys:createdDate' ? so.createdDate : so.updateDate
          });
        } else {
          const findProp = so.properties.find(prop => col.key === prop.key);
          if (findProp) {
            results.push({
              key: col.key,
              value: col.type.startsWith('so:') ? this.getSos(sos, findProp.value) : findProp.value,
            });
          } else {
            results.push({
              key: col.key,
              value: null
            });
          }
        }
        return results;
      }, []),
    };
  }

  initSmartModelsList() {
    return this.sessionsService.active.datas.read.smartModels.map(sm => ({
      key: sm.key,
      display: this.translateService.transform(sm.displayName) ?? sm.key,
      selected: false,
      sm
    } as Model));
  }

  setConfiguration(dbName: string, columns, headerEditable = true) {
    return {
      id: `DB_${dbName}`,
      search: false,
      rowHeight: 40,
      headerEditable,
      reorder: true,
      hasActions: true,
      icons: this.iconsService.loadListIcons(),
      columns,
      selection: {
        multiselection: true,
        list: [],
        selected: []
      }
    };
  }

  initColumns(selectedTab: DBType, properties, isSubProp = false): GridColumnConfigurationDto[] {
    return properties ? [
      ...properties,
      { key: 'sys:createdDate', keyType: 'datetime', multiple: false, displayName: [] },
      { key: 'sys:updateDate', keyType: 'datetime', multiple: false, displayName: [] },].map((prop: SmartPropertyModelDto) => {
        const glist = prop.items ?
          this.sessionsService.active.datas.read.glists.find((elem: GenericListDto) => elem.key === prop.items) : null;
        const display = this.translateService.transform(prop.displayName, undefined, false);
        return {
          key: prop.key,
          name: display ? display : prop.key,
          type: prop.keyType,
          width: 150,
          sort: !isSubProp,
          filter: !isSubProp,
          hide: false,
          resize: true,
          sticky: 'none',
          multiple: prop.multiple,
          custom: {
            isComposition: prop.composition,
            editable: !prop.key.startsWith('sys:') && selectedTab !== 'deleted',
            multiple: prop.multiple,
            clickable: prop.keyType.startsWith('so:') && selectedTab === 'smartObjects',
            items: glist ? glist.values.map((elem: GenericListValueDto) => ({
              key: elem.key,
              value: this.translateService.transform(elem.value)
            })) : null
          }
        } as GridColumnConfigurationDto;
      }) : [];
  }

  lastSkip(soCount: number, limit: number) {
    return Math.ceil(soCount / limit) - 1;
  }

  getSkipState(soCount: number, page, limit) {
    const skip = soCount && page != null ? (page + 1) : 0;
    const lastPage = (skip === 0) ? 0 : soCount ? this.lastSkip(soCount, limit) + 1 : 0;
    return {
      skip,
      lastPage
    };
  }
}
