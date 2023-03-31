import { SnModelDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { SmartflowHelper, SmartModelsHelper, WorkflowHelper } from './class';
import { HelperContext } from './helper.context';

@Injectable()
export class StudioHelper {
    public enableHelper = false;

    constructor(
        public context: HelperContext
    ) { }

    public execute() {
        this.context.refreshEnv();
    }

    public createWorkflowDir(dir: string): StudioHelper {
        this.context.createFlowDir(dir, 'workflow');
        return this;
    }

    public createWorkflow(directory: string, name: string): WorkflowHelper {
        const snModel: SnModelDto = this.context.createFlowModel(directory, name, 'workflow');
        return new WorkflowHelper(this.context, snModel);
    }

    public getWorkflow(key: string): WorkflowHelper {
        return new WorkflowHelper(this.context, this.context.getFlow(key, 'workflow'));
    }

    public getWorkflows(): WorkflowHelper[] {
        return this.context.getFlows('workflow')
            .map(workflow => new WorkflowHelper(this.context, workflow));
    }

    public removeWorkflow(key: string): StudioHelper {
        // TODO: to implemented
        // sessionsService.removeElement (extract line 333 to 349)

        return this;
    }

    public createSmartflowDir(dir: string): StudioHelper {
        this.context.createFlowDir(dir, 'smartflow');
        return this;
    }

    public createSmartflow(connector: string, name: string): SmartflowHelper {
        const snModel: SnModelDto = this.context.createFlowModel(connector, name, 'smartflow');
        return new SmartflowHelper(this.context, snModel);
    }

    public getSmartflow(key: string): SmartflowHelper {
        return new SmartflowHelper(this.context, this.context.getFlow(key, 'smartflow'));
    }

    public getSmartflows(): SmartflowHelper[] {
        return this.context.getFlows('smartflow')
            .map(smartflow => new SmartflowHelper(this.context, smartflow));
    }

    public removeSmartflow(key: string): StudioHelper {
        // TODO: to implemented
        // cf.removeWorkflow

        return this;
    }

    public getSmartModels(): SmartModelsHelper {
        // TODO: to implemented
        // new SmartModelsHelper => find first snModels on this.active.datas.write.snModels with type === 'smartmodel'
        return null;
    }
}
