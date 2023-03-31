import { Component, ChangeDetectorRef } from '@angular/core';
import { SN_BASE_METADATA, SnNodeBaseComponent } from '../../../smart-nodes';
import { TranslateService } from '@ngx-translate/core';
import { SnActionsService, SnTranslateService, SnDOMService, SnUtilsService } from '../../../smart-nodes/services';
import { KeyFormaterService } from '@algotech-ce/angular';
import { IconsService } from '../../../../services';
import * as _ from 'lodash';
import { SnSectionClickEvent } from '../../../smart-nodes/dto';
import { SnParam } from '../../../smart-nodes/models';

@Component({
    template: `${SN_BASE_METADATA.template}
    <sn-select-key-value
        *ngIf="top"
        [(top)]="top"
        direction="in"
        [snView]="snView"
        [node]="node"
        [showMultiple]="false"
        [showTypes]="false"
        placeHolder="SN-NEW-FIELD-KEY"
        (addParam)="onAddParam($event)">
    </sn-select-key-value>
    `,
})
export class SnModelNodeComponent extends SnNodeBaseComponent {

    top: number;

    constructor(
        private keyFormaterService: KeyFormaterService,
        private snTranslate: SnTranslateService,
        private iconsService: IconsService,
        private translate: TranslateService,
        private snDOM: SnDOMService,
        private snUtils:  SnUtilsService,
        protected snActions: SnActionsService,
        protected ref: ChangeDetectorRef,
    ) {
        super(snActions, ref);
    }

    calculate() {
        this.mergedSkills();
        this.mergedUniqueKeys();
        this.mergedKey();
        this.mergedIcons();
        this.mergedType();

        if (this.node.params.length > 0) {
            const hidden = !this.snUtils.getParams(this.snView).some((c) => c.toward === this.node.params[0].id);
            const notify = this.node.params[0].displayState.hidden !== hidden && this.node.params[0].displayState.hidden !== undefined;
            this.node.params[0].displayState.hidden = hidden;
            if (notify) {
                this.snActions.notifyHide(this.snView, this.node);
            }
        }
        this.node.displayState.placeHolder = this.translate.instant('SN-MODEL-PLACEHOLDER');

        super.calculate();
    }

    getSection() {
        const section = this.node.sections.find((s) => s.key === 'fields');
        if (!section) {
            throw new Error('section fields not found');
        }
        return section;
    }

    mergedIcons() {
        for (const param of this.getSection().params) {
            if (!param.displayState.icons) {
                param.displayState.icons = [];
            }

            const icons = [];
            // glist
            if (param.key.startsWith('~__')) {
                icons.push({
                    position: 'left',
                    icon: 'fa-solid fa-arrow-right',
                });
            }
            if (param.types === 'string' && param.value.items) {
                icons.push({
                    position: 'left',
                    icon: 'fa-solid fa-list',
                    color: '#2D9CDB'
                });
            } else {
                // type
                const icon = this.iconsService.getIconByType(param.types);
                if (icon) {
                    icons.push({
                        position: 'left',
                        icon: icon.value,
                        color: this.snDOM.getVarName('--SN-NODE-PARAM-COLOR',
                            (param.types as string).toUpperCase().replace(':', ''), true)
                    });
                }
            }

            // uniqueKey
            if (this.node.custom.uniqueKeys.indexOf(param.key) > -1) {
                icons.push({
                    position: 'right',
                    icon: 'fa-solid fa-key',
                    color: '#FFFFFF'
                });
            }

            if (JSON.stringify(param.displayState.icons) !== JSON.stringify(icons)) {
                param.displayState.icons = icons;
            }
        }
    }

    mergedUniqueKeys() {
        const uniqueKeys = _.filter(this.node.custom.uniqueKeys, (key: string) => this.getSection().params.find((p) => p.key === key));

        if (JSON.stringify(this.node.custom.uniqueKeys) !== JSON.stringify(uniqueKeys)) {
            this.node.custom.uniqueKeys = uniqueKeys;
            this.snActions.notifyNode('chg', this.snView, this.node);
        }
    }

