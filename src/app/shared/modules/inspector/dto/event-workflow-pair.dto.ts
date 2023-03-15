export class EventWorkflowPairDto {
    profiles: EventWorkflowPairProfileDto[];
}

export class EventWorkflowPairProfileDto {
    uuid: string;
    groups: string[];
}
