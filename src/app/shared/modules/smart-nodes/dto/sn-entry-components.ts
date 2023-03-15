import { SnLang } from '../models';
import { SnEntryComponent } from './sn-entry-component';

export class SnEntryComponents {
    groups: {
        displayName: string | SnLang[];
        components: SnEntryComponent[];
    }[];
}
