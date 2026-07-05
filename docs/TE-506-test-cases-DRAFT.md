# TE-506 — A06 "48 hours left" eSIM Expiry Reminder Email — Test Cases (DRAFT for review)

> Source of truth: the A06 Figma email design. Parent ticket: https://cps.jira.agile.vodafone.com/browse/TE-506
> Nothing posted to Zephyr yet — for your review.

## Scope (confirmed)
- **Languages:** all 6 (English, Spanish, French, German, Greek, Portuguese)
- **Platform:** Web / webmail only — **no platform segment in titles** (this is an email, not a Web/iOS/Android app)
- **Views:** Desktop + Mobile rendering
- **Out of scope:** API/trigger logic, SEO, dark mode

## Feature name used in titles
**48-Hour eSIM Expiry Reminder Email** (confirm or change)

## Naming convention (email — no platform segment)
`48-Hour eSIM Expiry Reminder Email | Verify ...`

## ⚠️ Design observations to raise (not test cases)
- The mock shows **"Expires on 30th Feb 2026"** — 30 Feb is an impossible date; confirm the real expiry value/format with design/dev.
- Copy inconsistency: headline says **"48 hours"** but the bullet says **"48 hrs"** — confirm intended wording.

---

## A. Content & layout (positive)

### TC-01 — Subject line personalization (positive)
**Title:** `48-Hour eSIM Expiry Reminder Email | Verify the subject line shows the personalized "48 hours left" message`
**Steps:**
1. Trigger/preview the A06 email for a recipient with a known first name.
2. View the email subject line in the inbox.

**Expected:** Subject reads "[First name], 48 hours left on your Travel eSIM bundle" with the recipient's actual first name substituted (no raw `[First name]` token).

### TC-02 — Vodafone logo (positive)
**Title:** `48-Hour eSIM Expiry Reminder Email | Verify the Vodafone logo renders at the top of the email`
**Steps:**
1. Open the email.

**Expected:** The Vodafone logo renders centered at the top, not broken, with alt text.

### TC-03 — Greeting & headline (positive)
**Title:** `48-Hour eSIM Expiry Reminder Email | Verify the greeting and "expire in 48 hours" headline display with the recipient name`
**Steps:**
1. Open the email body.

**Expected:** Greeting "Hi [First Name]," shows the recipient's name; headline reads "Your Travel eSIM plan will expire in 48 hours."

### TC-04 — Destination hero image (positive)
**Title:** `48-Hour eSIM Expiry Reminder Email | Verify the destination hero image renders`
**Steps:**
1. Open the email.

**Expected:** The destination hero image (matching the plan region, e.g. Asia) renders inside the plan card with alt text.

### TC-05 — Plan details card (positive)
**Title:** `48-Hour eSIM Expiry Reminder Email | Verify the plan details card shows plan name, data, validity, Order ID and expiry date`
**Steps:**
1. View the plan card.

**Expected:** Plan name ("ASIA eSIM"), data + validity ("Unlimited, 14 days"), "Order ID <real order id>" and "Expires on <real expiry date>" all display with the recipient's actual order data.

### TC-06 — "What happens next" bullets (positive)
**Title:** `48-Hour eSIM Expiry Reminder Email | Verify the "What happens next" section shows the three bullet points`
**Steps:**
1. View the "What happens next" section.

**Expected:** Three bullets render: "Your data access will stop in 48 hrs", "No further charges will be applied", "Your eSIM will stay installed on your device".

### TC-07 — "Extend your data" section & CTA (positive)
**Title:** `48-Hour eSIM Expiry Reminder Email | Verify the "Extend your data" section copy and CTA button are displayed`
**Steps:**
1. View the "Extend your data anytime." section.

**Expected:** Section heading, body copy ("To keep enjoying data after your bundle expires, extend it by getting a new top-up. No need to reinstall.") and the "Extend your data" button are displayed.

### TC-08 — "Extend your data" CTA link (positive)
**Title:** `48-Hour eSIM Expiry Reminder Email | Verify the "Extend your data" CTA links to the top-up/extend flow`
**Steps:**
1. Click the "Extend your data" button.

**Expected:** Navigates to the correct top-up/extend-data destination for that eSIM (valid HTTPS URL, correct landing page).

### TC-09 — "Need Help?" section & CTAs (positive)
**Title:** `48-Hour eSIM Expiry Reminder Email | Verify the "Need Help?" section with Contact support and View our Help Center CTAs`
**Steps:**
1. View the "Need Help?" section.
2. Click "Contact support", then "View our Help Center".

**Expected:** Section copy ("We're here for you… 24/7.") shows; "Contact support" and "View our Help Center" buttons render and each links to the correct destination.

### TC-10 — App download badges (positive)
**Title:** `48-Hour eSIM Expiry Reminder Email | Verify the App Store and Google Play download badges render and link correctly`
**Steps:**
1. View the "Download Vodafone Travel app" footer block.
2. Click each badge.

