# Test Cases — TE-1044
## [Web] Add Chinese Language

**Ticket:** TE-1044 | **Epic:** Support New Languages
**Type:** Feature | **Priority:** Critical | **Status:** Ready for PI
**Labels:** Consumer, PI_BACKLOG
**Scope:** Web + Mobile · Generic, reusable per new language · No SEO

**Design note:** Written generically against **any newly added language**, not
hardcoded to Chinese. Each case uses `[New Language]` as a placeholder (e.g.
Chinese, and — per the ticket — further languages to follow), so the same suite
is re-run for every future language rollout by swapping the parameter. Two open
points flagged directly on the ticket (CJK font support, ToS/Privacy Policy
translation) are captured as explicit cases below rather than assumptions.

---

## TC-01 — `[New Language]` Is Selectable as a Site Language

**Objective:** Verify the new language appears as an option in the language switcher

**Preconditions:** `[New Language]` has been added to the site's supported language list

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the language selector (header/footer or settings menu) | Selector opens showing the list of supported languages |
| 2 | Locate `[New Language]` in the list | `[New Language]` is present, correctly labelled (native name + flag/code if applicable) |
| 3 | Select `[New Language]` | Site switches to `[New Language]`; selector reflects the new active language |

---

## TC-02 — Homepage Fully Renders in `[New Language]`

**Objective:** Verify all homepage content — hero, navigation, region/country tabs, search bar, footer — is translated

**Preconditions:** `[New Language]` is selected

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the homepage with `[New Language]` active | Page loads |
| 2 | Inspect hero banner text, CTAs | All text is in `[New Language]`, no English/default-language leftovers |
| 3 | Inspect main navigation menu items | All nav labels translated |
| 4 | Inspect region and country tabs/cards | Region/country names translated (or correctly localized/transliterated per convention) |
| 5 | Inspect search bar placeholder text | Translated placeholder, search still functions correctly |
| 6 | Inspect footer links and legal text | Footer labels translated |

---

## TC-03 — Destinations Listing Page (`/our-destinations`) Fully Renders in `[New Language]`

**Objective:** Verify the destinations listing page — Regions/Countries tabs, search, cards — is fully translated

