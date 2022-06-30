"use strict";
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
exports.Pact = void 0;
var pact_core_1 = __importDefault(require("@pact-foundation/pact-core"));
var path = __importStar(require("path"));
var cli_color_1 = __importDefault(require("cli-color"));
var process_1 = __importDefault(require("process"));
var lodash_1 = require("lodash");
var interaction_1 = require("../dsl/interaction");
var net_1 = require("../common/net");
var logger_1 = __importStar(require("../common/logger"));
var mockService_1 = require("../dsl/mockService");
var verificationError_1 = __importDefault(require("../errors/verificationError"));
var configurationError_1 = __importDefault(require("../errors/configurationError"));
var tracing_1 = require("./tracing");
var logErrorNoMockServer = function () {
    logger_1.default.error("The pact mock service doesn't appear to be running\n" +
        '  - Please check the logs above to ensure that there are no pact service startup failures\n' +
        '  - Please check that pact lifecycle methods are called in the correct order (setup() needs to be called before this method)\n' +
        '  - Please check that your test code waits for the promises returned from lifecycle methods to complete before calling the next one\n' +
        "  - To learn more about what is happening during your pact run, try setting logLevel: 'DEBUG'");
};
/**
 * Creates a new {@link PactProvider}.
 * @memberof Pact
 * @name create
 * @param {PactOptions} opts
 * @return {@link PactProvider}
 */
