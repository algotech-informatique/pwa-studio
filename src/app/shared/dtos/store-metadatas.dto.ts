import { IsString, IsDefined, IsNotEmpty, IsUUID, IsUrl, IsOptional, IsBoolean } from 'class-validator';

// @dynamic
export class StoreMetadataDto {

    @IsString()
    @IsDefined()
    @IsOptional()
    fileName?: string;

    @IsBoolean()
    @IsOptional()
    homeImage?: boolean;

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    contentType: 'image/*' | 'video/*';

    @IsUUID()
    @IsOptional()
    fileUuid?: string;

    @IsUUID()
    @IsOptional()
    thumbnailUuid?: string;

    @IsDefined()
    @IsBoolean()
    embeded: boolean;
    @IsUrl()
    @IsOptional()
    embededUrl?: string;

    @IsUrl()
    @IsOptional()
    thumbnailUrl?: string;

}
