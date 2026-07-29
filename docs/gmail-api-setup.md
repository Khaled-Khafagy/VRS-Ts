# Gmail API Setup Guide for Test Email Verification

This guide covers everything needed to configure a new Gmail account with Google API so the Playwright test suite can verify emails (OTP, welcome, order confirmation, etc.).

---

## Overview

The test suite uses the Gmail API (OAuth2) to poll for emails sent during test flows. Each new tester needs:
- A Gmail account (used as both sender target and API owner)
- A Google Cloud project with Gmail API enabled
- An OAuth2 Client ID + Secret
- A Refresh Token (generated once, never expires unless revoked)

---

## Step 1 — Create or choose a Gmail account

Use a dedicated test Gmail account, not a personal one.

> **Important:** The account must be a standard `@gmail.com` address. Google Workspace / company accounts have stricter OAuth restrictions.

Recommended naming: `vrs.automation.test@gmail.com` or similar.

---

## Step 2 — Create a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Sign in with the Gmail account from Step 1
3. Click the project dropdown at the top → **New Project**
4. Give it a name (e.g., `VRS Test Automation`) → **Create**
5. Make sure the new project is selected in the top dropdown

---

## Step 3 — Enable the Gmail API

1. In the left sidebar → **APIs & Services** → **Library**
2. Search for `Gmail API`
3. Click it → **Enable**

---

## Step 4 — Configure the OAuth Consent Screen

1. Left sidebar → **APIs & Services** → **OAuth consent screen**
2. Select **External** → **Create**
3. Fill in:
   - **App name**: `VRS Test Automation` (or any name)
   - **User support email**: your Gmail account
   - **Developer contact email**: your Gmail account
4. Click **Save and Continue** through Scopes (no changes needed)
5. On the **Test users** screen → click **Add Users**
6. Add the Gmail account email (e.g., `testv225@gmail.com`)

   > **This step is critical.** Without adding the account as a test user, the OAuth flow returns `403: access_denied`.

7. Click **Save and Continue** → **Back to Dashboard**

---

## Step 5 — Create OAuth2 Credentials

1. Left sidebar → **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Application type: **Desktop app**
4. Name: `VRS Playwright CLI` (or any name)
5. Click **Create**
6. A dialog shows your **Client ID** and **Client Secret** — click **Download JSON**
7. Save the file somewhere safe (you'll need values from it in Step 7)

The JSON looks like:
```json
{
  "installed": {
    "client_id": "174592982576-xxxx.apps.googleusercontent.com",
    "client_secret": "GOCSPX-xxxx",
    "redirect_uris": ["http://localhost"]
  }
}
```

---

## Step 6 — Generate the Refresh Token (one-time)

The project has a script for this: `scripts/generateGmailToken.ts`

1. Add the credentials temporarily to `.env`:
```env
GMAIL_CLIENT_ID=<client_id from JSON>
GMAIL_CLIENT_SECRET=<client_secret from JSON>
```

2. Run the script:
```bash
npx ts-node scripts/generateGmailToken.ts
```

3. The script prints a URL — open it in a browser **while signed into the test Gmail account**
4. Click through the Google consent screen (you may see a warning — click **Continue**)
5. After approving, Google redirects to `http://localhost/?code=4/0Axxxx...`
6. Copy the `code` value from the URL (everything after `code=` and before `&scope`)
7. Paste it into the terminal when prompted
8. The script prints the **Refresh Token** — copy it

---

## Step 7 — Update .env

Add all three values to `.env`:

```env
BASE_GMAIL_ALIAS=testv225@gmail.com   # the Gmail account (use + aliases for unique per-test emails)
GMAIL_CLIENT_ID=174592982576-xxxx.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-xxxx
GMAIL_REFRESH_TOKEN=1//03xxxx
```

> **Never commit `.env` to version control.** It is already in `.gitignore`.

---

## Step 8 — Verify it works

Run the registration test (it verifies OTP + welcome emails):

```bash
npx playwright test tests/website/Regression/registration.spec.ts --grep "Register a new account"
```

If emails are received and assertions pass, the setup is complete.

---

## Refreshing an Expired/Revoked Token (Quick Reference)

If tests start failing with `invalid_grant` (see Troubleshooting below), the refresh token is dead and needs to be regenerated. `GMAIL_CLIENT_ID` and `GMAIL_CLIENT_SECRET` stay the same — only `GMAIL_REFRESH_TOKEN` needs replacing. No need to touch Google Cloud Console.

1. Run the token script:
   ```bash
   npx ts-node scripts/generateGmailToken.ts
   ```
2. Open the printed URL in a browser, signed in as the test Gmail account (e.g. `testv225@gmail.com`)
3. Click through the consent screen (click **Continue** past any warning)
4. You'll be redirected to `http://localhost/?code=4/0Axxxx...` — the page will show a connection error, that's expected
5. Copy the `code` value from the URL bar (everything after `code=` and before `&scope`)
6. Paste it into the terminal prompt
7. The script prints a new `GMAIL_REFRESH_TOKEN` — replace the old value in `.env` with it
8. Re-run the failing test to confirm it now passes

---

## How the + alias trick works

Instead of creating a new Gmail account per test, a single account receives all test emails using `+` suffixes:

```
testv225@gmail.com          ← real inbox
testv225+abc123@gmail.com   ← also lands in the same inbox
testv225+xyz789@gmail.com   ← also lands in the same inbox
```

`generateAliasEmail()` in `utils/testDataGenerator.ts` generates a unique alias automatically on every test run. The Gmail API then filters by the `to:` address to find the right email.

---

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `403: access_denied` | Test user not added to OAuth consent screen | Go to Step 4 → Test users → Add email |
| `invalid_grant` | Refresh token revoked or expired | Re-run Step 6 to generate a new token |
| `redirect_uri_mismatch` | Wrong redirect URI in credentials | Make sure Application type is **Desktop app** (uses `http://localhost`) |
| Email not found (timeout) | Gmail indexing delay | Increase `timeout` in `waitForEmail` call, or check spam folder |
| `400: invalid_client` | Wrong Client ID / Secret in `.env` | Double-check values match the downloaded JSON |

---

## Token lifecycle

- **Access tokens**: short-lived (1 hour), generated automatically by `gmailHelper.ts` using the refresh token
- **Refresh tokens**: long-lived, do not expire unless:
  - The user revokes access at [myaccount.google.com/permissions](https://myaccount.google.com/permissions)
  - The OAuth consent screen is set to "Testing" mode and the token is unused for 7 days (rare)
  - You generate a new token (old one is invalidated)

No action needed day-to-day — the refresh token in `.env` handles everything automatically.
