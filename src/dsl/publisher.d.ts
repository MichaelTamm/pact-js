/**
 * Pact Publisher service
 * @module Publisher
 */
import { PublisherOptions } from '@pact-foundation/pact-core';
export declare class Publisher {
    private opts;
    constructor(opts: PublisherOptions);
    publishPacts(): Promise<string[]>;
}
