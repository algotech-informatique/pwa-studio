export class ValidateData {
    valide: boolean;
    object: object;
}

export class ValidateDataModel {
    model: string;
    valide: boolean;
    data: ValidateData[];
}

export class ValidateDataFileDto {
    type: 'object' | 'link' | 'list' | 'document' | 'layer';
    valide: boolean;
    importData: ValidateDataModel[];
}
