import { TranslateService } from '@ngx-translate/core';
import { ListItem } from '../../modules/inspector/dto/list-item.dto';

export class SearchUtils {

    static categoriesList(translate: TranslateService): ListItem[] {
        return [{
            key: 'app',
            color: '#f44336',
            value: translate.instant('EXPLORER-APPLICATIONS'),
            icon: 'fa-solid fa-window-maximize'
        }, {
            key: 'workflow',
            color: '#388e3c',
            value: translate.instant('EXPLORER-WORKFLOWS'),
            icon: 'fa-solid fa-diagram-project'
        }, {
            key: 'smartmodel',
            color: '#ffc107',
            value: translate.instant('SMARTMODEL'),
            icon: 'fa-solid fa-cubes'
        }, {
            key: 'smartflow',
            color: '#3f51b5',
            value: translate.instant('DATA-SELECTOR-SMARTFLOW'),
            icon: 'fa-solid fa-atom'
        }, {
            key: 'report',
            color: '#33c9dc',
            value: translate.instant('EXPLORER-REPORTS'),
            icon: 'fa-solid fa-file-lines'
        }];
    }
}
