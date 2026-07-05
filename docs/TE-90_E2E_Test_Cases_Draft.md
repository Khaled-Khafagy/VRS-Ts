# TE-90: Purchase Journey - E2E Test Cases (Group Plan)

## Overview
E2E test cases for Group Plan purchase journey spanning: Destination → Cart → Checkout → Payment → Order Completion → Order Confirmation Email

**Scope:**
- Desktop & Mobile
- Region: Europe
- User types: Guest (new), Guest (existing account), Logged-in
- Device sharing: Up to 5 devices per group plan
- Email verification: Order Confirmation + Invoice & Agreement emails (in 6 languages: EN, DE, FR, ES, PT, EL)

---

## Test Case 1: Guest Checkout - New User - Desktop

**ID:** TE-90-TC-01  
**Title:** Purchase Group Plan as new guest user - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- Region: Europe (e.g., UK, Italy, France)
- User: Email NOT in system (new guest)

**Steps:**
1. Navigate to VRS homepage
2. Search or navigate to a European destination (e.g., UK) that offers Group Plans
3. Verify destination page displays Group Plan option with badge "Group Plan"
4. Click "Find out more" link on Group Plan hero section OR scroll to see Group Plan cards
5. Verify "Global plan details" modal appears showing:
   - "Travelling with family or friends?" heading
   - "Share across up to 5 devices per group plan"
   - "Invite members to your plan"
   - "Shared data pool for the group"
   - "Track usage and top up when needed"
   - "See Group plans" button
6. Click "See Group plans" button
7. Select a Group Plan card (e.g., "Democratic Republic of Congo 100GB - €50") and click "Add to cart"
8. Verify cart popup appears showing:
   - Plan details (name, GB, duration)
   - "Added to cart" confirmation
   - Quantity controls (-, qty, +)
   - Scrollable list of other available plans
9. (Optional) Add more plans to cart to test multiple items scenario
10. Click "Go to checkout" button (or similar)
11. Verify cart page loads showing:
    - "Items in cart (N)" section with plan details
    - Quantity controls for each plan
    - "What's included" expandable section for Group Plan
    - Order Summary with Subtotal, discount (if any), and Total
    - Promotional Code input field with "Apply code" button
    - "Continue" button (red)
12. Click "Continue" button to proceed to checkout
13. Verify checkout page loads (not logged in)
14. Fill personal info form:
    - First Name: Valid first name
    - Last Name: Valid last name
    - Email: New email (NOT in system)
15. Scroll and fill Billing Address:
    - Address line 1
    - City
    - Postal code
    - Country: Select appropriate country for region
16. Verify "I agree to terms" checkbox is visible (with hyperlinks)
17. Check the "I agree to terms" checkbox
18. Click "Continue to payment" or "Next" button
19. Verify Email Verification modal/page appears:
    - Heading: "Verify your email" or similar
    - OTP input field (6 digits)
    - Resend option
20. Enter OTP: "000000" (magic PIN for preprod)
21. Verify modal closes and user is logged in as new guest user
22. Verify payment page loads inside nested iframe showing:
    - Card number field (in nested iframe)
    - Expiry date field (in nested iframe)
    - CVC field (in nested iframe)
    - Cardholder name (optional)
    - Billing address (pre-filled from checkout)
    - "Pay" button
23. Fill payment card details:
    - Card number: Valid test card (4111 1111 1111 1111)
    - Expiry: Valid future date (e.g., 12/27)
    - CVC: 123
    - Cardholder: Name from checkout
24. Click "Pay" button
25. Verify payment processing and success
26. Verify order completion page loads showing:
    - "Thank you for your order!" heading
    - Order number (e.g., "1223345")
    - Message: "Your Group Plan confirmation and eSIM have been sent to [email]"
    - Support contact instruction with order number
    - 3-step setup guide:
      - Step 01: Look for email with installation details (download app links visible)
      - Step 02: "Setup group plan" button visible
      - Step 03: "Invite your group members" instruction
27. Verify order confirmation email received at user email with:
    - Subject line contains order number
    - Order number displayed
    - Group Plan details (name, GB, price, duration)
    - Device sharing info (up to 5 devices)
    - Setup instructions with call-to-action buttons
    - Contact support info
