# Test Cases — Registration & Login

Derived from `tests/website/Regression/registration & login/registration.spec.ts` and `login.spec.ts`.

---

## registration.spec.ts

### TC-01 — Register a New Account with Valid Details

**Tags:** `@regression` `@P1`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Login/Sign-up page and proceed with Sign Up | Registration form loads |
| 2 | Fill the registration form with a freshly generated alias email | Form accepts all details |
| 3 | Submit the registration form | OTP step is triggered |
| 4 | Verify the OTP email was received | OTP email arrives at the generated address |
| 5 | Enter the OTP | OTP accepted |
| 6 | Verify registration success | Success heading/confirmation displayed |
| 7 | Verify the welcome email was received | Welcome email arrives |

---

### TC-02 — Register with an Already Registered Email Shows Error

**Tags:** `@regression` `@P2`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Sign Up | Registration form loads |
| 2 | Fill the form using an already-registered email | Form accepts input |
| 3 | Submit the registration form | Proceeds to OTP step |
| 4 | Enter the OTP | OTP accepted |
| 5 | Verify the "email already exists" error message | Correct error message displayed |

---

### TC-03 — Register with an Invalid Email Format Shows Validation Error

**Tags:** `@regression` `@P2`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Sign Up | Registration form loads |
| 2 | Fill the form using an invalid email format | Form accepts input |
| 3 | Submit the registration form | Validation triggered |
| 4 | Verify the "invalid email format" error message | Correct error message displayed |

---

### TC-04 — Register with Mismatched Passwords Shows Error

**Tags:** `@regression` `@P2`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Sign Up | Registration form loads |
| 2 | Fill the form with a confirm-password value that doesn't match the password | Form accepts input |
| 3 | Submit the registration form | Validation triggered |
| 4 | Verify the "password mismatch" error message | Correct error message displayed |

---

### TC-05 — Submit Empty Registration Form Shows Required Field Errors

**Tags:** `@regression` `@P2`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Sign Up | Registration form loads |
| 2 | Submit the registration form without filling any fields | Form submission attempted |
| 3 | Verify required-field error messages | All mandatory fields show a required-field error |

---

### TC-06 — State/Province Dropdown Is Visible for USA

**Tags:** `@regression` `@P3`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Sign Up | Registration form loads |
| 2 | Select country "USA" | Country selected |
| 3 | Verify the State/Province dropdown is visible | Dropdown is shown |

---

### TC-07 — State/Province Dropdown Is Visible for Canada

**Tags:** `@regression` `@P3`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Sign Up | Registration form loads |
| 2 | Select the country configured as "country with state" (Canada) | Country selected |
| 3 | Verify the State/Province dropdown is visible | Dropdown is shown |

---

### TC-08 — State/Province Dropdown Is Hidden for Non-US/Canada Country

**Tags:** `@regression` `@P3`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Sign Up | Registration form loads |
| 2 | Select a country configured as "country without state" | Country selected |
| 3 | Verify the State/Province dropdown is hidden | Dropdown is not shown |

---

### TC-09 — "Join with Google" Button Is Visible on Registration Form

**Tags:** `@regression` `@P3`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Sign Up | Registration form loads |
| 2 | Click "Join with Google" | Google sign-up flow is triggered/button behaves correctly |

---

### TC-10 — "Join with Apple" Button Is Visible on Registration Form

**Tags:** `@regression` `@P3`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Sign Up | Registration form loads |
| 2 | Click "Join with Apple" | Apple sign-up flow is triggered/button behaves correctly |

---

### TC-11 — Terms and Conditions Link Opens in New Tab

**Tags:** `@regression` `@P3`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Sign Up | Registration form loads |
| 2 | Click the Terms and Conditions link | A new tab/popup opens and loads |

---

### TC-12 — Privacy Notice Link Opens in New Tab

**Tags:** `@regression` `@P3`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Sign Up | Registration form loads |
| 2 | Click the Privacy Notice link | A new tab/popup opens and loads |

---

### TC-13 — Footer Privacy Policy Link Opens in New Tab

**Tags:** `@regression` `@P3`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Sign Up | Registration form loads |
| 2 | Click the footer Privacy Policy link | A new tab/popup opens and loads |

---

### TC-14 — Footer Cookie Policy Link Opens in New Tab

**Tags:** `@regression` `@P3`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Sign Up | Registration form loads |
| 2 | Click the footer Cookie Policy link | A new tab/popup opens and loads |

---

### TC-15 — Footer Terms and Conditions Link Opens in New Tab

**Tags:** `@regression` `@P3`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Sign Up | Registration form loads |
| 2 | Click the footer Terms and Conditions link | A new tab/popup opens and loads |

---

### TC-16 — Login Link Navigates Back to Login Page

