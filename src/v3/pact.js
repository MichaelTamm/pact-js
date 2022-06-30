"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PactV3 = exports.SpecificationVersion = void 0;
/* eslint-disable import/first */
var ramda_1 = require("ramda");
var pact_core_1 = require("@pact-foundation/pact-core");
var util_1 = require("util");
var fs = require("fs");
var logger_1 = __importDefault(require("../common/logger"));
var package_json_1 = require("../../package.json");
var SpecificationVersion;
(function (SpecificationVersion) {
    SpecificationVersion[SpecificationVersion["SPECIFICATION_VERSION_V2"] = 3] = "SPECIFICATION_VERSION_V2";
    SpecificationVersion[SpecificationVersion["SPECIFICATION_VERSION_V3"] = 4] = "SPECIFICATION_VERSION_V3";
})(SpecificationVersion = exports.SpecificationVersion || (exports.SpecificationVersion = {}));
var matcherValueOrString = function (obj) {
    if (typeof obj === 'string')
        return obj;
    return JSON.stringify(obj);
};
var contentTypeFromHeaders = function (headers, defaultContentType) {
    var contentType = defaultContentType;
    (0, ramda_1.forEachObjIndexed)(function (v, k) {
        if ("".concat(k).toLowerCase() === 'content-type') {
            contentType = matcherValueOrString(v);
        }
    }, headers || {});
    return contentType;
};
var readBinaryData = function (file) {
    try {
        var body = fs.readFileSync(file);
        return body;
    }
    catch (e) {
        throw new Error("unable to read file for binary request: ".concat(e.message));
    }
};
function displayQuery(query) {
    var pairs = (0, ramda_1.toPairs)(query);
    var mapped = (0, ramda_1.flatten)((0, ramda_1.map)(function (_a) {
        var key = _a[0], values = _a[1];
        return (0, ramda_1.map)(function (val) { return "".concat(key, "=").concat(val); }, values);
    }, pairs));
    return (0, ramda_1.join)('&', mapped);
}
function displayHeaders(headers, indent) {
    return (0, ramda_1.join)("\n".concat(indent), (0, ramda_1.map)(function (_a) {
        var k = _a[0], v = _a[1];
        return "".concat(k, ": ").concat(v);
    }, (0, ramda_1.toPairs)(headers)));
}
function displayRequest(request, indent) {
    if (indent === void 0) { indent = ''; }
    var output = [''];
    output.push("".concat(indent, "Method: ").concat(request.method, "\n").concat(indent, "Path: ").concat(request.path));
    if (request.query) {
        output.push("".concat(indent, "Query String: ").concat(displayQuery(request.query)));
    }
    if (request.headers) {
        output.push("".concat(indent, "Headers:\n").concat(indent, "  ").concat(displayHeaders(request.headers, "".concat(indent, "  "))));
    }
    if (request.body) {
        var body = JSON.stringify(request.body);
        output.push("".concat(indent, "Body: ").concat(body.substr(0, 20), "... (").concat(body.length, " length)"));
    }
    return output.join('\n');
}
function filterMissingFeatureFlag(mismatches) {
    if (process.env.PACT_EXPERIMENTAL_FEATURE_ALLOW_MISSING_REQUESTS) {
        return mismatches.filter(function (m) { return m.type !== 'request-mismatch'; });
    }
    return mismatches;
}
function printMismatch(m) {
    switch (m.type) {
        case 'MethodMismatch':
            return "Expected ".concat(m.expected, ", got: ").concat(m.actual);
        default:
            return m.mismatch;
    }
}
function generateMockServerError(mismatches, indent) {
    return __spreadArray([
        'Mock server failed with the following mismatches:'
    ], mismatches.map(function (mismatch, i) {
        var _a;
        if (mismatch.type === 'request-mismatch') {
            return "\n".concat(indent).concat(i, ") The following request was incorrect: \n\n        ").concat(indent).concat(mismatch.method, " ").concat(mismatch.path, "\n        ").concat((_a = mismatch.mismatches) === null || _a === void 0 ? void 0 : _a.map(function (d, j) { return "\n".concat(indent).concat(indent).concat(indent, " 1.").concat(j, " ").concat(printMismatch(d)); }).join(''));
        }
        if (mismatch.type === 'request-not-found') {
            return "\n".concat(indent).concat(i, ") The following request was not expected: ").concat(displayRequest(mismatch.request, "".concat(indent, "    ")));
        }
        if (mismatch.type === 'missing-request') {
            return "\n".concat(indent).concat(i, ") The following request was expected but not received: ").concat(displayRequest(mismatch.request, "".concat(indent, "    ")));
        }
        return '';
    }), true).join('\n');
}
var PactV3 = /** @class */ (function () {
    function PactV3(opts) {
        this.states = [];
        this.opts = opts;
        this.setup();
    }
    // TODO: this currently must be called before other methods, else it won't work
    PactV3.prototype.given = function (providerState, parameters) {
        if (parameters) {
            var json = JSON.stringify(parameters);
            // undefined arguments not supported (invalid JSON)
            if (json === undefined) {
                throw new Error("Invalid provider state parameter received. Parameters must not be undefined. Received: ".concat(parameters));
            }
            // Check nested objects
            var jsonParsed = JSON.parse(json);
            if (!(0, ramda_1.equals)(parameters, jsonParsed)) {
                throw new Error("Invalid provider state parameter received. Parameters must not contain undefined values. Received: ".concat(parameters));
            }
        }
        this.states.push({ description: providerState, parameters: parameters });
        return this;
    };
    PactV3.prototype.uponReceiving = function (description) {
        var _this = this;
        this.interaction = this.pact.newInteraction(description);
        this.states.forEach(function (s) {
            if (s.parameters) {
                (0, ramda_1.forEachObjIndexed)(function (v, k) {
                    _this.interaction.givenWithParam(s.description, "".concat(k), JSON.stringify(v));
                }, s.parameters);
            }
            else {
                _this.interaction.given(s.description);
            }
        });
        return this;
    };
    PactV3.prototype.withRequest = function (req) {
        if (req.body) {
            this.interaction.withRequestBody(matcherValueOrString(req.body), req.contentType ||
                contentTypeFromHeaders(req.headers, 'application/json'));
        }
        this.setRequestDetails(req);
        return this;
    };
    PactV3.prototype.withRequestBinaryFile = function (req, contentType, file) {
        var body = readBinaryData(file);
        this.interaction.withRequestBinaryBody(body, contentType);
        this.setRequestDetails(req);
        return this;
    };
    PactV3.prototype.withRequestMultipartFileUpload = function (req, contentType, file, part) {
        this.interaction.withRequestMultipartBody(contentType, file, part);
        this.setRequestDetails(req);
        return this;
    };
    PactV3.prototype.willRespondWith = function (res) {
        this.setResponseDetails(res);
        if (res.body) {
            this.interaction.withResponseBody(matcherValueOrString(res.body), res.contentType ||
                contentTypeFromHeaders(res.headers, 'application/json') // TODO: extract // force correct content-type header?
            );
        }
        this.states = [];
        return this;
    };
    PactV3.prototype.withResponseBinaryFile = function (res, contentType, file) {
        var body = readBinaryData(file);
        this.interaction.withResponseBinaryBody(body, contentType);
        this.setResponseDetails(res);
        return this;
    };
    PactV3.prototype.withResponseMultipartFileUpload = function (res, contentType, file, part) {
        this.interaction.withResponseMultipartBody(contentType, file, part);
        this.setResponseDetails(res);
        return this;
    };
    PactV3.prototype.executeTest = function (testFn) {
        return __awaiter(this, void 0, void 0, function () {
            var scheme, host, port, server, val, e_1, matchingResults, success, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scheme = 'http';
                        host = '127.0.0.1';
                        port = this.pact.createMockServer(host, this.opts.port);
                        server = { port: port, url: "".concat(scheme, "://").concat(host, ":").concat(port), id: 'unknown' };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, testFn(server)];
                    case 2:
                        val = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        logger_1.default.error(e_1.message);
                        return [3 /*break*/, 4];
                    case 4:
                        matchingResults = this.pact.mockServerMismatches(port);
                        success = this.pact.mockServerMatchedSuccessfully(port);
                        // Feature flag: allow missing requests on the mock service
                        if (!success && filterMissingFeatureFlag(matchingResults).length > 0) {
                            error = 'Test failed for the following reasons:';
                            error += "\n\n  ".concat(generateMockServerError(matchingResults, '\t'));
                            this.cleanup(false, server);
                            return [2 /*return*/, Promise.reject(new Error(error))];
                        }
                        this.cleanup(true, server);
                        return [2 /*return*/, val];
                }
            });
        });
    };
    PactV3.prototype.cleanup = function (success, server) {
        if (success) {
            this.pact.writePactFile(this.opts.dir);
        }
        this.pact.cleanupMockServer(server.port);
        this.setup();
    };
    PactV3.prototype.setRequestDetails = function (req) {
        var _this = this;
        this.interaction.withRequest(req.method, matcherValueOrString(req.path));
        (0, ramda_1.forEachObjIndexed)(function (v, k) {
            _this.interaction.withRequestHeader(k, 0, matcherValueOrString(v));
        }, req.headers);
        (0, ramda_1.forEachObjIndexed)(function (v, k) {
            if ((0, util_1.isArray)(v)) {
                v.forEach(function (vv, i) {
                    _this.interaction.withQuery(k, i, matcherValueOrString(vv));
                });
            }
            else {
                _this.interaction.withQuery(k, 0, matcherValueOrString(v));
            }
        }, req.query);
    };
    PactV3.prototype.setResponseDetails = function (res) {
        var _this = this;
        this.interaction.withStatus(res.status);
        (0, ramda_1.forEachObjIndexed)(function (v, k) {
            _this.interaction.withResponseHeader(k, 0, matcherValueOrString(v));
        }, res.headers);
    };
    // reset the internal state
    // (this.pact cannot be re-used between tests)
    PactV3.prototype.setup = function () {
        var _a, _b;
        this.states = [];
        this.pact = (0, pact_core_1.makeConsumerPact)(this.opts.consumer, this.opts.provider, (_a = this.opts.spec) !== null && _a !== void 0 ? _a : SpecificationVersion.SPECIFICATION_VERSION_V3, (_b = this.opts.logLevel) !== null && _b !== void 0 ? _b : 'info');
        this.pact.addMetadata('pact-js', 'version', package_json_1.version);
    };
    return PactV3;
}());
exports.PactV3 = PactV3;
//# sourceMappingURL=pact.js.map