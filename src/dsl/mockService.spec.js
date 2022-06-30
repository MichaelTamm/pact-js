"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
var nock_1 = __importDefault(require("nock"));
var request_1 = require("../common/request");
var interaction_1 = require("./interaction");
var mockService_1 = require("./mockService");
chai_1.default.use(chai_as_promised_1.default);
var expect = chai_1.default.expect;
describe('MockService', function () {
    after(function () {
        nock_1.default.restore();
    });
    describe('#constructor', function () {
        it('creates a MockService when all mandatory parameters are provided', function () {
            var mock = new mockService_1.MockService('consumer', 'provider', 1234);
            expect(mock.baseUrl).to.eql('http://127.0.0.1:1234');
        });
        it('creates a MockService when all mandatory parameters are provided', function () {
            var mock = new mockService_1.MockService('consumer', 'provider', 4443, '127.0.0.2', true);
            expect(mock.baseUrl).to.eql('https://127.0.0.2:4443');
        });
        it('creates a MockService when port is not provided', function () {
            var mock = new mockService_1.MockService('consumer', 'provider');
            expect(mock).to.not.be.undefined;
            expect(mock.baseUrl).to.eql('http://127.0.0.1:1234');
        });
        it('does not create a MockService when consumer is not provided', function () {
            expect(function () {
                new mockService_1.MockService('', 'provider');
            }).not.to.throw(Error);
        });
        it('does not create a MockService when provider is not provided', function () {
            expect(function () {
                new mockService_1.MockService('consumer', '');
            }).not.to.throw(Error);
        });
    });
    describe('#addInteraction', function () {
        var mock = new mockService_1.MockService('consumer', 'provider', 1234);
        var interaction = new interaction_1.Interaction();
        interaction
            .uponReceiving('duh')
            .withRequest({ method: request_1.HTTPMethods.GET, path: '/search' })
            .willRespondWith({ status: 200 });
        it('when Interaction added successfully', function () {
            (0, nock_1.default)(mock.baseUrl)
                .post(/interactions$/)
                .reply(200);
            return expect(mock.addInteraction(interaction)).to.eventually;
        });
        it('when Interaction fails to be added', function () {
            (0, nock_1.default)(mock.baseUrl)
                .post(/interactions$/)
                .reply(500);
            return expect(mock.addInteraction(interaction)).to.eventually.be.rejected;
        });
    });
    describe('#removeInteractions', function () {
        var mock = new mockService_1.MockService('consumer', 'provider', 1234);
        it('when interactions are removed successfully', function () {
            (0, nock_1.default)(mock.baseUrl)
                .delete(/interactions$/)
                .reply(200);
            return expect(mock.removeInteractions()).to.eventually.be.fulfilled;
        });
        it('when interactions fail to be removed', function () {
            (0, nock_1.default)(mock.baseUrl)
                .delete(/interactions$/)
                .reply(500);
            return expect(mock.removeInteractions()).to.eventually.be.rejected;
        });
    });
    describe('#verify', function () {
        var mock = new mockService_1.MockService('consumer', 'provider', 1234);
        it('when verification is successful', function () {
            (0, nock_1.default)(mock.baseUrl)
                .get(/interactions\/verification$/)
                .reply(200);
            return expect(mock.verify()).to.eventually.be.fulfilled;
        });
        it('when verification fails', function () {
            (0, nock_1.default)(mock.baseUrl)
                .get(/interactions\/verification$/)
                .reply(500);
            return expect(mock.verify()).to.eventually.be.rejected;
        });
    });
    describe('#writePact', function () {
        describe('when consumer and provider details provided', function () {
            var mock = new mockService_1.MockService('aconsumer', 'aprovider', 1234);
            describe('and writing is successful', function () {
                it('writes the consumer and provider details into the pact', function () {
                    (0, nock_1.default)(mock.baseUrl)
                        .post(/pact$/, {
                        consumer: { name: 'aconsumer' },
                        pactfile_write_mode: 'overwrite',
                        provider: { name: 'aprovider' },
                    })
                        .reply(200);
                    return expect(mock.writePact()).to.eventually.be.fulfilled;
                });
            });
            describe('and writing fails', function () {
                it('returns a rejected promise', function () {
                    (0, nock_1.default)(mock.baseUrl).post(/pact$/, {}).reply(500);
                    return expect(mock.writePact()).to.eventually.be.rejected;
                });
            });
        });
        describe('when consumer and provider details are not provided', function () {
            var mock = new mockService_1.MockService(undefined, undefined, 1234);
            it('does not write the consumer and provider details into the pact', function () {
                (0, nock_1.default)(mock.baseUrl).post(/pact$/).reply(200);
                return expect(mock.writePact()).to.eventually.be.fulfilled;
            });
        });
    });
});
//# sourceMappingURL=mockService.spec.js.map