/* eslint-disable max-len */
import { SelectIconComponent } from './components/select-icon/select-icon.component';
import { EventsCardsComponent } from './app-inspector/widget-parameters/events-parameters/events-cards/events-cards.component';
import { EventTypePipe } from './pipes/event-type.pipe';
import { ObjectInputComponent } from './components/input-element/object-input/object-input.component';
import { EventInputsComponent } from './app-inspector/widget-parameters/events-parameters/events-cards/event-card/event-inputs/event-inputs.component';
import { EventTypeIconPipe } from './pipes/event-type-icon.pipe';
import { EventsParametersComponent } from './app-inspector/widget-parameters/events-parameters/events-parameters.component';
import { DataSelectorComponent } from './components/data-selector/data-selector.component';
import { PageParametersComponent } from './app-inspector/page-parameters/page-parameters.component';
import { AppParametersComponent } from './app-left-inspector/app-parameters/app-parameters.component';
import { PageWidgetParametersService } from './services/page-widget-parameters.service';
import { WidgetParametersComponent } from './app-inspector/widget-parameters/widget-parameters.component';
// tslint:disable-next-line: max-line-length
import { InspectorWidgetDirective } from './directives/inspector-widget.directive';
import { RangeSliderElementComponent } from './components/range-slider-element/range-slider-element.component';
import { DisplayTextElementComponent } from './components/display-text-element/display-text-element.component';
import { DisplayTranslateElementComponent } from './components/display-translate-element/display-translate-element.component';
import { DisplayInputElementComponent } from './components/display-input-element/display-input-element.component';
import { AppInspectorComponent } from './app-inspector/app-inspector.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartFlowInspectorComponent } from './smart-flow-inspector/smart-flow-inspector.component';
import { InspectorSectionComponent } from './components/inspector-section/inspector-section.component';
import { PipesModule, DirectivesModule } from '@algotech-ce/angular';
import { DisplayNameElementComponent } from './components/display-name-element/display-name-element.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { VariablesComponent } from './components/variables/variables.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ColorElementComponent } from './components/color-element/color-element.component';
import { InspectorOptionsComponent } from './components/inspector-options/inspector-options.component';
import { WorkFlowInspectorComponent } from './work-flow-inspector/work-flow-inspector.component';
import { DataModelInspectorComponent } from './data-model-inspector/data-model-inspector.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { DisplayKeyElementComponent } from './components/display-key-element/display-key-element.component';
import { ParamInspectorComponent } from './components/param-inspector/param-inspector.component';
import { PopUpModule } from '../../components/pop-ups/pop-up.module';
import { LauchParamConditionComponent } from './components/param-condition/param-condition.component';
import { ParamEditorService } from './services/param-editor.service';
import { InspectorOptionsService } from './components/inspector-options/inspector-options.service';
import { DisplayRadioElementComponent } from './components/display-radio-element/display-radio-element.component';
import { DataModelInspectorService } from './data-model-inspector/data-model-inspector.service';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { VariablesServices } from './components/variables/variables.service';
import { FieldInspectorComponent } from './components/field-inspector/field-inspector.component';
import { DataInputsModule } from './data-inputs/data-inputs.module';
import { SelectTypesComponent } from '../../components/select-types/select-types.component';
import { KeyToDisplayPipe } from './components/variables/pipe/variables.pipe';
import { DragSelectorWidgetDirective } from './components/drag-widget/drag-selector-widget.directive';
import { WidgetParametersPropertiesComponent } from './app-inspector/widget-parameters/widget-parameters-properties/widget-parameters-properties.component';
import { EventCardComponent } from './app-inspector/widget-parameters/events-parameters/events-cards/event-card/event-card.component';
import { SelectElementComponent } from './components/select-element/select-element.component';
import { InputElementComponent } from './components/input-element/input-element.component';
import { EventActionPipe } from './pipes/event-action.pipe';
import { PageVariablesParametersComponent } from './app-inspector/page-parameters/page-variables-parameters/page-variables-parameters.component';
import { DisplayCheckElementComponent } from './components/display-check-element/display-check-element.component';
import { MultiSelectElementComponent } from './components/multi-select-element/multi-select-element.component';
import { ATAppModule } from '../app/at-app.module';
import { ListPaginablePipe } from './pipes/list.paginable.pipe';
import { ColorPickerModule } from 'ngx-color-picker';
import { PopupElementComponent } from './components/popup-element/popup-element.component';
import { PopupElementService } from './components/popup-element/popup-element.service';
import { EventProfilesComponent } from './app-inspector/widget-parameters/events-parameters/events-cards/event-card/event-profiles/event-profiles.component';
import { InheritEventCardsComponent } from './app-inspector/widget-parameters/events-parameters/inherit-event-cards/inherit-event-cards.component';
import { DisplayDefinitionValuesComponent } from './components/display-definition-values/display-definition-values.component';
import { PageZoomParametersComponent } from './app-inspector/page-parameters/page-zoom-parameters/page-zoom-parameters.component';
import { RulesParametersComponent } from './app-inspector/widget-parameters/rules-parameters/rules-parameters.component';
import { RuleConditionsComponent } from './app-inspector/widget-parameters/rules-parameters/rule-conditions/rule-conditions.component';
import { RuleConditionComponent } from './app-inspector/widget-parameters/rules-parameters/rule-conditions/rule-condition/rule-condition.component';
import { PrimitiveInputComponent } from './components/input-element/primitive-input/primitive-input.component';
import { OpenApiParametersComponent } from './smart-flow-inspector/open-api-parameters/open-api-parameters.component';
import { InspectorLayoutComponent } from './inspector-layout/inspector-layout.component';
import { RouteParametersComponent } from './smart-flow-inspector/route-parameters/route-parameters.component';
import { RouteVariablesComponent } from './smart-flow-inspector/route-parameters/route-variables/route-variables.component';
import { RouteVariableInsideCardComponent } from './smart-flow-inspector/route-parameters/route-variables/route-variable-inside-card/route-variable-inside-card.component';
import { RouteBodyComponent } from './smart-flow-inspector/route-parameters/route-body/route-body.component';
import { InspectorLayoutService } from './inspector-layout/inspector-layout.service';
import { DesignParametersComponent } from './app-inspector/design-parameters/design-parameters.component';
import { DesignPositionParametersComponent } from './app-inspector/design-parameters/design-position-parameters/design-position-parameters.component';
import { DesignStyleParametersComponent } from './app-inspector/design-parameters/design-style-parameters/design-style-parameters.component';
import { DesignStyleBorderParametersComponent } from './app-inspector/design-parameters/design-style-parameters/design-style-border-parameters/design-style-border-parameters.component';
import { DesignStyleAbsPositionParametersComponent } from './app-inspector/design-parameters/design-style-parameters/design-style-absposition-parameters/design-style-absposition-parameters.component';
import { DrawingModule } from '@algotech-ce/business/drawing';
import { DesignStyleRadiusParametersComponent } from './app-inspector/design-parameters/design-style-parameters/design-style-radius-parameters/design-style-radius-parameters.component';
import { DesignStyleShadowParametersComponent } from './app-inspector/design-parameters/design-style-parameters/design-style-shadow-parameters/design-style-shadow-parameters.component';
import { DesignStyleStrokeParametersComponent } from './app-inspector/design-parameters/design-style-parameters/design-style-stroke-parameters/design-style-stroke-parameters.component';
import { DesignStyleTextParametersComponent } from './app-inspector/design-parameters/design-style-parameters/design-style-text-parameters/design-style-text-parameters.component';
import { DesignStyleCounterParametersComponent } from './app-inspector/design-parameters/design-style-parameters/design-style-counter-parameters/design-style-counter-parameters.component';
import { SmartNodesModule } from '../smart-nodes/smart-nodes.module';
import { UITreeComponent } from './app-left-inspector/ui-tree/ui-tree.component';
import { UITreePageComponent } from './app-left-inspector/ui-tree/ui-tree-page/ui-tree-page.component';
import { UITreeLineComponent } from './app-left-inspector/ui-tree/ui-tree-line/ui-tree-line.component';
import { UITreeWidgetComponent} from './app-left-inspector/ui-tree/ui-tree-widget/ui-tree-widget.component';
import { UITreeDragSourceDirective } from './app-left-inspector/ui-tree/directives/ui-tree/ui-tree-drag-data-source.directive';
import { UITreeDragTargetDirective } from './app-left-inspector/ui-tree/directives/ui-tree/ui-tree-drag-data-target.directive';
import { WidgetSelectorComponent } from './app-left-inspector/widget-selector/widget-selector.component';
import { UITreeMoveService } from './app-left-inspector/ui-tree/ui-tree-move.service';
import { AppLeftInspectorComponent } from './app-left-inspector/app-left-inspector.component';
import { SelectInlineElementComponent } from './components/select-inline-element/select-inline-element.component';
import { AppParametersThemeComponent } from './app-left-inspector/app-parameters/app-parameters-theme/app-parameters-theme.component';
import { ThemeEditorModule } from '../../components/theme/theme-editor.module';
import { PreviewSizePipe } from './pipes/preview-size.pipe';
import { DesignStyleLayoutParametersComponent } from './app-inspector/design-parameters/design-style-parameters/design-style-layout-parameters/design-style-layout-parameters.component';
import { DesignWidgetDirective } from './directives/design-widget.directive';
import { DesignStyleIconParametersComponent } from './app-inspector/design-parameters/design-style-parameters/design-style-icon-parameters/design-style-icon-parameters.component';
import { DesignStyleMarginParametersComponent } from './app-inspector/design-parameters/design-style-parameters/design-style-margin-parameters/design-style-margin-parameters.component';
import { DesignStyleMarginPaddingParametersComponent } from './app-inspector/design-parameters/design-style-parameters/design-style-margin-padding-parameters/design-style-margin-padding-parameters.component';
import { UITreeWidgetSharedComponent } from './app-left-inspector/ui-tree/ui-tree-shared-widgets/ui-tree-shared-widget.component';
import { LockInspectorSectionComponent } from './components/lock-inpector-section/lock-inspector-section.component';
import { AngularSplitModule } from 'angular-split';
import { AppInspectorSectionComponent } from './components/app-inspector-section/app-inspector-section.component';
import { DesignCustomParametersComponent } from './app-inspector/design-parameters/design-custom-parameters/design-custom-parameters.component';
import { ParameterPipe } from './pipes/parameter.pipe';
import { EventCardTypePageNavComponent } from './app-inspector/widget-parameters/events-parameters/events-cards/event-card/event-card-type/event-card-type-page-nav/event-card-type-page-nav.component';
import { EventCardTypeSmartflowComponent } from './app-inspector/widget-parameters/events-parameters/events-cards/event-card/event-card-type/event-card-type-smartflow/event-card-type-smartflow.component';
import { EventCardTypeWorkflowComponent } from './app-inspector/widget-parameters/events-parameters/events-cards/event-card/event-card-type/event-card-type-workflow/event-card-type-workflow.component';
import { EventCardTypePageComponent } from './app-inspector/widget-parameters/events-parameters/events-cards/event-card/event-card-type/event-card-type-page/event-card-type-page.component';
import { EventCardTypeCallOnloadComponent } from './app-inspector/widget-parameters/events-parameters/events-cards/event-card/event-card-type/event-card-type-call-onload/event-card-type-call-onload.component';
import { EventCardTypeUrlComponent } from './app-inspector/widget-parameters/events-parameters/events-cards/event-card/event-card-type/event-card-type-url/event-card-type-url.component';
import { EventCardTypeSmartobjectsComponent } from './app-inspector/widget-parameters/events-parameters/events-cards/event-card/event-card-type/event-card-type-smartobjects/event-card-type-smartobjects.component';

