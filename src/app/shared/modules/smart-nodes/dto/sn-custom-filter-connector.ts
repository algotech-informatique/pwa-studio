import { SnConnector } from '../models';
export type SnCustomFilterConnector<T extends SnConnector> = (connectorIn: T, connectorOut: T) => boolean;
