"use strict";
/**
 * An Interaction is where you define the state of your interaction with a Provider.
 * @module Interaction
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interaction = void 0;
var lodash_1 = require("lodash");
var request_1 = require("../common/request");
var matchers_1 = require("./matchers");
var configurationError_1 = __importDefault(require("../errors/configurationError"));
/**
 * Returns valid if object or matcher only contains string values
 * @param query
 */
var throwIfQueryObjectInvalid = function (query) {
    if ((0, matchers_1.isMatcher)(query)) {
        return;
    }
    Object.values(query).forEach(function (value) {
        if (!((0, matchers_1.isMatcher)(value) || Array.isArray(value) || typeof value === 'string')) {
            throw new configurationError_1.default("Query must only contain strings.");
        }
    });
};
var Interaction = /** @class */ (function () {
    function Interaction() {
        this.state = {};
    }
    /**
     * Gives a state the provider should be in for this interaction.
     * @param {string} providerState - The state of the provider.
     * @returns {Interaction} interaction
     */
    Interaction.prototype.given = function (providerState) {
        if (providerState) {
            this.state.providerState = providerState;
        }
        return this;
    };
    /**
     * A free style description of the interaction.
     * @param {string} description - A description of the interaction.
     * @returns {Interaction} interaction
     */
    Interaction.prototype.uponReceiving = function (description) {
        if ((0, lodash_1.isNil)(description)) {
            throw new configurationError_1.default('You must provide a description for the interaction.');
        }
        this.state.description = description;
        return this;
    };
    /**
     * The request that represents this interaction triggered by the consumer.
     * @param {Object} requestOpts
     * @param {string} requestOpts.method - The HTTP method
     * @param {string} requestOpts.path - The path of the URL
     * @param {string} requestOpts.query - Any query string in the interaction
     * @param {Object} requestOpts.headers - A key-value pair oject of headers
     * @param {Object} requestOpts.body - The body, in {@link String} format or {@link Object} format
     * @returns {Interaction} interaction
     */
    Interaction.prototype.withRequest = function (requestOpts) {
        if ((0, lodash_1.isNil)(requestOpts.method)) {
            throw new configurationError_1.default('You must provide an HTTP method.');
        }
        if ((0, lodash_1.keys)(request_1.HTTPMethods).indexOf(requestOpts.method.toString()) < 0) {
            throw new configurationError_1.default("You must provide a valid HTTP method: ".concat((0, lodash_1.keys)(request_1.HTTPMethods).join(', '), "."));
        }
        if ((0, lodash_1.isNil)(requestOpts.path)) {
            throw new configurationError_1.default('You must provide a path.');
        }
        if (typeof requestOpts.query === 'object') {
            throwIfQueryObjectInvalid(requestOpts.query);
        }
        this.state.request = (0, lodash_1.omitBy)(requestOpts, lodash_1.isNil);
        return this;
    };
    /**
     * The response expected by the consumer.
     * @param {Object} responseOpts
     * @param {string} responseOpts.status - The HTTP status
     * @param {string} responseOpts.headers
     * @param {Object} responseOpts.body
     * @returns {Interaction} interaction
     */
    Interaction.prototype.willRespondWith = function (responseOpts) {
        if ((0, lodash_1.isNil)(responseOpts.status) ||
            responseOpts.status.toString().trim().length === 0) {
            throw new configurationError_1.default('You must provide a status code.');
        }
        this.state.response = (0, lodash_1.omitBy)({
            body: responseOpts.body,
            headers: responseOpts.headers || undefined,
            status: responseOpts.status,
        }, lodash_1.isNil);
        return this;
    };
    /**
     * Returns the interaction object created.
     * @returns {Object}
     */
    Interaction.prototype.json = function () {
        if ((0, lodash_1.isNil)(this.state.description)) {
            throw new configurationError_1.default('You must provide a description for the Interaction');
        }
        return this.state;
    };
    return Interaction;
}());
exports.Interaction = Interaction;
//# sourceMappingURL=interaction.js.map