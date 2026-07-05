# TE-782 — eSIM Details Page — Test Cases (DRAFT for review)

> Source of truth: the three screenshots (`I_B04`, `I_B05`, `I_B06`). **The parent ticket description is intentionally ignored per instruction.**
> Parent ticket: https://cps.jira.agile.vodafone.com/browse/TE-782
> Nothing has been posted to Zephyr yet — this is for your review.

## Screens covered (states of *My eSIMs → eSIM details*)
- **I_B04 — Not installed** eSIM details page
- **I_B05 — Installed** eSIM details page
- **I_B06 — Active** eSIM details page (with top-ups + usage)

## Supported languages (confirmed)
**English, German, Portuguese, Spanish, French, Greek.** (None are RTL — no RTL case included.)

## Key business rules captured
- **Copy buttons** show a **green confirmation state for ~5 seconds** after a click, then revert to their original state.
- **Refund button** is shown **only for *Not installed* eSIMs**, and **only within 14 days of purchase**. After 14 days the Refund button is removed **even if the eSIM is still not installed**. It is never shown for *Installed* or *Active* eSIMs.

---

## A. I_B04 — Not installed eSIM details

### A1 — Display not-installed eSIM details (positive)
**Steps:**
1. Log in and navigate to *My eSIMs*.
2. Open an eSIM whose status is *Not installed*.

**Expected:** Card shows country flag, plan name ("Democratic Republic of the Congo 100GB"), eSIM ID (123456789098765), a **Not installed** status badge, the message "Your eSIM is ready to install…", and Plan details (Date of purchase 22/11/2025, Data 5 GB / 7 days).

### A2 — QR code section is shown and expanded (positive)
**Steps:**
1. On the not-installed details page, view the "Install your eSIM" panel.

**Expected:** "Scan QR Code" section is present and shows a QR image plus the note "The following QR code has been emailed to you…".

### A3 — Manual installation details are shown (positive)
**Steps:**
1. Expand "Enter details manually".

**Expected:** SM-DP+ Address (e.g. `smdp-plus-0.eu....`) and Activation code (`ABC123456789`) are displayed, each with a **Copy** button, plus a "View activation guide" button.

### A4 — Copy SM-DP+ address (positive)
**Steps:**
1. Click **Copy** next to SM-DP+ Address.

**Expected:** The full (untruncated) SM-DP+ address is copied to the clipboard.

### A5 — Copy activation code (positive)
**Steps:**
1. Click **Copy** next to Activation code.

**Expected:** `ABC123456789` is copied to the clipboard.

### A6 — Copy button green confirmation then reverts (positive)
**Steps:**
1. Click a **Copy** button (SM-DP+ Address or Activation code).
2. Observe the button immediately after the click.
3. Wait ~5 seconds.

**Expected:** On click the Copy button turns **green** (success state) for ~5 seconds, then automatically reverts to its original/default appearance.

### A7 — Re-clicking Copy within the 5-second window (edge)
**Steps:**
1. Click a **Copy** button.
2. Within the 5-second green window, click the same Copy button again.

**Expected:** The value is copied again and the 5-second green timer restarts (button stays green for a fresh 5 seconds); no flicker, stuck-green, or original-state-before-5s behaviour.

### A8 — View activation guide (positive)
**Steps:**
1. Click **View activation guide**.

**Expected:** The activation guide opens (page/modal/new tab) with installation instructions.

### A9 — Refund button available for not-installed eSIM within 14 days (positive)
**Steps:**
1. Open a *Not installed* eSIM purchased 14 days ago or less.

**Expected:** A **Refund** button/option is displayed on the details page.

### A10 — Refund button removed after 14 days for still-not-installed eSIM (edge — 14/15-day boundary)
**Steps:**
1. Open a *Not installed* eSIM purchased exactly 14 days ago.
2. Open a *Not installed* eSIM purchased 15 days ago.

**Expected:** At day 14 the **Refund** button is still shown; from day 15 onward the Refund button is **removed even though the eSIM is still not installed**.

### A11 — Unauthenticated / unauthorized access to details page (negative)
**Steps:**
1. While logged out, open a direct URL to an eSIM details page.
2. Attempt to open an eSIM ID that does not belong to the logged-in user.

**Expected:** User is redirected to login / shown an access-denied state; no eSIM data is exposed.

