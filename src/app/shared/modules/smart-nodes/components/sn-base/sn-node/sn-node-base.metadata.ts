export const SN_BASE_METADATA = {
    selector: 'sn-node-base',
    template: `
        <div class="node" *ngIf="node">
            <sn-flows
                *ngIf="node.flows?.length > 0"
                [snView]="snView"
                [flows]="node.flows"
                [node]="node"
                [languages]="settings.languages"
            >
            </sn-flows>

            <sn-params
                *ngIf="node.params?.length > 0"
                [params]="node.params"
                [snView]="snView"
                [node]="node"
            ></sn-params>

            <sn-sections
                *ngIf="node.sections?.length > 0"
                [sections]="node.sections"
                [snView]="snView"
                [settings]="settings"
                [node]="node"
                (sectionClicked)="onSectionClicked($event)"
                >
            </sn-sections>
        </div>
    `,
};
