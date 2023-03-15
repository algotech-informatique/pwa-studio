import { SnParam } from './sn-param';
import { SnConnector } from './sn-connector';

export class SnFlow extends SnConnector {
    paramsEditable?: boolean;
    params: SnParam[];
}
