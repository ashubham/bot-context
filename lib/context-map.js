var Logger = require('log4js');
var Context = require('./context');
var _logger = Logger.getLogger("ContextMap");

/**
 * A map to hold contexts for all users/keys
 * 
 * @class ContextMap
 * @extends {Map}
 */
class ContextMap extends Map {
    /**
     * Creates an instance of ContextMap.
     * @param {any} args 
     * 
     * @memberOf ContextMap
     */
    constructor(...args) {
        super(...args);
    }

    /**
     * Creates a new context entry in the ContextMap
     * 
     * @param {string} uKey 
     * @returns Context
     * 
     * @memberOf ContextMap
     * @private
     */
    create(uKey) {
        if(!uKey) {
            return;
        }
        let context = new Context(uKey);
        super.set(uKey, context);
        _logger.debug(`New context created ${uKey}`);
        return context;
    }

    /**
     * Get Or Creates a context given the key.
     * 
     * @param {string} uKey 
     * @returns {Context}
     * 
     * @memberOf ContextMap
     */
    getOrCreate(uKey) {
        if(this.has(uKey)) {
            return this.get(uKey);
        } else {
            return this.create(uKey);
        }
    }
}

module.exports = ContextMap;