28. Verify **Invoice & Agreement Email** received at same email address:
    - Separate email from order confirmation
    - Subject line indicates invoice/agreement
    - PDF or document attachment with:
      - Invoice details (order number, date, items, price breakdown)
      - Terms & conditions
      - Billing agreement
    - All content in English (since user language was English)
29. ✅ **Email Localization Verification (for this English flow):**
    - ✅ Order confirmation email body is in English
    - ✅ Invoice/agreement email is in English
    - ✅ Subject lines in English
    - (Full localization tested separately in TC-10 across 6 languages)

**Expected Results:**
- All steps complete successfully
- Both emails received within reasonable time (< 5 min)
- Order confirmation email contains all purchase details
- Invoice/agreement email separate and includes legal docs
- Email content matches checkout language (English in this case)
- Setup guide is clear with call-to-action buttons

---

## Test Case 2: Guest Checkout - New User - Mobile

**ID:** TE-90-TC-02  
**Title:** Purchase Group Plan as new guest user - Mobile  
**Preconditions:**
- Browser: Chrome/Safari Mobile
- Device: Mobile (iPhone 12 or Android equivalent)
- Region: Europe
- User: Email NOT in system (new guest)

**Steps:**
1-26: Same as TE-90-TC-01, but verify responsive layout at each step:
   - Destination page: Group Plan section visible on mobile
   - Cart popup: Scrollable list visible, CTA buttons full-width
   - Cart page: Items stack vertically, order summary below, Continue button full-width
   - Checkout form: Form fields stack properly, address fields responsive
   - Email verification: OTP input visible, resend link accessible
   - Payment: Card fields responsive inside iframe (may have mobile-specific styling)
   - Order completion: Thank you message, order number, and 3-step guide display properly on mobile
27. Verify **Order Confirmation Email** received with:
    - Subject line contains order number
    - Order details, Group Plan info (name, GB, price)
    - Device sharing info (up to 5 devices)
    - Setup instructions
