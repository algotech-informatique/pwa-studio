import { TestBed } from '@angular/core/testing';
import { StudioHelper } from './helper.service';
import { SessionsService, SnModelsService } from 'src/app/shared/services';
import { SnLauncherNodeHelper, SnDataNodeHelper, SnObjectCreationNodeHelper, SnFormulaNodeHelper, SnFormNodeHelper } from '../index-helper';
import { SnFinisherNodeHelper } from '../workflow/lifecycle/sn-finisher-node/sn-finisher-node.helper';
import { WorkflowHelper, GroupHelper, BoxHelper } from './class';
import { UUID } from 'angular2-uuid';
import { SnBox, SnGroup, SnLang, SnView } from '../../smart-nodes/models';
import { SnModelDto } from '@algotech-ce/core';
import _ from 'lodash';
import { FixtureFactory } from 'test-utils/fixtures/FixtureFactory';
import { TagDtoBuilder } from 'test-utils/builders';
import TestUtils from 'test-utils/test-utils';
import { AppModuleMock } from '../../../../../../test-utils/mocks/app.module.mock';

/**
 * WARNING: Tests in this test suite are sequential, each test depends on the result of the previous one
 *
 * That's why we use storage classes TestHelpers and TestData to ease data sharing between tests
 */
class TestHelpers {
    studio: StudioHelper;
    workflow: WorkflowHelper;
    group: GroupHelper;
    groupToBeDeleted: GroupHelper;
    box: BoxHelper;
    boxToBeDeleted: BoxHelper;
    boxInGroup: BoxHelper;
    launcherNode: SnLauncherNodeHelper;
    finisherNode: SnFinisherNodeHelper;
    dataNode: SnDataNodeHelper;
    objectCreationNode: SnObjectCreationNodeHelper;
    formNode: SnFormNodeHelper;
    formulaNode: SnFormulaNodeHelper;
};

class TestData {
    view: SnView;
    workflow: SnModelDto;
    group: SnGroup;
    groupToBeDeleted: SnGroup;
    box: SnBox;
    boxToBeDeleted: SnBox;
    boxInGroup: SnBox;
}

// TODO also add tests for smartflows (do it in new test file to limit size ?)