### A12 — Truncated SM-DP+ address still copies full value (edge)
**Steps:**
1. Note the SM-DP+ address is visually truncated (`smdp-plus-0.eu....`).
2. Click **Copy** and paste into a text field.

**Expected:** The pasted value is the complete address, not the truncated display string.

### A13 — Long plan name wrapping (edge)
**Steps:**
1. Open an eSIM with a long name ("Democratic Republic of the Congo 100GB").

**Expected:** The name wraps across multiple lines without overflowing the card, overlapping the status badge, or breaking layout.

---

## B. I_B05 — Installed eSIM details

### B1 — Display installed eSIM details (positive)
**Steps:**
1. Open an eSIM whose status is *Installed*.

**Expected:** Card shows an **Installed** status badge and the "Recommendation for eSIM activation" section with the three recommendations: (a) "Your eSIM is installed but not activated or used.", (b) "Activate your eSIM only upon arrival…", (c) "Maintain a stable internet connection during installation…". Plan details remain (22/11/2025, 5 GB / 7 days).

### B2 — Install panel still available when installed (positive)
**Steps:**
1. View the "Install your eSIM" panel on the installed page.

**Expected:** Scan QR Code and Enter details manually (SM-DP+ address, activation code, Copy buttons, View activation guide) are still present, allowing install on another device.

### B3 — Recommendations list renders fully (edge)
**Steps:**
1. View the recommendation list with its icons.

**Expected:** All three recommendation rows render with icon + text, correctly aligned, no truncation of the longer "Maintain a stable internet connection…" line.

### B4 — Status badge reflects state, not stale "Not installed" (negative)
**Steps:**
1. Install an eSIM, then reopen its details page.

**Expected:** Badge reads **Installed** (not "Not installed"); the not-installed-only "ready to install" copy is no longer shown.

### B5 — Refund button not shown for installed eSIM (negative)
**Steps:**
1. Open an *Installed* eSIM (even if purchased 14 days ago or less).

**Expected:** **No Refund button** is shown — refund is only available while the eSIM is *Not installed*.

---

## C. I_B06 — Active eSIM details (with top-ups)

### C1 — Display active eSIM with usage and applied top-ups (positive)
**Steps:**
1. Open an eSIM whose status is *Active*.

**Expected:** **Active** (green) badge; Data usage shows used GB out of the plan allowance (e.g. "0GB out of 5GB"); Days "You have 5 days left out of 10 days"; "Your top-up(s)" list showing "4GB for 7 days" and "2GB for 5 days"; Plan details (22/11/2025, 5 GB / 7 days).

### C2 — Top-up options list with pricing (positive)
**Steps:**
1. View the "Top - up options" panel.

**Expected:** Four options shown — 5GB/7 Days (12 USD), 10GB/15 Days (~~25 USD~~ 20 USD), 20GB/30 Days (30 USD), 50GB/30 Days (50 USD) — with the intro copy "Running low on your data?…".

### C3 — Discounted option shows original + reduced price (positive)
**Steps:**
1. Inspect the "10GB for 15 Days" option.

**Expected:** Original price `25 USD` is struck through and discounted price `20 USD` is highlighted.

### C4 — First top-up option preselected (positive)
**Steps:**
1. Open the active details page without interacting.

**Expected:** "5GB for 7 Days" radio is selected by default; **Continue** is enabled.

### C5 — Select a top-up and continue (positive)
**Steps:**
1. Select "20GB for 30 Days".
2. Click **Continue**.

**Expected:** Selection updates to the chosen option and the flow proceeds to checkout/payment for that top-up.

### C6 — Install panel collapsed by default on active page (positive)
**Steps:**
1. View the lower "Install your eSIM" section.
2. Expand "Scan QR Code" / "Enter details manually".

**Expected:** Both sections are collapsed by default and expand on click to reveal QR / manual details.

### C7 — Top-up purchase failure handling (negative)
**Steps:**
1. Select a top-up, click **Continue**, and force the payment/top-up request to fail.

**Expected:** A clear error is shown, the plan is unchanged, and the user can retry; no top-up is falsely added.

### C8 — Continue with no selectable/available top-ups (negative)
**Steps:**
1. Open an active eSIM for which no top-up options are available/returned.

**Expected:** Either no Continue action is offered or it is disabled with an explanatory empty state; no broken/empty radio list.

### C9 — Usage meter shows 0GB used out of the plan allowance (edge)
**Steps:**
1. Open a freshly activated eSIM that has not consumed any data.

