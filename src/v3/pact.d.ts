import * as MatchersV3 from './matchers';
import { JsonMap } from '../common/jsonTypes';
export declare enum SpecificationVersion {
    SPECIFICATION_VERSION_V2 = 3,
    SPECIFICATION_VERSION_V3 = 4
}
/**
 * Options for the mock server
 */
export interface PactV3Options {
    /**
     * Directory to write the pact file to
     */
    dir: string;
    /**
     * Consumer name
     */
    consumer: string;
    /**
     * Provider name
     */
    provider: string;
    /**
     * If the mock server should handle CORS pre-flight requests. Defaults to false
     */
    cors?: boolean;
    /**
     * Port to run the mock server on. Defaults to a random port
     */
    port?: number;
    /**
     * Specification version to use
     */
    spec?: SpecificationVersion;
    /**
     * Specification version to use
     */
    logLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error';
}
export interface V3ProviderState {
    description: string;
    parameters?: JsonMap;
}
declare type TemplateHeaders = {
    [header: string]: string | MatchersV3.Matcher<string>;
};
declare type TemplateQuery = Record<string, string | MatchersV3.Matcher<string> | Array<string | MatchersV3.Matcher<string>>>;
export interface V3Request {
    method: string;
    path: string | MatchersV3.Matcher<string>;
    query?: TemplateQuery;
    headers?: TemplateHeaders;
    body?: MatchersV3.AnyTemplate;
    contentType?: string;
}
export interface V3Response {
    status: number;
    headers?: TemplateHeaders;
    body?: MatchersV3.AnyTemplate;
    contentType?: string;
}
export interface V3MockServer {
    port: number;
    url: string;
    id: string;
}
export declare class PactV3 {
    private opts;
    private states;
    private pact;
    private interaction;
    constructor(opts: PactV3Options);
    given(providerState: string, parameters?: JsonMap): PactV3;
    uponReceiving(description: string): PactV3;
    withRequest(req: V3Request): PactV3;
    withRequestBinaryFile(req: V3Request, contentType: string, file: string): PactV3;
    withRequestMultipartFileUpload(req: V3Request, contentType: string, file: string, part: string): PactV3;
    willRespondWith(res: V3Response): PactV3;
    withResponseBinaryFile(res: V3Response, contentType: string, file: string): PactV3;
    withResponseMultipartFileUpload(res: V3Response, contentType: string, file: string, part: string): PactV3;
    executeTest<T>(testFn: (mockServer: V3MockServer) => Promise<T>): Promise<T | undefined>;
    private cleanup;
    private setRequestDetails;
    private setResponseDetails;
    private setup;
}
export {};
