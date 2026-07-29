# Test Cases — Refund Flow

Derived from `tests/website/Regression/refund/refund.spec.ts`.

---

### TC-01 — Request Refund for Not-Installed eSIM

**Tags:** `@regression` `@P1`

**Objective:** Verify a logged-in user can request a refund for an eSIM that has not yet been installed, and receives a refund confirmation email.

**Preconditions:** Valid account credentials (`ValidLoginDetails`); the account has at least one not-installed eSIM.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the login URL and log in | User is authenticated |
| 2 | Navigate to the My Account tab | My Account page loads |
| 3 | Click the eSIMs tab | My eSIMs page loads |
| 4 | Verify the My eSIMs page has loaded | Page content displayed |
| 5 | Verify a not-installed eSIM is present | At least one not-installed eSIM listed |
| 6 | Click "View details" on the first not-installed eSIM | eSIM details page opens |
| 7 | Verify the eSIM details page has loaded | Page content displayed |
| 8 | Verify the "Request Refund" button is visible | Button displayed |
| 9 | Click "Request Refund" | Refund reason selection appears |
| 10 | Select the refund reason "No longer needed" | Reason selected |
| 11 | Submit the refund request | Request submitted |
| 12 | Verify the refund request was submitted | Confirmation displayed |
| 13 | Verify the refund email was received | Refund confirmation email arrives at the account's address |

---

## Coverage Summary

| # | Test Case | Priority |
|---|-----------|----------|
| TC-01 | Request refund for not-installed eSIM | P1 |

**Total: 1 test case.**
