import { SnConnector } from '../models';

export class SnLinkMatrice {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    link: {
        id: string;
        connector?: SnConnector,
        style?: string;
        lineSize: number;
    };
    circles: {
        x: number,
        y: number,
        stroke?: string,
        r?: number,
    }[];
}
