
import { RulesStack } from '../../../../../models/check-rule.interface';
import {
  crudObjectRule, nodeRProfileRule,
  snConnectorNodeRule, snDataNodeRule,
  snLoopNodeRule, snMultiChoiceNodeRule, snServiceSmartObjectV2NodeRule, snSubWorkflowNodeRule, snSwitchNodeRule
} from './flow/flow-nodes-rules';
import { flowOptIncorrectApiRule, flowOptIncorrectVarRule } from './flow/flow-options-rules';
import { emailRecipientRule, emailRule, flowRequiredValueRule,
    flowWrongTypeRule, paramConnectedRule } from './flow/flow-params-rules';
import {
  nodeDupplicateRule, nodeParamDupplicateRule,
  nodeParamTypeUdefinedRule, nodeParamUnconsistentTypeRule,
  nodePermissionRule
} from './smart-models/smart-models-rules';

export const smartModelsNodeRules: RulesStack = {
  code: 'SM.NODE', rules: [
    { code: 'SM.NODE.001', rule: nodeDupplicateRule },
    { code: 'SM.NODE.002', rule: nodePermissionRule },
  ]
};

export const smartModelsParamsRules: RulesStack = {
  code: 'SM.PARAM', rules: [
    { code: 'SM.PARAM.001', rule: nodeParamTypeUdefinedRule },
    { code: 'SM.PARAM.002', rule: nodeParamUnconsistentTypeRule },
    { code: 'SM.PARAM.003', rule: nodeParamDupplicateRule }
  ]
};

export const snViewRules: RulesStack = {
  code: 'SN', rules: [
    { code: 'SN.001', rule: flowOptIncorrectApiRule },
    { code: 'SN.002', rule: flowOptIncorrectVarRule },
  ]
};

export const snViewNodeRules: RulesStack = {
  code: 'SN.NODE', rules: [
    { code: 'SN.NODE.001', rule: snDataNodeRule },
    { code: 'SN.NODE.002', rule: crudObjectRule },
    { code: 'SN.NODE.003', rule: snLoopNodeRule },
    { code: 'SN.NODE.004', rule: snMultiChoiceNodeRule },
    { code: 'SN.NODE.005', rule: snSubWorkflowNodeRule },
    { code: 'SN.NODE.006', rule: snConnectorNodeRule },
    { code: 'SN.NODE.007', rule: snServiceSmartObjectV2NodeRule },
    { code: 'SN.NODE.008', rule: nodeRProfileRule },
    { code: 'SN.NODE.009', rule: snSwitchNodeRule },
  ]
};

export const snViewParamsRules: RulesStack = {
  code: 'SN.PARAM', rules: [
    { code: 'SN.PARAM.001', rule: flowRequiredValueRule },
    { code: 'SN.PARAM.002', rule: flowWrongTypeRule },
    { code: 'SN.PARAM.003', rule: emailRule },
    { code: 'SN.PARAM.004', rule: emailRecipientRule },
    { code: 'SN.PARAM.005', rule: paramConnectedRule },
  ]
};
