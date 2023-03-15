export class ImportDataDocDto {
    fileName: string;
    pathName: string;
    file: Blob; // File;
}

export class ImportDataOptionsDto {
    forceData: boolean;
    verifyDocs: boolean;
    versionDocs: boolean;
}


