/**
 * WireMock Studio API Client
 */
import axios from 'axios';
export class WireMockStudioClient {
    client;
    baseUrl;
    apiVersion;
    defaultService;
    constructor(baseUrl, token, apiVersion = 'v1', defaultService) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.apiVersion = apiVersion;
        this.defaultService = defaultService;
        const headers = {
            'Content-Type': 'application/json',
        };
        // Add Authorization header only if token is provided
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        this.client = axios.create({
            baseURL: this.baseUrl,
            headers,
            timeout: 30000,
        });
    }
    /**
     * Get Mock API ID by service name
     * Returns the ID for the default service or specified service name
     */
    async getMockApiIdByName(serviceName) {
        const name = serviceName || this.defaultService;
        if (!name) {
            throw new Error('No service name provided and no default service configured');
        }
        const mockApis = await this.listMockAPIs();
        const mockApi = mockApis.find(api => api.name.toLowerCase() === name.toLowerCase());
        if (!mockApi) {
            const available = mockApis.map(api => api.name).join(', ');
            throw new Error(`Mock API service "${name}" not found. Available: ${available}`);
        }
        return mockApi.id;
    }
    async listMockAPIs() {
        try {
            const response = await this.client.get('/mock-apis');
            return response.data.mockApis || [];
        }
        catch (error) {
            throw this.handleError(error, 'Failed to list Mock APIs');
        }
    }
    async getMockAPI(mockApiId) {
        try {
            const response = await this.client.get(`/mock-apis/${mockApiId}`);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error, `Failed to get Mock API ${mockApiId}`);
        }
    }
    async listStubs(params) {
        try {
            // Use WireMock Studio admin API endpoint
            const url = `/mock-apis/${params.mockApiId}/__admin/mocklab/mappings`;
            const response = await this.client.get(url);
            // Transform response to match expected format
            let mappings = response.data.mappings || [];
            // Apply limit and offset if specified
            if (params.offset) {
                mappings = mappings.slice(params.offset);
            }
            if (params.limit) {
                mappings = mappings.slice(0, params.limit);
            }
            return {
                stubs: mappings,
                meta: {
                    total: response.data.mappings?.length || 0
                }
            };
        }
        catch (error) {
            throw this.handleError(error, 'Failed to list stubs');
        }
    }
    async getStub(params) {
        try {
            // Get stub by ID using WireMock admin API
            const response = await this.client.get(`/mock-apis/${params.mockApiId}/__admin/mappings/${params.stubId}`);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error, `Failed to get stub ${params.stubId}`);
        }
    }
    async createStub(params) {
        try {
            const response = await this.client.post(`/mock-apis/${params.mockApiId}/__admin/mappings`, params.stub);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error, 'Failed to create stub');
        }
    }
    async updateStub(params) {
        try {
            const response = await this.client.put(`/mock-apis/${params.mockApiId}/__admin/mappings/${params.stubId}`, params.stub);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error, `Failed to update stub ${params.stubId}`);
        }
    }
    async deleteStub(params) {
        try {
            await this.client.delete(`/mock-apis/${params.mockApiId}/__admin/mappings/${params.stubId}`);
        }
        catch (error) {
            throw this.handleError(error, `Failed to delete stub ${params.stubId}`);
        }
    }
    async importStubs(params) {
        try {
            const response = await this.client.post(`/mock-apis/${params.mockApiId}/stubs/import`, {
                stubs: params.stubs,
                mode: params.mode || 'append',
            });
            return response.data;
        }
        catch (error) {
            throw this.handleError(error, 'Failed to import stubs');
        }
    }
    async exportStubs(params) {
        try {
            const response = await this.listStubs({ mockApiId: params.mockApiId });
            return response.stubs;
        }
        catch (error) {
            throw this.handleError(error, 'Failed to export stubs');
        }
    }
    async resetStubs(mockApiId) {
        try {
            await this.client.delete(`/mock-apis/${mockApiId}/__admin/mappings`);
        }
        catch (error) {
            throw this.handleError(error, 'Failed to reset stubs');
        }
    }
    handleError(error, message) {
        if (axios.isAxiosError(error)) {
            const axiosError = error;
            const status = axiosError.response?.status;
            const data = axiosError.response?.data;
            if (status === 401) {
                return new Error(`Authentication failed. Check your API token. ${message}`);
            }
            else if (status === 404) {
                return new Error(`Resource not found. ${message}`);
            }
            else if (status === 403) {
                return new Error(`Access denied. Check your permissions. ${message}`);
            }
            else if (data?.message) {
                return new Error(`${message}: ${data.message}`);
            }
            return new Error(`${message}: ${axiosError.message}`);
        }
        return new Error(`${message}: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=wiremock-client.js.map