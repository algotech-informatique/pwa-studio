export class ValidateImportDocDto {
    name: string;
    valide: boolean;
}

export class ValidateImportDataModelDto {
    model: string;
    valide: boolean;
    data: Object[];
}

export class ValidateImportDataDto {
    type: 'object' | 'link' | 'list' | 'document' | 'layer';
    valide: boolean;
    importData: ValidateImportDataModelDto[];
}
