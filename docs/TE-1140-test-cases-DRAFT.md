# TE-1140 — New TopupAPI for Product Stacking — Test Cases (DRAFT)

> **Scope**: All platforms (web, iOS, Android). API behavior tested via UI flows; no standalone API test cases. One-time testing for feature launch (June 17th pre-production release).
>
> **Key changes**: SIM provisioned after release uses TopupAPI V2 for all top-up operations. Legacy SIMs (V1) continue to work. Roaming control / bundle config changes trigger migration to V2.
>
> **Ticket**: https://cps.jira.agile.vodafone.com/browse/TE-1140

---

## Context: Feature Overview

- **SIM Activation Behaviour**: Newly provisioned SIMs activate immediately on network latching (including home country).
- **Top-Up API Strategy** (90-day interim):
  - **Limited plans** → route to new **Direct Top-Up API** (KORE).
  - **Unlimited plans** → continue on existing (old) **Top-Up API** (old endpoint, unchanged for 90 days).
  - **Product changes** (Limited ↔ Unlimited) → unaffected; not a top-up endpoint.
- **Legacy SIM Support**: SIMs provisioned before release continue to use the appropriate API based on plan type.
- **Migration Trigger**: Changing roaming control or bundle config via "Change thing roaming control and bundle" API may trigger API routing updates.
- **Roaming Control Update**: Bundles only activate once the subscriber latches onto a network in the destination country/region.

---

## A. SIM Activation Behavior — Immediate Activation on Network Latching

### A1 — Newly provisioned SIM activates immediately on home network latch (positive)
**Steps:**
1. Purchase a new eSIM post-release.
2. Install and activate it on a device.
3. Connect to a network in the subscriber's home country while the destination is home country.

**Expected:** eSIM status immediately changes to **Active** without waiting for arrival in a destination country. Data is usable immediately on the home network.

### A2 — Newly provisioned SIM activates immediately on destination network latch (positive)
**Steps:**
1. Purchase a new eSIM post-release for a destination country (e.g., France).
2. Install and activate on a device.
3. Connect to a network in France.

**Expected:** eSIM status immediately changes to **Active** upon connecting to any network in France. No additional activation step required.

### A3 — Pre-release legacy SIM activation behavior unchanged (positive)
**Steps:**
1. Retrieve a legacy eSIM (provisioned before June 17th).
2. Install and attempt to activate.

**Expected:** eSIM activation behavior matches the old pattern (bundles activate only once subscriber latches onto destination country network); no immediate activation behavior.

### A4 — Activation timing persists across app sessions (positive)
**Steps:**
1. Activate a newly provisioned eSIM on home/destination network.
2. Close and reopen the app.

**Expected:** eSIM status remains **Active** and data remains usable after app restart.

### A5 — Multiple SIMs installed, each respects its own provisioning date (positive)
**Steps:**
1. Install a legacy pre-release SIM and a new post-release SIM.
2. Connect to a destination network (e.g., Spain).

**Expected:** New post-release SIM activates immediately; legacy SIM follows old behavior (bundles activate on latch). Both can coexist without conflict.

---

## B. Top-Up API Routing — Limited vs. Unlimited Plans

### B1 — Limited plan top-up via new Direct Top-Up API (positive)
**Steps:**
1. Navigate to an **Active** eSIM with a **limited plan** (e.g., 5GB/7 days, newly provisioned post-release).
2. Open the top-up options panel.
3. Select a top-up package (e.g., 5GB/7 days).
4. Click **Continue** and complete payment.

**Expected:** Top-up is routed to the new **Direct Top-Up API** (KORE). Top-up is applied successfully. Usage meter and days-remaining update on the details page. No API errors.

### B2 — Unlimited plan top-up via existing Top-Up API (positive)
**Steps:**
1. Navigate to an **Active** eSIM with an **unlimited plan** (newly provisioned post-release).
2. Open the top-up options panel.
3. Select a top-up package.
4. Click **Continue** and complete payment.

