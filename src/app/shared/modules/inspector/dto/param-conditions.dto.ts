import { ParamConditionDto } from './param-condition.dto';

export class ParamConditionsDto {
    list: ParamConditionDto[];
    mode: 'visible' | 'enabled';
    operator: 'and' | 'or';
}
