# Test Cases — TE-1484
## Technical POC: World Cup Campaign – Champions Travel eSIM Web Updates

**Ticket:** TE-1484 | **Parent:** TE-1482
**Type:** Story | **Priority:** Critical | **Status:** Ready for QA
**Labels:** Consumer, PI_BACKLOG
**Scope:** Web only · Guest + Logged-in · Multiple locales · Contentful-driven (no BE)
**SEO section:** ⚠️ Pending confirmation — included below, confirm before posting to Zephyr

---

## TC-01 — Campaign Page Loads Successfully

**Objective:** Verify the Champions/World Cup campaign page renders without errors

**Preconditions:** Campaign page is published in Contentful

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Champions/UEFA campaign page URL | Page loads with HTTP 200, no console errors |
| 2 | Observe the full page | World Cup / Champions-themed hero banner is visible |
| 3 | Scroll through the page | No broken layouts, missing images, or placeholder text |

---

## TC-02 — Campaign Hero Banner Displays Correctly (Contentful)

**Objective:** Verify hero banner content is driven by Contentful and renders correctly

**Preconditions:** Hero banner fields (image, title, subtitle, CTA text) are configured in Contentful

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the campaign page | Hero banner is visible at the top of the page |
| 2 | Observe the hero image | Champions/World Cup themed image loads fully, no broken image icon |
| 3 | Observe the hero title and subtitle | Text matches values configured in Contentful |
| 4 | Observe the CTA button on the banner | Button text matches Contentful config and is clickable |
| 5 | Click the hero CTA | User is scrolled to the plans section or navigated to the correct destination |

---

## TC-03 — World Cup eSIM Bundles Are Displayed on the Campaign Page

**Objective:** Verify that the new World Cup bundle IDs added via Contentful appear as plan cards

**Preconditions:** New bundle IDs are added to the UEFA/campaign page entry in Contentful and published

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the campaign page | Plans section is visible |
| 2 | Count the plan cards displayed | All bundle IDs configured in Contentful appear as plan cards |
| 3 | Verify no old/unrelated plans appear | Only the World Cup campaign bundles are shown in this section |
| 4 | Verify no "null" or empty plan cards appear | Every card shows real data — no placeholder or broken entries |

---

## TC-04 — Plan Card Details Are Correct

**Objective:** Verify each World Cup bundle card displays accurate information from Contentful

**Preconditions:** Bundle IDs are configured in Contentful with data allowance, validity, and price

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the campaign page | Plan cards are visible |
| 2 | For each plan card, check the plan name | Name matches what is configured in Contentful / backend catalog |
| 3 | Check the data allowance (e.g. 5 GB, 10 GB) | Correct data amount is displayed |
| 4 | Check the validity period (e.g. 7 days, 30 days) | Correct validity is displayed |
| 5 | Check the price | Correct price and currency are displayed |
| 6 | Check the coverage / destination label | Correct region or country is shown on the card |

---

## TC-05 — "Add to Cart" / "Buy Now" CTA Works for Campaign Plans (Guest)

**Objective:** Verify a guest user can add a World Cup campaign plan to cart and proceed

**Preconditions:** At least one bundle is visible on the campaign page; user is not logged in

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the campaign page as a guest | Plans are visible |
| 2 | Click "Add to cart" on any campaign plan | Plan is added to the cart; cart icon updates or cart modal appears |
| 3 | Click "Go to checkout" / proceed from cart | User is navigated to the Checkout page |
| 4 | Observe the checkout page | The correct campaign plan is shown in the order summary |

---

## TC-06 — "Add to Cart" / "Buy Now" CTA Works for Campaign Plans (Logged-In)

**Objective:** Verify a logged-in user can add a World Cup campaign plan to cart and proceed

**Preconditions:** User is authenticated via Vodafone ID; campaign page is accessible

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in via Vodafone ID and navigate to the campaign page | User is authenticated; plans are visible |
| 2 | Click "Add to cart" on any campaign plan | Plan is added to cart |
| 3 | Proceed to checkout | Checkout page shows the campaign plan in the order summary |
| 4 | Verify saved card is available | Payment page shows saved Visa card for logged-in user |

---

## TC-07 — Full Purchase Flow for a World Cup Campaign Plan (Guest)