**Expected:** Top-up is routed to the existing (old) **Top-Up API**. Top-up is applied successfully. No "unsupported" error for unlimited plans.

### B3 — Legacy SIM: Limited plan top-up via Direct Top-Up API (positive)
**Steps:**
1. Open a legacy pre-release eSIM with a **limited plan**.
2. Select and purchase a top-up.

**Expected:** Top-up completes successfully via the new **Direct Top-Up API**. No "unsupported version" error.

### B4 — Legacy SIM: Unlimited plan top-up via existing Top-Up API (positive)
**Steps:**
1. Open a legacy pre-release eSIM with an **unlimited plan**.
2. Select and purchase a top-up.

**Expected:** Top-up completes successfully via the existing (old) **Top-Up API**. No errors.

### B5 — Multiple top-ups stack correctly (limited plan) (positive)
**Steps:**
1. On a limited plan eSIM, purchase a 4GB top-up.
2. Wait for it to apply.
3. Purchase another 2GB top-up.

**Expected:** "Your top-up(s)" section shows both applied top-ups (4GB + 2GB). Data allowance and expiry reflect the combined stack.

### B6 — Multiple top-ups stack correctly (unlimited plan) (positive)
**Steps:**
1. On an unlimited plan eSIM, purchase top-ups multiple times.
2. Verify each top-up applies.

**Expected:** All top-ups stack correctly. No limit on stacking for unlimited plans.

### B7 — Top-up pricing and discounts render correctly (positive)
**Steps:**
1. View the top-up options panel on both limited and unlimited eSIMs.

**Expected:** All four options display:
- 5GB/7 Days: $12
- 10GB/15 Days: ~~$25~~ $20 (discount shown)
- 20GB/30 Days: $30
- 50GB/30 Days: $50
No truncation or formatting errors on either plan type.

### B8 — First top-up option preselected by default (positive)
**Steps:**
1. Open the top-up options panel on an active eSIM without interacting.

**Expected:** "5GB/7 Days" radio button is selected. **Continue** button is enabled.

### B9 — Can re-select top-up option (positive)
**Steps:**
1. Default option is "5GB/7 Days".
2. Click on "20GB/30 Days".

**Expected:** Radio selection updates to the new option. **Continue** remains enabled.

### B10 — Top-up purchase failure shows error and allows retry (limited plan) (negative)
**Steps:**
1. On a limited plan eSIM, initiate a top-up purchase.
2. Force the payment to fail (network error / payment gateway rejection / Direct Top-Up API error).

**Expected:** Clear error message is shown ("Payment failed. Please try again."). eSIM details page remains unchanged. User can retry the top-up.

### B11 — Top-up purchase failure shows error and allows retry (unlimited plan) (negative)
**Steps:**
1. On an unlimited plan eSIM, initiate a top-up purchase.
2. Force the payment to fail.

**Expected:** Clear error message is shown. eSIM details page remains unchanged. User can retry.

---

## C. 90-Day Interim Period — Dual Endpoint Strategy

### C1 — Both old and new Top-Up API endpoints are available during interim (positive)
**Steps:**
1. During the 90-day window, verify that both API endpoints are live:
   - Old endpoint: serving unlimited plans and legacy traffic
   - New endpoint: serving limited plans and new Direct Top-Up API calls.

**Expected:** No downtime. Both endpoints are reachable and functional.

### C2 — Limited plan routes to new Direct Top-Up API, unlimited to old (positive)
**Steps:**
1. Purchase a limited plan top-up and inspect the API call.
2. Purchase an unlimited plan top-up and inspect the API call.

**Expected:** Limited plan top-ups are routed to the new Direct Top-Up API (KORE). Unlimited plan top-ups hit the old endpoint. No routing errors or mismatches.

### C3 — No service interruption after 90-day window expires (positive)
**Steps:**
1. After the 90-day interim period, verify that:
   - New Direct Top-Up API continues to serve limited plans.
   - Old endpoint is decommissioned (no more traffic).

