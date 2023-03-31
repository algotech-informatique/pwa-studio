import { SnModelDto, TagDto, WorkflowVariableModelDto } from '@algotech-ce/core';
import { SnEntryComponents } from '../../../smart-nodes/dto';
import { SnView } from '../../../smart-nodes/models';
import { HelperContext } from '../helper.context';
import { ViewHelper } from './view.helper';

export class FlowHelper<HelperType extends unknown> extends ViewHelper<HelperType> {
    constructor(helperContext: HelperContext, snModel: SnModelDto, entryComponents: (snView: SnView) => SnEntryComponents) {
        super(helperContext, snModel, entryComponents);
    }

    public setTags(tags: TagDto[]): HelperType {
        this.snView.options.tags = tags;
        return this as unknown as HelperType;
    }

    public getTags(): TagDto[] {
        return this.snView.options?.tags ? this.snView.options.tags : [];
    }

    public setVariables(variables: WorkflowVariableModelDto[]): HelperType {
        this.snView.options.variables = variables;
        return this as unknown as HelperType;
    }

    public getVariables(): WorkflowVariableModelDto[] {
        return this.snView.options?.variables ? this.snView.options.variables : [];
    }

    public newVersion(): HelperType {
        // TODO: to implemented
        // const newView: SnView = injector.get(SnModelsService).actionVersion(
        //     event.type, event.version, this.snModel, this.snView as SnViewDto, injector.get(SessionsService).active.connection.login
        // ) as SnView;
        return this as unknown as HelperType;
    }

    public selectVersion(index: number): HelperType {
        // TODO: to implemented
        // this.snView = this.snModel.versions[index]

        return this as unknown as HelperType;
    }

    public removeVersion(index: number): HelperType {
        // TODO: to implemented
        // const newView: SnView = injector.get(SnModelsService).actionVersion(
        //     event.type, event.version, this.snModel, this.snView as SnViewDto, injector.get(SessionsService).active.connection.login
        // ) as SnView;
        return this as unknown as HelperType;
    }
}
