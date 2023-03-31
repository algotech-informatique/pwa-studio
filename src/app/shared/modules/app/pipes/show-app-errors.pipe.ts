import { SnPageWidgetDto } from '@algotech-ce/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'showAppErrors' })
export class ShowAppErrorsPipe implements PipeTransform {

    /*
        [ngClass]="{'app-errors': appCheckService.reports | showAppErrors: widgetID}
        [ngClass]="{'app-errors': appCheckService.reports | showAppErrors: widgetID: 'custom.title'}
        [ngClass]="{'app-errors': appCheckService.reports | showAppErrors: widgetID: 'event.onClick.0'}
    */

    transform(errors: string[], path?: string, widget?: SnPageWidgetDto): boolean {
        let _errors = errors;
        if (!_errors) {
            return false;
        }
        if (widget?.displayState?.relativeTo) {
            _errors = errors.reduce((result, err: string) => {
                if (err.includes(widget?.displayState?.relativeTo)) {
                    result.push(err.replace(`rule.${widget?.displayState?.relativeTo}.`, ''));
                }
                return result;
            }, []);
        }
        if (!_errors) {
            return false;
        }
        if (!path) {
            return _errors.length > 0;
        }
        return _errors.includes(path);
    }
}
