# Test Cases — TE-1639
## Exclude USD Currency for Chinese Customers

**Ticket:** TE-1639 | **Epic:** Unlock China
**Type:** Feature | **Priority:** Critical | **Status:** Ready For Development
**Labels:** Consumer, PI_BACKLOG
**Scope:** Web + Mobile · Config-driven country→currency mapping · No SEO

**Design note:** Test cases are written generically against the country-currency
**configuration mechanism**, not hardcoded to China. Each case uses placeholders —
`[Configured Country]` (a country present in the mapping table, e.g. China),
`[Unconfigured Country]` (a country with no mapping entry), `[Default Currency]`,
`[Configured Currency List]`, `[Excluded Currency]` — so the same suite can be
re-run for any future market by swapping the parameter values. Where an example
is needed for illustration, China / CNY / USD is used, per the current ticket scope.

---

## TC-01 — Configured Country Uses Its Mapped Default Currency (Web)

**Objective:** Verify that when a customer's country matches a configured entry, the web app uses that entry's default currency instead of standard browser/site default logic

**Preconditions:** A country-currency mapping entry exists for `[Configured Country]` with default currency `[Default Currency]` (e.g. China → CNY)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Access the web app with CDN country code set to `[Configured Country]` | Site loads |
| 2 | Observe the default displayed/selected currency | Currency shown is `[Default Currency]`, not the browser/site default |
| 3 | Observe the default language | Language defaults per the configured entry (e.g. Chinese for China) |

---

## TC-02 — Configured Country's Currency List Excludes Non-Configured Currencies (Web)

**Objective:** Verify the list of currencies available for display/selection matches only what's configured for that country

