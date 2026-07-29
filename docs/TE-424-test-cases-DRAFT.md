# Test Cases — TE-424
## [eSIM swap] Regenerate QR code for a customer's eSIM from admin portal

**Ticket:** TE-424 | **Epic:** Care Capabilities
**Type:** Feature | **Priority:** Medium | **Status:** Draft — NOT posted to Zephyr/Jira, pending review
**Labels:** Consumer, PI_BACKLOG
**Scope:** Web only (admin portal) · All 6 locales for the resend email · All views · No SEO · No API

**Description recap:** Admin can regenerate a customer's eSIM QR code from the admin portal (device reset, lost profile, stolen device). Old QR is invalidated immediately, new QR delivered via email (same template as existing "Resend QR Code" email, A13, with copy adjustments per Anna Kontaraki's comment). Regeneration allowed for statuses: Not Installed, Inactive w/ 0 usage, Active w/ 0 usage, Active w/ usage (usage must transfer to new eSIM — either natively via KORE, or via a create-group/add-new/remove-old/terminate-old workaround). Not permitted for Released status. Out of scope: eSIMs already in an existing family/group plan — swap must be blocked with a clear admin-facing error.

**Known open questions (flag before sign-off):**
- KORE native usage-transfer API investigation status/timeline unconfirmed
- Exact copy of the blocked-swap error message (family/group plan case) not yet defined

---

## TC-01 — Admin Can Trigger QR Regeneration from eSIM Detail View

**Objective:** Verify the regenerate action is available and triggers a new QR code

**Preconditions:** Admin logged into admin portal; customer eSIM in an allowed status (e.g. Active with 0 usage)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to the customer's eSIM detail view in the admin portal | eSIM detail view loads with current QR/status info |
| 2 | Trigger the "Regenerate QR code" action | Confirmation prompt (if any) is shown, then regeneration proceeds |
| 3 | Observe the result | A new QR code is generated for the eSIM |

---

## TC-02 — Previous QR Code Is Immediately Invalidated

**Objective:** Verify the old QR code can no longer be used to install the eSIM after regeneration

**Preconditions:** Customer eSIM has an existing valid QR code that has not yet been installed

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Note/save the original QR code or activation code | Original code captured |
| 2 | Trigger QR regeneration from the admin portal | New QR code is generated |
| 3 | Attempt to install the eSIM using the original QR/activation code | Installation fails — old code is rejected/invalid |

---

## TC-03 — New QR Code Is Delivered to the Customer via Email

**Objective:** Verify the customer receives an email with the new QR code after regeneration

**Preconditions:** Admin has triggered a QR regeneration for a customer eSIM

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Trigger QR regeneration for a customer eSIM with a valid email on file | Regeneration completes successfully |
| 2 | Check the customer's inbox | New email is received using the "Resend QR Code" (A13) template with adjusted copy for the swap scenario |
| 3 | Inspect the email content | Subject line, install/activate instructions, and new QR code are present and correct |
| 4 | Scan/use the QR code in the email | eSIM installs successfully using the new QR code |

---

## TC-04 — Regeneration Allowed: "Not Installed" Status

**Objective:** Verify regeneration succeeds for an eSIM in "Not Installed" status

**Preconditions:** Customer eSIM in "Not Installed" status

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to eSIM detail view for a "Not Installed" eSIM | Status is correctly shown as "Not Installed" |
| 2 | Trigger QR regeneration | Regeneration succeeds, new QR generated and emailed |

---

## TC-05 — Regeneration Allowed: "Inactive with 0 Usage" Status

**Objective:** Verify regeneration succeeds for an eSIM in "Inactive" status with zero usage

**Preconditions:** Customer eSIM in "Inactive" status with 0 usage recorded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to eSIM detail view for an "Inactive with 0 usage" eSIM | Status/usage correctly shown |
| 2 | Trigger QR regeneration | Regeneration succeeds, new QR generated and emailed |

---

## TC-06 — Regeneration Allowed: "Active with 0 Usage" Status

**Objective:** Verify regeneration succeeds for an eSIM in "Active" status with zero usage

**Preconditions:** Customer eSIM in "Active" status with 0 usage recorded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to eSIM detail view for an "Active with 0 usage" eSIM | Status/usage correctly shown |
| 2 | Trigger QR regeneration | Regeneration succeeds, new QR generated and emailed |

