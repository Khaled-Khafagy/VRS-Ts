import * as Figma from 'figma-api';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
export class FigmaClient {
    api;
    token;
    constructor(config) {
        this.token = config.accessToken;
        this.api = new Figma.Api({
            personalAccessToken: config.accessToken,
        });
    }
    /**
     * Get file information including all pages and frames
     */
    async getFile(fileKey) {
        try {
            const file = await this.api.getFile({ file_key: fileKey });
            return {
                name: file.name,
                lastModified: file.lastModified,
                version: file.version,
                pages: file.document.children.map((page) => ({
                    id: page.id,
                    name: page.name,
                    type: page.type,
                    children: page.children?.map((child) => ({
                        id: child.id,
                        name: child.name,
                        type: child.type,
                    })) || [],
                })),
            };
        }
        catch (error) {
            throw new Error(`Failed to get Figma file: ${error.message}`);
        }
    }
    /**
     * Get specific nodes/frames from a file
     */
    async getNodes(fileKey, nodeIds) {
        throw new Error(`Figma getNodes not yet implemented`);
    }
    /**
     * Export images from Figma (useful for test documentation)
     */
    async exportImages(fileKey, nodeIds, format = 'png', scale = 2) {
        throw new Error(`Figma exportImages not yet implemented`);
    }
    /**
     * Download image to local file (useful for embedding in test reports)
     */
    async downloadImage(imageUrl, outputPath) {
        try {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(outputPath, response.data);
            return { success: true, path: outputPath };
        }
        catch (error) {
            throw new Error(`Failed to download image: ${error.message}`);
        }
    }
    /**
     * Get file components (useful for design system documentation)
     */
    async getComponents(fileKey) {
        try {
            const file = await this.api.getFile({ file_key: fileKey });
            const components = [];
            const extractComponents = (node) => {
                if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
                    components.push({
                        id: node.id,
                        name: node.name,
                        type: node.type,
                        description: node.description || '',
                    });
                }
                if (node.children) {
                    node.children.forEach(extractComponents);
                }
            };
            file.document.children.forEach(extractComponents);
            return { components };
        }
        catch (error) {
            throw new Error(`Failed to get components: ${error.message}`);
        }
    }
    /**
     * Get file comments (useful for design feedback in test cases)
     */
    async getComments(fileKey) {
        try {
            const result = await this.api.getComments({ file_key: fileKey });
            const commentsList = Array.isArray(result) ? result : result.comments || [];
            return {
                comments: commentsList.map((comment) => ({
                    id: comment.id,
                    message: comment.message,
                    user: comment.user.handle,
                    createdAt: comment.created_at,
                    resolvedAt: comment.resolved_at,
                    clientMeta: comment.client_meta,
                })),
            };
        }
        catch (error) {
            throw new Error(`Failed to get comments: ${error.message}`);
        }
    }
    /**
     * Post a comment on a specific location (useful for marking test coverage)
     */
    async postComment(fileKey, message, clientMeta) {
        throw new Error(`Figma postComment not yet implemented`);
    }
    /**
     * Get file styles (colors, text styles, etc.)
     */
    async getStyles(fileKey) {
        try {
            const file = await this.api.getFile({ file_key: fileKey });
            return {
                styles: file.styles || {},
                styleNames: Object.entries(file.styles || {}).map(([id, style]) => ({
                    id,
                    name: style.name,
                    styleType: style.styleType,
                    description: style.description || '',
                })),
            };
        }
        catch (error) {
            throw new Error(`Failed to get styles: ${error.message}`);
        }
    }
    /**
     * Search for frames by name (useful for finding test scenarios)
     */
    async searchFrames(fileKey, searchTerm) {
        try {
            const file = await this.api.getFile({ file_key: fileKey });
            const matches = [];
            const searchNode = (node, pageName) => {
                if (node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    matches.push({
                        id: node.id,
                        name: node.name,
                        type: node.type,
                        page: pageName,
                    });
                }
                if (node.children) {
                    node.children.forEach((child) => searchNode(child, pageName));
                }
            };
            file.document.children.forEach((page) => {
                searchNode(page, page.name);
            });
            return { matches };
        }
        catch (error) {
            throw new Error(`Failed to search frames: ${error.message}`);
        }
    }
    /**
     * Get Figma file link for embedding in test cases
     */
    getFileLink(fileKey, nodeId) {
        const baseUrl = `https://www.figma.com/file/${fileKey}`;
        return nodeId ? `${baseUrl}?node-id=${encodeURIComponent(nodeId)}` : baseUrl;
    }
    /**
     * Parse Figma URL to extract file key and node ID
     */
    static parseFigmaUrl(url) {
        // Handle file, design, and prototype URLs
        const patterns = [
            /figma\.com\/file\/([a-zA-Z0-9]+)/, // File URL
            /figma\.com\/design\/([a-zA-Z0-9]+)/, // Design URL (new Figma UI)
            /figma\.com\/proto\/([a-zA-Z0-9]+)/, // Prototype URL
        ];
        let fileKey = null;
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                fileKey = match[1];
                break;
            }
        }
        if (!fileKey)
            return null;
        // Extract node ID if present
        const nodeIdMatch = url.match(/node-id=([^&]+)/);
        const nodeId = nodeIdMatch ? decodeURIComponent(nodeIdMatch[1]) : undefined;
        return { fileKey, nodeId };
    }
}
//# sourceMappingURL=figma-client.js.map