**Preconditions:** `[Configured Country]` entry defines an available currency list that excludes `[Excluded Currency]` (e.g. China's list excludes USD)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Access the web app as `[Configured Country]` | Currency selector/display is available |
| 2 | Open the currency selection option (if selectable) or inspect displayed pricing currency | Only currencies in `[Configured Currency List]` are shown |
| 3 | Confirm `[Excluded Currency]` is not present anywhere in currency selection or pricing display | `[Excluded Currency]` (e.g. USD) does not appear |

---

## TC-03 — China-Specific Configuration: CNY Default, USD Removed (Web)

**Objective:** Verify the concrete acceptance criteria for China are met on web

**Preconditions:** China is configured in the mapping table per AC #4

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Access the web app with CDN country code = China | Site loads |
| 2 | Observe default language | Chinese is the default language |
| 3 | Observe default currency | CNY is the default currency |
| 4 | Check all available/displayable currencies | USD is not present in the list |

---

## TC-04 — Configured Country Uses Its Mapped Default Currency (Mobile)

**Objective:** Verify mobile app applies the configured country's default currency based on app store/download source

**Preconditions:** `[Configured Country]` entry exists; app build/store variant corresponds to `[Configured Country]`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Launch the app as downloaded from the `[Configured Country]` app store | App loads |
| 2 | Observe default currency | Currency shown is `[Default Currency]` per config |
| 3 | Observe default language | Language defaults per the configured entry |

---

## TC-05 — Mobile Country Detection Uses Store, Not Physical Location

**Objective:** Verify mobile country/currency detection is based on the store the app was downloaded from, not the user's current physical location, per AC #5

**Preconditions:** App downloaded from `[Configured Country]`'s store; device/user is physically located in a different country

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Launch the app (downloaded from `[Configured Country]` store) while physically located in another country | App loads |
| 2 | Observe default currency/language | Reflects `[Configured Country]`'s config (store-based), unaffected by physical location |
| 3 | Change device location (mock/simulate) without changing store variant | Currency/language configuration remains unchanged |

---

## TC-06 — China-Specific Configuration: CNY Default, USD Removed (Mobile)

**Objective:** Verify the concrete acceptance criteria for China are met on mobile

**Preconditions:** China store variant of the app is available for testing

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Launch app downloaded from the China app store | App loads |
| 2 | Observe default language | Chinese is the default language |
| 3 | Observe default currency | CNY is the default currency |
| 4 | Check all available/displayable currencies | USD is not present in the list |

---

## TC-07 — Unconfigured Country Falls Back to Existing Default Behavior (Web)

**Objective:** Verify countries with no configuration entry are unaffected and use pre-existing default logic, per AC #3 and Technical Notes fallback hierarchy

**Preconditions:** `[Unconfigured Country]` has no entry in the mapping table

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Access the web app with CDN country code = `[Unconfigured Country]` | Site loads |
| 2 | Observe default currency | Falls back to existing browser/site default currency logic (unchanged from pre-feature behavior) |
| 3 | Observe default language | Falls back to existing browser/site default language logic |
| 4 | Check available currency list | Not restricted by any config — includes USD and all previously available currencies |

---

## TC-08 — Unconfigured Country Falls Back to Existing Default Behavior (Mobile)

**Objective:** Verify mobile fallback logic is unaffected for countries without a config entry

**Preconditions:** App store variant for `[Unconfigured Country]` has no mapping entry

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Launch app downloaded from `[Unconfigured Country]`'s store | App loads |
| 2 | Observe default currency | Falls back to existing device-language-based default currency logic |
| 3 | Observe default language | Falls back to existing device-language-based default logic |
| 4 | Check available currency list | Unrestricted — same as pre-feature behavior, includes USD |

---

## TC-09 — All Other Markets Remain Unaffected After Feature Rollout

**Objective:** Regression check confirming no unintended behavior change for markets outside the new configuration, per Technical Notes ("no config = current behavior, unaffected for all other markets")

**Preconditions:** Feature deployed; only `[Configured Country]` (e.g. China) has an active config entry

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Access web app from several previously-supported countries not in the config table (e.g. UK, USA, Italy) | Currency/language behave exactly as before the feature (no regression) |
| 2 | Repeat on mobile with corresponding store variants | Same — no behavior change |

---

## TC-10 — Excluded Currency Cannot Be Selected Even via Deep Link / Direct Query Param (Web)

**Objective:** Verify the excluded currency cannot be forced onto a configured-country session via URL manipulation

**Preconditions:** `[Configured Country]` config excludes `[Excluded Currency]`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Access the web app as `[Configured Country]` with a URL/query parameter attempting to force `[Excluded Currency]` (if such a mechanism exists) | Site loads |
| 2 | Observe resulting currency | `[Excluded Currency]` is not applied; configured default/list is enforced |

---

## TC-11 — Configuration Change Does Not Require Application Code Change

**Objective:** Verify the config mechanism is extensible/data-driven, per AC #6 — adding or updating a country's setup should not require a code deployment

**Preconditions:** Access to wherever the config is managed (CMS / Admin Portal / code-level config — TBC per Technical Notes); this case should be adapted once the storage mechanism is confirmed

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Add or update a country's currency configuration entry via the configuration mechanism (no app/code deployment) | Change is saved |
| 2 | Access the app as that country (web and/or mobile) | Updated currency/language configuration is reflected without requiring a new app build or code deploy |
| 3 | Revert the configuration change | Behavior reverts accordingly |

---

## TC-12 — Pricing and Checkout Reflect the Configured Default Currency End-to-End

**Objective:** Verify the configured currency (e.g. CNY for China) is consistently applied through plan pricing, cart, and checkout — not just on the homepage

**Preconditions:** `[Configured Country]` is configured; at least one plan is purchasable

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Access as `[Configured Country]`, browse to a destination's plans | Plan prices are shown in `[Default Currency]` |
| 2 | Add a plan to cart | Cart total is shown in `[Default Currency]` |
| 3 | Proceed to checkout | Checkout page and payment page also reflect `[Default Currency]`; `[Excluded Currency]` never appears |

---

## TC-13 — Web vs. Mobile Consistency for the Same Configured Country

**Objective:** Verify web (CDN-based) and mobile (store-based) detection produce consistent currency/language results for the same configured country

**Preconditions:** `[Configured Country]` configured; both web and mobile accessible

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Access web app as `[Configured Country]` (CDN country code) | Default currency = `[Default Currency]`, language matches config |
| 2 | Launch mobile app store variant for `[Configured Country]` | Default currency and language match the same values as web |

---

## Coverage Summary

| # | Test Case | Platform | Scenario | Reusable Params |
|---|-----------|----------|----------|------------------|
| TC-01 | Configured country → mapped default currency | Web | Positive | ✓ |
| TC-02 | Configured country → currency list excludes non-configured | Web | Positive/Negative | ✓ |
| TC-03 | China: CNY default, USD removed | Web | Concrete AC | China-specific |
| TC-04 | Configured country → mapped default currency | Mobile | Positive | ✓ |
| TC-05 | Mobile detection uses store, not physical location | Mobile | Edge case | ✓ |
| TC-06 | China: CNY default, USD removed | Mobile | Concrete AC | China-specific |
| TC-07 | Unconfigured country → fallback default logic | Web | Negative/Fallback | ✓ |
| TC-08 | Unconfigured country → fallback default logic | Mobile | Negative/Fallback | ✓ |
| TC-09 | Other markets unaffected (regression) | Web + Mobile | Regression | ✓ |
| TC-10 | Excluded currency can't be forced via URL param | Web | Negative/Security | ✓ |
| TC-11 | Config change requires no app code deployment | Web + Mobile | Extensibility | ✓ |
| TC-12 | Configured currency consistent through checkout | Web | End-to-end | ✓ |
| TC-13 | Web/mobile consistency for same country | Web + Mobile | Consistency | ✓ |

**Total: 13 test cases** (10 fully generic/reusable, 2 China-specific concrete AC checks, 1 requiring confirmation of config storage mechanism before automation)

**Open item before posting to Zephyr:** TC-11 depends on confirming where configuration is managed (CMS, Admin Portal, or code-level) — per ticket's Technical Notes, this is still "to be confirmed."
