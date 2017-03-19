let ContextMap = require('../lib/context-map');
let Context = require('../lib/context');

describe('Context Map', function() {
    it('getOrCreate method should create and return a new context for a new key', () => {
        let ctxMap = new ContextMap();
        let ctx = ctxMap.getOrCreate('key1');
        expect(ctx instanceof Context).toBe(true);
    });
})

