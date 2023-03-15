import { Pipe, PipeTransform } from '@angular/core';
import { SnTranslateService } from '../services';
import { SnLang } from '../models';

@Pipe({ name: 'snlang' })
export class SnTranslatePipe implements PipeTransform {

    constructor(private readonly translateLangService: SnTranslateService) { }

    transform(values: SnLang[], alertNoTranslate = true, lang?: string): string {
        return this.translateLangService.transform(values, alertNoTranslate, lang);
    }
}
