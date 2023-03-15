import { InterpretorSoUtils } from '@algotech/business';
import { SmartModelDto, WorkflowProfilModelDto, WorkflowVariableModelDto } from '@algotech/core';
import { Injectable } from '@angular/core';
import { SnConnector, SnNode, SnParam, SnUtilsService, SnView } from '../../../smart-nodes';
import { SnConnectorUtilsService, SnCustomSmartConnectionsService } from '../..';
import { SnATNodeUtilsService } from '../../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SessionsService } from '../../../../services/sessions/sessions.service';
import { SnModelsService } from '../../../../services/smart-nodes/smart-nodes.service';
import * as _ from 'lodash';
import { OpenInspectorType } from '../../../app/dto/app-selection.dto';
import { ValidationReportDto } from '../../../../dtos';

@Injectable()
export class SnCheckUtilsService {

  constructor(
    public sessionsService: SessionsService,
    public snUtils: SnUtilsService,
    public snAtNodeUtils: SnATNodeUtilsService,
    public smartConnection: SnCustomSmartConnectionsService,
    public snModelsService: SnModelsService,
    public snConnectorUtils: SnConnectorUtilsService,
  ) { }


  checkModelPermissions(snView: SnView, param: SnParam): boolean {
    const modelNode: SnNode = snView.nodes.find((n: SnNode) =>
      n.custom?.key?.toUpperCase() === (param.types as string).replace('so:', '').toUpperCase()
    );
    const rPermissions: boolean = _.union(param.value?.permissions?.R, param.value?.permissions?.RW).every((r: string) =>
      modelNode.custom?.permissions?.R.includes(r) || modelNode.custom?.permissions?.RW.includes(r)
    );
    return rPermissions;
  }

  verifyProperty(key: string, type: string, checkDeep = false) {
    const models: SmartModelDto[] = this.sessionsService.active.datas.read.smartModels;
    const findModel = models.find((model: SmartModelDto) =>
      model.key.toUpperCase() === type?.replace('so:', '').toUpperCase(),
    );

    if (!findModel) {
      return false;
    }

    if (!checkDeep) {
      return findModel.properties.some((p) => p.key === key);
    }

    const split = InterpretorSoUtils.split(key);
    const findProperty = findModel.properties.find((p) => p.key === split[0]);
    if (!findProperty) {
      return false;
    }
    if (split.length > 1) {
      return this.verifyProperty(key.replace(`${split[0]}.`, ''), findProperty.keyType, checkDeep);
    }
    return true;
  }

  dataExists(snView: SnView, node: SnNode, key: string) {
    // find inputs
    if (snView.options.variables) {
      if (snView.options.variables.some((v: WorkflowVariableModelDto) => v.key === key)) {
        return true;
      }
    }

    // find outputs
    const outputs: SnParam[] = _.reduce(snView.nodes, (results, n: SnNode) => {
      if (node !== n) {
        for (const flow of n.flows) {
          for (const param of flow.params) {
            results.push(param);
          }
        }
      }
      return results;
    }, []);

    return outputs.some((p) => p.key === key);
  }

  nodeActive(snView: SnView, node: SnNode) {
    const flowIn = node.flows.find((f) => f.direction === 'in');
    if (!flowIn) {
      return true;
    }
    return !!this.snUtils.findConnectedFlow(snView, flowIn);
  }

  getProfils(snView: SnView): WorkflowProfilModelDto[] {
    let profiles: WorkflowProfilModelDto[] = [];
    if (snView.options.type === 'workflow') {
      profiles = snView.options.profiles && snView.options.profiles.length > 0 ?
        snView.options.profiles : [];
    }
    return profiles;
  }

  pushError(view: SnView, code: string, report: ValidationReportDto, type: string, node: SnNode,
    connector: SnConnector, key?: string,
    openInspector?: OpenInspectorType) {
    if (node?.displayState) { node.displayState.error = true; }
    if (connector?.displayState) { connector.displayState.error = true; }

    report.errors.push({
      view,
      code,
      type,
      key,
      element: connector ? connector : node,
      parent: node,
      openInspector
    });
  }

  pushWarning(view: SnView, code: string, report: ValidationReportDto, type: string, node: SnNode,
    connector: SnConnector, key?: string,
    openInspector?: OpenInspectorType) {
    if (node?.displayState) { node.displayState.warning = true; }
    if (connector?.displayState) { connector.displayState.warning = true; }

    report.warnings.push({
      view,
      code,
      type,
      key,
      element: connector ? connector : node,
      parent: node,
      openInspector
    });
  }

  pushInfo(view: SnView, code: string, report: ValidationReportDto, type: string, node: SnNode,
    connector: SnConnector, key?: string,
    openInspector?: OpenInspectorType) {
    if (node?.displayState) { node.displayState.info = true; }
    if (connector?.displayState) { connector.displayState.info = true; }

    report.infos.push({
      view,
      code,
      type,
      key,
      element: connector ? connector : node,
      parent: node,
      openInspector
    });
  }
}
