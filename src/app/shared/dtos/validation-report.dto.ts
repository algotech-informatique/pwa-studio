import { SnNode, SnConnector } from '../modules/smart-nodes';
import { CheckEvent } from './check-options.dto';
import { ReportData } from './report-data.dto';

export class ValidationReportDto {
    _id: string;
    checkEvent: CheckEvent; 
    type: 'SF' | 'WF' | 'SM' | 'APP';
    caption: string;
    errors: ReportData[];
    warnings: ReportData[];
    infos: ReportData[];    
}
