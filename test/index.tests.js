let contextMap = require('../index');
let ContextMap = require('../lib/context-map');

describe('bot-context', function () {
    it('should return an instance of the context map', () => {
        expect(contextMap instanceof ContextMap).toBe(true);
    });
})