    mergedKey() {
        if (!this.node.custom.key) {
            const name = this.snTranslate.transform(this.node.displayName, false);
            if (name) {
                this.node.custom.key = this.keyFormaterService.format(name).toLowerCase();
                this.snActions.notifyNode('chg', this.snView, this.node);
            }
        }

        // unique key
        if (this.node.custom.key) {
            const filterByKey = this.snView.nodes.filter((n) => n.custom && n.custom.key === this.node.custom.key);
            if (filterByKey.length > 1) {
                if (filterByKey[0] === this.node) {
                    return;
                }

                this.node.custom.key = '';
            }
        }
        this.node.displayState.error = !this.node.custom.key && !this.node.displayState.edit;
    }

    mergedSkills() {
        const icons = [];
        // skills
        for (const propName in this.node.custom.skills) {
            if (this.node.custom.skills.hasOwnProperty(propName) && this.node.custom.skills[propName] === true) {
                const icon = this.iconsService.getIcon(`sk:${propName}`);
                if (!icon) {
                    continue;
                }
                icons.push({
                    icon: icon.value,
                });
            }
        }

        if (JSON.stringify(this.node.displayState.icons) !== JSON.stringify(icons)) {
            this.node.displayState.icons = icons;
            this.snActions.notifyRefresh(this.snView);
        }
    }

    mergedType() {
        let notify = false;
        const params = this.getSection().params;
        for (const param of params) {
            const type = (param.types as string);

            // reset glist
            if (type !== 'string' && param.value.items) {
                notify = true;
                delete param.value.items;
            }

            if ((param.multiple || this.node.custom.uniqueKeys.indexOf(param.key) > -1) && param.value.defaultValue !== undefined) {
                notify = true;
                delete param.value.defaultValue;
            }

            if (!type.startsWith('so:') && param.value.composition !== undefined) {
                notify = true;
                delete param.value.composition;
            }

            if (type.startsWith('so:')) {
                // composition|association
                const style = param.value.composition ? 'dash' : 'normal';
                if (param.displayState.style !== undefined && param.displayState.style !== style) {
                    notify = true;
                }
                param.displayState.style = style;

                if (!param.pluggable) {
                    // initialize for the first time
                    notify = true;
                    param.pluggable = true;
                } else if (!param.toward) {
                    // after removed the link
                    notify = true;
                    param.pluggable = false;
                    param.types = 'string';
                    this.mergedIcons();
                }

                // refresh the link
                if (param.pluggable) {
                    const findNode = this.snView.nodes.find((n) => n.custom && `so:${n.custom.key.toLowerCase()}` === type.toLowerCase());
                    if (!findNode) {
                        continue;
                    }
                    const findParam = findNode.params.find((p) => p.master);
                    if (!findParam) {
                        continue;
                    }
                    if (param.toward !== findParam.id) {
                        notify = true;
                        param.toward = findParam.id;
                    }
                }
            } else if (param.pluggable) {
                // after changed the type
                notify = true;
                delete param.displayState.style;
                param.pluggable = false;
                param.toward = null;
            }
        }

        if (notify) {
            this.snActions.notifyNode('chg', this.snView, this.node);
        }
    }

    onSectionClicked(event: SnSectionClickEvent) {
        this.top = this.snDOM.getRelativeTop(event.event.toElement || event.event.target, this.node) + 35;
    }

    onAddParam(param: SnParam) {
        const _param: SnParam = _.cloneDeep(param);
        _param.displayName = this.snTranslate.initializeLangs(_param.key, this.settings.languages);
        _param.key = this.keyFormaterService.format(_param.key);
        _param.display = null;
        _param.pluggable = false;
        _param.multiple = false;
        _param.required = false;
        _param.value = {
            hidden: false,
            composition: false,
            permissions: {
                R: [],
                RW: [],
            },
            description: '',
        };
        this.snActions.addParam(this.snView, this.node, _param, this.getSection().params);
    }
}
