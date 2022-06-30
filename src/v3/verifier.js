"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifierV3 = void 0;
var logger_1 = __importDefault(require("../common/logger"));
var verifier_1 = require("../dsl/verifier");
var VerifierV3 = /** @class */ (function () {
    function VerifierV3(config) {
        this.internalVerifier = new verifier_1.Verifier(config);
    }
    /**
     * Verify a HTTP Provider
     */
    VerifierV3.prototype.verifyProvider = function () {
        logger_1.default.warn("VerifierV3 is now deprecated\n\n  You no longer need to import the verifier from @pact-foundation/pact/v3\n  You may now update your imports to:\n\n      import { Verifier } from '@pact-foundation/pact'\n\n  Thank you for being part of pact-js beta!");
        return this.internalVerifier.verifyProvider();
    };
    return VerifierV3;
}());
exports.VerifierV3 = VerifierV3;
//# sourceMappingURL=verifier.js.map