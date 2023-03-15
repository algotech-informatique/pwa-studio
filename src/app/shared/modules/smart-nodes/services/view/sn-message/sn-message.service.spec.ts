import { SnMessageService } from './sn-message.service';

describe('MessageService', () => {
    it('should create an instance', () => {
        const srv = new SnMessageService();
        expect(srv).toBeTruthy();
    });
    it('match regex (1)', () => {
        const srv = new SnMessageService();
        expect(srv._match('t*', 'test')).toEqual(true);
    });
    it('match regex (2)', () => {
        const srv = new SnMessageService();
        expect(srv._match('t*', 'z')).toEqual(false);
    });
});
