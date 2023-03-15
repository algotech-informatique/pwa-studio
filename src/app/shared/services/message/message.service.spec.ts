import { MessageService } from './message.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

describe('MessageService', () => {
    it('should create an instance', () => {
        const srv = new MessageService();
        expect(srv).toBeTruthy();
    });
    it('match regex (1)', () => {
        const srv = new MessageService();
        expect(srv._match('t*', 'test')).toEqual(true);
    });
    it('match regex (2)', () => {
        const srv = new MessageService();
        expect(srv._match('t*', 'z')).toEqual(false);
    });
    it('should send a message', () => {
        const message = { cmd: 'test', payload: { a: 0 } };
        const srv = new MessageService();

        srv._messages.subscribe((res) => {
            expect(res).toEqual(message);
        })
        srv.send(message.cmd, message.payload);
    });
    it('should get a message', () => {
        const message = { cmd: 'test', payload: { a: 0 } };
        const srv = new MessageService();

        srv.getAll().subscribe((res) => {
            expect(res).toEqual(message);
        })
        srv.send(message.cmd, message.payload);
    });
    it('should get a filtered message', () => {
        const message = { cmd: 'test', payload: { a: 0 } };
        const srv = new MessageService();

        srv.get(message.cmd).subscribe((res) => {
            expect(res).toEqual(message.payload);
        })
        srv.send(message.cmd, message.payload);
    });
    it('should get a filtered message with Regex', () => {
        const message = { cmd: 'test', payload: { a: 0 } };
        const srv = new MessageService();

        srv.get('t*').subscribe((res) => {
            expect(res).toEqual(message.payload);
        })
        srv.send(message.cmd, message.payload);
    });
    it('should not receive a filtered message', () => {
        const message = { cmd: 'test', payload: { a: 0 } };
        const srv = new MessageService();

        srv.get('t*').subscribe((res) => {
            if (res === 'z') {
                fail();
            } else {
                expect(res).toEqual(message.payload);
            }
        })
        srv.send('z', 'error');
        srv.send(message.cmd, message.payload);
    });
});
