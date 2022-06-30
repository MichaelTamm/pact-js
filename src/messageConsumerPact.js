"use strict";
/**
 * @module Message
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asynchronousBodyHandler = exports.synchronousBodyHandler = exports.MessageConsumerPact = void 0;
var lodash_1 = require("lodash");
var pact_core_1 = __importDefault(require("@pact-foundation/pact-core"));
var matchers_1 = require("./dsl/matchers");
var logger_1 = __importStar(require("./common/logger"));
var configurationError_1 = __importDefault(require("./errors/configurationError"));
var isMessage = function (x) {
    return x.contents !== undefined;
};
/**
 * A Message Consumer is analagous to a Provider in the HTTP Interaction model.
 * It is the receiver of an interaction, and needs to be able to handle whatever
 * request was provided.
 */
var MessageConsumerPact = /** @class */ (function () {
    function MessageConsumerPact(config) {
        this.config = config;
        // Build up a valid Message object
        this.state = {};
        if (!(0, lodash_1.isEmpty)(config.logLevel)) {
            (0, logger_1.setLogLevel)(config.logLevel);
            pact_core_1.default.logLevel(config.logLevel);
        }
    }
    // eslint-disable-next-line class-methods-use-this
    MessageConsumerPact.prototype.getServiceFactory = function () {
        return pact_core_1.default;
    };
    /**
     * Gives a state the provider should be in for this Message.
     *
     * @param {string} providerState - The state of the provider.
     * @returns {Message} MessageConsumer
     */
    MessageConsumerPact.prototype.given = function (providerState) {
        if (providerState) {
            // Currently only supports a single state
            // but the format needs to be v3 compatible for
            // basic interoperability
            this.state.providerStates = [
                {
                    name: providerState,
                },
            ];
        }
        return this;
    };
    /**
     * A free style description of the Message.
     *
     * @param {string} description - A description of the Message to be received
     * @returns {Message} MessageConsumer
     */
    MessageConsumerPact.prototype.expectsToReceive = function (description) {
        if ((0, lodash_1.isEmpty)(description)) {
            throw new configurationError_1.default('You must provide a description for the Message.');
        }
        this.state.description = description;
        return this;
    };
    /**
     * The content to be received by the message consumer.
     *
     * May be a JSON document or JSON primitive.
     *
     * @param {string} content - A description of the Message to be received
     * @returns {Message} MessageConsumer
     */
    MessageConsumerPact.prototype.withContent = function (content) {
        if ((0, lodash_1.isEmpty)(content)) {
            throw new configurationError_1.default('You must provide a valid JSON document or primitive for the Message.');
        }
        this.state.contents = content;
        return this;
    };
    /**
     * Message metadata
     *
     * @param {string} metadata -
     * @returns {Message} MessageConsumer
     */
    MessageConsumerPact.prototype.withMetadata = function (metadata) {
        if ((0, lodash_1.isEmpty)(metadata)) {
            throw new configurationError_1.default('You must provide valid metadata for the Message, or none at all');
        }
        this.state.metadata = metadata;
        return this;
    };
    /**
     * Returns the Message object created.
     *
     * @returns {Message}
     */
    MessageConsumerPact.prototype.json = function () {
        return this.state;
    };
    /**
     * Creates a new Pact _message_ interaction to build a testable interaction.
     *
     * @param handler A message handler, that must be able to consume the given Message
     * @returns {Promise}
     */
    MessageConsumerPact.prototype.verify = function (handler) {
        var _this = this;
        logger_1.default.info('Verifying message');
        return this.validate()
            .then(function () { return (0, lodash_1.cloneDeep)(_this.state); })
            .then(function (clone) {
            return handler(__assign(__assign({}, clone), { contents: (0, matchers_1.extractPayload)(clone.contents) }));
        })
            .then(function () {
            return _this.getServiceFactory().createMessage({
                consumer: _this.config.consumer,
                content: JSON.stringify(_this.state),
                dir: _this.config.dir,
                pactFileWriteMode: _this.config.pactfileWriteMode,
                provider: _this.config.provider,
                spec: 3,
            });
        });
    };
    /**
     * Validates the current state of the Message.
     *
     * @returns {Promise}
     */
    MessageConsumerPact.prototype.validate = function () {
        if (isMessage(this.state)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('message has not yet been properly constructed'));
    };
    return MessageConsumerPact;
}());
exports.MessageConsumerPact = MessageConsumerPact;
// TODO: create more basic adapters for API handlers
// bodyHandler takes a synchronous function and returns
// a wrapped function that accepts a Message and returns a Promise
function synchronousBodyHandler(handler) {
    return function (m) {
        var body = m.contents;
        return new Promise(function (resolve, reject) {
            try {
                var res = handler(body);
                resolve(res);
            }
            catch (e) {
                reject(e);
            }
        });
    };
}
exports.synchronousBodyHandler = synchronousBodyHandler;
// bodyHandler takes an asynchronous (promisified) function and returns
// a wrapped function that accepts a Message and returns a Promise
// TODO: move this into its own package and re-export?
function asynchronousBodyHandler(handler) {
    return function (m) { return handler(m.contents); };
}
exports.asynchronousBodyHandler = asynchronousBodyHandler;
//# sourceMappingURL=messageConsumerPact.js.map