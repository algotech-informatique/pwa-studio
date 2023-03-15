import { TypeVariable } from './../components/variables/dto/type-variable.dto';

export class ParamTabDto {
    type: string;
    title: string;
    list: TypeVariable[];
    icon: string;
    select: boolean;
}
