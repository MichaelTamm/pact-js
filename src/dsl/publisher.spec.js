"use strict";
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
/* tslint:disable:no-unused-expression no-empty no-string-literal */
var chai = __importStar(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
var publisher_1 = require("./publisher");
chai.use(chai_as_promised_1.default);
var expect = chai.expect;
describe('Publisher', function () {
    describe('#constructor', function () {
        it('constructs a valid Pubisher class', function () {
            var p = new publisher_1.Publisher({
                consumerVersion: '1.0.0',
                pactBroker: 'http://foo.com',
                pactFilesOrDirs: [],
            });
            expect(p).to.have.nested.property('opts.consumerVersion');
        });
    });
});
//# sourceMappingURL=publisher.spec.js.map