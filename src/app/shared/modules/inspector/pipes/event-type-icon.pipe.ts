import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'eventTypeIcon' })
export class EventTypeIconPipe implements PipeTransform {

    transform(type: string): string {
        switch (type) {
            case 'workflow':
                return 'fa-solid fa-diagram-project';
            case 'call::onLoad':
                return 'fa-solid fa-rotate';
            case 'smartflow':
                return 'fa-solid fa-atom';
            case 'page':
                return 'fa-solid fa-window-maximize';
            case 'url':
                return 'fa-solid fa-link';
            case 'smartobjects':
                return 'fa-solid fa-cubes';
            case 'page::nav':
                return 'fa-solid fa-window-maximize';
        }
    }

}
