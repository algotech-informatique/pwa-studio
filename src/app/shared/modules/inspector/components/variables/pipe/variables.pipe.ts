import { Pipe, PipeTransform } from '@angular/core';
import { ListItem } from '../../../dto/list-item.dto';

@Pipe({
    name: 'keyToDisplay'
})
export class KeyToDisplayPipe implements PipeTransform {

    transform(value: string, types: ListItem[], propName = 'value'): string {
        const findDisplay = types?.find((t) => t.key === value);
        return findDisplay ? findDisplay[propName] : value;
    }

}
