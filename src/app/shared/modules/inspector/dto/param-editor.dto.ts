import { PairDto } from '@algotech/core';

export class ParamEditorDto {
    type?: 'string' | 'number' | 'boolean' | 'list';
    params: PairDto[];
    optParams?: PairDto[];
    plugged?: PairDto;
    value: any;
}