**Preconditions:** `[New Language]` is selected

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/our-destinations` | Page loads in `[New Language]` |
| 2 | Switch between Regions and Countries tabs | Tab labels and all listed destination names are translated |
| 3 | Use the destination search field | Placeholder/labels translated; search results still correct |

---

## TC-04 — Region Plans Page Fully Renders in `[New Language]`

**Objective:** Verify plan cards and page chrome on a region's plans page are translated

**Preconditions:** `[New Language]` selected; navigate to any region's plans page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a region plans page (e.g. `/our-destinations/<region>`) | Page loads in `[New Language]` |
| 2 | Inspect plan card labels — data allowance, validity, price unit, "Add to cart" CTA | All labels translated; only the numeric/currency values stay as-is |
| 3 | Inspect page headings and filters (if any) | Translated |

---

## TC-05 — Cart Reflects `[New Language]`

**Objective:** Verify the cart modal/page is translated after adding a plan

**Preconditions:** `[New Language]` selected; a plan is added to cart

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Add a plan to cart | Cart opens/updates |
| 2 | Inspect cart content — plan name, price label, "Continue to checkout" CTA | All translated |

---

## TC-06 — Checkout Page Fully Renders in `[New Language]`

**Objective:** Verify the checkout form (personal info + billing address) and its validation messages are translated

**Preconditions:** `[New Language]` selected; cart contains a plan

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Proceed to Checkout | Page loads in `[New Language]` |
| 2 | Inspect field labels (first name, last name, email, billing address fields) | All labels translated |
| 3 | Inspect the "Log in" link and consent checkbox text | Translated, including any linked ToS/Privacy Policy anchor text |
| 4 | Submit the form with invalid/empty data | Validation error messages appear in `[New Language]` |

---

## TC-07 — Email Verification / OTP Screen Renders in `[New Language]`

**Objective:** Verify the OTP entry modal and "Welcome back" prompt are translated

**Preconditions:** `[New Language]` selected; checkout submitted with email

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Trigger email verification with a new email | OTP modal shows instructions and field labels in `[New Language]` |
| 2 | Trigger email verification with an existing account's email | "Welcome back" heading and Login button text are translated |
| 3 | Enter an invalid OTP | Error message appears in `[New Language]` |

---

## TC-08 — Login Page (Vodafone ID) Renders in `[New Language]`

**Objective:** Verify the external Vodafone ID login page reflects the selected site language

**Preconditions:** `[New Language]` selected on VRS before navigating to login

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "Log in" from Checkout or navigate to the login URL | Vodafone ID login page loads |
| 2 | Inspect field labels, "Continue" button, error/help text | Reflects `[New Language]` (or documents/flags if Vodafone ID does not yet support this language — see TC-13) |

---

## TC-09 — Payment Page Renders in `[New Language]`

**Objective:** Verify the payment gateway page (nested iframe) and surrounding checkout chrome are translated

**Preconditions:** `[New Language]` selected; user reaches Payment page as guest and as logged-in

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Reach the Payment page as a guest | Card entry field labels, Pay button, and page chrome outside the iframe are translated |
| 2 | Reach the Payment page as a logged-in user | Saved card label/CTA and surrounding chrome translated |
| 3 | Inspect the payment iframe itself | Documents whether the third-party payment gateway supports `[New Language]`; if not, flag as a known limitation rather than a defect in VRS itself |

---

## TC-10 — Order Successful Page Renders in `[New Language]`

**Objective:** Verify the order confirmation page is fully translated

**Preconditions:** `[New Language]` selected; a purchase is completed

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Complete a purchase as a guest | "Thank you for your order!" message and eSIM delivery notice are translated |
| 2 | Inspect the "Create Password" prompt (guest) | Translated |
| 3 | Complete a purchase as a logged-in user | Confirmation content translated; no "Create Password" prompt shown |

---

## TC-11 — Registration Page Renders in `[New Language]`

**Objective:** Verify Vodafone ID account creation form is translated

**Preconditions:** `[New Language]` selected; navigate to registration

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the registration page | Field labels (first/last name, email, country, state, password, confirm password) translated |
| 2 | Trigger a validation error (e.g. mismatched passwords) | Error message shown in `[New Language]` |
| 3 | Enter OTP screen during registration | OTP instructions/labels translated |
| 4 | Complete registration | Success heading translated |

---

## TC-12 — My Account / Sign Out Renders in `[New Language]`

**Objective:** Verify the account dropdown and sign-out flow are translated

**Preconditions:** `[New Language]` selected; user is logged in

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the account dropdown | Menu items (e.g. "Sign Out") translated |
| 2 | Sign out | Confirmation/redirect behaves correctly; any messaging shown is translated |

---

## TC-13 — Terms of Service and Privacy Policy Reflect `[New Language]` (or Documented Fallback)

**Objective:** Resolve the ticket's open point — verify whether legal pages are translated or intentionally remain in a base/default language

**Preconditions:** `[New Language]` selected

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Terms of Service via footer/checkout consent link | Page content is either fully translated into `[New Language]`, **or** — if legal content is intentionally not translated — it clearly falls back to a defined default language without broken layout or mixed partial translation |
| 2 | Navigate to Privacy Policy via footer/checkout consent link | Same as above |
| 3 | Record actual behavior against product decision | Confirms expected behavior is a deliberate, documented choice — not an accidental gap |

---

## TC-14 — Font Rendering Supports `[New Language]`'s Character Set

**Objective:** Resolve the ticket's open point — verify the site's font stack correctly renders `[New Language]`'s script (e.g. CJK for Chinese) across all pages

**Preconditions:** `[New Language]` selected

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Browse through homepage, destinations, checkout, and order success pages in `[New Language]` | All characters render clearly — no tofu boxes (☐), missing glyphs, or fallback system fonts that break the visual design |
| 2 | Inspect text at various sizes/weights (headings, body, buttons) | Font renders legibly and consistently at all sizes used in the design |
| 3 | Check text-heavy areas (long legal text, error messages) | No layout overflow/clipping caused by character width differences vs. the default language |

---

## TC-15 — No Missing Translation Keys / Fallback Text Leaks Through

**Objective:** Verify there are no untranslated strings, raw translation keys, or default-language leftovers on any page in `[New Language]`

**Preconditions:** `[New Language]` selected; full site crawl planned

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate through every core flow (home → destinations → plans → cart → checkout → payment → order success) in `[New Language]` | No raw translation keys (e.g. `checkout.title`) are visible anywhere |
| 2 | Check dynamic/interpolated strings (e.g. "You added X GB for Y days") | Interpolated values render correctly within the translated sentence structure |
| 3 | Check error/toast/empty-state messages across flows | All translated — no English/default-language leftovers |

---

## TC-16 — Language Selection Persists Across Navigation and Session

**Objective:** Verify `[New Language]` stays active as the user navigates and returns to the site

**Preconditions:** `[New Language]` selected

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select `[New Language]`, then navigate across several pages | Language remains `[New Language]` on every page, no reset to default |
| 2 | Refresh the browser | Language persists after refresh |
| 3 | Close and reopen the site (new session, same browser/device) | Language preference is remembered (or correctly resets to a documented default — confirm expected behavior) |

---

## TC-17 — `[New Language]` Fully Renders on Mobile App

**Objective:** Verify the mobile app equivalent flows are translated, mirroring web coverage

**Preconditions:** `[New Language]` available in the mobile app; device language or in-app selector set to `[New Language]`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Set device/app language to `[New Language]` | App launches with UI in `[New Language]` |
| 2 | Navigate through home, destinations, plans, cart, checkout, payment, order success screens | All screens fully translated, consistent with web coverage (TC-02 through TC-10) |
| 3 | Check font rendering and missing-key issues on mobile | Same checks as TC-14/TC-15, applied to native mobile UI components |

---

## TC-18 — Switching Away From `[New Language]` Reverts Cleanly

**Objective:** Verify switching from `[New Language]` back to another language (or the default) leaves no mixed-language remnants

**Preconditions:** `[New Language]` is active

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | While on a content-heavy page (e.g. checkout), switch language away from `[New Language]` | Page content updates fully to the newly selected language |
| 2 | Inspect the full page | No leftover `[New Language]` text remains anywhere on the page |

---

## TC-19 — UEFA Champions League Campaign Page Fully Renders in `[New Language]`

**Objective:** Verify the campaign landing page (banner, promo bar, plan section) is translated

**Preconditions:** `[New Language]` selected

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the UEFA Champions League page | Page loads in `[New Language]` |
| 2 | Inspect the promo banner ("Double data available on selected plans") and hero text/CTA | Translated |
| 3 | Inspect the plans section heading and descriptive copy | Translated |

---

## TC-20 — About eSIM Section Fully Renders in `[New Language]`

**Objective:** Verify the informational "What is an eSIM?" section and its numbered steps are translated

**Preconditions:** `[New Language]` selected

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the About eSIM section | Section loads in `[New Language]` |
| 2 | Inspect heading, body copy, and "Check device compatibility" link | Translated |
| 3 | Inspect the 3-step how-it-works list and "Find Plan" / "Get help & support" links | Translated |

---

## TC-21 — Help & Support Page and FAQs Fully Render in `[New Language]`

**Objective:** Verify the help hub, FAQ categories, and FAQ answers are translated

**Preconditions:** `[New Language]` selected

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Help & Support | Page loads in `[New Language]`; "How can we help you today?" heading and quick-action tiles (Installation guide, Chat with an agent, Send us a message) translated |
| 2 | Switch between FAQ category tabs (eSIM, Quick Answers, My account, Troubleshooting, About your data plan, Vodafone Travel Together Plan) | Tab labels translated |
| 3 | Expand several FAQ questions | Both question and answer text render in `[New Language]` |

---

## TC-22 — Blog Listing and Article Pages Render in `[New Language]`

**Objective:** Verify the blog hub and individual article content are translated

**Preconditions:** `[New Language]` selected

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Blog page | "Vodafone Travel Blogs" heading, intro copy, and "Latest Entries" label translated |
| 2 | Open an individual blog article | Article title, body, and any CTAs translated (or documents fallback if blog content is CMS-sourced and not yet translated) |

---

## TC-23 — Search Bar Works Correctly in `[New Language]`

**Objective:** Verify the global search icon/bar is translated and returns correct results

**Preconditions:** `[New Language]` selected

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the search bar via the header search icon | Placeholder/label text translated |
| 2 | Enter a destination name in `[New Language]` (if local-script input is expected) or in the default language | Relevant results are returned and displayed with translated labels |

---

## TC-24 — Language and Currency Selector Itself Renders and Behaves Correctly

**Objective:** Verify the header language/currency selector control is usable and consistent once `[New Language]` is active

**Preconditions:** `[New Language]` selected

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the language/currency selector (e.g. "English \| US Dollar" in header) | Selector shows `[New Language]` as the active language alongside the correct currency |
| 2 | Reopen the selector | Full list of languages/currencies is itself legible and translated where applicable (language names shown in a consistent convention) |
| 3 | Change currency without changing language | Language stays on `[New Language]`; only currency updates |

---

## TC-25 — Cart Icon and Badge Reflect `[New Language]`

**Objective:** Verify the persistent header cart icon, item-count badge, and empty-cart state are translated

**Preconditions:** `[New Language]` selected

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | With an empty cart, click the cart icon | Empty-state message is translated |
| 2 | Add an item and observe the cart badge/count | Badge updates correctly; any accompanying label text is translated |

---

## TC-26 — Footer Fully Renders in `[New Language]`

**Objective:** Verify footer branding text, app store badges, legal entity text, and link columns (Top Destinations, Legal, Help and Support) are translated

**Preconditions:** `[New Language]` selected

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Scroll to the footer on any page | Column headings (Top Destinations, Legal, Help and Support) translated |
| 2 | Inspect the legal entity disclaimer text (company registration, VAT, address) | Translated, or intentionally kept in a base language per legal requirement (confirm and document) |
| 3 | Inspect "Get it on Google Play" / "Download on the App Store" badges | Badge images use the correct localized store badge if available, or remain in default language per platform convention |

---

## TC-27 — My Account Landing Page Fully Renders in `[New Language]`

**Objective:** Verify the account hub page (greeting, section tiles, sign out) is translated

**Preconditions:** `[New Language]` selected; user is logged in

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to My Account | "Hey, [name]!" greeting renders with translated surrounding text (name itself stays as entered) |
| 2 | Inspect section tiles (eSIMs, Orders, Personal information, Notification settings) | Titles and descriptions translated |
| 3 | Inspect "Sign Out" link | Translated |

---

## TC-28 — My eSIMs Landing and Expired eSIMs Pages Render in `[New Language]`

**Objective:** Verify the active/expired eSIM listing, statuses, and toggle are translated

**Preconditions:** `[New Language]` selected; account has active and expired eSIMs

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to My eSIMs | "My eSIMs" heading, "View Expired" toggle label translated |
| 2 | Inspect eSIM cards (status badges: Not installed / Active / Expired, "See details", "Top-up", "Manage plan" buttons) | All labels translated; data values (GB, days left) remain numeric/correct |
| 3 | Toggle "View Expired" on | Expired eSIM cards show translated "Expired" status and "Purchased [date]" label |

---

## TC-29 — eSIM Details Page Renders in `[New Language]`

**Objective:** Verify individual eSIM detail/install page is translated

**Preconditions:** `[New Language]` selected; navigate to a specific eSIM's detail page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open an eSIM's details page | Breadcrumb ("my eSIMs"), plan name, status badge, and "Plan details" section labels (Data, Purchase date) translated |
| 2 | Inspect "Install your eSIM" section | "Scan QR Code" / "Enter details manually" accordion labels, instructional text translated |
| 3 | Inspect "View activation guide" and "Request a refund" buttons | Translated |

---

## TC-30 — Group Plan Manage Page Renders in `[New Language]`

**Objective:** Verify the group/shared plan management page (members, devices, invite) is translated

**Preconditions:** `[New Language]` selected; account has an active group plan

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a group plan's manage page | Plan name, status, "Your group data" section, and data bar labels translated |
| 2 | Inspect "Your group" member list and "Remove" action | Section heading and action label translated (member emails stay as-is) |
| 3 | Inspect "Devices" section and device slots | "X of Y devices used" text and "You" label translated |
| 4 | Inspect "Invite people" / "Add device" buttons and "Your eSIMs" / "This device" section | All translated |

---

## TC-31 — Orders Page Renders in `[New Language]`

**Objective:** Verify the order history table headers and status labels are translated

**Preconditions:** `[New Language]` selected; account has order history

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Orders | "Orders" heading translated |
| 2 | Inspect table column headers (Product, Date, Order #, Status, Total) | Translated |
| 3 | Inspect status values (Completed, Refunded, etc.) | Translated; order numbers, dates, and amounts remain correctly formatted |

---

## TC-32 — Personal Information Page Renders in `[New Language]`

**Objective:** Verify the account details page (name, user details, billing details) is translated

**Preconditions:** `[New Language]` selected; navigate to Personal information

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Personal information | "Your details", "User details", "Billing details" section headings translated |
| 2 | Inspect field labels (Name, Email, Mobile, Country, Address line 1/2, City, State, ZIP/Postal) | Translated; user-entered values remain unchanged |
| 3 | Click "Edit" on Billing details | Edit form labels and any validation messages translated |

---

## TC-33 — Notification Settings Page Renders in `[New Language]`

**Objective:** Verify the account settings/notification preferences page is translated

**Preconditions:** `[New Language]` selected; navigate to Notification settings

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Notification settings | "Account Settings" heading translated |
| 2 | Inspect checkbox labels and descriptions (Marketing communication, eSIM Notifications) | Translated |
| 3 | Inspect "Cancel" and "Save changes" buttons | Translated; saving/canceling behaves correctly regardless of language |

---

## Coverage Summary

| # | Test Case | Platform | Area | Reusable |
|---|-----------|----------|------|----------|
| TC-01 | Language selectable in switcher | Web | Language selector | ✓ |
| TC-02 | Homepage fully translated | Web | Homepage | ✓ |
| TC-03 | Destinations listing translated | Web | Destinations | ✓ |
| TC-04 | Region plans page translated | Web | Plans | ✓ |
| TC-05 | Cart translated | Web | Cart | ✓ |
| TC-06 | Checkout form + validation translated | Web | Checkout | ✓ |
| TC-07 | OTP/email verification translated | Web | Email Verification | ✓ |
| TC-08 | Vodafone ID login page translated | Web | Login | ✓ |
| TC-09 | Payment page + iframe chrome translated | Web | Payment | ✓ |
| TC-10 | Order success page translated | Web | Order Success | ✓ |
| TC-11 | Registration page translated | Web | Registration | ✓ |
| TC-12 | Account dropdown / sign out translated | Web | My Account | ✓ |
| TC-13 | ToS/Privacy Policy translation or documented fallback | Web | Legal | ✓ (open point) |
| TC-14 | Font/character set renders correctly | Web | Cross-cutting | ✓ (open point) |
| TC-15 | No missing translation keys / leftovers | Web | Cross-cutting | ✓ |
| TC-16 | Language persists across navigation/session | Web | Cross-cutting | ✓ |
| TC-17 | Full flow coverage on mobile app | Mobile | Cross-cutting | ✓ |
| TC-18 | Clean revert when switching away | Web | Cross-cutting | ✓ |
| TC-19 | UEFA Champions League campaign page translated | Web | Campaign | ✓ |
| TC-20 | About eSIM section translated | Web | About eSIM | ✓ |
| TC-21 | Help & Support page + FAQs translated | Web | Help & Support | ✓ |
| TC-22 | Blog listing + article pages translated | Web | Blog | ✓ |
| TC-23 | Search bar translated and functional | Web | Search | ✓ |
| TC-24 | Language/currency selector itself renders correctly | Web | Language Selector | ✓ |
| TC-25 | Cart icon/badge/empty state translated | Web | Cart | ✓ |
| TC-26 | Footer fully translated | Web | Footer | ✓ |
| TC-27 | My Account landing page translated | Web | My Account | ✓ |
| TC-28 | My eSIMs + Expired eSIMs pages translated | Web | eSIM Management | ✓ |
| TC-29 | eSIM details/install page translated | Web | eSIM Management | ✓ |
| TC-30 | Group plan manage page translated | Web | Group Plan | ✓ |
| TC-31 | Orders page translated | Web | Orders | ✓ |
| TC-32 | Personal information page translated | Web | Account | ✓ |
| TC-33 | Notification settings page translated | Web | Account | ✓ |

**Total: 33 test cases**, all written generically against `[New Language]` for reuse on every future language rollout beyond Chinese.

**Open items to confirm before execution (flagged on the ticket itself):**
- TC-14: whether the current font set supports the target script (e.g. CJK) or a new font needs to be bundled.
- TC-13: whether Terms of Service / Privacy Policy are in scope for translation, or intentionally remain in a base language.