**Expected:** The Data row shows "0GB out of [plan allowance]GB" (e.g. "0GB out of 5GB") — **not** "0GB out of 0GB"; the progress bar renders at 0% with no NaN / divide-by-zero.

### C10 — Days remaining shows "1 day left out of [validity] days" (edge)
**Steps:**
1. Open an active eSIM with 1 day of validity remaining.

**Expected:** The Days row shows "You have 1 day left out of [plan validity] days" — singular "day", out of the plan's validity period — with correct near-expiry styling.

### C11 — Days remaining at expiry boundary — 0 days left (edge)
**Steps:**
1. Open an active eSIM on its final / expired day.

**Expected:** Days row shows "0 days left out of [validity] days"; expiry messaging/styling applied; no negative numbers.

### C12 — Refund button not shown for active eSIM (negative)
**Steps:**
1. Open an *Active* eSIM.

**Expected:** **No Refund button** is shown — refund is only available while the eSIM is *Not installed*.

---

## D. Localization — one test case per supported language

> One case per language, each a full checklist across all three details states (I_B04 / I_B05 / I_B06).
> The checklist is identical per language; only the active language changes.

### D1 — eSIM details page localization — English (positive)
**Steps (checklist in English):**
1. Switch the site language to English and open the *Not installed* (I_B04) details page.
2. Verify all I_B04 strings render in English: **Not installed** badge, "ready to install" message, "Install your eSIM", "Scan QR Code", emailed-QR note, "Enter details manually", "SM-DP+ Address", "Activation code", **Copy**, "View activation guide", **Refund**, and the Plan details labels (Date of purchase, Data).
3. Open the *Installed* (I_B05) page and verify the **Installed** badge and all three "Recommendation for eSIM activation" lines render in English.
4. Open the *Active* (I_B06) page and verify the **Active** badge, "Top - up options" + intro copy, usage labels (Data / Days / "used … out of …" / "… days left out of …"), "Your top-up(s)", and **Continue** render in English.
5. Verify the "Date of purchase" date is formatted per the locale convention.
6. Verify top-up prices, GB and day figures use correct currency/number formatting (incl. the struck-through discount price).
7. Verify there are no untranslated strings or missing-key placeholders on any of the three states.
8. Verify translated strings wrap without clipping/overlap of the status badge, cards, or radio rows.
9. Switch to this language, navigate away and back (and reload); verify the language persists.

**Expected:** All content across the three states renders correctly in **English** — fully translated, correctly formatted (date/currency/number), no layout breakage, no untranslated strings, and the language persists across navigation/reload.

### D2 — eSIM details page localization — German (positive)
**Steps (checklist in German):**
1. Switch the site language to German and open the *Not installed* (I_B04) details page.
2. Verify all I_B04 strings render in German: status badge, "ready to install" message, "Install your eSIM", "Scan QR Code", emailed-QR note, "Enter details manually", "SM-DP+ Address", "Activation code", Copy, "View activation guide", Refund, and the Plan details labels.
3. Open *Installed* (I_B05) and verify the Installed badge and all three recommendation lines render in German.
4. Open *Active* (I_B06) and verify the Active badge, "Top - up options" + intro copy, usage labels, "Your top-up(s)", and Continue render in German.
5. Verify the "Date of purchase" date is formatted per the locale convention.
6. Verify top-up prices, GB and day figures use correct currency/number formatting (incl. the discount price).
7. Verify there are no untranslated strings or missing-key placeholders on any state.
8. Verify the typically **longer German strings** wrap without clipping/overlap of the status badge, cards, or radio rows.
9. Switch to German, navigate away and back (and reload); verify the language persists.

**Expected:** All content across the three states renders correctly in **German** — fully translated, correctly formatted, no layout breakage (longer strings handled), no untranslated strings, language persists.

### D3 — eSIM details page localization — Portuguese (positive)
**Steps (checklist in Portuguese):**
1. Switch the site language to Portuguese and open the *Not installed* (I_B04) details page.
2. Verify all I_B04 strings render in Portuguese: status badge, "ready to install" message, "Install your eSIM", "Scan QR Code", emailed-QR note, "Enter details manually", "SM-DP+ Address", "Activation code", Copy, "View activation guide", Refund, and the Plan details labels.
3. Open *Installed* (I_B05) and verify the Installed badge and all three recommendation lines render in Portuguese.
4. Open *Active* (I_B06) and verify the Active badge, "Top - up options" + intro copy, usage labels, "Your top-up(s)", and Continue render in Portuguese.
5. Verify the "Date of purchase" date is formatted per the locale convention.
6. Verify top-up prices, GB and day figures use correct currency/number formatting (incl. the discount price).
7. Verify there are no untranslated strings or missing-key placeholders on any state.
8. Verify translated strings wrap without clipping/overlap of the status badge, cards, or radio rows.
9. Switch to Portuguese, navigate away and back (and reload); verify the language persists.