---

## TC-07 — Regeneration Allowed with Usage Transfer: "Active with Usage" Status

**Objective:** Verify regeneration succeeds for an eSIM with existing usage, and that usage is preserved on the new eSIM

**Preconditions:** Customer eSIM in "Active" status with non-zero recorded usage (e.g. data consumed)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to eSIM detail view for an "Active with usage" eSIM, note current usage (e.g. 3GB used) | Usage value visible and recorded |
| 2 | Trigger QR regeneration | Regeneration succeeds, new QR generated and emailed |
| 3 | Check the new eSIM's usage after swap | Usage matches the original eSIM's usage at time of swap (e.g. still 3GB used, not reset to 0) |
| 4 | Verify the old eSIM is terminated/no longer active | Old eSIM shows as terminated/replaced, cannot be used |

---

## TC-08 — Regeneration Blocked for "Released" Status

**Objective:** Verify the system prevents QR regeneration for eSIMs in Released status

**Preconditions:** Customer eSIM in "Released" (Suspended in KORE) status

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to eSIM detail view for a "Released" status eSIM | Status correctly shown as "Released" |
| 2 | Attempt to trigger QR regeneration | Action is disabled or blocked, with a clear message that regeneration is not supported for this status |

---

## TC-09 — Swap Blocked When eSIM Is Already Part of an Existing Family/Group Plan

**Objective:** Verify the system blocks the swap and surfaces a clear error when the eSIM belongs to an existing family/group plan

**Preconditions:** Customer eSIM is already a member of an existing family/group plan

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to eSIM detail view for an eSIM that is part of an existing family/group plan | eSIM detail view loads |
| 2 | Attempt to trigger QR regeneration | Swap action is blocked before regeneration occurs |
| 3 | Observe the admin-facing message | A clear error message is displayed indicating the eSIM cannot be swapped because it belongs to an existing family/group plan |
| 4 | Verify no new QR was generated and no email was sent | Original QR/eSIM state is unchanged |

---

## TC-10 — Resend QR Email Renders Correctly Across All Supported Languages

**Objective:** Verify the swap QR email (A13 template) is correctly localized

**Preconditions:** Customer account/profile set to each target language; QR regeneration triggered per language

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Trigger QR regeneration for a customer with English as their language | Email received in English, all copy/labels correct, no truncation |
| 2 | Repeat for German | Email received in German, correctly translated, no layout break |
| 3 | Repeat for Portuguese | Email received in Portuguese, correctly translated |
| 4 | Repeat for Spanish | Email received in Spanish, correctly translated |
| 5 | Repeat for French | Email received in French, correctly translated |
| 6 | Repeat for Greek | Email received in Greek, correctly translated, no character encoding issues |

---

## TC-11 — Resend QR Email Renders Correctly Across Views

**Objective:** Verify the swap QR email is responsive across email client viewport sizes

**Preconditions:** QR regeneration triggered, email available for preview/testing across viewports

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | View the email on a desktop-width email client | Layout, QR code, and buttons render correctly, nothing overlapping |
| 2 | View the email on a mobile-width email client | Layout stacks correctly, QR code remains scannable/visible, buttons remain tappable |
| 3 | View the email on a tablet-width email client | Layout renders correctly, no breakage |

---

## TC-12 — Admin Portal Displays Correct QR/Status After Regeneration

**Objective:** Verify the admin portal UI reflects the updated eSIM state after a successful swap

**Preconditions:** QR regeneration has just been triggered for a customer eSIM

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | After regeneration completes, refresh/reload the eSIM detail view | View shows the new eSIM record (or updated QR reference) |
| 2 | Check status/usage fields | Status and usage reflect the new eSIM's state (with usage preserved for the "Active with usage" case) |
| 3 | Check for any audit trail / history entry of the swap action | A record of the regeneration action is visible (admin, timestamp) if the portal supports an audit log |

---

## Open questions before finalizing

- Confirm exact wording of the blocked-swap error message for the family/group plan case
- Confirm whether KORE native usage-transfer API is confirmed/implemented, or if all "Active with usage" testing must go through the group/family-plan workaround path (create group → add new eSIM → remove old → terminate old)
- Confirm whether an audit/history log entry is in scope for this ticket, or out of scope
- Confirm the finalized copy differences between the swap email and the existing "Resend QR Code" (A13) template
