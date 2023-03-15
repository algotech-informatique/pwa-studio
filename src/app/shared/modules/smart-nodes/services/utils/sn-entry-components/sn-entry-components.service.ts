import { Injectable, Type } from '@angular/core';
import { SnNode, SnParam, SnFlow, SnConnector, SnView } from '../../../models';
import * as _ from 'lodash';
import { SnEntryComponents, SnNodeSchema, SnEntryComponent } from '../../../dto';
import { SnNodeBaseComponent } from '../../../components';
import { SnSettings } from '../../../dto/sn-settings';
import { SnSmartConnectionsService } from '../sn-smart-connections/sn-smart-connections.service';

@Injectable()
export class SnEntryComponentsService {

    constructor(private snSmartConnections: SnSmartConnectionsService) { }

    filterSnComponents(snView: SnView, elt: SnNode | SnConnector, settings: SnSettings,
        type: 'node' | 'flow' | 'param'): SnEntryComponents {
        const entryComponents = settings.entryComponents(snView);
        return {
            groups: _.reduce(entryComponents.groups, (groups, group) => {
                const filter = _.filter(group.components, (component: SnEntryComponent) => {
                    if (!component.schema || component.schema.deprecated) {
                        return false;
                    }

                    switch (type) {
                        case 'node':
                            return this.snSmartConnections.filterSchema(snView, component.schema, elt as SnNode,
                                settings.filterFlows, settings.filterParams);
                        case 'flow':
                            return this.snSmartConnections.filterSchemaByFlow(component.schema, elt as SnFlow,
                                settings.filterFlows);
                        case 'param':
                            return this.snSmartConnections.filterSchemaByParam(component.schema, elt as SnParam,
                                settings.filterParams);
                    }
                });

                if (filter.length > 0) {
                    groups.push({
                        displayName: group.displayName,
                        components: filter,
                    });
                }
                return groups;
            }, [])
        };
    }

    getEntryComponents(snEntryComponents: SnEntryComponents): SnEntryComponent[] {
        const components: SnEntryComponent[] =
            _.reduce(snEntryComponents.groups, (results, group) => {
                results.push(...group.components);
                return results;
            }, []);

        return components;
    }

    findEntryComponent(snView: SnView, settings: SnSettings, node: SnNode): SnEntryComponent {
        const entryComponents = this.getEntryComponents(settings.entryComponents(snView));
        return entryComponents.find((cmp) => cmp.schema &&
            cmp.schema.key === node.key && cmp.schema.type === node.type);
    }
}