@NgModule({
    declarations: [
        SmartFlowInspectorComponent,
        WorkFlowInspectorComponent,
        DataModelInspectorComponent,
        AppInspectorSectionComponent,
        InspectorSectionComponent,
        InspectorOptionsComponent,
        DisplayNameElementComponent,
        DisplayKeyElementComponent,
        ColorElementComponent,
        VariablesComponent,
        PermissionsComponent,
        ProfilesComponent,
        ParamInspectorComponent,
        LauchParamConditionComponent,
        DisplayRadioElementComponent,
        FieldInspectorComponent,
        SelectTypesComponent,
        KeyToDisplayPipe,
        DragSelectorWidgetDirective,
        AppInspectorComponent,
        WidgetParametersComponent,
        WidgetParametersPropertiesComponent,
        RulesParametersComponent,
        RuleConditionsComponent,
        RuleConditionComponent,
        DisplayTextElementComponent,
        DisplayTranslateElementComponent,
        DisplayInputElementComponent,
        RangeSliderElementComponent,
        InspectorWidgetDirective,
        AppParametersComponent,
        PageParametersComponent,
        DataSelectorComponent,
        EventInputsComponent,
        EventsParametersComponent,
        EventTypeIconPipe,
        EventCardComponent,
        SelectElementComponent,
        ObjectInputComponent,
        InputElementComponent,
        PrimitiveInputComponent,
        EventActionPipe,
        EventTypePipe,
        ListPaginablePipe,
        PreviewSizePipe,
        ParameterPipe,
        EventsCardsComponent,
        DisplayCheckElementComponent,
        PageVariablesParametersComponent,
        DisplayDefinitionValuesComponent,
        MultiSelectElementComponent,
        SelectIconComponent,
        PopupElementComponent,
        EventProfilesComponent,
        InheritEventCardsComponent,
        PageZoomParametersComponent,
        OpenApiParametersComponent,
        InspectorLayoutComponent,
        RouteParametersComponent,
        RouteVariablesComponent,
        RouteVariableInsideCardComponent,
        RouteBodyComponent,
        DesignParametersComponent,
        DesignCustomParametersComponent,
        DesignPositionParametersComponent,
        DesignParametersComponent,
        DesignStyleParametersComponent,
        DesignStyleBorderParametersComponent,
        DesignStyleAbsPositionParametersComponent,
        DesignStyleRadiusParametersComponent,
        DesignStyleShadowParametersComponent,
        DesignStyleStrokeParametersComponent,
        DesignStyleTextParametersComponent,
        DesignStyleIconParametersComponent,
        DesignStyleCounterParametersComponent,
        DesignStyleMarginParametersComponent,
        WidgetSelectorComponent,
        UITreeComponent,
        UITreePageComponent,
        UITreeLineComponent,
        UITreeWidgetComponent,
        UITreeWidgetSharedComponent,
        UITreeDragSourceDirective,
        UITreeDragTargetDirective,
        AppLeftInspectorComponent,
        SelectInlineElementComponent,
        AppParametersThemeComponent,
        DesignStyleLayoutParametersComponent,
        DesignWidgetDirective,
        DesignStyleIconParametersComponent,
        DesignStyleMarginParametersComponent,
        DesignStyleMarginPaddingParametersComponent,
        LockInspectorSectionComponent,
        EventCardTypePageNavComponent,
        EventCardTypeSmartflowComponent,
        EventCardTypeWorkflowComponent,
        EventCardTypePageComponent,
        EventCardTypeCallOnloadComponent,
        EventCardTypeUrlComponent,
        EventCardTypeSmartobjectsComponent,
    ],
    imports: [
        FormsModule,
        CommonModule,
        PipesModule,
        DragDropModule,
        TranslateModule,
        DragDropModule,
        PopUpModule,
        DataInputsModule,
        SmartNodesModule,
        DirectivesModule,
        ATAppModule,
        ColorPickerModule,
        DrawingModule,
        ThemeEditorModule,
        AngularSplitModule
    ],
    exports: [
        SmartFlowInspectorComponent,
        WorkFlowInspectorComponent,
        DataModelInspectorComponent,
        SelectTypesComponent,
        KeyToDisplayPipe,
        AppInspectorComponent,
        EventInputsComponent,
        InputElementComponent,
        InspectorSectionComponent,
        AppInspectorSectionComponent,
        DisplayInputElementComponent,
        DisplayNameElementComponent,
        DisplayTextElementComponent,
        DisplayTranslateElementComponent,
        ColorElementComponent,
        RangeSliderElementComponent,
        EventsCardsComponent,
        SelectIconComponent,
        SelectElementComponent,
        MultiSelectElementComponent,
        DisplayRadioElementComponent,
        DisplayCheckElementComponent,
        DisplayDefinitionValuesComponent,
        ListPaginablePipe,
        AppLeftInspectorComponent,
        SelectInlineElementComponent,
        LockInspectorSectionComponent,
        DesignStyleParametersComponent,
        DesignStyleTextParametersComponent,
    ],
    providers: [
        ParamEditorService,
        InspectorOptionsService,
        DataModelInspectorService,
        VariablesServices,
        PageWidgetParametersService,
        KeyToDisplayPipe,
        EventTypeIconPipe,
        EventActionPipe,
        EventTypePipe,
        PopupElementService,
        InspectorLayoutService,
        UITreeMoveService,
    ],
})
export class InspectorModule { }
