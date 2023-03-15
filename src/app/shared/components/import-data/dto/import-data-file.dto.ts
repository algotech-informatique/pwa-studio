export class ImportDataModel {
    model: string;
    data: object[];
}

export class ImportDataFileDto {
    type: 'object' | 'list' | 'document' | 'layer';
    importData: ImportDataModel[];
}
