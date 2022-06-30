"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
/**
 * Pact Publisher service
 * @module Publisher
 */
var pact_core_1 = __importDefault(require("@pact-foundation/pact-core"));
var Publisher = /** @class */ (function () {
    function Publisher(opts) {
        this.opts = opts;
    }
    Publisher.prototype.publishPacts = function () {
        return pact_core_1.default.publishPacts(this.opts);
    };
    return Publisher;
}());
exports.Publisher = Publisher;
//# sourceMappingURL=publisher.js.map