import { ConnectionDto } from './connection.dto';

export class GroupConnectionDto {
    uuid: string;
    type: 'cloud'  | 'custom';
    name: string;
    connection: ConnectionDto[];
    host: string;
    color?: string;
}