**Expected:** App Store and Google Play badges render; App Store links to the iOS app listing and Google Play to the Android app listing.

### TC-11 — Social media icons (positive)
**Title:** `48-Hour eSIM Expiry Reminder Email | Verify the "Connect with us" social media icons render and link to the correct profiles`
**Steps:**
1. View the "Connect with us" row.
2. Click each icon.

**Expected:** Facebook, Instagram, TikTok, LinkedIn and YouTube icons render and each links to the correct Vodafone profile.

### TC-12 — Footer legal links & copyright (positive)
**Title:** `48-Hour eSIM Expiry Reminder Email | Verify the footer Unsubscribe and Privacy Policy links and the copyright year`
**Steps:**
1. View the footer.

**Expected:** "Unsubscribe" and "Privacy Policy" links render and point to the correct pages; copyright reads "© 2026 Vodafone. All rights reserved".

### TC-13 — Unsubscribe flow (positive)
**Title:** `48-Hour eSIM Expiry Reminder Email | Verify the Unsubscribe link opens the unsubscribe flow`
**Steps:**
1. Click "Unsubscribe".

**Expected:** Opens the unsubscribe/preferences flow for the recipient (valid HTTPS URL).

---

## B. Rendering — desktop & mobile

### TC-14 — Desktop rendering (positive)
**Title:** `48-Hour eSIM Expiry Reminder Email | Verify the email renders correctly on desktop webmail`
**Steps:**
1. Open the email on desktop webmail (e.g. Gmail web, Outlook web).

**Expected:** The 600px-wide layout renders intact — logo, hero, plan card, sections, CTAs and footer aligned; no clipping, overlap or broken styling.

### TC-15 — Mobile responsive rendering (edge)
**Title:** `48-Hour eSIM Expiry Reminder Email | Verify the email renders responsively on mobile`
**Steps:**
1. Open the email on a mobile mail client / narrow viewport.

**Expected:** Content stacks and scales responsively; text is readable, images scale, and CTA buttons are full-width and tappable; no horizontal scroll.

---

## C. Data & personalization (negative / edge)

### TC-16 — Missing first name fallback (negative)
**Title:** `48-Hour eSIM Expiry Reminder Email | Verify the greeting and subject fall back gracefully when the first name is missing`
**Steps:**
1. Trigger the email for a recipient with no first name on file.

**Expected:** Subject and greeting use a graceful fallback (e.g. "Hi there,") with no empty/raw `[First Name]` token and no broken punctuation.

### TC-17 — Very long first name (edge)
**Title:** `48-Hour eSIM Expiry Reminder Email | Verify a very long first name does not break the subject or greeting layout`
**Steps:**
1. Trigger the email for a recipient with a very long first name.

**Expected:** The long name truncates or wraps gracefully in the subject and greeting without breaking layout.

### TC-18 — Unlimited plan display (edge)
**Title:** `48-Hour eSIM Expiry Reminder Email | Verify an Unlimited data plan is displayed correctly in the plan card`
**Steps:**
1. View the plan card for an Unlimited plan (and, for contrast, a fixed-GB plan).

**Expected:** "Unlimited, <validity>" displays correctly for unlimited plans; fixed-GB plans show "<GB>, <validity>" — no "undefined"/"0GB" artifacts.

---

## D. Localization — one test case per language (positive)

> One case per language, each a checklist over the whole email on desktop + mobile.

### TC-19..TC-24 — Localized email per language
For each of **English, Spanish, French, German, Greek, Portuguese**, one test case:

**Title:** `48-Hour eSIM Expiry Reminder Email | Verify the email is fully localized in <Language>`

**Steps (checklist in <Language>):**
1. Trigger/preview the A06 email with the site/account language set to <Language>.
2. Verify the **subject line** is translated and the personalization token still resolves.
3. Verify the **greeting** and **"expire in 48 hours" headline** are translated.
4. Verify the **plan card** labels (data/validity, "Order ID", "Expires on") are translated; the expiry **date is formatted per the locale**.
5. Verify the **"What happens next"** heading and all three bullets are translated.
6. Verify the **"Extend your data"** heading, body copy and CTA label are translated.
7. Verify the **"Need Help?"** heading, body and both CTA labels ("Contact support", "View our Help Center") are translated.
8. Verify the **footer** ("Download Vodafone Travel app", "Connect with us", "Unsubscribe", "Privacy Policy", copyright) is translated where applicable.
9. Verify there are **no untranslated strings** or missing-key placeholders, and the layout holds on **desktop and mobile** (longer strings, e.g. German, do not break buttons/cards; Greek script renders correctly).

**Expected:** The entire email renders correctly in <Language> — fully translated, locale-correct date formatting, no untranslated strings, layout intact on desktop and mobile.
