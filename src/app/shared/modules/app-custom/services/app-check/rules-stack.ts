import {
    actionloadRule, actionPageNavRule, actionPageRule, actionSmartflowworkflowRule, actionSmartobjectsRule, actionUrlRule,
} from './rules/action.rules';
import { formulaInputRule, formulaListRule } from './rules/formulas.rules';
import { widgetConditionInputRule, widgetCriteaInputRule, widgetNoConditionRule, widgetNoCriteraRule } from './rules/widget-rules.rules';
import { pageDataSourceRule, pageSingleWidgetRule, pageVarRule } from './rules/page.rules';
import { appIconRule } from './rules/app.rules';
import { widgetTableRule, widgetZoneRule } from './rules/widget-check.rules';
import { RulesStack } from '../../../../models/check-rule.interface';

export const formulaRules: RulesStack = {
    code: 'APP.FORMULA', rules: [
        { code: 'APP.FORMULA.001', rule: formulaInputRule },
        { code: 'APP.FORMULA.002', rule: formulaListRule }]
};

export const actionsRules: RulesStack = {
    code: 'APP.ACTIONS', rules: [
        { code: 'APP.ACTIONS.001', rule: actionUrlRule },
        { code: 'APP.ACTIONS.002', rule: actionSmartobjectsRule },
        { code: 'APP.ACTIONS.003', rule: actionloadRule },
        { code: 'APP.ACTIONS.004', rule: actionSmartflowworkflowRule },
        { code: 'APP.ACTIONS.005', rule: actionPageRule },
        { code: 'APP.ACTIONS.006', rule: actionPageNavRule }
    ]
};

export const widgetRuleRules: RulesStack = {
    code: 'APP.WIDGET.RULES', rules: [
        { code: 'APP.WIDGET.RULES.001', rule: widgetNoConditionRule },
        { code: 'APP.WIDGET.RULES.002', rule: widgetNoCriteraRule },
        { code: 'APP.WIDGET.RULES.003', rule: widgetConditionInputRule },
        { code: 'APP.WIDGET.RULES.004', rule: widgetCriteaInputRule }
    ]
};

export const widgetCheckRules: RulesStack = {
    code: 'APP.WIDGET', rules: [
        { code: 'APP.WIDGET.001', rule: widgetZoneRule },
        { code: 'APP.WIDGET.002', rule: widgetTableRule },
    ]
};
export const pageRules: RulesStack = {
    code: 'APP.PAGE', rules: [
        { code: 'APP.PAGE.001', rule: pageVarRule },
        { code: 'APP.PAGE.002', rule: pageDataSourceRule },
        { code: 'APP.PAGE.003', rule: pageSingleWidgetRule },
    ]
};
export const appRules: RulesStack = {
    code: 'APP', rules: [
        { code: 'APP.001', rule: appIconRule }
    ]
};