var Pact = /** @class */ (function () {
    function Pact(config) {
        this.opts = Pact.createOptionsWithDefaults(config);
        if ((0, lodash_1.isEmpty)(this.opts.consumer)) {
            throw new configurationError_1.default('You must specify a Consumer for this pact.');
        }
        if ((0, lodash_1.isEmpty)(this.opts.provider)) {
            throw new configurationError_1.default('You must specify a Provider for this pact.');
        }
        (0, logger_1.setLogLevel)(this.opts.logLevel);
        pact_core_1.default.logLevel(this.opts.logLevel);
        if (this.opts.logLevel === 'trace') {
            (0, tracing_1.traceHttpInteractions)();
        }
        this.createServer(config);
    }
    Pact.createOptionsWithDefaults = function (opts) {
        return __assign(__assign({}, Pact.defaults), opts);
    };
    /**
     * Setup the pact framework, including start the
     * underlying mock server
     * @returns {Promise}
     */
    Pact.prototype.setup = function () {
        var _this = this;
        return this.checkPort()
            .then(function () { return _this.startServer(); })
            .then(function (opts) {
            _this.setupMockService();
            return Promise.resolve(opts);
        });
    };
    /**
     * Add an interaction to the {@link MockService}.
     * @memberof PactProvider
     * @instance
     * @param {Interaction} interactionObj
     * @returns {Promise}
     */
    Pact.prototype.addInteraction = function (interactionObj) {
        if (!this.mockService) {
            logErrorNoMockServer();
            return Promise.reject(new Error("The pact mock service wasn't running when addInteraction was called"));
        }
        if (interactionObj instanceof interaction_1.Interaction) {
            return this.mockService.addInteraction(interactionObj);
        }
        var interaction = new interaction_1.Interaction();
        if (interactionObj.state) {
            interaction.given(interactionObj.state);
        }
        interaction
            .uponReceiving(interactionObj.uponReceiving)
            .withRequest(interactionObj.withRequest)
            .willRespondWith(interactionObj.willRespondWith);
        return this.mockService.addInteraction(interaction);
    };
    /**
     * Checks with the Mock Service if the expected interactions have been exercised.
     * @memberof PactProvider
     * @instance
     * @returns {Promise}
     */
    Pact.prototype.verify = function () {
        var _this = this;
        if (!this.mockService) {
            logErrorNoMockServer();
            return Promise.reject(new Error("The pact mock service wasn't running when verify was called"));
        }
        return this.mockService
            .verify()
            .then(function () { return _this.mockService.removeInteractions(); })
            .catch(function (e) {
            // Properly format the error
            // eslint-disable-next-line no-console
            console.error('');
            // eslint-disable-next-line no-console
            console.error(cli_color_1.default.red('Pact verification failed!'));
            // eslint-disable-next-line no-console
            console.error(cli_color_1.default.red(e));
            return _this.mockService.removeInteractions().then(function () {
                throw new verificationError_1.default('Pact verification failed - expected interactions did not match actual.');
            });
        });
    };
    /**
     * Writes the Pact and clears any interactions left behind and shutdown the
     * mock server
     * @memberof PactProvider
     * @instance
     * @returns {Promise}
     */
    Pact.prototype.finalize = function () {
        var _this = this;
        if (this.finalized) {
            logger_1.default.warn('finalize() has already been called, this is probably a logic error in your test setup. ' +
                'In the future this will be an error.');
        }
        this.finalized = true;
        if (!this.mockService) {
            logErrorNoMockServer();
            return Promise.reject(new Error("The pact mock service wasn't running when finalize was called"));
        }
        return this.mockService
            .writePact()
            .then(function () { return logger_1.default.info('Pact File Written'); }, function (e) { return Promise.reject(e); })
            .then(function () {
            return new Promise(function (resolve, reject) {
                return _this.server.delete().then(function () { return resolve(); }, function (e) { return reject(e); });
            });
        })
            .catch(function (e) {
            return new Promise(function (resolve, reject) {
                return _this.server.delete().finally(function () { return reject(e); });
            });
        });
    };
    /**
     * Writes the pact file out to file. Should be called when all tests have been performed for a
     * given Consumer <-> Provider pair. It will write out the Pact to the
     * configured file.
     * @memberof PactProvider
     * @instance
     * @returns {Promise}
     */
    Pact.prototype.writePact = function () {
        if (!this.mockService) {
            logErrorNoMockServer();
            return Promise.reject(new Error("The pact mock service wasn't running when writePact was called"));
        }
        return this.mockService.writePact();
    };
    /**
     * Clear up any interactions in the Provider Mock Server.
     * @memberof PactProvider
     * @instance
     * @returns {Promise}
     */
    Pact.prototype.removeInteractions = function () {
        if (!this.mockService) {
            logErrorNoMockServer();
            return Promise.reject(new Error("The pact mock service wasn't running when removeInteractions was called"));
        }
        return this.mockService.removeInteractions();
    };
    Pact.prototype.checkPort = function () {
        if (this.server && this.server.options.port) {
            return (0, net_1.isPortAvailable)(this.server.options.port, this.opts.host);
        }
        return Promise.resolve();
    };
    Pact.prototype.setupMockService = function () {
        logger_1.default.info("Setting up Pact with Consumer \"".concat(this.opts.consumer, "\" and Provider \"").concat(this.opts.provider, "\"\n    using mock service on Port: \"").concat(this.opts.port, "\""));
        this.mockService = new mockService_1.MockService(undefined, undefined, this.opts.port, this.opts.host, this.opts.ssl, this.opts.pactfileWriteMode);
    };
    Pact.prototype.startServer = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.server.start().then(function () {
                _this.opts.port = _this.server.options.port || _this.opts.port;
                resolve(_this.opts);
            }, function (e) { return reject(e); });
        });
    };
    Pact.prototype.createServer = function (config) {
        this.server = pact_core_1.default.createServer(__assign(__assign({ timeout: 30000 }, this.opts), { port: config.port }));
    };
    Pact.defaults = {
        consumer: '',
        cors: false,
        dir: path.resolve(process_1.default.cwd(), 'pacts'),
        host: '127.0.0.1',
        log: path.resolve(process_1.default.cwd(), 'logs', 'pact.log'),
        logLevel: 'info',
        pactfileWriteMode: 'overwrite',
        provider: '',
        spec: 2,
        ssl: false,
    };
    return Pact;
}());
exports.Pact = Pact;
//# sourceMappingURL=index.js.map