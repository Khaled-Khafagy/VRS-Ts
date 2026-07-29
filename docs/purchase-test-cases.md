# Test Cases — Purchase Flows

Derived from automated specs in `tests/website/Regression/purchase/`.

---

## guestCheckout.spec.ts

### TC-01 — Guest Checkout for Non-Existing User

**Tags:** `@regression` `@P1`

**Objective:** Verify a brand-new guest user can complete a purchase end-to-end and receives all expected transactional emails.

**Preconditions:** None — a new guest identity and a random destination are generated at runtime.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Go to the homepage | Homepage loads |
| 2 | Navigate to a random destination's region plans page | Plans page loads for the selected destination |
| 3 | Select the first available plan | Plan is added and cart is reached |
| 4 | Proceed to checkout from the cart | Checkout page loads |
| 5 | Fill personal details for a non-existing user | Personal info accepted |
| 6 | Fill billing address details and proceed to payment | Billing details accepted; navigates to payment step |
| 7 | Complete OTP verification for a non-existing user | Email is verified |
| 8 | Verify the OTP email was received | OTP email arrives at the guest's address |
| 9 | Fill card details and pay | Payment is submitted successfully |
| 10 | Verify the Order Successful page for guest users | Confirmation page displays guest-specific content (e.g. Create Password prompt) |
| 11 | Verify QR code email received | QR code email arrives |
| 12 | Verify receipt email received | Receipt email arrives |
| 13 | Verify welcome email received | Welcome email arrives |

---

### TC-02 — Guest Checkout with Existing Account Email

**Tags:** `@regression` `@P1`

**Objective:** Verify that entering an existing account's email during guest checkout redirects to login and completes the purchase as a logged-in user.

**Preconditions:** A valid existing account exists (`GuestUserData` / `ValidLoginDetails`).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Go to the homepage | Homepage loads |
| 2 | Navigate to a random destination's region plans page | Plans page loads |
| 3 | Select the first available plan | Plan added, proceeds to cart |
| 4 | Proceed to checkout from the cart | Checkout page loads |
| 5 | Fill personal details using an existing user's email | Existing-user email is recognized |
| 6 | Fill billing address details and proceed to payment | Billing accepted |
| 7 | Complete OTP verification flow for an existing user | "Welcome back" prompt is triggered |
| 8 | Verify redirection to the Login page completes | Vodafone ID login page loads |
| 9 | Fill login details and submit | Login succeeds |
| 10 | Proceed to payment as a logged-in user | Payment step loads with saved card |
| 11 | Perform payment with the saved card | Payment completes |
| 12 | Verify the Order Successful page for logged-in users | Confirmation page displays logged-in-specific content (no Create Password prompt) |

**Post-condition:** `myAccountPage` fixture signs the user out automatically after the test.

---

### TC-03 — Guest Checkout Login with Existing Account

**Tags:** `@regression` `@P2`

**Objective:** Verify a user can click the "Log in" link directly on checkout (instead of via OTP flow) and complete the purchase as a logged-in user.

**Preconditions:** A valid existing account exists (`ValidLoginDetails`).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Go to the homepage | Homepage loads |
| 2 | Navigate to a random destination's region plans page | Plans page loads |
| 3 | Select the first available plan | Plan added, proceeds to cart |
| 4 | Proceed to checkout from the cart | Checkout page loads |
| 5 | Click the "Log in" link on checkout | Redirects toward login |
| 6 | Verify redirection to the Login page completes | Vodafone ID login page loads |
| 7 | Fill login details and submit | Login succeeds |
| 8 | Proceed to payment as a logged-in user | Payment step loads with saved card |
| 9 | Perform payment with the saved card | Payment completes |
| 10 | Verify the Order Successful page for logged-in users | Confirmation page displays logged-in-specific content |

**Post-condition:** `myAccountPage` fixture signs the user out automatically after the test.

---

## loggedInCheckout.spec.ts

### TC-04 — One eSIM Checkout as Logged-In User

**Tags:** `@regression` `@P1`

**Objective:** Verify a logged-in user can purchase a single eSIM plan and receives the expected transactional emails.

