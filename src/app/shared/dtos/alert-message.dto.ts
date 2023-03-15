export class AlertMessageDto {
    type: 'none' | 'info' | 'error' | 'question' | 'warning';
    title?: string;
    message: string;
    confirm: string;
    cancel?: string;
    messageButton: boolean;
    dataUuid?: string;
    detail?: string;
}
