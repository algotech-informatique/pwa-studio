import { SnParam } from 'src/app/shared/modules/smart-nodes/models';
import { NodeHelper } from '../../../helper/class';

export class SnAlertNodeHelper extends NodeHelper<SnAlertNodeHelper> {
    public setTitle(data: { value?: string; relativeTo?: SnParam }): SnAlertNodeHelper {
        this.setParamValue({ key: 'alertTitle', ...data });
        return this;
    }

    public setMessage(data: { value?: string; relativeTo?: SnParam }): SnAlertNodeHelper {
        this.setParamValue({ key: 'alertMessage', ...data });
        return this;
    }

    public setType(type: 'information' | 'warning' | 'error' /* TODO is there an enum somewhere ? */): SnAlertNodeHelper {
        this.getParam('alertType').value = type;
        return this;
    }
}
