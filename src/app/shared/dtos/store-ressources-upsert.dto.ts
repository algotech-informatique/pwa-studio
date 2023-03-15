import { RessourcesRefDto } from './ressource-ref.dto';

export class RessourcesUpsertDto {
    foundInStore: boolean;
    customerKey: string;
    doUpdate: boolean;
    ressources: RessourcesRefDto[];
}
