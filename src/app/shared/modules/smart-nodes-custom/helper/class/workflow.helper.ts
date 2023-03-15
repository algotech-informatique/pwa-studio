import { SnModelDto, WorkflowProfilModelDto } from '@algotech/core';
import { HelperContext } from '../helper.context';
import { FlowHelper } from './flow.helper';

export class WorkflowHelper extends FlowHelper<WorkflowHelper> {
    constructor(helperContext: HelperContext, snModel: SnModelDto) {
        super(helperContext, snModel, helperContext.getWorkflowEntryComponents());
    }

    public setProfiles(tags: WorkflowProfilModelDto[]): WorkflowHelper {
        // TODO: to implemented
        // this.snView.options.profiles
        return this;
    }

    public getProfiles(): WorkflowProfilModelDto[] {
        // TODO: to implemented
        // this.snView.options.profiles
        return [];
    }

    public setIcon(iconName: string): WorkflowHelper {
        this.snView.options.iconName = iconName;
        return this;
    }

    public getIcon(): string {
        return this.snView.options.iconName;
    }
}
