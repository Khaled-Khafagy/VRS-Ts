# Test Cases — TE-1878
## Group Plan Invitation - Social Login (+ Admin-Side Invitation Removal)

**Ticket:** TE-1878 | **Related:** TE-48 (Group Plan - Member Invitation Acceptance Email) | **Epic:** Vodafone Travel Together Plan - Enhancements
**Type:** Feature | **Priority:** High | **Status:** Draft — NOT posted to Zephyr/Jira, pending review
**Labels:** Consumer
**Scope:** Web + iOS + Android · English only · All views (desktop/mobile/tablet) · No SEO · Includes API

**Description recap:** Today, Family Plan invitations are matched to the authenticated user by email address. If a user signs in via a social login provider (e.g. Apple Sign-In) and the provider returns a different email identity (e.g. Apple private relay), the system cannot associate the authenticated account with the invitation and the user is stuck. The fix: track the invitation by its unique token, pass a unique `state` value when redirecting to Vodafone ID, and use the returned state on callback to resolve the original invitation regardless of login method (Email, Apple, Google, etc.).

**Baseline flow (TE-48) these enhancements build on:** Admin sends invite → member receives email → clicks "Accept invite" → system validates invitation status → registered user is asked to log in, non-registered user completes guest checkout/account creation → user lands on My eSIMs with the group plan ready to install.

**Note on this revision:** Cases below are restructured as full end-to-end journeys (one journey = one continuous user path from trigger to final state) rather than single-assertion steps, per review feedback. Only genuinely standalone checks (isolated edge cases, security checks, API contract checks, static content/regression checks) remain as separate atomic cases. Admin-side invitation removal is added as its own section (Section 6) since it wasn't covered in the original draft.

---

## Section 1 — Invitation Setup (Admin Side, Foundational)

### TC-01 — Invitation Email Sent on Admin Invite, Matches TE-48 Template

**Objective:** Verify the invitation email is sent automatically and matches the TE-48 template