**Objective:** Verify end-to-end guest checkout for a World Cup campaign bundle

**Preconditions:** New user data available; OTP magic pin is 000000 in preprod

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to campaign page and add a plan to cart | Cart shows campaign plan |
| 2 | Proceed to checkout and fill in personal info (new email) | Personal info form accepts input |
| 3 | Enter OTP "000000" on email verification screen | OTP accepted; proceed to payment |
| 4 | Fill in card details on payment page | Card fields accept input |
| 5 | Submit payment | Order Successful page loads |
| 6 | Verify order confirmation | "Thank you for your order!" message shown; eSIM delivery notice visible |
| 7 | Verify "Create Password" prompt is shown | Guest is offered to create an account |

---

## TC-08 — Full Purchase Flow for a World Cup Campaign Plan (Logged-In)

**Objective:** Verify end-to-end logged-in checkout for a World Cup campaign bundle

**Preconditions:** Test account with saved card exists

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Log in and navigate to campaign page; add a plan to cart | Cart shows campaign plan |
| 2 | Proceed to checkout | Checkout page pre-fills user details |
| 3 | Proceed to payment | Payment page shows saved card |
| 4 | Select saved card and submit payment | Order Successful page loads |
| 5 | Verify order confirmation | "Thank you for your order!" shown; no "Create Password" prompt |

---

## TC-09 — Campaign Page Content Updates Reflect Without Redeployment (Contentful)

**Objective:** Verify that publishing a Contentful change is sufficient to update the campaign page (no BE deployment needed — per POC scope)

**Preconditions:** Access to Contentful; campaign page is live

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Note the current hero title text on the campaign page | Title text recorded |
| 2 | Update the hero title in Contentful and publish | Change is saved in Contentful |
| 3 | Hard-refresh the campaign page in the browser | Updated title text appears without any deployment |
| 4 | Revert the title in Contentful | Page reflects the revert after refresh |

---

## TC-10 — Adding a New Bundle ID via Contentful Adds a New Plan Card

**Objective:** Verify that adding a new bundle ID to the Contentful entry causes a new plan card to appear

**Preconditions:** Contentful access; at least one new valid bundle ID available

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Note the current number of plan cards on the campaign page | Count recorded |
| 2 | Add a new bundle ID to the page entry in Contentful and publish | Change published |
| 3 | Hard-refresh the campaign page | A new plan card appears with correct plan details |
| 4 | Remove the bundle ID from Contentful and publish | Plan card disappears from the page after refresh |

---

## TC-11 — Removing a Bundle ID via Contentful Removes the Plan Card

**Objective:** Verify removing a bundle ID from Contentful hides the plan immediately

**Preconditions:** At least 2 bundle IDs configured on the campaign page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Note all plan cards visible on the campaign page | Count and names recorded |
| 2 | Remove one bundle ID from Contentful entry and publish | Change saved |
| 3 | Hard-refresh the campaign page | Removed plan card is no longer visible |
| 4 | Remaining plans are unaffected | Other plan cards still display correctly |

---

## TC-12 — Multi-Locale: Campaign Page Displays Correctly in All Configured Locales

**Objective:** Verify World Cup campaign content renders correctly in each active Contentful locale

**Preconditions:** Campaign page entry has content defined for multiple locales in Contentful

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the campaign page in the default locale (EN) | Page renders correctly with English content |
| 2 | Switch to each additional configured locale | Page reloads in the target locale |
| 3 | Verify hero banner text is translated | Title, subtitle, and CTA text match the Contentful locale values |
| 4 | Verify plan card labels are translated | Data labels, CTA text, and any promotional text appear in the correct language |
| 5 | Verify no locale fallback is used unexpectedly | No English text bleeds through in non-English locales (unless fallback is intended) |

---

## TC-13 — Multi-Locale: Plan Price and Currency Displayed Correctly per Locale

**Objective:** Verify pricing adapts to locale/currency configuration

**Preconditions:** Multiple locales with different currencies configured

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | View the campaign page in default locale | Price displayed in default currency (e.g. EUR) |
| 2 | Switch to another configured locale | Price displayed in the locale's currency |
| 3 | Currency symbol and format are correct | e.g. £ for GBP, $ for USD — no raw ISO code shown without symbol |

---

## TC-14 — Campaign Page is Accessible to Both Guest and Logged-In Users