**Tags:** `@regression` `@P3`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Sign Up | Registration form loads |
| 2 | Click the Login link | Navigates back to the Login page |

---

## login.spec.ts

### TC-17 — Login with Valid Credentials

**Tags:** `@regression` `@P1`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the Login/Sign-up page and proceed with Login | Login/Sign-up choice screen loads |
| 2 | Verify redirection to the Login page completes | Vodafone ID login page loads |
| 3 | Fill in valid login details and submit | Login succeeds |
| 4 | Navigate to the My Account tab | My Account page loads, confirming logged-in state |
| 5 | Sign out of the account | User is signed out successfully |

---

### TC-18 — Login with Invalid Credentials

**Tags:** `@regression` `@P2`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Login | Login/Sign-up choice screen loads |
| 2 | Verify redirection to the Login page completes | Vodafone ID login page loads |
| 3 | Fill in invalid login details and submit | Login attempted |
| 4 | Verify the invalid-credentials error message | Correct error message displayed |

---

### TC-19 — Login with Empty Credentials

**Tags:** `@regression` `@P2`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Login | Login/Sign-up choice screen loads |
| 2 | Verify redirection to the Login page completes | Vodafone ID login page loads |
| 3 | Submit the login form with both fields empty | Login attempted |
| 4 | Verify the "email required" error message | Correct error message displayed |

---

### TC-20 — Login with Empty Email

**Tags:** `@regression` `@P2`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Login | Login/Sign-up choice screen loads |
| 2 | Verify redirection to the Login page completes | Vodafone ID login page loads |
| 3 | Submit the login form with email left empty | Login attempted |
| 4 | Verify the "email required" error message | Correct error message displayed |

---

### TC-21 — Login with Empty Password

**Tags:** `@regression` `@P2`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Login | Login/Sign-up choice screen loads |
| 2 | Verify redirection to the Login page completes | Vodafone ID login page loads |
| 3 | Submit the login form with password left empty | Login attempted |
| 4 | Verify the "password required" error message | Correct error message displayed |

---

### TC-22 — Cancel Login Navigates Back to VRS

**Tags:** `@regression` `@P3`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Login | Login/Sign-up choice screen loads |
| 2 | Verify redirection to the Login page completes | Vodafone ID login page loads |
| 3 | Click the Cancel button | Login is cancelled |
| 4 | Verify navigation back to VRS | User lands back on the VRS site |

---

### TC-23 — Forgot Password Link Navigates to Reset Password Page

**Tags:** `@regression` `@P3`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to Login | Login/Sign-up choice screen loads |
| 2 | Verify redirection to the Login page completes | Vodafone ID login page loads |
| 3 | Click the "Forgot password" link | Navigation triggered |
| 4 | Verify navigation to the Forgot Password page | Reset password page loads |

---

## Coverage Summary

| # | Test Case | Spec File | Priority |
|---|-----------|-----------|----------|
| TC-01 | Register a new account with valid details | registration.spec.ts | P1 |
| TC-02 | Register with already registered email shows error | registration.spec.ts | P2 |
| TC-03 | Register with invalid email format shows validation error | registration.spec.ts | P2 |
| TC-04 | Register with mismatched passwords shows error | registration.spec.ts | P2 |
| TC-05 | Submit empty registration form shows required field errors | registration.spec.ts | P2 |
| TC-06 | State/Province dropdown visible for USA | registration.spec.ts | P3 |
| TC-07 | State/Province dropdown visible for Canada | registration.spec.ts | P3 |
| TC-08 | State/Province dropdown hidden for non-US/Canada country | registration.spec.ts | P3 |
| TC-09 | Join with Google button visible | registration.spec.ts | P3 |
| TC-10 | Join with Apple button visible | registration.spec.ts | P3 |
| TC-11 | Terms and Conditions link opens in new tab | registration.spec.ts | P3 |
| TC-12 | Privacy Notice link opens in new tab | registration.spec.ts | P3 |
| TC-13 | Footer Privacy Policy link opens in new tab | registration.spec.ts | P3 |
| TC-14 | Footer Cookie Policy link opens in new tab | registration.spec.ts | P3 |
| TC-15 | Footer Terms and Conditions link opens in new tab | registration.spec.ts | P3 |
| TC-16 | Login link navigates back to login page | registration.spec.ts | P3 |
| TC-17 | Login with valid credentials | login.spec.ts | P1 |
| TC-18 | Login with invalid credentials | login.spec.ts | P2 |
| TC-19 | Login with empty credentials | login.spec.ts | P2 |
| TC-20 | Login with empty email | login.spec.ts | P2 |
| TC-21 | Login with empty password | login.spec.ts | P2 |
| TC-22 | Cancel login navigates back to VRS | login.spec.ts | P3 |
| TC-23 | Forgot password link navigates to reset password page | login.spec.ts | P3 |

**Total: 23 test cases.**
