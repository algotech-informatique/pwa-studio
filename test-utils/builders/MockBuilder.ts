import _ from 'lodash';

export abstract class MockBuilder<T> {
    build(): T {
        return this as unknown as T;
    }

    toPlainObject() {
        return JSON.parse(JSON.stringify(this.build()));
    }

    /**
     * Sets a fixture object as default for the built mock
     *
     * @param fixture can be partial, attributes not present in the fixture will have the default value defined in builder's constructor
     */
    from(fixture: Partial<T>): MockBuilder<T> {
        Object.keys(fixture).forEach(key => {
            this[key] = _.cloneDeep(fixture[key]);
        });
        return this;
    }
}
