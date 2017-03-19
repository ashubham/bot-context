/**
 * 
 * 
 * @class Context
 */
class Context {
    constructor(key) {
        this.key = key;
        this.handlers = new Map();
    }

    /**
     * Set the current context. 
     * 
     * @param {RegExp|Function} pattern 
     * @param {Function} callback 
     * 
     * @memberOf Context
     */
    set(pattern, callback) {
        if(typeof pattern !== 'function') {
            pattern = function(text, cb) {
                let match = new RegExp(pattern, 'i').match(text);
                return cb(match);
            }
        }
        // Delete and set to ensure the new context is at the end.
        // According to spec, entries in map are stored in insertion order.
        this.handlers.delete(pattern);
        this.handlers.set(pattern, callback);
    }

    isSet() {
        return this.handlers.size > 0;
    }

    /**
     * Match an input text to the collection of currently set contexts.
     * 
     * @param {string} text 
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