**Expected:** Unlimited plan top-ups transition to a permanent solution (either migrated to new API or kept on a legacy endpoint). No customer impact.

### C4 — Switching from limited to unlimited plan uses correct endpoint (edge)
**Steps:**
1. Have a limited plan eSIM (using new Direct Top-Up API).
2. Perform a product change to unlimited.
3. Attempt a top-up on the now-unlimited eSIM.

**Expected:** Top-up is routed to the old/correct endpoint for unlimited plans. No "unsupported" error.

### C5 — Switching from unlimited to limited plan uses correct endpoint (edge)
**Steps:**
1. Have an unlimited plan eSIM (using old Top-Up API).
2. Perform a product change to limited.
3. Attempt a top-up on the now-limited eSIM.

**Expected:** Top-up is routed to the new Direct Top-Up API. No errors.

---

## D. TopUp API Error Handling — Unsupported Scenarios

### D1 — Direct Top-Up API does not support unlimited plans (negative)
**Steps:**
1. If a misconfiguration or bug routes an unlimited plan to the new Direct Top-Up API, verify error handling.

**Expected:** API returns a clear error: *"This version of top up API is not supported for this thing."* User sees a friendly error message and is prompted to try again or contact support.

### D2 — Clear messaging when Direct Top-Up API is unavailable (edge)
**Steps:**
1. If any UI path explicitly mentions API versions, verify the messaging.

**Expected:** No user-facing reference to "Direct Top-Up API" or "old Top-Up API" unless the user explicitly enabled developer mode. Standard users see only "Top-up" or "Add data".

### D3 — Product change flows are unaffected by API migration (positive)
**Steps:**
1. Perform a product change (Limited → Unlimited or vice versa).
2. Verify no top-up endpoint is called during the product change.

**Expected:** Product change completes successfully. Top-up endpoint is not involved. User can top-up after the product change using the correct endpoint.

---

## E. Migration Trigger — Roaming Control and Bundle Configuration Changes

### E1 — Changing roaming control triggers API routing update (positive)
**Steps:**
1. Retrieve a legacy SIM with a limited plan.
2. Initiate the "Change thing roaming control and bundle" flow (if exposed in UI).
3. Modify the roaming control setting and save.

**Expected:** Behind the scenes, the subscription's top-up routing is verified. Subsequent top-ups continue to use the correct API (Direct Top-Up API for limited plans).

### E2 — Changing bundle configuration triggers API routing update (positive)
**Steps:**
1. Retrieve a legacy SIM.
2. Modify the bundle configuration.

**Expected:** Subscription's top-up routing is verified/updated. Top-ups use the correct endpoint for the new plan type.

### E3 — Product change (Limited → Unlimited) updates API routing (positive)
**Steps:**
1. Have a limited plan eSIM currently using the new Direct Top-Up API.
2. Perform a product change to unlimited.
3. Attempt a top-up.

**Expected:** Top-up is now routed to the old endpoint (for unlimited plans). No errors.

### E4 — Product change (Unlimited → Limited) updates API routing (positive)
**Steps:**
1. Have an unlimited plan eSIM currently using the old Top-Up API.
2. Perform a product change to limited.
3. Attempt a top-up.

**Expected:** Top-up is now routed to the new Direct Top-Up API. No errors.

### E5 — Routing changes do not affect active plans or usage (positive)
**Steps:**
1. Have an active SIM with a running plan and partial data usage.
2. Trigger a roaming control change or product change that updates API routing.

**Expected:** Active plan, data usage, and days remaining are unaffected. No data loss or reset.

---

## F. Roaming Control — Bundles Activate Only on Destination Network Latch

### F1 — Bundle activates only on destination country network latch (positive)
**Steps:**
1. Purchase an eSIM for a destination country (e.g., USA).
2. Keep the device offline (no network connection).
3. Navigate to the eSIM details page.

**Expected:** eSIM status is **Not installed** or **Installed** (not **Active**). Bundle data is not usable.