**Preconditions:** Valid account credentials (`ValidLoginDetails`); a random destination is pre-selected via fixture.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the login URL and log in | User is authenticated |
| 2 | Navigate to the random destination's region plans page | Plans page loads |
| 3 | Select the first available plan | Plan added, proceeds to cart |
| 4 | Proceed to checkout from the cart | Checkout page loads |
| 5 | Proceed to payment as a logged-in user | Payment step loads with saved card |
| 6 | Perform payment with the saved card | Payment completes |
| 7 | Verify the Order Successful page for logged-in users | Confirmation page displays correctly |
| 8 | Verify QR code email received | QR code email arrives at the account's address |
| 9 | Verify receipt email received | Receipt email arrives |

**Post-condition:** `myAccountPage` fixture signs the user out automatically after the test.

---

### TC-05 — Multiple eSIM Checkout as Logged-In User

**Tags:** `@regression` `@P2`

**Objective:** Verify a logged-in user can add plans from two different regions to the cart and complete a single combined checkout.

**Preconditions:** Valid account credentials (`ValidLoginDetails`); two distinct random regions are pre-selected via fixture.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the login URL and log in | User is authenticated |
| 2 | Navigate to the first region's plans page | Plans page loads |
| 3 | Add the first region's plan to cart | Plan added to cart |
| 4 | Return to the homepage | Homepage loads |
| 5 | Navigate to the second region's plans page | Plans page loads |
| 6 | Select the second region's first plan | Plan added, proceeds to cart |
| 7 | Proceed to checkout from the cart | Checkout page shows both plans |
| 8 | Proceed to payment as a logged-in user | Payment step loads with saved card |
| 9 | Perform payment with the saved card | Payment completes for both items |
| 10 | Verify the Order Successful page for logged-in users | Confirmation page displays correctly |
| 11 | Verify QR code email received | QR code email arrives |
| 12 | Verify receipt email received | Receipt email arrives |

**Post-condition:** `myAccountPage` fixture signs the user out automatically after the test.

---

## travelToGetherPlan.spec.ts (TE-90)

### TC-06 — Travel Together Plan: Guest Checkout, New User (Desktop)

**Tags:** `@regression` `@P1` `@travelTogetherPlan`

**Objective:** Verify a new guest user can discover, review, and purchase a Travel Together (global) plan end-to-end.

**Preconditions:** None — a new guest identity and a Travel-Together-eligible destination are generated at runtime.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Go to the homepage | Homepage loads |
| 2 | Navigate to the selected destination's region plans page | Plans page loads |
| 3 | Verify the Travel Together Plan banner is visible | Banner displayed on the plans page |
| 4 | Open the Global Plan details modal | Modal opens |
| 5 | Verify the Global Plan details modal content | Modal displays correct plan details |
| 6 | Proceed from the modal to the cart | Cart is reached with the plan added |
| 7 | Verify the cart has loaded | Cart content displayed |
| 8 | Expand and verify the "What's included" section | Section expands and shows correct inclusions |
| 9 | Proceed to checkout from the cart | Checkout page loads |
| 10 | Fill personal details for a non-existing user | Personal info accepted |
| 11 | Fill billing address details and proceed to payment | Billing accepted |
| 12 | Complete OTP verification for a non-existing user | Email verified |
| 13 | Fill card details and pay | Payment completes |
| 14 | Verify the Travel Together Plan order-success page for guest users | Confirmation page shows Travel Together-specific guest content |

---

### TC-07 — Travel Together Plan: Guest Checkout, Existing Account Email (Desktop)

**Tags:** `@regression` `@P1` `@travelTogetherPlan`

**Objective:** Verify a guest entering an existing account's email during Travel Together Plan checkout is routed through login and completes the purchase as a logged-in user.

**Preconditions:** A valid existing account exists (`GuestUserData` / `ValidLoginDetails`).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Go to the homepage | Homepage loads |
| 2 | Navigate to the selected destination's region plans page | Plans page loads |
| 3 | Verify the Travel Together Plan banner is visible | Banner displayed |
| 4 | Select the Travel Together plan | Plan selected |
| 5 | Verify the cart has loaded | Cart shows the plan |
| 6 | Proceed to checkout from the cart | Checkout page loads |
| 7 | Fill personal details using an existing user's email | Existing-user email recognized |
| 8 | Fill billing address details and proceed to payment | Billing accepted |
| 9 | Complete OTP verification flow for an existing user | "Welcome back" prompt triggered |
| 10 | Verify redirection to the Login page completes | Vodafone ID login page loads |
| 11 | Fill login details and submit | Login succeeds |
| 12 | Proceed to payment as a logged-in user | Payment step loads with saved card |
| 13 | Perform payment with the saved card | Payment completes |
| 14 | Verify the Travel Together Plan order-success page for logged-in users | Confirmation page shows Travel Together-specific logged-in content |