**Objective:** Verify no authentication gate blocks access to the campaign page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the campaign page URL in a private/incognito window | Page loads fully without login prompt |
| 2 | Log in as an existing user and navigate to the same URL | Page loads with same content; login state does not alter campaign page content |
| 3 | Compare plan cards between guest and logged-in views | Same plans are visible to both user types |

---

## TC-15 — Campaign Page Responsiveness (Web — Desktop & Mobile Browser)

**Objective:** Verify the campaign page layout adapts correctly across screen widths

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the campaign page on a desktop browser (1280px+) | Full-width hero, plan cards in a grid layout |
| 2 | Resize browser to tablet width (~768px) | Layout reflows; no horizontal scrollbar; content readable |
| 3 | Open in a mobile browser or DevTools mobile emulation (375px) | Single-column layout; hero image cropped appropriately; CTA buttons full-width |
| 4 | Verify plan cards at mobile width | Cards stack vertically; all text and CTAs remain accessible |

---

## TC-16 — Invalid / Inactive Bundle ID Shows No Broken Card

**Objective:** Verify that an invalid or expired bundle ID in Contentful does not result in a broken/empty plan card

**Preconditions:** Ability to add a test bundle ID that does not exist in the product catalog

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Add an invalid/non-existent bundle ID to the Contentful entry and publish | Change saved |
| 2 | Hard-refresh the campaign page | No broken/empty plan card appears for the invalid ID (either gracefully hidden or shows an error state — not a blank card) |
| 3 | Remove the invalid ID from Contentful | Page returns to normal after refresh |

---

## ⚠️ SEO — PENDING CONFIRMATION (include or exclude before posting to Zephyr)

## TC-17 — SEO: Page Title and Meta Description

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to campaign page; view page source or DevTools | `<title>` tag contains campaign-relevant text (e.g. "Champions Travel eSIM" or "World Cup") |
| 2 | Check `<meta name="description">` | Description is populated and relevant to the campaign |

## TC-18 — SEO: Open Graph Tags for Social Sharing

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | View page source | `og:title`, `og:description`, `og:image` are all present and populated |
| 2 | Check `og:image` URL | Campaign hero image URL is correct and accessible |

## TC-19 — SEO: Canonical URL

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | View page source | `<link rel="canonical">` points to the correct campaign page URL |
| 2 | Verify no duplicate canonical across locales | Each locale has its own correct canonical |

---

## Coverage Summary

| # | Test Case | Platform | User State | Contentful | Locale |
|---|-----------|----------|------------|------------|--------|
| TC-01 | Page loads successfully | Web | Guest | ✓ | EN |
| TC-02 | Hero banner displays correctly | Web | Guest | ✓ | EN |
| TC-03 | World Cup bundles appear | Web | Guest | ✓ | EN |
| TC-04 | Plan card details correct | Web | Guest | ✓ | EN |
| TC-05 | Add to cart — Guest | Web | Guest | ✓ | EN |
| TC-06 | Add to cart — Logged-in | Web | Logged-in | ✓ | EN |
| TC-07 | Full checkout — Guest | Web | Guest | ✓ | EN |
| TC-08 | Full checkout — Logged-in | Web | Logged-in | ✓ | EN |
| TC-09 | Contentful change reflects live | Web | Guest | ✓ | EN |
| TC-10 | Add bundle ID → card appears | Web | Guest | ✓ | EN |
| TC-11 | Remove bundle ID → card gone | Web | Guest | ✓ | EN |
| TC-12 | Multi-locale content | Web | Guest | ✓ | Multi |
| TC-13 | Multi-locale pricing/currency | Web | Guest | ✓ | Multi |
| TC-14 | Page accessible to all users | Web | Both | ✓ | EN |
| TC-15 | Responsiveness (web) | Web | Guest | ✓ | EN |
| TC-16 | Invalid bundle ID handling | Web | Guest | ✓ | EN |
| TC-17 ⚠️ | SEO: Title & meta | Web | Guest | ✓ | EN |
| TC-18 ⚠️ | SEO: OG tags | Web | Guest | ✓ | EN |
| TC-19 ⚠️ | SEO: Canonical URL | Web | Guest | ✓ | Multi |

**Total: 16 confirmed + 3 pending SEO confirmation**
