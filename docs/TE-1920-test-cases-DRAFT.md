# Test Cases — TE-1920
## QR Code Email | "What Happens Next" section — add CTA

**Ticket:** TE-1920 | **Parent:** TE-1762 (UAT Findings)
**Type:** Story | **Priority:** Medium | **Status:** Draft — NOT posted to Zephyr/Jira, pending review
**Labels:** Consumer
**Scope:** Web only · All 6 locales (EN, DE, PT, ES, FR, EL) · All views (desktop/mobile/tablet) · No SEO · No API

**Description recap:** Add a CTA button to the second bullet ("Use other plans individually on each device") of the "What Happens Next" section in the QR code email. Button navigates to the **My eSIMs** landing page. If the user is not logged in, they must be prompted to log in first, then redirected to My eSIMs after successful authentication. Button label and URL must be configurable and support all available languages.

---

## TC-01 — CTA Button Is Present on the Correct Bullet

**Objective:** Verify the new CTA button renders under the correct bullet in the "What Happens Next" section

**Preconditions:** User has completed a purchase and received the QR code email

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the QR code delivery email | "What Happens Next" section is visible with 3 bullets |
| 2 | Locate the second bullet ("Use other plans individually on each device") | Bullet text is unchanged from current copy |
| 3 | Observe the area directly under/near the second bullet | A CTA button is present (matches Figma: "Go to My eSIMs" style button) |
| 4 | Confirm no CTA button appears on bullet 1 or bullet 3 | Only the second bullet has the new CTA |

---

## TC-02 — CTA Navigates Logged-In User to My eSIMs

**Objective:** Verify clicking the CTA takes an already-authenticated user directly to the My eSIMs landing page

**Preconditions:** User is logged into Vodafone ID in the browser session used to click the email link

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the QR code email, click the new CTA button | Browser opens/navigates |
| 2 | Observe destination | User lands directly on the My eSIMs landing page, no login prompt shown |
| 3 | Verify page content | My eSIMs page shows the user's active eSIM(s)/plan(s) |

---

## TC-03 — CTA Prompts Login for Logged-Out User, Then Redirects to My eSIMs

**Objective:** Verify unauthenticated users are prompted to log in and redirected correctly after authentication

**Preconditions:** User is logged out (no active Vodafone ID session)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the QR code email, click the new CTA button | User is redirected to the Vodafone ID login page |
| 2 | Enter valid credentials and submit | Authentication succeeds |
| 3 | Observe post-login redirect | User is redirected to the My eSIMs landing page (not homepage or checkout) |

---

## TC-04 — CTA Label and URL Are Configurable

**Objective:** Verify the button label/URL are driven by config (e.g. Contentful) rather than hardcoded

**Preconditions:** Access to the email template config source

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Update the CTA button label in the config source | Change saves successfully |
| 2 | Trigger/preview the QR code email | Updated label is reflected in the rendered email |
| 3 | Update the CTA target URL in the config source | Change saves successfully |
| 4 | Trigger/preview the QR code email and click CTA | Button navigates to the updated URL |

---

## TC-05 — CTA Renders and Functions Correctly Across All Supported Languages

**Objective:** Verify the CTA button label is translated and functional in each supported locale

**Preconditions:** User account/profile set to each target language, or email triggered with each locale

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Trigger the QR code email in English | CTA button label is in English, text fits within button bounds, no overflow/truncation |
| 2 | Repeat for German | CTA label is correctly translated, no layout break (German strings tend to be longer) |
| 3 | Repeat for Portuguese | CTA label is correctly translated, button renders correctly |
| 4 | Repeat for Spanish | CTA label is correctly translated, button renders correctly |
| 5 | Repeat for French | CTA label is correctly translated, button renders correctly |
| 6 | Repeat for Greek | CTA label is correctly translated, button renders correctly, no character encoding issues |
| 7 | Click the CTA in each locale | Navigates correctly to My eSIMs (with login prompt if logged out), regardless of language |

---

## TC-06 — Email and CTA Render Correctly Across Views

**Objective:** Verify the CTA button is responsive and usable across email client viewport sizes

**Preconditions:** QR code email available for preview/testing across viewports

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | View the email on a desktop-width email client | CTA button is fully visible, correctly positioned under bullet 2, not overlapping other content |
| 2 | View the email on a mobile-width email client | CTA button scales/stacks appropriately, remains tappable, label not truncated |
| 3 | View the email on a tablet-width email client | CTA button renders correctly, no layout breakage |

---

## TC-07 — Other "What Happens Next" Bullets Remain Unaffected

**Objective:** Regression check — ensure adding the CTA didn't break the rest of the section

**Preconditions:** QR code email available

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the QR code email | "What Happens Next" section shows all 3 bullets with icons and text intact |
| 2 | Verify bullet 1 ("Share data across your group with Travel Together plans") | Renders unchanged, no CTA added |
| 3 | Verify bullet 3 ("Track usage and top up when needed") | Renders unchanged, no CTA added |
| 4 | Verify overall section spacing/layout | No visual regression from the added CTA on bullet 2 |

---

## Open questions before finalizing

- Exact CTA button copy — confirm final string with design/PO (Figma shows "Go to My eSIMs")
- Which email client(s)/testing tool will be used to preview across languages and viewports (e.g. Litmus, direct send)?
- Confirm redirect-after-login behavior handles edge cases (e.g. login failure, session timeout mid-flow) — may need an additional negative test case
