import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface WaitForEmailOptions {
    to: string;
    subject: RegExp | string;
    timeout?: number;
    pollingInterval?: number;
    afterTimestamp?: number;
}

interface EmailResult {
    subject: string;
    body: string;
}

const getGmailClient = () => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        'http://localhost'
    );
    oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });
    return google.gmail({ version: 'v1', auth: oauth2Client });
};

const extractBody = (payload: any): string => {
    if (!payload) return '';
    if (payload.body?.data)
        return Buffer.from(payload.body.data, 'base64url').toString('utf-8');
    if (payload.parts) {
        for (const part of payload.parts) {
            const result = extractBody(part);
            if (result) return result;
        }
    }
    return '';
};

export const waitForEmail = async ({
    to,
    subject,
    timeout = 120000,
    pollingInterval = 5000,
    afterTimestamp = Date.now() - 10000,
}: WaitForEmailOptions): Promise<EmailResult> => {
    const gmail = getGmailClient();
    const deadline = Date.now() + timeout;

    while (Date.now() < deadline) {
        const res = await gmail.users.messages.list({
            userId: 'me',
            q: `to:${to}`,
            maxResults: 10,
        });

        for (const msg of res.data.messages ?? []) {
            const detail = await gmail.users.messages.get({
                userId: 'me',
                id: msg.id!,
                format: 'full',
            });

            const internalDate = parseInt(detail.data.internalDate ?? '0');
            if (internalDate < afterTimestamp) continue;

            const headers = detail.data.payload?.headers ?? [];
            const subjectHeader = headers.find(h => h.name === 'Subject')?.value ?? '';

            const matched = typeof subject === 'string'
                ? subjectHeader.toLowerCase().includes(subject.toLowerCase())
                : subject.test(subjectHeader);

            if (!matched) continue;

            return { subject: subjectHeader, body: extractBody(detail.data.payload) };
        }

        await new Promise(resolve => setTimeout(resolve, pollingInterval));
    }

    throw new Error(`Email to "${to}" with subject "${subject}" was not received within ${timeout}ms`);
};