describe('Helpers', () => {
    let sessionsService: SessionsService;
    let snModelsService: SnModelsService;

    // References to share helpers instances
    const helpers = new TestHelpers();
    // References to share data between tests
    const data = new TestData();

    beforeAll(() => {
        TestBed.configureTestingModule({
            imports: [AppModuleMock],
        });

        helpers.studio = TestBed.inject(StudioHelper);
        sessionsService = TestBed.inject(SessionsService);
        sessionsService.setActiveSession(FixtureFactory.createSessionDto());
        snModelsService = TestBed.inject(SnModelsService);

        helpers.studio.context._initializeOutsideStudio();
    });

    it(StudioHelper.name + ' should have been initialized', () => {
        expect(helpers.studio).toBeTruthy();
        expect(sessionsService.active.datas.write.environment.workflows.length).toBe(18); // in fixture
    });

    it(StudioHelper.name + ' should create workflow and directories', () => {
        // WHEN
        helpers.workflow = helpers.studio.createWorkflowDir('/directory/test')
            .createWorkflow('/directory/test', 'test_workflow')
            .setName('Workflow de test')
            .setVariables([{
                key: 'smart-object-selected',
                type: 'so:machine',
                multiple: false,
                uuid: UUID.UUID()
            }])
            .setTags([
                new TagDtoBuilder().withKeyAndName('Maintenance').build(),
                new TagDtoBuilder().withKeyAndName('Production').build()
            ])
            .setIcon('fa-solid fa-cube');
        helpers.studio.execute();

        // THEN
        expect(sessionsService.active.datas.write.environment.workflows).toHaveSize(19); // number in fixture + 1 new
        const createdWorkflowDirectory =
            sessionsService.active.datas.write.environment.workflows.find(dir => dir.name === 'directory');
        expect(createdWorkflowDirectory).toBeDefined();
        expect(createdWorkflowDirectory.subDirectories).toHaveSize(1);
        expect(createdWorkflowDirectory.subDirectories.find(dir => dir.name === 'test')).toBeDefined();

        data.workflow = sessionsService.active.datas.write.snModels
            .find(model => model.type === 'workflow' && model.key === 'test_workflow');
        expect(data.workflow).toBeDefined();
        expect(data.workflow.versions).toHaveSize(1);
        expect(data.workflow.displayName.find(l => l.lang === 'fr-FR').value).toBe('Workflow de test');
        expect(helpers.workflow.getName()).toEqual('Workflow de test');

        const tags = helpers.workflow.getTags();
        expect(tags).toHaveSize(2);
        expect(tags.map(t => t.key)).toContain('tag-maintenance');
        expect(tags.map(t => t.key)).toContain('tag-production');

        data.view = snModelsService.getActiveView(data.workflow) as SnView;
        expect(data.view.options.variables.find(variable => variable.key === 'smart-object-selected').type).toBe('so:machine');
        expect(data.view.options.iconName).toBe('fa-solid fa-cube');
    });

    it(StudioHelper.name + ' should change workflow name', () => {
        // WHEN
        helpers.workflow.setName('Workflow de test édité');

        // THEN
        expect(data.workflow.displayName.find(l => l.lang === 'fr-FR').value).toBe('Workflow de test édité');
        expect(helpers.workflow.getName()).toEqual('Workflow de test édité');
    });

    it(WorkflowHelper.name + ' should create groups and boxes', () => {
        // WHEN
        helpers.group = helpers.workflow.createGroup('test-group');
        helpers.groupToBeDeleted = helpers.workflow.createGroup('test-group-to-delete');
        helpers.box = helpers.workflow.createBox('test-box');
        helpers.boxToBeDeleted = helpers.workflow.createBox('test-box-to-delete');

        // THEN
        expect(data.view.groups).toHaveSize(2);

        data.group = TestUtils.findElementWithDisplayName(data.view.groups, 'test-group');
        expect(data.group).toBeDefined();
        expect(data.view.box).toHaveSize(2);

        data.groupToBeDeleted = TestUtils.findElementWithDisplayName(data.view.groups, 'test-group-to-delete');
        expect(data.groupToBeDeleted).toBeDefined();

        data.box = data.view.box.find(box => (box.displayName as SnLang[]).map(l => l.value).includes('test-box'));
        expect(data.box).toBeDefined();
        expect(data.box.parentId).toBeNull();

        data.boxToBeDeleted = TestUtils.findElementWithDisplayName(data.view.box, 'test-box-to-delete');
        expect(data.boxToBeDeleted).toBeDefined();
    });

    it(WorkflowHelper.name + ' should get groups', () => {
        // WHEN
        const groups = helpers.workflow.getGroups();
        const group = helpers.workflow.getGroup(data.group.id);

        // THEN
        expect(groups).toHaveSize(2);
        expect(groups[0].group.id).toBe(data.group.id);
        expect(groups[1].group.id).toBe(data.groupToBeDeleted.id);

        expect(group).toBeDefined();
        expect(group.group.displayName).toBe(data.group.displayName);
    });

    it(WorkflowHelper.name + ' should delete group', () => {
        // WHEN
        helpers.workflow.removeGroup(data.groupToBeDeleted.id);

        // THEN
        expect(data.view.groups).toHaveSize(1);
        const deleted = TestUtils.findElementWithDisplayName(data.view.groups, 'test-group-to-delete');
        expect(deleted).toBeUndefined();
    });

    it(WorkflowHelper.name + ' should get boxes', () => {
        // WHEN
        const boxes = helpers.workflow.getBoxes();
        const box = helpers.workflow.getBox(data.box.id);

        // THEN
        expect(boxes).toHaveSize(2);
        expect(boxes[0].box.id).toBe(data.box.id);
        expect(boxes[1].box.id).toBe(data.boxToBeDeleted.id);

        expect(box).toBeDefined();
        expect(box.box.displayName).toBe(data.box.displayName);
    });

    it(WorkflowHelper.name + ' should delete box', () => {
        // WHEN
        helpers.workflow.removeBox(data.boxToBeDeleted.id);

        // THEN
        expect(data.view.box).toHaveSize(1);
        const deleted = TestUtils.findElementWithDisplayName(data.view.box, 'test-box-to-delete');
        expect(deleted).toBeUndefined();
    });

    it(GroupHelper.name + ' should create boxes in group', () => {
        // WHEN
        helpers.boxInGroup = helpers.group.createBox('test-box-in-group');
        helpers.boxToBeDeleted = helpers.group.createBox('test-box-in-group-to-delete');

        // THEN
        expect(data.view.box).toHaveSize(3); // 1 in view root + 2 in group

        data.boxInGroup = TestUtils.findElementWithDisplayName(data.view.box, 'test-box-in-group');
        expect(data.boxInGroup).toBeDefined();
        expect(data.boxInGroup.parentId).toBe(helpers.group.group.id);

        data.boxToBeDeleted = TestUtils.findElementWithDisplayName(data.view.box, 'test-box-in-group-to-delete');
        expect(data.boxToBeDeleted).not.toBeUndefined();
        expect(data.boxToBeDeleted.parentId).toBe(helpers.group.group.id);
    });

    it(GroupHelper.name + ' should get boxes in group', () => {
        // WHEN
        const boxesInGroup = helpers.group.getBoxes();
        const boxFoundInGroup = helpers.group.getBox(data.boxInGroup.id);

        // THEN
        expect(boxesInGroup).toHaveSize(2);
        expect(boxesInGroup[0].box.id).toBe(data.boxInGroup.id);
        expect(boxFoundInGroup).toBeDefined();
        expect(
            (boxFoundInGroup.box.displayName as SnLang[]).map(l => l.value)
        ).toContain('test-box-in-group');
    });

    it(WorkflowHelper.name + ' should delete box in group', () => {
        // WHEN
        helpers.group.removeBox(data.boxToBeDeleted.id);

        // THEN
        expect(data.view.box).toHaveSize(2);
        const deleted = TestUtils.findElementWithDisplayName(data.view.box, 'test-box-in-group-to-delete');
        expect(deleted).toBeUndefined();
    });

    it(WorkflowHelper.name + ' should throw en error', () => {
        // WHEN
        const cb = () => helpers.workflow.createNode(SnDataNodeHelper, 'bad key');

        // THEN
        expect(cb).toThrowError();
    });

    it(BoxHelper.name + ' should create node in box', () => {
        // WHEN
        helpers.dataNode = helpers.boxInGroup.createNode(SnDataNodeHelper, 'smart-object-selected')
            .extendProperties(['NAME', 'DESIGNATION'])
            .execute();

        // THEN
        expect(helpers.boxInGroup.nodes).toHaveSize(1);
        const newNode = helpers.boxInGroup.nodes[0];
        expect(newNode.node.type).toBe('SnDataNode');
        expect(newNode.node.params[0].key).toBe('smart-object-selected');
        expect(newNode.node.sections[0].params).toHaveSize(2);
        expect(newNode.node.sections[0].params[0].key).toBe('NAME');
        expect(newNode.node.sections[0].params[1].key).toBe('DESIGNATION');
    });

    it(GroupHelper.name + ' should create node in group and link it to other nodes in box', () => {
        // WHEN
        helpers.formulaNode = helpers.boxInGroup.createNode(SnFormulaNodeHelper)
            .setSource([{
                key: 'text1',
                relativeTo: helpers.dataNode.getParam('NAME')
            }, {
                key: 'text2',
                relativeTo: helpers.dataNode.getParam('DESIGNATION')
            }])
            .setFormula('CONCATENATE({{text1}}, {{text2}})')
            .execute();

        helpers.objectCreationNode = helpers.group.createNode(SnObjectCreationNodeHelper)
            .setModel('machine') // TODO
            .assignProperties([{ // TODO
                key: 'NAME',
                linkTo: helpers.formulaNode.getOutput()
            }])
            .execute();

        // THEN
        // nodes creation expectations
        expect(helpers.group.nodes).toHaveSize(1);
        const newNode = helpers.group.nodes[0];
        expect(newNode.node.type).toBe('SnObjectCreationNode');
        // TODO add more expectations when data node methods are implemented (set data, properties...)
        expect(helpers.boxInGroup.nodes).toHaveSize(2); // because we created another node (data node) in previous test
        const newNodeInBox = helpers.boxInGroup.nodes[1];
        expect(newNodeInBox.node.type).toBe('SnFormulaNode');

        // nodes linking expectations
    });

    xit('should create operation nodes', () => {
        helpers.formNode = helpers.group.createNode(SnFormNodeHelper)
            .setSmartObject(helpers.objectCreationNode.getOutput().key)
            .setProperties([{
                key: 'NAME',
                config: {
                    display: 'zone',
                    minLength: 3,
                }
            }])
            .activeTags()
            .execute(); // subjet for run calculation (View)

        // THEN
    });

    it('should link flow nodes together', () => {
        // WHEN
        helpers.launcherNode = helpers.group.createNode(SnLauncherNodeHelper);
        helpers.finisherNode = helpers.group.createNode(SnFinisherNodeHelper);

        helpers.workflow.chainLinkNodes(
            helpers.launcherNode,
            helpers.objectCreationNode,
            //helpers.formNode, // TODO
            helpers.finisherNode
        );

        helpers.workflow.update();

        // THEN
        const nodeTypes = data.view.nodes.map(n => n.type);
        // checking flow nodes existence
        expect(nodeTypes).toContain('SnLauncherNode');
        expect(nodeTypes).toContain('SnObjectCreationNode');
        //expect(nodeTypes).toContain('SnFormNodeHelper'); //TODO
        expect(nodeTypes).toContain('SnFinisherNode');

        // checking flow nodes connections
        const launcherNode = data.view.nodes.find(n => n.type === 'SnLauncherNode');
        const objectCreationNode = data.view.nodes.find(n => n.type === 'SnObjectCreationNode');
        // const formNode = data.view.nodes.find(n => n.type === 'SnFormNodeHelper'); // TODO
        const finisherNode = data.view.nodes.find(n => n.type === 'SnFinisherNode');

        expect(launcherNode.flows).toHaveSize(1); // only out
        expect(objectCreationNode.flows).toHaveSize(2); // in / out
        //expect(formNode.flows).toHaveSize(2); // in / out // TODO
        expect(finisherNode.flows).toHaveSize(1); // only in

        expect(launcherNode.flows[0].toward).toBe(objectCreationNode.flows[0].id);
        // expect(objectCreationNode.flows[0].toward).toBe(launcherNode.flows[0].id);
        expect(objectCreationNode.flows[1].toward).toBe(finisherNode.flows[0].id);
        // TODO add links to formNode
        // expect(finisherNode.flows[0].toward).toBe(objectCreationNode.flows[1].id);
    });
});
