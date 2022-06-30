/**
 * @module Message
 */
import { AnyJson } from './common/jsonTypes';
import { AnyTemplate } from './dsl/matchers';
import { Metadata, Message, MessageConsumer } from './dsl/message';
import { MessageConsumerOptions } from './dsl/options';
/**
 * A Message Consumer is analagous to a Provider in the HTTP Interaction model.
 * It is the receiver of an interaction, and needs to be able to handle whatever
 * request was provided.
 */
export declare class MessageConsumerPact {
    private config;
    private state;
    private getServiceFactory;
    constructor(config: MessageConsumerOptions);
    /**
     * Gives a state the provider should be in for this Message.
     *
     * @param {string} providerState - The state of the provider.
     * @returns {Message} MessageConsumer
     */
    given(providerState: string): MessageConsumerPact;
    /**
     * A free style description of the Message.
     *
     * @param {string} description - A description of the Message to be received
     * @returns {Message} MessageConsumer
     */
    expectsToReceive(description: string): MessageConsumerPact;
    /**
     * The content to be received by the message consumer.
     *
     * May be a JSON document or JSON primitive.
     *
     * @param {string} content - A description of the Message to be received
     * @returns {Message} MessageConsumer
     */
    withContent(content: AnyTemplate): MessageConsumerPact;
    /**
     * Message metadata
     *
     * @param {string} metadata -
     * @returns {Message} MessageConsumer
     */
    withMetadata(metadata: Metadata): MessageConsumerPact;
    /**
     * Returns the Message object created.
     *
     * @returns {Message}
     */
    json(): Message;
    /**
     * Creates a new Pact _message_ interaction to build a testable interaction.
     *
     * @param handler A message handler, that must be able to consume the given Message
     * @returns {Promise}
     */
    verify(handler: MessageConsumer): Promise<unknown>;
    /**
     * Validates the current state of the Message.
     *
     * @returns {Promise}
     */
    validate(): Promise<unknown>;
}
export declare function synchronousBodyHandler<R>(handler: (body: AnyJson) => R): MessageConsumer;
export declare function asynchronousBodyHandler<R>(handler: (body: AnyJson) => Promise<R>): MessageConsumer;
