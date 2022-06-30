import { ConsumerVersionSelector, VerifierOptions as PactCoreVerifierOptions } from '@pact-foundation/pact-core';
import { ProxyOptions } from '../dsl/verifier/proxy/types';
export declare type VerifierV3Options = PactCoreVerifierOptions & ProxyOptions;
export { ConsumerVersionSelector };
export declare class VerifierV3 {
    private internalVerifier;
    constructor(config: VerifierV3Options);
    /**
     * Verify a HTTP Provider
     */
    verifyProvider(): Promise<unknown>;
}
