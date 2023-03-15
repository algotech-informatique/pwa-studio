export class ValidateImportRasterDto {
    key: string;
    default: boolean;
    color: string;
    source: string;
    valide: boolean;
    index: number;
}

export class ValidateImportLayerDto {
    key: string;
    name: string;
    type: string;
    regroup: boolean;
    rasters: ValidateImportRasterDto[];
    metadata: string;
    valide: boolean;
}

export class ValidateImportContainerDto {
    key: string;
    name: string;
    description: string;
    parent: string;
    layers: ValidateImportLayerDto[];
    metadata: string;
    valide: boolean;
}