**Post-condition:** `myAccountPage` fixture signs the user out automatically after the test.

---

### TC-08 — Travel Together Plan: Logged-In User Checkout (Desktop)

**Tags:** `@regression` `@P1` `@travelTogetherPlan`

**Objective:** Verify a logged-in user can purchase a Travel Together Plan directly.

**Preconditions:** Valid account credentials (`ValidLoginDetails`).

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the login URL and log in | User is authenticated |
| 2 | Navigate to the selected destination's region plans page | Plans page loads |
| 3 | Verify the Travel Together Plan banner is visible | Banner displayed |
| 4 | Select the Travel Together plan | Plan selected |
| 5 | Verify the cart has loaded | Cart shows the plan |
| 6 | Proceed to checkout from the cart | Checkout page loads |
| 7 | Proceed to payment as a logged-in user | Payment step loads with saved card |
| 8 | Perform payment with the saved card | Payment completes |
| 9 | Verify the Travel Together Plan order-success page for logged-in users | Confirmation page shows Travel Together-specific logged-in content |

**Post-condition:** `myAccountPage` fixture signs the user out automatically after the test.

---

### TC-09 — Travel Together Plan: Promotional Code Application (Desktop)

**Tags:** `@regression` `@P2` `@travelTogetherPlan`

**Objective:** Verify a promo code can be applied to a Travel Together Plan in the cart, the order summary reflects the discount, and the receipt email matches the discounted order summary.

**Preconditions:** None — a new guest identity, an eligible destination, and a valid promo code (`TravelTogetherPlanPromoCode`) are used.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Go to the homepage | Homepage loads |
| 2 | Navigate to the selected destination's region plans page | Plans page loads |
| 3 | Verify the Travel Together Plan banner is visible | Banner displayed |
| 4 | Select the Travel Together plan | Plan selected |
| 5 | Verify the cart has loaded | Cart shows the plan |
| 6 | Apply the promotional code | Promo code is accepted |
| 7 | Verify the order summary is visible | Order summary section displayed |
| 8 | Capture the order summary | Summary values captured for later comparison |
| 9 | Proceed to checkout from the cart | Checkout page loads |
| 10 | Fill personal details for a non-existing user | Personal info accepted |
| 11 | Fill billing address details and proceed to payment | Billing accepted |
| 12 | Complete OTP verification for a non-existing user | Email verified |
| 13 | Fill card details and pay | Payment completes |
| 14 | Verify the Travel Together Plan order-success page for guest users | Confirmation page shows Travel Together-specific guest content |
| 15 | Verify QR code email received | QR code email arrives |
| 16 | Verify the receipt email matches the captured order summary | Receipt email amounts/discount match the summary captured in step 8 |

---

## Coverage Summary

| # | Test Case | Spec File | Priority |
|---|-----------|-----------|----------|
| TC-01 | Guest checkout for non-existing user | guestCheckout.spec.ts | P1 |
| TC-02 | Guest checkout with existing account email | guestCheckout.spec.ts | P1 |
| TC-03 | Guest checkout login with existing account | guestCheckout.spec.ts | P2 |
| TC-04 | One eSIM checkout as logged-in user | loggedInCheckout.spec.ts | P1 |
| TC-05 | Multiple eSIM checkout as logged-in user | loggedInCheckout.spec.ts | P2 |
| TC-06 | Travel Together — guest checkout, new user | travelToGetherPlan.spec.ts | P1 |
| TC-07 | Travel Together — guest checkout, existing email | travelToGetherPlan.spec.ts | P1 |
| TC-08 | Travel Together — logged-in user checkout | travelToGetherPlan.spec.ts | P1 |
| TC-09 | Travel Together — promotional code application | travelToGetherPlan.spec.ts | P2 |

**Total: 9 test cases.**