### F2 — Bundle activates immediately on first network latch in destination (positive)
**Steps:**
1. Install the USA eSIM from F1.
2. Connect to a network in the USA.

**Expected:** eSIM status changes to **Active** immediately. Bundle data becomes usable.

### F3 — Roaming to non-destination country does not activate bundle (negative)
**Steps:**
1. Activate a French eSIM.
2. Instead of latching onto a French network, latch onto a USA network.

**Expected:** eSIM status remains **Not installed** / **Installed** or shows no active data. Bundle is not activated in the non-destination country (aligns with roaming control rules).

### F4 — Multiple bundles respect their own roaming control settings (positive)
**Steps:**
1. Have two eSIMs: one for Europe, one for Asia.
2. Connect to a network in Europe.

**Expected:** Only the Europe eSIM activates. Asia eSIM remains inactive until its roaming control condition is met (user latches onto an Asia network).

---

## G. CDR Feed Updates

### G1 — CDR feed reflects correct API version for newly provisioned SIMs (positive)
**Steps:**
1. Provision a new SIM and make a top-up purchase.
2. Retrieve the CDR (Call Detail Record) feed for that subscription.

**Expected:** CDR contains the updated format (new fields or structure per the spec). No parsing errors downstream.

### G2 — CDR feed format remains consistent across API versions (positive)
**Steps:**
1. Retrieve SIMs using different APIs:
   - Limited plan (new Direct Top-Up API)
   - Unlimited plan (old Top-Up API)
2. Check the CDR feed format for each.

**Expected:** CDR format is consistent across both API versions. Downstream systems correctly parse and process feeds from both.

### G3 — CDR feed includes all top-up stacking transactions (positive)
**Steps:**
1. Apply multiple top-ups to an eSIM.
2. Retrieve the CDR feed.

**Expected:** Each top-up transaction is logged separately. Billing, reporting, and integration processes can correctly identify each top-up.

---

## H. Error Handling and Edge Cases

### H1 — No top-up options available (negative)
**Steps:**
1. Open an active eSIM that has no top-up options (e.g., all options are sold out or unavailable in the region).

**Expected:** An empty state or disabled state is shown ("No top-up options available in your region."). No broken UI or empty radio list.

### H2 — Network latency during top-up purchase (negative)
**Steps:**
1. Initiate a top-up purchase.
2. Simulate network latency or slow response from the backend.

**Expected:** A loading spinner or progress indicator is shown. No timeout or premature error message.

### H3 — User cancels top-up mid-payment (negative)
**Steps:**
1. Select a top-up and click **Continue**.
2. On the payment page, close the modal or click **Back**.

**Expected:** Top-up is cancelled. eSIM details page is restored without applying the top-up. No partial charge.

### H4 — Invalid eSIM ID in URL (negative)
**Steps:**
1. Attempt to view the details of a non-existent or deleted eSIM.

**Expected:** 404 or "Not found" message. No crash or data leak.

### H5 — Unauthorized access to another user's eSIM (negative)
**Steps:**
1. While logged in as User A, attempt to access User B's eSIM details page (via direct URL or API call).

**Expected:** 403 Forbidden or redirect to login. No eSIM data from User B is exposed.

---

## I. Cross-Platform Testing — Web, iOS, Android

### I1 — Web: Limited plan top-up via Direct Top-Up API (positive)
**Steps:**
1. On web (vrs.preprod.travel.vodafone.com), navigate to an active limited plan eSIM.
2. Select and purchase a top-up.

**Expected:** Top-up completes successfully via the new Direct Top-Up API. Usage is updated on the details page.

### I2 — Web: Unlimited plan top-up via old Top-Up API (positive)
**Steps:**
1. On web, navigate to an active unlimited plan eSIM.
2. Select and purchase a top-up.

**Expected:** Top-up completes successfully via the old Top-Up API. Usage is updated.

### I3 — iOS: Limited plan top-up via Direct Top-Up API (positive)
**Steps:**
1. On iOS app, navigate to an active limited plan eSIM.
2. Select and purchase a top-up.