**Expected:** All content across the three states renders correctly in **Portuguese** — fully translated, correctly formatted, no layout breakage, no untranslated strings, language persists.

### D4 — eSIM details page localization — Spanish (positive)
**Steps (checklist in Spanish):**
1. Switch the site language to Spanish and open the *Not installed* (I_B04) details page.
2. Verify all I_B04 strings render in Spanish: status badge, "ready to install" message, "Install your eSIM", "Scan QR Code", emailed-QR note, "Enter details manually", "SM-DP+ Address", "Activation code", Copy, "View activation guide", Refund, and the Plan details labels.
3. Open *Installed* (I_B05) and verify the Installed badge and all three recommendation lines render in Spanish.
4. Open *Active* (I_B06) and verify the Active badge, "Top - up options" + intro copy, usage labels, "Your top-up(s)", and Continue render in Spanish.
5. Verify the "Date of purchase" date is formatted per the locale convention.
6. Verify top-up prices, GB and day figures use correct currency/number formatting (incl. the discount price).
7. Verify there are no untranslated strings or missing-key placeholders on any state.
8. Verify translated strings wrap without clipping/overlap of the status badge, cards, or radio rows.
9. Switch to Spanish, navigate away and back (and reload); verify the language persists.

**Expected:** All content across the three states renders correctly in **Spanish** — fully translated, correctly formatted, no layout breakage, no untranslated strings, language persists.

### D5 — eSIM details page localization — French (positive)
**Steps (checklist in French):**
1. Switch the site language to French and open the *Not installed* (I_B04) details page.
2. Verify all I_B04 strings render in French: status badge, "ready to install" message, "Install your eSIM", "Scan QR Code", emailed-QR note, "Enter details manually", "SM-DP+ Address", "Activation code", Copy, "View activation guide", Refund, and the Plan details labels.
3. Open *Installed* (I_B05) and verify the Installed badge and all three recommendation lines render in French.
4. Open *Active* (I_B06) and verify the Active badge, "Top - up options" + intro copy, usage labels, "Your top-up(s)", and Continue render in French.
5. Verify the "Date of purchase" date is formatted per the locale convention.
6. Verify top-up prices, GB and day figures use correct currency/number formatting (incl. the discount price).
7. Verify there are no untranslated strings or missing-key placeholders on any state.
8. Verify translated strings wrap without clipping/overlap of the status badge, cards, or radio rows.
9. Switch to French, navigate away and back (and reload); verify the language persists.

**Expected:** All content across the three states renders correctly in **French** — fully translated, correctly formatted, no layout breakage, no untranslated strings, language persists.

### D6 — eSIM details page localization — Greek (positive)
**Steps (checklist in Greek):**
1. Switch the site language to Greek and open the *Not installed* (I_B04) details page.
2. Verify all I_B04 strings render in Greek: status badge, "ready to install" message, "Install your eSIM", "Scan QR Code", emailed-QR note, "Enter details manually", "SM-DP+ Address", "Activation code", Copy, "View activation guide", Refund, and the Plan details labels.
3. Open *Installed* (I_B05) and verify the Installed badge and all three recommendation lines render in Greek.
4. Open *Active* (I_B06) and verify the Active badge, "Top - up options" + intro copy, usage labels, "Your top-up(s)", and Continue render in Greek.
5. Verify the "Date of purchase" date is formatted per the locale convention.
6. Verify top-up prices, GB and day figures use correct currency/number formatting (incl. the discount price).
7. Verify there are no untranslated strings or missing-key placeholders on any state.
8. Verify the **Greek script** renders correctly (correct glyphs/encoding) and strings wrap without clipping/overlap of the status badge, cards, or radio rows.
9. Switch to Greek, navigate away and back (and reload); verify the language persists.

**Expected:** All content across the three states renders correctly in **Greek** — fully translated, Greek script rendered correctly, correctly formatted, no layout breakage, no untranslated strings, language persists.
