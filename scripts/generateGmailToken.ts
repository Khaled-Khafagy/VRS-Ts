import { google } from 'googleapis';
import * as readline from 'readline';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'http://localhost'
);

const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
});

console.log('\n>>> Open this URL in your browser and sign in with testv225@gmail.com:\n');
console.log(authUrl);
console.log('\n>>> After approving, the browser will redirect to http://localhost and show an error — that is expected.');
console.log('>>> Copy the "code" value from the URL bar (everything after "code=" and before "&").\n');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('>>> Paste the code here: ', async (code) => {
    rl.close();
    const { tokens } = await oauth2Client.getToken(code.trim());
    console.log('\n✅ Add this to your .env file:\n');
    console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`);
});
