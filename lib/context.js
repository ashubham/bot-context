/**
 * 
 * 
 * @class Context
 */
class Context {
    /**
     * Creates an instance of Context.
     * @param {string} key 
     * 
     * @memberOf Context
     */
    constructor(key) {
        this.key = key;
        this.handlers = new Map();
    }

    /**
     * Matcher method called when matching contexts.
     * 
     * @callback matcherFn
     * @param {string} text input text
     * @param {Function} cb Callback resolving to truthy/falsy value.
     */
    /**
     * Context callback set in the context stack.
     * 
     * @callback ContextCb
     */

    /**
     * Set the current context. 
     * 
     * @param {RegExp|matcherFn} pattern 
     * @param {ContextCb} callback 
     * 
     * @memberOf Context
     */
    set(pattern, callback) {
        var patternFn = pattern;
        if(typeof patternFn !== 'function') {
            patternFn = function(text, cb) {
                let re = new RegExp(pattern, 'i');
                let match = text.match();
                return cb(null, match);
            }
        }
        // Delete and set to ensure the new context is at the end.
        // According to spec, entries in map are stored in insertion order.
        this.handlers.delete(patternFn);
        this.handlers.set(patternFn, callback);
    }

    /**
     * Returns whethere there is any context set.
     * 
     * @returns {boolean}
     * 
     * @memberOf Context
     */
    isSet() {
        return this.handlers.size > 0;
    }

    /**
     * Callback when a context is matched.
     *
     * @callback contextMatchedCb
     * @param {string|null} err - Error if any
     * @param {any} match the match returned from the matchFn or regex
     * @param {ContextCb} callback the callback set to the context stack.
     */

    /**
     * Match an input text to the collection of currently set contexts.
     * 
     * @param {string} input text 
     * @param {contextMatchedCb} callback The callback to be called if matched.
     * @returns 
     * 
     * @memberOf Context
     */
    match(text, cb) {
        if(!text) {
            return cb('input text cannot be empty');
        }

        var handlerStack = [...this.handlers].reverse();
        for(let [pattern, contextHandler] of handlerStack) {
            pattern(text, function(err, match) {
                if(!!match) {
                    return cb(
                        null,
                        match,
                        contextHandler
                    );
                }
            });
        }
        return cb('No match found');
    }
}

module.exports = Context;