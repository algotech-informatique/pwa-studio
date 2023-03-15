import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import expressions from 'angular-expressions';
import { flatMap } from 'rxjs/operators';
import InspectModule from 'docxtemplater/js/inspect-module';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

@Injectable({
    providedIn: 'root'
})
export class DocxTemplaterService {

    constructor() { }

    _errorHandler(observer, error) {
        if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors.map((e) => e.properties.explanation);
            observer.error(errorMessages);
        } else {
            observer.error(error);
        }
    }

    _isCondition(tag: string): boolean {
        const chars = ['+', '-', '=', '&&', '||', '>', '<', '!'];
        return (_.findIndex(chars, (c) => (_.indexOf(tag, c) !== -1)) !== -1);
    }


    loadExpression() {
        expressions.filters.size = (input, width, height) =>
        ({
            data: input,
            size: [width, height],
        });

        expressions.filters.maxSize = (input, width, height) =>
        ({
            data: input,
            maxSize: [width, height],
        });
    }

    angularParser(): any {
        const angularParser = (tag) => {
            if (tag === '.') {
                return {
                    get: (s) => s
                };
            }
            const expr = expressions.compile(
                tag.replace(/(’|‘)/g, '\'').replace(/(“|”)/g, '"')
            );
            return {
                get: (scope, context) => {
                    let obj = {};
                    const scopeList = context.scopeList;
                    const num = context.num;
                    for (let i = 0, len = num + 1; i < len; i++) {
                        obj = Object.assign(obj, scopeList[i]);
                    }
                    return expr(scope, obj);
                }
            };
        };
        return angularParser;
    }

    nullGetter(): any {
        const nullGetter = (part, scopeManager) => {
            if (!part.module) {
                return 'undefined';
            }
            if (part.module === 'rawxml') {
                return '';
            }
            return '';
        };
        return nullGetter;
    }

    getReportTags(template): Observable<any> {
        return new Observable<any>(observer => {
            this.loadExpression();

            const reader = new FileReader();
            reader.readAsBinaryString(template);
            reader.onerror = (err) => {
                observer.error(err);
            };
            reader.onloadend = (evt) => {
                const iModule = new InspectModule();
                const content = evt.target?.result;
                const zip = new PizZip(content);
                let doc;
                try {
                    doc = new Docxtemplater(zip, {
                        parser: this.angularParser(), modules: [iModule], nullGetter: this.nullGetter()
                    });
                } catch (error) {
                    // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
                    this._errorHandler(observer, error);
                }
                try {
                    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                    doc.render();
                } catch (error) {
                    // Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
                    this._errorHandler(observer, error);
                }
                observer.next(iModule.getAllTags());
            };
        }).pipe(
            flatMap((tags) => {
                const ntags = _.reduce(Object.keys(tags), (result, k) => {
                    const regEx = /^(<c)/gi;
                    if (!regEx.test(_.trim(k)) && !this._isCondition(k)) {
                        const key = (_.indexOf(k, '|') !== -1) ? _.trim(k.split('|')[0]) : k; //enlever les filters (expressions.filters)
                        result[key] = (Object.keys(tags[k]).length > 0) ? { obj: true } : '';
                    }
                    return result;
                }, {});
                return of(ntags);
            })
        );
    }
}
