import { SnPageDto, SnPageEventPipeDto } from '@algotech-ce/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'getType' })
export class GetTypePipe implements PipeTransform {

    constructor() {}

    transform(update, dataSource: SnPageEventPipeDto): string {
        switch(dataSource.type) {
            case 'smartobjects':{
                return `so:${dataSource.action}`;
            }
            case 'smartflow': {
                return dataSource.smartflowResult ? dataSource.smartflowResult.type : '';
            }
        }
    }
}
