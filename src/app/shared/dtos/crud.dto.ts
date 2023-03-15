export class CrudDto {
    op: 'remove' | 'update' | 'add';
    value: any;
}
