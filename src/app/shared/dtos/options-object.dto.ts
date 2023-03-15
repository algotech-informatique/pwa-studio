import { OptionsLabelIconDto } from './Options-label-icon.dto';
import { OptionsObjectStatusDto } from './options-object-status.dto';

export class OptionsObjectDto {

    uuid: string;

    statusIcon?: OptionsObjectStatusDto;

    title: string;
    mainLine: string;
    detailLine?: string;

    mainIcon?: string;
    detailIcon?: string;

    labelIcon?: OptionsLabelIconDto;

}
