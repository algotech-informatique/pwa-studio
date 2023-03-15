import { IsString, IsArray, IsDefined, IsNotEmpty } from 'class-validator';

export class StoreCategoriesKeysDto {

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    key: string;

    @IsDefined()
    @IsArray()
    subCategoriesKeys: string[];
}

