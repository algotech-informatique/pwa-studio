import { IsString, IsDefined, IsNotEmpty, IsArray, IsUUID, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseModel, LangDto } from '@algotech-ce/core';
import { StoreMetadataDto } from './store-metadatas.dto';
import { StoreCategoriesKeysDto } from './store-categories.dto';
export type ArticleType = 'bundle' | 'workflow-model' | 'smartflow-model' | 'smart-model' | 'generic-list' | 'tag-list' | 'app' | 'report';

// @dynamic
export class StoreArticleDto extends BaseModel {

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    key: string;

    @IsDefined()
    @IsBoolean()
    homePage: boolean;

    @IsDefined()
    @IsBoolean()
    draft: boolean;

    @IsUUID()
    @IsOptional()
    articleUuid?: string;

    @IsUUID()
    @IsOptional()
    draftUuid?: string;

    @IsDefined()
    @IsArray()
    @Type(() => LangDto)
    display: LangDto[];

    @IsDefined()
    @IsArray()
    @Type(() => StoreMetadataDto)
    metadata: StoreMetadataDto[];

    @IsDefined()
    @IsArray()
    @Type(() => LangDto)
    description: LangDto[];

    @IsDefined()
    @IsArray()
    @Type(() => LangDto)
    content: LangDto[];

    @IsString()
    @IsOptional()
    articleType: ArticleType;

    @IsDefined()
    @IsArray()
    @Type(() => StoreCategoriesKeysDto)
    categoriesKeys: StoreCategoriesKeysDto[];

    @IsDefined()
    @IsArray()
    ressourceUUIDs: string[];

    @IsOptional()
    @IsNumber()
    size?: number;

    @IsOptional()
    @IsString()
    version?: string;

    @IsOptional()
    @IsString()
    releaseDate?: string;

    @IsOptional()
    @IsBoolean()
    isPrivate?: boolean;

    @IsDefined()
    @IsString()
    ownerId: string;
}
