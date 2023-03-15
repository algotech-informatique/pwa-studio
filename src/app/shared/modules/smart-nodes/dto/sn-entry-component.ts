import { SnNodeSchema } from './sn-node-schema';
import { SnNodeBaseComponent } from '../components';
import { Type } from '@angular/core';
import { SnLang } from '../models';
import { NodeHelper } from '../../smart-nodes-custom/helper/class';
import { ClassConstructor } from 'class-transformer';

export class SnEntryComponent {
    component?: Type<SnNodeBaseComponent>;
    displayName: string | SnLang[];
    schema?: SnNodeSchema;
    helper?: ClassConstructor<NodeHelper<any>>;
}
