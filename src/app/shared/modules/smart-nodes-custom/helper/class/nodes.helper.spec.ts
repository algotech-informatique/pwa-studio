import { TestBed } from '@angular/core/testing';
import { StudioHelper } from '../helper.service';
import { NodesHelper } from './nodes.helper';
import { WorkflowHelper } from './workflow.helper';
import { SnObjectCreationNodeHelper } from '../../index-helper';
import { SnNodeSchema } from '../../../smart-nodes/dto';
import { SessionsService } from 'src/app/shared/services';
import { SnNode } from '../../../smart-nodes/models';
import { NodeHelper } from './node.helper';
import { FixtureFactory } from 'test-utils/fixtures/FixtureFactory';
import { AppModuleMock } from '../../../../../../../test-utils/mocks/app.module.mock';
import { AppModule } from '@algotech/business';

describe(NodesHelper.name, () => {
    let studioHelper: StudioHelper;
    let workflowHelper: WorkflowHelper;
    let sessionsService: SessionsService;

    beforeAll(() => {
        TestBed.configureTestingModule({
            imports: [AppModuleMock],
        });
        studioHelper = TestBed.inject(StudioHelper);
        sessionsService = TestBed.inject(SessionsService);
        sessionsService.setActiveSession(FixtureFactory.createSessionDto());
        studioHelper.context._initializeOutsideStudio();
        workflowHelper = studioHelper.createWorkflowDir('/test').createWorkflow('/test', 'test-workflow');
    });

    it('workflow helper should have been initialized', () => {
        expect(workflowHelper).not.toBeNull();
    });

    it(NodesHelper.prototype._getSchema.name + ' should get node schema from classtype', () => {
        // WHEN
        const schema: SnNodeSchema = workflowHelper._getSchema(SnObjectCreationNodeHelper);

        // THEN
        expect(schema).not.toBeNull();
        expect(schema.type).toBe('SnObjectCreationNode');
    });

    it(NodesHelper.prototype._getSchema.name + ' should throw error if helper has no node declared in entry components', () => {
        // WHEN
        expect(() => workflowHelper._getSchema(NodeHelper)).toThrowError(/NodeHelper/); // generic NodeHelper has no corresponding component
    });

    it(NodesHelper.prototype._getType.name + ' should get helper type from node', () => {
        // GIVEN
        const node = new SnNode();
        node.type = 'SnObjectCreationNode';

        // WHEN
        const type = workflowHelper._getType(node);

        // THEN
        expect(type).not.toBeNull();
        expect(type).toBe(SnObjectCreationNodeHelper);
    });

    it(NodesHelper.prototype._getType.name + ' should throw error if node does not exist', () => {
        // GIVEN
        const node = new SnNode();
        node.type = 'SnDontExistsNode';

        // THEN
        expect(() => workflowHelper._getType(node)).toThrowError(/SnDontExistsNode/);
    });
});