28. Verify **Invoice & Agreement Email** received at same address:
    - Separate email with subject indicating invoice/agreement
    - PDF/document attachment with invoice and terms
    - All content in English (user's selected language)
29. ✅ **Email Localization Verification:**
    - ✅ Order confirmation email body is in English
    - ✅ Invoice/agreement email is in English
    - (Full localization tested separately in TC-10)

**Expected Results:**
- All elements responsive and accessible on mobile
- No horizontal scroll required
- Buttons and inputs properly sized for touch
- Order flow completes successfully
- Both emails received within reasonable time
- Email content in correct language (English)

---

## Test Case 3: Guest Checkout - Existing Account Email - Desktop

**ID:** TE-90-TC-03  
**Title:** Purchase Group Plan with existing account email - Desktop (Welcome back flow)  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- Region: Europe
- User: Email already has an account in the system
- Existing credentials: Known username/password (from test data)

**Steps:**
1-11: Same as TE-90-TC-01 up to checkout page
12. Verify checkout page loads (not logged in)
13. Fill personal info:
    - First Name: Can be any name
    - Last Name: Can be any name
    - Email: Use EXISTING account email (in system)
14. Scroll and fill Billing Address (or skip if same as account)
15. Check "I agree to terms" checkbox
16. Click "Continue to payment" or "Next" button
17. Verify Email Verification modal/page appears with heading:
    - "Welcome back!" or "This email already has an account"
    - Option to "Login" or "Continue with password"
18. Click "Login" button
19. Verify redirect to Vodafone ID login page (external IdP)
20. Fill Vodafone ID login form:
    - Email: Existing account email
    - Password: Correct password from test data
21. Click "Continue" button
22. Verify redirect back to VRS checkout page as logged-in user
23. Verify checkout page now shows:
    - User's name pre-filled from account
    - Billing address pre-filled from account (if exists)
    - Option to use saved billing address or add new
24. Verify payment page loads with:
    - SAVED CARD option (Visa card token visible, masked last 4 digits)
    - Option to use saved card
    - Or "Add new card" option
25. Click on saved card (Visa token) to select it
26. Verify "Pay" button visible and enabled
27. Click "Pay" button
28. Verify payment processing with saved card
29. Verify order completion page loads with:
    - "Thank you for your order!" heading
    - Order number
    - Confirmation message with email
    - 3-step setup guide (same as TC-01, but no "Create Password" prompt since user already has account)
30. Verify **Order Confirmation Email** received at existing account email:
    - Subject line contains order number
    - Order details, Group Plan info (name, GB, price)
    - Device sharing and setup info
31. Verify **Invoice & Agreement Email** received at same email:
    - Separate email with invoice/agreement subject
    - PDF/document attachment with invoice and terms
    - All content in English (user's selected language)
32. ✅ **Email Localization Verification:**
    - ✅ Order confirmation email body is in English
    - ✅ Invoice/agreement email is in English

**Expected Results:**
- Welcome back flow triggered for existing email
- Login to Vodafone ID succeeds
- Saved card option available and usable
- Order placed successfully with logged-in user
- Both emails received within reasonable time
- Email content in correct language (English)

---

## Test Case 4: Guest Checkout - Existing Account Email - Mobile

**ID:** TE-90-TC-04  
**Title:** Purchase Group Plan with existing account email - Mobile (Welcome back flow)  
**Preconditions:**
- Browser: Chrome/Safari Mobile
- Device: Mobile
- Region: Europe
- User: Email already has an account
- Existing credentials: Known username/password

**Steps:**
1-31: Same as TE-90-TC-03 steps, verify responsive layout throughout mobile flow
32. Verify **Order Confirmation Email** received at user email (same content as TC-03)
33. Verify **Invoice & Agreement Email** received (same as TC-03)
34. ✅ **Email Localization Verification:**
    - ✅ Both emails in English

**Expected Results:**
- Mobile-responsive welcome back flow
- Login form accessible on mobile
- Saved card selection visible on mobile
- Order completes successfully
- Both emails received in correct language

---

## Test Case 5: Logged-In User Checkout - Desktop

**ID:** TE-90-TC-05  
**Title:** Purchase Group Plan as logged-in user - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- Region: Europe
- User: Already logged in to VRS with valid account
- Session: Active and valid

**Steps:**
1. Verify user is already logged in (Login button replaced with account icon/dropdown in header)
2. Navigate to or search for European destination with Group Plan
3. Verify Group Plan section visible with "Global plan details" modal option
4. Click "See Group plans" button
5. Select a Group Plan card (e.g., "Democratic Republic of Congo 100GB") and click "Add to cart"
6. Verify cart popup shows plan with "Added to cart" status
7. (Optional) Add additional plans to test multi-item cart
8. Click "Go to checkout"
9. Verify cart page loads with items and order summary
10. Click "Continue" button
11. Verify checkout page loads with:
    - First Name, Last Name, Email pre-filled from logged-in account
    - Billing address pre-filled from account (or empty if first purchase)
    - Option to add/edit address
12. Verify billing address is populated or add new if needed
13. Verify "I agree to terms" checkbox and check it
14. Click "Continue to payment" / "Next" button
15. (NO email verification step since user is already logged in)
16. Verify payment page loads showing:
    - Saved card option (Visa token with masked digits)
    - "Pay" button
    - Option to add new card if desired
17. Select saved card (or add new if needed)
18. Click "Pay" button
19. Verify payment success
20. Verify order completion page displays:
    - "Thank you for your order!" 
    - Order number
    - Confirmation message with email
    - 3-step setup guide
    - NO "Create Password" prompt (user already has account)
21. Verify **Order Confirmation Email** received:
    - Subject line contains order number
    - Order details, Group Plan info
    - Setup instructions
    - All content in English
22. Verify **Invoice & Agreement Email** received:
    - Separate email with invoice/agreement subject
    - PDF/document attachment
    - All content in English
23. ✅ **Email Localization Verification:**
    - ✅ Both emails in English

**Expected Results:**
- Checkout process streamlined for logged-in user
- Pre-filled form fields reduce friction
- Saved card available and used successfully
- Order completes end-to-end
- Both emails received in correct language

---

## Test Case 6: Logged-In User Checkout - Mobile

**ID:** TE-90-TC-06  
**Title:** Purchase Group Plan as logged-in user - Mobile  
**Preconditions:**
- Browser: Chrome/Safari Mobile
- Device: Mobile
- Region: Europe
- User: Already logged in to VRS
- Session: Active

**Steps:**
1-22: Same as TE-90-TC-05 steps, verify responsive layout on mobile throughout
23. Verify **Order Confirmation Email** received (same as TC-05 step 21)
24. Verify **Invoice & Agreement Email** received (same as TC-05 step 22)
25. ✅ **Email Localization Verification:**
    - ✅ Both emails in English

**Expected Results:**
- Mobile-responsive logged-in checkout
- Pre-filled fields visible and editable on mobile
- Saved card selection accessible
- Order completes successfully
- Both emails received in correct language

---

## Test Case 7: Guest Checkout - Multiple Plans in Cart - Desktop

**ID:** TE-90-TC-08  
**Title:** Purchase multiple Group Plans in single order - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- Regions: Europe (multiple countries or plans)
- User: New guest

**Steps:**
1. Navigate to destination page with Group Plan
2. Add first Group Plan to cart (e.g., "Democratic Republic of Congo 100GB")
3. Verify "Added to cart" state
4. Continue shopping (click back or continue browsing)
5. Add second Group Plan to cart (e.g., "Europe 50GB")
6. Verify both items show in cart popup
7. Verify quantity can be adjusted for each plan
8. Click "Go to checkout"
9. Verify cart page shows:
    - "Items in cart (2)" or appropriate count
    - Both plans listed with quantities
    - Each plan's details visible
    - Order summary with combined subtotal
10. Verify "What's included" section expandable for Group Plan items
11. Verify discount calculation if applicable (e.g., "Buy more, pay less!" discount for multiple eSIMs)
12. Proceed to checkout and complete purchase (same as TE-90-TC-01 from step 12)
13. Verify order confirmation includes all plans purchased
14. Verify **Order Confirmation Email** lists both Group Plans:
    - Both plan names and prices visible
    - Combined total correct
    - All content in English
15. Verify **Invoice & Agreement Email** received:
    - Itemized invoice with both plans
    - PDF/document attachment
    - All content in English
16. ✅ **Email Localization Verification:**
    - ✅ Both emails in English

**Expected Results:**
- Multiple plans can be added to cart
- Cart page displays all items correctly
- Discounts applied correctly for bulk purchases
- Order confirmation includes all plans
- Both emails show complete order with all items

---

## Test Case 9: Promotional Code Application - Desktop

**ID:** TE-90-TC-09  
**Title:** Apply valid promotional code to Group Plan order - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- Promotional Code: Valid, active code from test data
- User: New guest

**Steps:**
1. Navigate to destination and add Group Plan to cart
2. Proceed to cart page
3. Verify cart page displays:
    - Items in cart
    - "Promotional Code" section with input field and "Apply code" button
4. Enter valid promotional code in the field
5. Click "Apply code" button
6. Verify:
    - Code is accepted (no error message)
    - Discount amount displays in order summary
    - Total price is reduced
7. Proceed to checkout and complete purchase (same as TE-90-TC-01)
8. Verify order completion page shows:
    - Discounted total
    - Promotional code applied
9. Verify **Order Confirmation Email** shows:
    - Promotional code applied/mentioned
    - Original price
    - Discount amount
    - Final total
    - All content in English
10. Verify **Invoice & Agreement Email** received with:
    - Itemized breakdown showing discount
    - Promo code reference
    - PDF/document attachment
    - All content in English
11. ✅ **Email Localization Verification:**
    - ✅ Both emails in English

**Expected Results:**
- Promotional code accepted and applied
- Discount visible on cart, checkout, and order page
- Order confirmation reflects discount
- Both emails include promo code details
- Email confirmation in correct language (English)

---

## Test Case 8: Promotional Code Application - Desktop

**ID:** TE-90-TC-08  
**Title:** Apply valid promotional code to Group Plan order - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- Promotional Code: Valid, active code from test data
- User: New guest

**Steps:**
1. Navigate to destination and add Group Plan to cart
2. Proceed to cart page
3. Verify cart page displays:
    - Items in cart
    - "Promotional Code" section with input field and "Apply code" button
4. Enter valid promotional code in the field
5. Click "Apply code" button
6. Verify:
    - Code is accepted (no error message)
    - Discount amount displays in order summary
    - Total price is reduced
7. Proceed to checkout and complete purchase (same as TE-90-TC-01)
8. Verify order completion page shows:
    - Discounted total
    - Promotional code applied
9. Verify order confirmation email shows:
    - Original price
    - Discount amount
    - Final total

**Expected Results:**
- Promotional code accepted and applied
- Discount visible on cart and checkout
- Order confirmation reflects discount
- Email includes promo code details

---

## Test Case 9: Localization E2E - English (EN)

**ID:** TE-90-TC-09-EN  
**Title:** Complete Group Plan purchase in English and verify localized emails  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- Language: English (EN)
- User: New guest
- Email: testuser_en@test.com (or unique email)
- Region: Europe
- Test payment card: 4111 1111 1111 1111

**Steps:**
1. Navigate to VRS homepage
2. Click language selector and select English (EN)
3. Click "Apply and close" button
4. Verify homepage displays in English
5. Navigate to a destination offering Group Plans (e.g., Democratic Republic of Congo)
6. Verify destination page displays in English (all text, buttons, headings)
7. Click "See Group plans" button
8. Select a Group Plan (e.g., "100GB 30 Days - €50") and click "Add to cart"
9. Verify "Added to cart" popup displays in English
10. Click "Go to checkout"
11. Verify cart page displays in English with all elements translated
12. Click "Continue" button
13. Verify checkout page displays in English:
    - Form labels in English
    - Button text in English
14. Fill form:
    - First Name: Test
    - Last Name: User
    - Email: testuser_en@test.com
    - Address: Valid UK/Europe address
    - Country: Select from dropdown (in English)
15. Check "I agree to terms" checkbox
16. Click "Continue to payment" button
17. Verify Email Verification modal displays in English
18. Enter OTP: "000000"
19. Verify modal closes and payment page loads in English
20. Fill payment details:
    - Card: 4111 1111 1111 1111
    - Expiry: 12/27
    - CVC: 123
21. Click "Pay" button
22. Verify order completion page displays in English:
    - "Thank you for your order!" heading in English
    - 3-step setup guide in English
23. Verify **Order Confirmation Email** received at testuser_en@test.com:
    - Subject and body in English
    - Order number, plan details, prices in English
    - Setup instructions in English
24. Verify **Invoice & Agreement Email** received:
    - Subject and body in English
    - PDF content in English
    - Dates/amounts in English format

**Expected Results:**
- ✅ Complete purchase flow succeeds in English
- ✅ All UI elements in English (no mixed languages)
- ✅ Both emails received in English
- ✅ Email content fully localized
- ✅ No UI glitches or truncations

---

## Test Case 10: Localization E2E - Deutsch (DE)

**ID:** TE-90-TC-10-DE  
**Title:** Complete Group Plan purchase in German and verify localized emails  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- Language: Deutsch (DE)
- User: New guest
- Email: testuser_de@test.com (or unique email)
- Region: Europe
- Test payment card: 4111 1111 1111 1111

**Steps:**
1. Navigate to VRS homepage
2. Click language selector and select Deutsch (German)
3. Click "Apply and close" button
4. Verify homepage displays in German (Deutsch)
5. Navigate to a destination offering Group Plans
6. Verify destination page displays in German (all text, buttons, headings)
7. Click "See Group plans" button (or German equivalent)
8. Select a Group Plan and click "Add to cart" (or German equivalent)
9. Verify "Added to cart" popup displays in German
10. Click "Go to checkout" (or German equivalent)
11. Verify cart page displays in German with all elements translated
12. Click "Continue" button (or German equivalent)
13. Verify checkout page displays in German:
    - Form labels in German
    - Button text in German
14. Fill form:
    - First Name: Test
    - Last Name: User
    - Email: testuser_de@test.com
    - Address: Valid German/Europe address
    - Country: Select from dropdown (in German)
15. Check "I agree to terms" checkbox (in German)
16. Click "Continue to payment" button (in German)
17. Verify Email Verification modal displays in German
18. Enter OTP: "000000"
19. Verify payment page loads in German
20. Fill payment details:
    - Card: 4111 1111 1111 1111
    - Expiry: 12/27
    - CVC: 123
21. Click "Pay" button (in German)
22. Verify order completion page displays in German:
    - "Thank you for your order!" (or German equivalent) heading
    - 3-step setup guide in German
23. Verify **Order Confirmation Email** received at testuser_de@test.com:
    - Subject and body in German
    - Order number, plan details, prices in German
    - Setup instructions in German
24. Verify **Invoice & Agreement Email** received:
    - Subject and body in German
    - PDF content in German
    - Dates/amounts in German format

**Expected Results:**
- ✅ Complete purchase flow succeeds in German
- ✅ All UI elements in German (no English or mixed languages)
- ✅ Both emails received in German
- ✅ Email content fully localized to German
- ✅ No UI glitches or truncations

---

## Test Case 11: Localization E2E - Français (FR)

**ID:** TE-90-TC-11-FR  
**Title:** Complete Group Plan purchase in French and verify localized emails  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- Language: Français (FR)
- User: New guest
- Email: testuser_fr@test.com (or unique email)
- Region: Europe
- Test payment card: 4111 1111 1111 1111

**Steps:**
Same as TC-09 and TC-10, but with:
- Language selection: Français (French)
- All UI text in French
- Email: testuser_fr@test.com
- Verify all form labels in French
- Verify all page headings in French
- Verify **Order Confirmation Email** in French
- Verify **Invoice & Agreement Email** in French
- All dates/amounts in French format

**Expected Results:**
- ✅ Complete purchase flow succeeds in French
- ✅ All UI elements in French (no English or mixed languages)
- ✅ Both emails received in French
- ✅ Email content fully localized to French
- ✅ No UI glitches or truncations

---

## Test Case 12: Localization E2E - Español (ES)

**ID:** TE-90-TC-12-ES  
**Title:** Complete Group Plan purchase in Spanish and verify localized emails  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- Language: Español (ES)
- User: New guest
- Email: testuser_es@test.com (or unique email)
- Region: Europe
- Test payment card: 4111 1111 1111 1111

**Steps:**
Same as TC-09 and TC-10, but with:
- Language selection: Español (Spanish)
- All UI text in Spanish
- Email: testuser_es@test.com
- Verify all form labels in Spanish
- Verify all page headings in Spanish
- Verify **Order Confirmation Email** in Spanish
- Verify **Invoice & Agreement Email** in Spanish
- All dates/amounts in Spanish format

**Expected Results:**
- ✅ Complete purchase flow succeeds in Spanish
- ✅ All UI elements in Spanish (no English or mixed languages)
- ✅ Both emails received in Spanish
- ✅ Email content fully localized to Spanish
- ✅ No UI glitches or truncations

---

## Test Case 13: Localization E2E - Português (PT)

**ID:** TE-90-TC-13-PT  
**Title:** Complete Group Plan purchase in Portuguese and verify localized emails  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- Language: Português (PT)
- User: New guest
- Email: testuser_pt@test.com (or unique email)
- Region: Europe
- Test payment card: 4111 1111 1111 1111

**Steps:**
Same as TC-09 and TC-10, but with:
- Language selection: Português (Portuguese)
- All UI text in Portuguese
- Email: testuser_pt@test.com
- Verify all form labels in Portuguese
- Verify all page headings in Portuguese
- Verify **Order Confirmation Email** in Portuguese
- Verify **Invoice & Agreement Email** in Portuguese
- All dates/amounts in Portuguese format

**Expected Results:**
- ✅ Complete purchase flow succeeds in Portuguese
- ✅ All UI elements in Portuguese (no English or mixed languages)
- ✅ Both emails received in Portuguese
- ✅ Email content fully localized to Portuguese
- ✅ No UI glitches or truncations

---

## Test Case 14: Localization E2E - Ελληνικά (EL)

**ID:** TE-90-TC-14-EL  
**Title:** Complete Group Plan purchase in Greek and verify localized emails  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- Language: Ελληνικά (Greek - EL)
- User: New guest
- Email: testuser_el@test.com (or unique email)
- Region: Europe
- Test payment card: 4111 1111 1111 1111

**Steps:**
Same as TC-09 and TC-10, but with:
- Language selection: Ελληνικά (Greek)
- All UI text in Greek
- Email: testuser_el@test.com
- Verify all form labels in Greek
- Verify all page headings in Greek
- Verify **Order Confirmation Email** in Greek
- Verify **Invoice & Agreement Email** in Greek
- All dates/amounts in Greek format

**Expected Results:**
- ✅ Complete purchase flow succeeds in Greek
- ✅ All UI elements in Greek (no English or mixed languages)
- ✅ Both emails received in Greek
- ✅ Email content fully localized to Greek
- ✅ No UI glitches or truncations

---

## Summary of Test Coverage

### Core Functionality Tests (TC-01 to TC-08)

| Test Case | Scenario | Device | Region | User Type | Key Feature |
|-----------|----------|--------|--------|-----------|-------------|
| TC-01 | New guest (standard) | Desktop | Europe | New guest | Happy path + Email verification |
| TC-02 | New guest (standard) | Mobile | Europe | New guest | Mobile responsive + Email verification |
| TC-03 | Existing email, welcome back | Desktop | Europe | Existing account | Login integration + Email verification |
| TC-04 | Existing email, welcome back | Mobile | Europe | Existing account | Mobile + login + Email verification |
| TC-05 | Logged-in user | Desktop | Europe | Logged-in | Pre-filled checkout + Email verification |
| TC-06 | Logged-in user | Mobile | Europe | Logged-in | Mobile logged-in + Email verification |
| TC-07 | Multiple items in cart | Desktop | Europe | New guest | Cart logic + Email verification |
| TC-08 | Promo code | Desktop | Europe | New guest | Promotional discount + Email verification |

### Localization E2E Tests (TC-09 to TC-14) - Each language is a separate test case

| Test Case | Language | Device | Region | User Type | Key Feature |
|-----------|----------|--------|--------|-----------|-------------|
| TC-09 | English (EN) | Desktop | Europe | New guest | **Full E2E + Localized emails (EN)** |
| TC-10 | Deutsch (DE) | Desktop | Europe | New guest | **Full E2E + Localized emails (DE)** |
| TC-11 | Français (FR) | Desktop | Europe | New guest | **Full E2E + Localized emails (FR)** |
| TC-12 | Español (ES) | Desktop | Europe | New guest | **Full E2E + Localized emails (ES)** |
| TC-13 | Português (PT) | Desktop | Europe | New guest | **Full E2E + Localized emails (PT)** |
| TC-14 | Ελληνικά (EL) | Desktop | Europe | New guest | **Full E2E + Localized emails (EL)** |

**Total: 14 test cases** (8 core functionality + 6 localization E2E)

---

## Notes for Manual Execution

1. **OTP Magic PIN:** In preprod, all OTPs are "000000"
2. **Payment Gateway:** Payment form is inside nested iframes (3-field tokenization)
3. **Test Data:** 
   - Group Plans available in Europe region
   - Test emails: Use non-existing emails for new guest flows, existing account emails for welcome-back flows
4. **Email Verification:** Different paths for new users (OTP) vs existing users (login)
5. **Group Plan Features to Verify:** Cart and order confirm should display:
   - "Share across up to 5 devices per group plan"
   - "Shared data pool for the group"
   - "Invite members to your plan"
   - "Track usage and top up when needed"
   - Setup guide with app download links
6. **Order Confirmation:** Must include:
   - Step 01: Email with installation details + app download links
   - Step 02: "Setup group plan" button with instructions
   - Step 03: "Invite your group members" instructions
7. **Mobile Considerations:** Verify responsive layout, touch-friendly buttons, accessible forms
8. **Language Selector:** Located in top-right nav (flag icon + language/currency toggle)
   - Opens modal with Language and Currency tabs
   - 6 languages available: EN, DE, FR, ES, PT, EL
   - Changes persist across page navigation
9. **Localization E2E Tests (TC-09 to TC-14):** Separate test case per language
   - **6 independent test cases:** One for each language (EN, DE, FR, ES, PT, EL)
   - **Each test case includes:**
     - Complete flow: Language selection → Cart → Checkout → Payment → Order completion
     - All UI elements verified in target language
     - **Both Order Confirmation and Invoice/Agreement emails verified in target language**
     - Unique test email per language (testuser_en@test.com, testuser_de@test.com, etc.)
   - **Benefits for manual testing:**
     - Can assign each language test to a different tester
     - Independent execution and tracking
     - Clear pass/fail per language
     - Easier to identify which language has issues
   - **Defect coverage per language:** Missing translations, broken layouts, payment issues, email localization problems

---

## Next Steps

1. ✅ **Test case structure finalized** (8 core E2E scenarios + 6 independent localization E2E tests)
2. ✅ **Email verification added** to all test cases (both Order Confirmation + Invoice/Agreement emails in 6 languages)
3. ⏳ **Awaiting:** Your final review and feedback
4. ⏳ **Awaiting:** JIRA ticket reference (TE-90) for linking test cases
5. 📋 **Ready to push to Zephyr** once feedback incorporated and ticket provided
