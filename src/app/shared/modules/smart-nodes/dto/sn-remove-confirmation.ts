import { SnRemoveSelection } from './sn-remove-selection';

export type SnRemoveConfirmation = (selection: SnRemoveSelection, done: () => void) => void;