**Expected:** Top-up completes successfully via the new Direct Top-Up API. Usage is updated on the details page.

### I4 — iOS: Unlimited plan top-up via old Top-Up API (positive)
**Steps:**
1. On iOS app, navigate to an active unlimited plan eSIM.
2. Select and purchase a top-up.

**Expected:** Top-up completes successfully via the old Top-Up API. Usage is updated.

### I5 — Android: Limited plan top-up via Direct Top-Up API (positive)
**Steps:**
1. On Android app, navigate to an active limited plan eSIM.
2. Select and purchase a top-up.

**Expected:** Top-up completes successfully via the new Direct Top-Up API. Usage is updated.

### I6 — Android: Unlimited plan top-up via old Top-Up API (positive)
**Steps:**
1. On Android app, navigate to an active unlimited plan eSIM.
2. Select and purchase a top-up.

**Expected:** Top-up completes successfully via the old Top-Up API. Usage is updated.

### I7 — Web + iOS sync: Top-up on web, verify on iOS (positive)
**Steps:**
1. Purchase a top-up on web (limited or unlimited plan).
2. Refresh the iOS app (or wait for sync).

**Expected:** iOS app displays the newly applied top-up without manual refresh (or after a short refresh cycle).

### I8 — Cross-platform: Top-up on one platform, use on another (positive)
**Steps:**
1. Purchase a top-up on one platform (e.g., web).
2. Switch to another platform (e.g., iOS) and verify the eSIM shows the updated data allowance.

**Expected:** Top-up is reflected across all platforms. No discrepancy in usage reporting.

---

## J. Regression Testing — Ensure No Breakage to Existing Flows

### J1 — Guest checkout for new SIM (positive)
**Steps:**
1. Perform a guest checkout for a new eSIM (post-release).
2. Complete the flow: cart → checkout → payment → success.

**Expected:** All steps complete. SIM is provisioned and ready to activate.

### J2 — Logged-in checkout for new SIM (positive)
**Steps:**
1. Log in and purchase a new eSIM.
2. Complete cart → checkout → payment → success.

**Expected:** All steps complete. SIM is provisioned and associated with the user's account.

### J3 — Navigate to My eSIMs and view newly purchased SIM (positive)
**Steps:**
1. Purchase a new eSIM (post-release).
2. Navigate to My eSIMs.

**Expected:** Newly purchased SIM appears in the list with status **Not installed**. No stale data or missing entries.

### J4 — View details of legacy pre-release SIM (positive)
**Steps:**
1. Open the My eSIMs list.
2. Click on a legacy pre-release SIM.

**Expected:** Details page loads. All plan info, top-up options, and actions (Refund, Install, etc.) are present and functional.

### J5 — Refund flow for not-installed SIM (positive)
**Steps:**
1. Open a not-installed eSIM (within 14 days of purchase).
2. Click **Refund**.

**Expected:** Refund confirmation is shown. Refund is processed. SIM is removed from My eSIMs list.

### J6 — Search/filter My eSIMs list still works (positive)
**Steps:**
1. Navigate to My eSIMs.
2. Use search or filter to find a specific eSIM by region or country.

**Expected:** Search/filter results are accurate. Both new and legacy SIMs are found.

---

## K. API Response Validation (if applicable)

### K1 — Direct Top-Up API response schema is correct (positive)
**Steps:**
1. Trigger a top-up purchase on a limited plan eSIM.
2. Inspect the API response (via DevTools or interceptor).

**Expected:** Response includes all required fields (transaction ID, status, data allowance, expiry, etc.). No extra/unexpected fields that break downstream parsing.

### K2 — Old Top-Up API continues to work correctly for unlimited plans (positive)
**Steps:**
1. Trigger a top-up purchase on an unlimited plan eSIM.
2. Inspect the API response.

**Expected:** API responds correctly with all required fields. No unexpected errors or format changes.

### K3 — CDR feed format is consistent across API versions (positive)
**Steps:**
1. Retrieve CDR feed for both new and legacy SIMs.
2. Verify downstream systems (billing, reporting) can parse both formats.

