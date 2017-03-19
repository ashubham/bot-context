let Context = require('../lib/context');

describe('Context', function() {
    it('set method should put an entry in handlers', () => {
        let ctx = new Context('key1');
        expect(ctx.handlers.size).toBe(0);
        ctx.set('/yes/', (match, cb) => {
            cb();
        });
        expect(ctx.handlers.size).toBe(1);
    });

    it('match method should call the callback with correct params on match', (done) => {
        let ctx = new Context('key1');
        let callback = jasmine.createSpy();
        ctx.set(/yes/, callback);
        ctx.match('yes', (err, match, contextCb) => {
            expect(contextCb).toBe(callback);
            done();
        });
    })
});