import { SnElement, SnLang } from 'src/app/shared/modules/smart-nodes';

export default class TestUtils {
    public static findElementWithDisplayName<T extends SnElement>(elements: Array<T>, displayName: string): T {
        return elements.find(element => {
            if (typeof element.displayName === 'string') {
                return element.displayName === displayName;
            } else {
                return element.displayName.map(lang => lang.value).includes(displayName);
            }
        });
    }
}
