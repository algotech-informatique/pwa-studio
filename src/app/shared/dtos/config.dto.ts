import { PreferencesDto } from './preferences.dto';
import { StoreConnectionDto } from './store-connection.dto';

export class ConfigDto {
    preferences?: PreferencesDto;
    lang: string;
    storeConnection?: StoreConnectionDto;
}
