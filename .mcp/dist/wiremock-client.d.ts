/**
 * WireMock Studio API Client
 */
export interface StubMapping {
    id?: string;
    uuid?: string;
    name?: string;
    priority?: number;
    request: RequestPattern;
    response: ResponseDefinition;
    persistent?: boolean;
    metadata?: Record<string, any>;
    scenarioName?: string;
    requiredScenarioState?: string;
    newScenarioState?: string;
}
export interface RequestPattern {
    method?: string;
    url?: string;
    urlPath?: string;
    urlPathPattern?: string;
    urlPattern?: string;
    queryParameters?: Record<string, any>;
    headers?: Record<string, any>;
    cookies?: Record<string, any>;
    bodyPatterns?: BodyPattern[];
    basicAuthCredentials?: {
        username: string;
        password: string;
    };
}
export interface BodyPattern {
    equalTo?: string;
    equalToJson?: string | object;
    matchesJsonPath?: string;
    equalToXml?: string;
    matchesXPath?: string;
    contains?: string;
    matches?: string;
}
export interface ResponseDefinition {
    status: number;
    statusMessage?: string;
    headers?: Record<string, string>;
    body?: string;
    jsonBody?: any;
    base64Body?: string;
    bodyFileName?: string;
    fixedDelayMilliseconds?: number;
    delayDistribution?: any;
    fault?: string;
    transformers?: string[];
    transformerParameters?: Record<string, any>;
}
export interface MockAPI {
    id: string;
    name: string;
    publicUrl?: string;
    adminUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}
export interface StubListResponse {
    stubs: StubMapping[];
    meta?: {
        total: number;
    };
}
export interface CreateStubRequest {
    mockApiId: string;
    stub: StubMapping;
}
export interface UpdateStubRequest {
    mockApiId: string;
    stubId: string;
    stub: Partial<StubMapping>;
}
export interface DeleteStubRequest {
    mockApiId: string;
    stubId: string;
}
export interface GetStubRequest {
    mockApiId: string;
    stubId: string;
}
export interface ListStubsRequest {
    mockApiId: string;
    limit?: number;
    offset?: number;
}
export interface ImportStubsRequest {
    mockApiId: string;
    stubs: StubMapping[];
    mode?: 'append' | 'replace';
}
export interface ExportStubsRequest {
    mockApiId: string;
}
export declare class WireMockStudioClient {
    private client;
    private baseUrl;
    private apiVersion;
    private defaultService?;
    constructor(baseUrl: string, token?: string, apiVersion?: string, defaultService?: string);
    /**
     * Get Mock API ID by service name
     * Returns the ID for the default service or specified service name
     */
    getMockApiIdByName(serviceName?: string): Promise<string>;
    listMockAPIs(): Promise<MockAPI[]>;
    getMockAPI(mockApiId: string): Promise<MockAPI>;
    listStubs(params: ListStubsRequest): Promise<StubListResponse>;
    getStub(params: GetStubRequest): Promise<StubMapping>;
    createStub(params: CreateStubRequest): Promise<StubMapping>;
    updateStub(params: UpdateStubRequest): Promise<StubMapping>;
    deleteStub(params: DeleteStubRequest): Promise<void>;
    importStubs(params: ImportStubsRequest): Promise<{
        imported: number;
    }>;
    exportStubs(params: ExportStubsRequest): Promise<StubMapping[]>;
    resetStubs(mockApiId: string): Promise<void>;
    private handleError;
}
//# sourceMappingURL=wiremock-client.d.ts.map