**Preconditions:** Admin has an active Travel Together plan

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Admin submits a member's email in the invite flow | Invitation email sent automatically to that address |
| 2 | Open the email | Header (Vodafone logo, "You've been invited to a Travel Together Plan"), main card (Join [Admin]'s plan, destination, 3 benefit rows), Accept invite CTA, Need Help card, app badges, social footer all render per TE-48 |
| 3 | Inspect the URL behind "Accept invite" | URL contains a unique, non-guessable invitation token |
| 4 | Admin sends a second invite to a different member | Second invite has a distinct token from the first |

---

## Section 2 — End-to-End Acceptance Journeys

Each journey below runs the full path from clicking the email link through to the final My eSIMs state. Assertions from the old atomic cases (O_D02 copy, state param presence, ICCID timing, banner text) are now checkpoints *within* each journey rather than separate cases.

### E2E-01 — Registered User, Standard Email/Password Login (Baseline)

**Objective:** Confirm the full baseline path still works end-to-end after the social-login changes

**Preconditions:** User registered under the exact invited email; valid, unexpired invitation

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "Accept invite" in the email | Lands on "Sign up or login to your account" (O_D02); "Sign up" and "Login" buttons both visible with expected sub-copy |
| 2 | Click "Login" | Redirected to Vodafone ID with a unique `state` value tied to the invitation token |
| 3 | Authenticate with the invited email + password | Auth succeeds; redirected back to Vodafone Travel |
| 4 | Observe post-auth screen | "Accept your invitation" screen (O18) shown with correct plan name/destination, data/duration, admin name and email |
| 5 | Click "Accept invitation" | Confirmation: "Your invitation has been accepted. Log in to view your group plan details." |
| 6 | Land on My eSIMs | "You've joined [Admin]'s group plan" banner shown; new plan listed with correct destination/data/duration, "Not installed" badge, "Install eSIM" CTA; ICCID/eSIM entry now present (not before this point) |

---

### E2E-02 — Registered User via Apple Sign-In, Private Relay Email Mismatch (Critical)

**Objective:** Verify the primary bug fix end-to-end — an Apple private relay email that differs from the invited address no longer breaks the flow

**Preconditions:** Valid invitation sent to Address A; user has an existing Vodafone account and an Apple ID that returns a private relay email (Address B ≠ Address A)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "Accept invite" → O_D02 → Login → choose Apple Sign-In | Redirected to Apple auth with a unique `state` value carried through |
| 2 | Complete Apple Sign-In (returns Address B) | Auth succeeds against the existing account |
| 3 | Return to Vodafone Travel | Invitation resolved via `state`, NOT by comparing Address A to Address B; "Accept your invitation" screen shown |
| 4 | Complete acceptance | Confirmation shown, plan associated to the correct existing account |
| 5 | Land on My eSIMs | Group plan visible as "Not installed", installable; pre-existing eSIMs on the account unchanged (no duplication/data loss) |

---

### E2E-03 — Registered User via Google Sign-In, Different Email (Critical)

**Objective:** Verify the same fix end-to-end for Google as the identity provider

**Preconditions:** Valid invitation sent to Address A; existing Vodafone account linked to a Google identity using Address C

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "Accept invite" → O_D02 → choose Google Sign-In | Redirected to Google auth with unique `state` value |
| 2 | Complete sign-in with Address C | Auth succeeds |
| 3 | Return to Vodafone Travel | Invitation correctly associated via `state` despite email mismatch; "Accept your invitation" screen shown |
| 4 | Complete acceptance | Confirmation shown |
| 5 | Land on My eSIMs | Group plan available, listed correctly |

---

### E2E-04 — New User, Sign Up via Apple/Google, Full Profile Completion (Critical)

**Objective:** Verify a brand-new account created through a social provider ties back to the invitation end-to-end, including profile completion

**Preconditions:** No existing Vodafone account for this identity; valid invitation

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "Accept invite" → O_D02 → "Sign up" → choose Apple (or Google) Sign-In | New Vodafone ID account created/linked; `state` value carried through |
| 2 | Return to Vodafone Travel | Redirected to complete profile: first name, last name, country (dropdown, not free text) |
| 3 | Attempt to submit with country unselected | Validation error, form does not submit |
| 4 | Fill all required fields, select a country, click Proceed/Save | Invitation acceptance formally triggered; invitation associated with the new account via token (not blocked by email mismatch); account auto-created and linked to the social identity used |
| 5 | Land on My eSIMs | Group plan visible, shown as installable |

---

### E2E-05 — Already Logged-In User Skips O_D02

**Objective:** Verify a user with an active Vodafone ID session bypasses the auth landing page entirely and still completes the full flow (per Figma: "Authentication screen. Only shown if user is not logged in.")

**Preconditions:** User already logged into Vodafone ID in the browser/app session; valid, unaccepted invitation

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "Accept invite" in the invitation email while already logged in | O_D02 is NOT shown; user lands directly on "Accept your invitation" (O18) with correct plan/admin details |
| 2 | Complete acceptance | Confirmation shown |
| 3 | Land on My eSIMs | Group plan listed correctly |
| 4 (comparison) | Open the same type of invite link as a logged-out user in a separate session | Logged-out user sees O_D02 first — confirms the conditional branch |

---

### E2E-06 — Mobile Web Full Flow

**Objective:** Verify the entire journey (not just isolated screens) works responsively on a mobile browser

**Preconditions:** Valid invite link, mobile Safari/Chrome

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Tap invite link on mobile browser | O_D02 renders correctly at mobile width — buttons stacked, tappable, copy not truncated |
| 2 | Complete login/sign-up + acceptance | Each screen (auth, profile completion if applicable, Accept invitation, confirmation) renders correctly at mobile width, no cutoff |
| 3 | Land on My eSIMs | Banner and plan card render correctly on mobile |

---

### E2E-07 — Native iOS App: Apple Sign-In Full Flow

**Objective:** Verify social login and invitation association work correctly end-to-end inside the native iOS app

**Preconditions:** iOS app installed, valid invitation, Apple ID with private relay email

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open invite link on a device with the app installed | Confirm with PO/design whether this deep-links into the app or opens mobile web — **behavior not specified in ticket, needs confirmation** (see Open Questions) |
| 2 | Complete the invitation flow inside the iOS app | Apple Sign-In uses the native iOS auth sheet |
| 3 | Verify association | State/token association resolves the invitation despite email mismatch |
| 4 | Land on My eSIMs (in-app) | Group plan visible and installable |

---

### E2E-08 — Native Android App: Google Sign-In Full Flow

**Objective:** Verify social login and invitation association work correctly end-to-end inside the native Android app

**Preconditions:** Android app installed, valid invitation, Google account with a different email

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open invite link on a device with the app installed | Confirm with PO/design whether this deep-links into the app or opens mobile web — **behavior not specified in ticket, needs confirmation** (see Open Questions) |
| 2 | Complete the invitation flow inside the Android app | Google Sign-In uses native Android auth |
| 3 | Verify association | State/token association resolves correctly |
| 4 | Land on My eSIMs (in-app) | Group plan visible and installable |

---

## Section 3 — Auth & State-Handling Edge Cases

These remain standalone since each isolates one failure/edge condition rather than a full happy-path journey.

### TC-02 — State Value Round-Trips Correctly Through the Full Redirect

**Preconditions:** Valid invitation

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Initiate login, capture the outbound `state` value | Value recorded |
| 2 | Complete authentication | IdP redirects back with the same `state` value |
| 3 | Compare inbound vs outbound state | Values match; invitation resolved correctly |

---

### TC-03 — Tampered/Invalid State Value on Callback (Security)

**Preconditions:** Ability to intercept/modify the callback request (API/proxy level)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Complete auth, but alter the `state` value before it reaches the callback endpoint | Backend rejects or fails to resolve the invitation |
| 2 | Observe UI | Generic error shown; user is NOT silently associated with an unrelated invitation |

---

### TC-04 — Two Invitations Claimed in Parallel Tabs

**Preconditions:** Two separate valid invitations (different tokens) open in two browser tabs

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Start auth flow for Invitation 1 in Tab 1, then start Invitation 2 in Tab 2 | Each tab carries its own distinct `state` value |
| 2 | Complete auth for Invitation 2 first | Only Invitation 2 is accepted/associated |
| 3 | Return to Tab 1 and complete auth for Invitation 1 | Invitation 1 is correctly and separately associated |

---

### TC-05 — Social Login Cancelled Mid-Flow

**Preconditions:** Valid invitation, on O_D02

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click Login → choose Apple Sign-In → cancel the Apple prompt | User returned to O_D02 |
| 2 | Verify invitation status | Invitation remains valid/unclaimed, can be retried |

---

### TC-06 — Abandon Profile Completion Mid-Way (New User)

**Preconditions:** New user mid-way through profile fields (see E2E-04)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Fill some but not all required fields, navigate away/close tab | Invitation is NOT accepted |
| 2 | Reopen the original email invite link | User must restart the process from the email link |

---

## Section 4 — Invitation Status Validation & Error Handling

### TC-07 — Expired Invitation Token at Entry (O_D02)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the invite link after expiry | User is shown expired/invalid-invitation messaging rather than a functional Sign up/Login page |

---

### TC-08 — Expired Invitation Token at Accept Screen

**Preconditions:** Invitation expires after reaching Accept invitation screen but before completing acceptance

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Let invitation expire mid-flow, then attempt to click Accept invitation | Clear expired-invitation error, not a generic/unrelated error |

---

### TC-09 — Already-Accepted Invitation Clicked Again

**Preconditions:** Invitation already accepted previously

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "Accept invite" in the (old) email again | Error webpage: "You have already accepted the invitation. Please log in to view your plan." |
| 2 | Observe next step | User is prompted to the Login page |

---

### TC-10 — "Not Now" on Accept Invitation Screen

**Preconditions:** On the Accept invitation screen

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "Not now" | Invitation remains pending/unaccepted; no ICCID generated |
| 2 | Reopen the original invite link later | User can resume and complete acceptance |

---

### TC-11 — Generic Error Screen + Retry on Association Failure

**Preconditions:** Ability to force a backend association failure (test/staging env)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Trigger an association failure after successful auth | "Something went wrong" screen: "Your personal information has not been updated, please make sure your internet connection is stable and try again"; "Try again" CTA present |
| 2 | Resolve the underlying issue, click "Try again" | Retries the failed step (auth or association) without forcing a restart from the email link, unless the invitation itself expired |

---

### TC-12 — Network Drop During Social Login Redirect

**Preconditions:** Ability to simulate network loss

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Start Apple/Google sign-in, disable network mid-redirect | No indefinite spinner or unhandled crash |
| 2 | Observe result | Graceful, recoverable error state |

---

### TC-13 — Backend Failure During Invitation-Association Step

**Preconditions:** Ability to simulate BE 5xx on the association endpoint

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Complete auth successfully, force BE 5xx on association call | Generic error page shown |
| 2 | Verify no partial state | User not silently left without an eSIM and without a way to retry |

---

## Section 5 — Post-Acceptance Regression Check

### TC-14 — Existing eSIMs Unaffected by New Group Plan Addition

**Preconditions:** User already has other active/installed eSIMs before accepting the new invite

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Accept new group plan invite (any journey from Section 2) | New plan added |
| 2 | Verify pre-existing eSIMs (e.g. Italy, Spain) | Unchanged, no duplication, correct remaining data/days still shown |

---

## Section 6 — Admin-Side Invitation Removal (NEW)

> **Scope note:** Not covered in the original TE-1878 ticket text — the cases below are drafted from the standard admin-management pattern and TE-48's invite lifecycle. **Flag for PO/design confirmation** before finalizing (see Open Questions): exact admin UI location, whether "remove" means revoke-before-accept only or also removes an already-accepted member from the plan, and whether a removed member's already-installed eSIM is deactivated.

### E2E-09 — Admin Removes a Pending (Unaccepted) Invitation — Full Journey

**Objective:** Verify an admin can cancel a pending invite and that the member-side link is invalidated end-to-end

**Preconditions:** Admin has an active Travel Together plan with at least one pending (unaccepted) invitation

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Admin opens the plan's member/invitation management screen | Pending invitation listed with member email and a Remove/Cancel action |
| 2 | Admin clicks Remove/Cancel on the pending invitation | Confirmation prompt shown (destructive action) |
| 3 | Admin confirms removal | Invitation removed from the admin's pending list immediately; invitation marked invalid server-side |
| 4 | The invited member clicks their (now-removed) original invite link | Clear "invitation no longer valid" messaging shown — not the live O_D02/Accept screens |
| 5 | Verify no residual state | No ICCID or account association created for the removed invitation |

---

### TC-15 — Admin Cancels Own Removal Action

**Preconditions:** Admin viewing the remove confirmation prompt from E2E-09 step 2

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "Cancel" on the removal confirmation | Invitation remains pending, unaffected |
| 2 | Reload the member management screen | Invitation still listed as pending |

---

### E2E-10 — Admin Resends an Invitation After Removal

**Objective:** Verify a fresh invite can be sent to the same member after a previous one was removed, and only the new token is valid

**Preconditions:** A previously removed/expired invitation exists for a member's email (see E2E-09)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Admin sends a new invite to the same member email | New invitation email sent with a new, distinct token |
| 2 | Member clicks the OLD (removed) invite link again | Still shows "invitation no longer valid" |
| 3 | Member clicks the NEW invite link | Valid O_D02/Accept flow proceeds normally (as in Section 2 journeys) |

---

### TC-16 — Admin Removes an Invitation Mid-Acceptance (Race Condition)

**Objective:** Verify a removal that happens while the member is actively completing acceptance doesn't create a partial/corrupted state

**Preconditions:** Member has reached the Accept invitation (O18) screen but not yet clicked "Accept invitation"

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Admin removes the invitation while the member is on O18 | Invitation marked invalid server-side |
| 2 | Member clicks "Accept invitation" | Acceptance is rejected with a clear "invitation no longer valid" error, not a silent success or generic crash |

---

### TC-17 — Already-Accepted Invitation Cannot Be "Removed" the Same Way

**Objective:** Verify the admin UI correctly distinguishes a pending invite (cancellable) from an accepted member (requires a different removal/offboarding action, if supported)

**Preconditions:** Invitation already accepted, member now shown as an active plan participant

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Admin views the member list | Accepted member shown with a different action set than pending invites (e.g. "Remove from plan" instead of "Cancel invitation") — **exact copy/behavior needs PO confirmation** |
| 2 | If a removal action is available, admin uses it | Confirm with PO: does this deactivate the member's installed eSIM, revoke data access, or both? |

---

## Section 7 — Platform & Content Regression

### TC-18 — Responsive Rendering of O_D02 Across Viewports

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Load O_D02 at desktop width | Layout centered, no overlap, buttons full width within card |
| 2 | Load O_D02 at tablet width | Layout adapts, no cutoff |
| 3 | Load O_D02 at mobile width | Buttons stack correctly, remain tappable, copy not truncated |

---

### TC-19 — App Store / Google Play Badges Link Correctly

**Preconditions:** Invitation email open

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Tap the App Store badge | Navigates to the correct iOS App Store listing |
| 2 | Tap the Google Play badge | Navigates to the correct Google Play listing |

---

## Section 8 — API Test Cases

### TC-20 — Invitation Token Uniqueness

**Preconditions:** API/backend access to trigger invites

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Trigger multiple invitations via the invite API | Each invitation record has a unique token, sufficiently random/non-sequential |

---

### TC-21 — State Param Uniqueness Per Auth Attempt

**Preconditions:** Ability to inspect outbound auth redirect requests

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Initiate the auth redirect for the same invitation twice (e.g. retry) | A new, distinct `state` value is generated for each attempt |

---

### TC-22 — Callback Correctly Resolves Invitation From Valid State (Critical)

**Preconditions:** API access to the auth-callback endpoint

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Call the callback endpoint with a valid `state` value | API resolves it to the correct invitation record |
| 2 | Verify response | Correct invitation ID/token returned, ready for association |

---

### TC-23 — Callback With Invalid/Unknown State Value (Critical, Security)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Call the callback endpoint with a garbage/unknown `state` value | API returns a 4xx error |
| 2 | Verify no side effects | No invitation is silently associated with the wrong account |

---

### TC-24 — Callback With Expired State/Token

**Preconditions:** Expired invitation, API access

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Call the callback endpoint with a state tied to an expired invitation | API returns an expired-invitation error |

---

### TC-25 — Association Endpoint Idempotency

**Preconditions:** Valid, resolved invitation ready for association

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Call the association endpoint once with a valid state | Invitation accepted, ICCID/account associated |
| 2 | Call the same endpoint again with the same state | Returns an already-accepted error/response; does not duplicate ICCID or association |

---

### TC-26 — API Accepts Association Despite Email Mismatch (Critical)

**Preconditions:** Invitation sent to Address A; authenticated identity resolves to Address B

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Call the association endpoint with a valid state where the authenticated account's email differs from the invited email | Association succeeds based on state/token match; email mismatch is not a blocking condition |

---

### TC-27 — Concurrent Claim Attempts on Same Invitation (Race Condition)

**Preconditions:** Valid invitation, ability to fire concurrent API calls

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Fire two simultaneous acceptance calls using the same valid state/token | Only one call succeeds |
| 2 | Verify the second call's response | Returns an "already accepted" error, no duplicate ICCID/account association |

---

### TC-28 — Admin Removal Endpoint — Success Path

**Preconditions:** API access, valid pending invitation

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Call the invitation-removal endpoint as the owning admin, with a valid pending invitation ID | 2xx response; invitation status changed to removed/cancelled server-side |
| 2 | Call the (now-removed) invitation's callback/resolve endpoint | Returns an invalid/not-found response, not the original invitation record |

---

### TC-29 — Admin Removal Endpoint — Authorization Check (Security)

**Objective:** Verify only the owning admin (not the invited member, not another admin) can remove an invitation

**Preconditions:** API access, valid pending invitation belonging to Admin A

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Call the removal endpoint authenticated as a different admin (Admin B) or as the invited member | 403/401 returned; invitation remains pending, unaffected |

---

### TC-30 — Admin Removal Endpoint — Already-Accepted Invitation

**Preconditions:** API access, invitation already accepted

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Call the removal endpoint for an already-accepted invitation | Confirm with BE: does this 4xx (removal not applicable to accepted invites), or does it route to a "remove member from plan" flow? **Needs confirmation — no separate accepted-member-removal endpoint documented in TE-1878/TE-48** |

---

## Open questions before finalizing

- **Deep-linking behavior (E2E-07, E2E-08):** Ticket doesn't specify whether tapping the invite link should open the native iOS/Android app (if installed) via deep link, or always route through mobile web. Needs confirmation from PO/design before these cases can be finalized.
- **Password setup step for social-login sign-ups:** TE-48 describes a password-setup step for non-registered users; TE-1878 doesn't clarify whether this step is skipped when the user authenticates via a social provider (since a password may not be needed). Affects E2E-04's exact expected result.
- **Existing-account-with-different-social-identity edge case:** Not covered in TE-1878 — what happens if a user's authenticated social email matches an existing Vodafone account by email, but a *different* social identity was used previously? Worth checking with BE team.
- **Rate limiting / abuse prevention** on the callback and association endpoints isn't mentioned in the ticket — flagging as a potential gap for security review, not included as a formal test case here.
- **Admin-side removal (Section 6, all cases):** Not covered in TE-1878 at all — drafted from the standard invite-lifecycle pattern (TE-48) and needs PO/design/BE confirmation on: (1) exact UI location and copy for removing a pending invite, (2) whether "removal" applies to accepted members too and what that does to their installed eSIM/data access (TC-17, TC-30), (3) whether removal is instant or requires a grace period, (4) exact API endpoint/authorization model (TC-28–TC-30 assume a REST endpoint scoped to the owning admin — verify against actual implementation).
