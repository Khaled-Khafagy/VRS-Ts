# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```bash
# Run all tests (headed, opens Allure report)
npm run test:allure

# Run all tests headless, generate and open Allure report
npm run test:headless

# Run a single test file
npx playwright test tests/website/Regression/guestCheckout.spec.ts

# Run a single test by title
npx playwright test --grep "Guest checkout for non-existing user"

# Run with Playwright UI (interactive mode)
npx playwright test --ui

# Debug a single test (headed, pauses on failure)
npx playwright test tests/website/Regression/guestCheckout.spec.ts --debug

# Keep browser open after test (useful for DOM inspection)
KEEP_BROWSER=true npx playwright test --grep "test name"
```

---

## Architecture

### Layer overview

```
tests/          → spec files (test scenarios only, no selectors)
Pages/          → Page Object classes (selectors + actions)
fixtures/       → page-manager.ts (custom test fixture wiring)
data/           → credentials.ts (typed env-var constants) + Pages/index.ts (interfaces)
utils/          → testDataGenerator.ts (faker-based dynamic data)
```

### How tests connect to pages

All tests import `test` from `fixtures/page-manager.ts`, not from `@playwright/test` directly. `page-manager.ts` extends the base test with typed fixtures for every page object, so spec files receive page objects as destructured parameters:

```ts
import { test } from '../../../fixtures/page-manager';
test('my test', async ({ homePage, checkoutPage, paymentPage }) => { ... });
```

When a new page is created it must be added to both the `MyFixtures` type and the `customPage.extend` call in `page-manager.ts`.

### Page Object pattern

Every page class:
- Lives in `Pages/` and is a named export
- Extends `BasePage`
- Declares locators in a single private `readonly` object at the top of the class (e.g. `private readonly checkoutPageLocators = { ... }`)
- Wraps every public method body in `await test.step('Description', async () => { ... })`
- Imports only its own interfaces from `Pages/index.ts`

`BasePage` installs a `locatorHandler` that auto-clicks the cookie consent banner whenever it intercepts navigation — no manual cookie handling is needed in tests or page methods.

### Data layer

`Pages/index.ts` — TypeScript interfaces (`GuestInfo`, `LoginInfo`, `BillingAddressInfo`, `CreditCardDetails`, `RegistrationInfo`, `NonExistingUser`).

`data/credentials.ts` — typed constants populated from `.env`. Add new constants here when a test needs env-based data. Never hardcode values in tests.

`utils/testDataGenerator.ts` — `generateGuestUserData()` returns a random `NonExistingUser` using `@faker-js/faker`. Use this for one-time guest registrations; use `GuestUserData` from credentials for tests that need a known existing account.

---

## The website under test

**VRS (Vodafone Roaming Service)** is a Vodafone eSIM travel platform. Users browse destinations by region or country, select a data plan, and purchase an eSIM that activates on arrival. The environment under test is **pre-production**: `vrs.preprod.travel.vodafone.com`.

Authentication is delegated to **Vodafone ID** (`idp.vodafone.com`). Payment is handled by **Vodafone's payment gateway** served inside a nested iframe from `pre.pay.vodafone.com`.

### Pages and their roles

| Page class | URL pattern | Purpose |
|---|---|---|
| `HomePage` | `/` | Entry point. Hero banner, region/country tabs, search bar, navigation to destination pages. |
| `OurDestinationsPage` | `/our-destinations` | Full destination listing with Regions/Countries tabs and search. |
| `RegionPlansPage` | `/our-destinations/<region>` | eSIM plan cards for a specific region. "Add to cart" → "Go to checkout" triggers cart flow. |
| `CartPage` | (modal or page) | Shows added plan, "Continue to checkout" proceeds to checkout. |
| `CheckoutPage` | `/checkout` | Personal info form (first name, last name, email) + billing address. Has a "Log in" link for existing users. |
| `EmailVerificationPage` | (modal within checkout) | OTP entry for new users, or "Welcome back" prompt for existing-email users. |
| `LoginPage` | `idp.vodafone.com` (external) | Vodafone ID login. Email + password → "Continue". |
| `PaymentPage` | `/checkout/payment` | Payment gateway in a nested iframe. Saved card for logged-in users, new card entry for guests. |
| `OrderSuccessfulPage` | `/checkout/success` | Order confirmation. Shows "Thank you for your order!" and eSIM delivery notice. Guest users also see a "Create Password" prompt. |
| `RegistationPage` | `idp.vodafone.com/register` | Vodafone ID account creation: first/last name, email, country (+ state for USA/Canada), password, OTP. |
| `MyAccountPage` | (account dropdown) | Contains Sign Out. The `myAccountPage` fixture auto-signs out after every test. |
| `LoginOrSignupPage` | (modal) | Entry choice between Login and Sign Up paths (not heavily used in current tests). |

### Available regions and countries

Regions on homepage: `Europe`, `North America`, `Middle East`, `Africa`, `Asia`, `Caribbean`, `South America` / `Latin America`, `Oceania`.

Country cards on homepage: Italy, UK, South Africa, France, Spain, USA, Egypt, Germany, Greece.

Full destination list on `/our-destinations`: Africa, American Samoa, Asia, Caribbean, Europe, Latin America, Middle East, North America, Oceania (and individual countries in the Countries tab).

---

## Core user flows

### 1. Guest checkout — new user
```
HomePage → RegionPlansPage (Add to cart → Go to checkout)
→ CartPage (Continue to checkout)
→ CheckoutPage (fill new user info + billing address)
→ EmailVerificationPage (OTP "000000" magic pin in preprod)
→ PaymentPage (fill card details)
→ OrderSuccessfulPage (verify success + "Create Password" button visible)
```

### 2. Guest checkout — existing account email
```
HomePage → RegionPlansPage → CartPage
→ CheckoutPage (fill existing user's email)
→ EmailVerificationPage ("Welcome back" heading → click Login button)
→ LoginPage / Vodafone ID (fill credentials)
→ CheckoutPage (proceed to payment as logged-in user)
→ PaymentPage (saved card)
→ OrderSuccessfulPage (verify success, no "Create Password")
```

### 3. Guest checkout — click login link
```
HomePage → RegionPlansPage → CartPage
→ CheckoutPage (click "Log in" link at top)
→ LoginPage / Vodafone ID (fill credentials)
→ CheckoutPage (proceed to payment as logged-in user)
→ PaymentPage (saved card)
→ OrderSuccessfulPage
```

### 4. Login flow (standalone)
```
Navigate to AppUrls.login → LoginPage (fill email + password → Continue)
→ assert redirect back to vrs.preprod.travel.vodafone.com
```

### 5. Registration flow
```
Navigate to registration URL → RegistationPage
(fill firstName, lastName, email, country, [state for USA/Canada], password, confirmPassword)
→ Submit → OTP entry (6 digits) → success heading
```

---

## Key behavioral rules

- **OTP in preprod**: The magic OTP is always `000000`. `EmailVerificationPage.enterMagicOTP()` hardcodes this. `RegistationPage.enterOTP(otp)` accepts a string — pass `RegistrationTestData.otp` (env var).
- **Payment is inside nested iframes**: The outer iframe is `iframe[src*="pre.pay.vodafone.com"]`. Card number/expiry/CVC each live inside a further nested `iframe` with a `title` attribute. Use `pressSequentially` with a small delay for these secure fields — `.fill()` is silently ignored by the payment gateway.
- **Logged-in payment uses a saved card**: `performPaymentWithCardForLoggedInUsers()` clicks the saved Visa card token, scrolls the Pay button into view inside the iframe's own document, then clicks it.
- **Checkout consent checkbox**: The "I agree" checkbox (`input[value="consolidated"]`) is inside a label containing hyperlinks, so clicking the label navigates away. It must be checked via `page.evaluate` to directly set `.checked` and dispatch the click/change events.
- **`myAccountPage` fixture auto-signs out** after every test that uses it — no manual sign-out step needed in tests.
- **Cookie banner is auto-dismissed** by `BasePage`'s `addLocatorHandler` on navigation — no `acceptCookies()` call needed in individual tests unless the banner appears mid-test outside of navigation.
- **Tests are serial** (`fullyParallel: false`). Workers default to 1 in both local and CI.
- **Retry policy**: 0 retries locally, 2 retries in CI.
- **Headed locally, headless in CI**: Controlled by `!!process.env.CI`.

---

## Locator priority (always follow this order)

1. `getByRole()` — preferred
2. `getByLabel()`
3. `getByPlaceholder()`
4. `getByText()`
5. CSS selectors or XPath — last resort only
6. Never use: `data-testid`, `id`, `className` — **except** in `RegistationPage` where the Vodafone ID registration form exposes `data-testid` attributes and there are no accessible-name alternatives

---

## Adding new page objects

1. Create `Pages/NewPage.ts` extending `BasePage`
2. Add the interface (if new data shape needed) to `Pages/index.ts`
3. Add the fixture to `MyFixtures` type and `customPage.extend` in `fixtures/page-manager.ts`
4. Add env-based test data constants to `data/credentials.ts`

## Adding new test files

Follow the structure of [tests/website/Regression/guestCheckout.spec.ts](tests/website/Regression/guestCheckout.spec.ts):
- Import `test` from `fixtures/page-manager`
- Import typed data from `data/credentials`
- Import generators from `utils/testDataGenerator` for one-off dynamic data
- Each `test()` block contains only sequential page method calls — no assertions, no selectors
