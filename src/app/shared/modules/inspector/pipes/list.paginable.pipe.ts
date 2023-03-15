import { SnPageDto } from '@algotech/core';
import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { AppCustomService } from '../../app-custom/services';

@Pipe({ name: 'paginable' })
export class ListPaginablePipe implements PipeTransform {
    constructor(private appCustom: AppCustomService) { }
    transform(collection: string, page: SnPageDto, keysCheck: string[]): boolean {
        return this.appCustom.paginable(page, collection, keysCheck);
    }
}
