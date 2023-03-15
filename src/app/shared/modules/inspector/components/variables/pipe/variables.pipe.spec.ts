import { KeyToDisplayPipe } from './variables.pipe';

describe('VariablesPipe', () => {
  it('create an instance', () => {
    const pipe = new KeyToDisplayPipe();
    expect(pipe).toBeTruthy();
  });
});
