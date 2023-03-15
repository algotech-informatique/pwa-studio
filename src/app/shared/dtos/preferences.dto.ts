import { SnTransforms } from '../modules/smart-nodes';
import { ActiveVersion } from './active-versions.dto';
import { CheckOptionsDto } from './check-options.dto';
import { DataBaseOptionsDto } from './data-base-options.dto';
import { TabDto } from './tab.dto';
import { WatchersCollectionDto } from './watchers-collection.dto';

export class PreferencesDto {
    tabs: TabDto[];
    versions: ActiveVersion[];
    appPositions: SnTransforms;
    positions: SnTransforms;
    watchers: WatchersCollectionDto[];
    checkOptions: CheckOptionsDto;
    dataBaseOptions: DataBaseOptionsDto;
}