**Expected:** No parsing errors. Legacy systems continue to work with the new CDR format (or new fields are optional).

---

## L. Performance Testing (optional, based on scope)

### L1 — Top-up purchase latency on limited plan (Direct Top-Up API) (positive)
**Steps:**
1. Measure the time from clicking **Continue** to receiving payment success response for a limited plan.

**Expected:** Response time is < 5 seconds under normal network conditions.

### L2 — Top-up purchase latency on unlimited plan (old Top-Up API) (positive)
**Steps:**
1. Measure the time from clicking **Continue** to receiving payment success response for an unlimited plan.

**Expected:** Response time is < 5 seconds under normal network conditions. No performance degradation from using the old endpoint.

### L3 — Details page load time with multiple applied top-ups (positive)
**Steps:**
1. Open an eSIM with 5+ applied top-ups.
2. Measure page load time.

**Expected:** Page loads within 2 seconds. No performance degradation as top-up count increases.

---

## M. Rollback / Contingency Testing (if applicable)

### M1 — Rollback to old endpoint: existing top-ups remain functional (positive)
**Steps:**
1. Apply a top-up using the new Direct Top-Up API (limited plan).
2. If a rollback is triggered and limited plans are reverted to the old endpoint, verify the eSIM still functions.

**Expected:** Top-up remains active and usable. No data loss or service interruption.

### M2 — Direct Top-Up API becomes unavailable: graceful error handling (negative)
**Steps:**
1. If the new Direct Top-Up API becomes unavailable, attempt a top-up on a limited plan.

**Expected:** User sees a clear error: "Service temporarily unavailable. Please try again later." Fallback mechanism (if any) is transparent to the user. No silent failure or orphaned transaction.

---

## Summary of Coverage

| Category | Count | Scenarios |
|---|---|---|
| **Activation Behavior** | 5 | Immediate activation, home/destination, legacy behavior, persistence, multi-SIM |
| **Top-Up API Routing (Limited vs. Unlimited)** | 11 | Limited plan via Direct API, unlimited via old API, legacy support, stacking, pricing, error handling |
| **90-Day Interim Period** | 5 | Dual endpoint availability, routing verification, 90-day transition, plan changes, endpoint correctness |
| **TopUp API Error Handling** | 3 | Unsupported unlimited on new API, error messaging, product change unaffected |
| **API Routing on Plan Changes** | 5 | Roaming control changes, bundle config changes, Limited→Unlimited, Unlimited→Limited, plan preservation |
| **Roaming Control** | 4 | Bundle activation timing, destination latch, non-destination, multi-bundle |
| **CDR Updates** | 3 | Format consistency across APIs, legacy SIM updates, transaction logging |
| **Error Handling** | 5 | No options, network latency, mid-payment cancel, invalid ID, unauthorized access |
| **Cross-Platform** | 8 | Web/iOS/Android limited/unlimited top-ups; cross-platform sync |
| **Regression Testing** | 6 | Guest/logged-in checkout, My eSIMs view, refund, search, details |
| **API Response Validation** | 3 | Direct API schema, old API correctness, CDR consistency |
| **Performance** | 3 | Limited plan latency, unlimited plan latency, page load with stacked top-ups |
| **Rollback / Contingency** | 2 | Existing top-ups survive rollback, graceful error handling |
| **Total** | **63** | |

---

## Notes for QA / Zephyr

- **Test data**: Use pre-provisioned SIMs (both new post-June-17th and legacy pre-release) to validate scenarios A–E.
- **Test environments**: Run all scenarios on `vrs.preprod.travel.vodafone.com`.
- **OTP in preprod**: Use magic OTP `000000` for email verification.
- **Manual testing priority**: A1–A3, B1–B3, C1–C2 (core feature paths). Automate regression tests (I1–I6) via Playwright.
- **Automation gaps**: Cross-platform sync (H4–H5) may require manual or device-level testing.
