export interface FigmaConfig {
    accessToken: string;
}
export declare class FigmaClient {
    private api;
    private token;
    constructor(config: FigmaConfig);
    /**
     * Get file information including all pages and frames
     */
    getFile(fileKey: string): Promise<{
        name: string;
        lastModified: string;
        version: string;
        pages: {
            id: any;
            name: any;
            type: any;
            children: any;
        }[];
    }>;
    /**
     * Get specific nodes/frames from a file
     */
    getNodes(fileKey: string, nodeIds: string[]): Promise<void>;
    /**
     * Export images from Figma (useful for test documentation)
     */
    exportImages(fileKey: string, nodeIds: string[], format?: 'png' | 'jpg' | 'svg' | 'pdf', scale?: number): Promise<void>;
    /**
     * Download image to local file (useful for embedding in test reports)
     */
    downloadImage(imageUrl: string, outputPath: string): Promise<{
        success: boolean;
        path: string;
    }>;
    /**
     * Get file components (useful for design system documentation)
     */
    getComponents(fileKey: string): Promise<{
        components: any[];
    }>;
    /**
     * Get file comments (useful for design feedback in test cases)
     */
    getComments(fileKey: string): Promise<{
        comments: any;
    }>;
    /**
     * Post a comment on a specific location (useful for marking test coverage)
     */
    postComment(fileKey: string, message: string, clientMeta?: any): Promise<void>;
    /**
     * Get file styles (colors, text styles, etc.)
     */
    getStyles(fileKey: string): Promise<{
        styles: {
            [key: string]: import("@figma/rest-api-spec").Style;
        };
        styleNames: {
            id: string;
            name: any;
            styleType: any;
            description: any;
        }[];
    }>;
    /**
     * Search for frames by name (useful for finding test scenarios)
     */
    searchFrames(fileKey: string, searchTerm: string): Promise<{
        matches: any[];
    }>;
    /**
     * Get Figma file link for embedding in test cases
     */
    getFileLink(fileKey: string, nodeId?: string): string;
    /**
     * Parse Figma URL to extract file key and node ID
     */
    static parseFigmaUrl(url: string): {
        fileKey: string;
        nodeId?: string;
    } | null;
}
//# sourceMappingURL=figma-client.d.ts.map