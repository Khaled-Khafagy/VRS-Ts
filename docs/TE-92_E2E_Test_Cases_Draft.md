# TE-92: Primary User (Admin) View - E2E Test Cases (Group Plan)

## Overview
E2E test cases for Group Plan Primary User (Admin) View covering the complete admin experience: viewing admin dashboard, managing slots, inviting members, managing devices, and managing group members.

**Scope:**
- Desktop & Mobile
- Region: Europe
- User type: Primary User (Admin)
- Operations: Dashboard viewing, member invitation, member management, device management, top-up, refund

---

## Test Case 1: Primary User Admin Dashboard - Initial State (No Members Invited) - Desktop

**ID:** TE-92-TC-01  
**Title:** View admin dashboard when no members have been invited yet - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- User: Primary user (admin) of a Group Plan
- Group Plan: Purchased but no members invited
- Access: Via "Manage plan" CTA on My eSIMs page

**Steps:**
1. Navigate to VRS My eSIMs page (logged in as primary user)
2. Locate Group Plan card with "Manage plan" CTA
3. Click "Manage plan" button
4. Verify admin dashboard loads with correct Sub-view 1 (Set up / Invite)
5. Verify page header displays:
   - Title: "Invite your group"
   - Subtitle: "Add people to start sharing your plan"
6. Verify plan summary card displays:
   - Destination flag + plan name (e.g., "Democratic Republic of the Congo 100GB")
   - Plan type label: "Group plan - 100GB - 30days"
7. Verify devices section displays:
   - Slot counter: "X of 5 devices used - Y available"
   - Avatar row: Filled circle for admin (initials + "You" label), empty circles for unfilled slots (not clickable)
8. Verify "Invite your group" section displays:
   - Section heading: "Invite your group"
   - Subtitle: "Add people to start sharing your plan"
   - Email input field
   - Nickname input field (optional)
   - "Send invite" CTA button
9. Verify "Add another device" row displays:
   - "Add another device" clickable tab
   - Sub-label: "Install eSIM on your second device"
10. Verify "Your eSIMs" accordion section displays:
    - Section heading: "Your eSIMs" with sub-label "Manage eSIMs for your devices"
    - Accordion expandable/collapsible
11. Verify footer CTA:
    - "Back to My eSIMs" link/button navigates back to landing page
12. Verify responsive layout on desktop (no horizontal scroll, proper spacing)

**Expected Results:**
- Admin dashboard loads successfully showing Sub-view 1 (Set up / Invite)
- All UI elements display correctly with proper labels and CTAs
- Page structure follows design specification
- No broken layout or missing elements
- Navigation works as expected

---

## Test Case 2: Primary User Admin Dashboard - Initial State (No Members Invited) - Mobile

**ID:** TE-92-TC-02  
**Title:** View admin dashboard when no members invited - Mobile  
**Preconditions:**
- Browser: Chrome/Safari Mobile
- Device: Mobile (iPhone 12 or Android equivalent)
- User: Primary user (admin) of a Group Plan
- Group Plan: Purchased but no members invited

**Steps:**
1. Navigate to VRS My eSIMs page on mobile (logged in)
2. Locate Group Plan card with "Manage plan" CTA
3. Click "Manage plan" button
4. Verify admin dashboard loads on mobile with responsive layout
5. Verify page header displays properly on mobile
6. Verify plan summary card displays responsively
7. Verify devices section displays with responsive grid
8. Verify invite section displays with full-width input fields
9. Verify "Add another device" tab accessible on mobile
10. Verify "Your eSIMs" accordion displays properly on mobile
11. Verify all buttons/CTAs are touch-friendly sized
12. Verify no horizontal scroll required
13. Verify footer CTA accessible at bottom of page

**Expected Results:**
- Dashboard displays responsively on mobile
- All elements properly stacked vertically
- Touch-friendly interaction areas
- No horizontal scroll
- Navigation works on mobile

---

## Test Case 3: Invite Member via Email - Desktop

**ID:** TE-92-TC-03  
**Title:** Invite a new member to Group Plan via email address - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- User: Primary user (admin)
- Group Plan: Purchased with available slots (not full)
- Email: Valid email address of member to invite (not already invited/enrolled)

**Steps:**
1. Navigate to Group Plan admin dashboard (Sub-view 1)
2. Verify "Invite your group" section visible
3. Click email input field
4. Enter member email address (e.g., member@example.com)
5. (Optional) Enter nickname in nickname field (e.g., "Mike's iPad")
6. Verify "Send invite" button is enabled
7. Click "Send invite" CTA button
8. Verify submission processes and confirmation message displays
9. Verify invitation email sent to member email address containing:
   - Invitation text with plan details
   - Link to accept invitation or accept via shared link
   - Member can access shared data pool details
10. Verify admin dashboard updates after invitation:
    - Page may show loading state
    - Upon completion, verify member appears in group list with "Pending" status
    - Slot counter updates to reflect new pending invitation
11. Verify invite section resets (email/nickname fields cleared)
12. Verify member is now visible in "Your group list" with:
    - Member name/email
    - Avatar/initials
    - Status: "Pending" or "Invited"
    - Option to remove or edit nickname

**Expected Results:**
- Invitation email sent successfully
- Member added to group with "Pending" status
- Slot counter decrements (reserved for invited member)
- Admin dashboard updates to reflect new member
- Group list displays invited member
- Error handling works if email invalid/already invited

---

## Test Case 4: Invite Member via Email - Mobile

**ID:** TE-92-TC-04  
**Title:** Invite a new member to Group Plan via email address - Mobile  
**Preconditions:**
- Browser: Chrome/Safari Mobile
- Device: Mobile
- User: Primary user (admin)
- Group Plan: Purchased with available slots

**Steps:**
1. Navigate to Group Plan admin dashboard on mobile
2. Verify invite section displays with responsive layout
3. Click email input field on mobile
4. Enter member email address
5. Enter optional nickname
6. Verify "Send invite" button is enabled and touch-friendly
7. Click "Send invite" CTA
8. Verify invitation processes and confirmation displays on mobile
9. Verify member appears in group list with "Pending" status
10. Verify responsive layout maintained throughout

**Expected Results:**
- Invitation sent successfully on mobile
- Member added with "Pending" status
- Responsive layout maintained
- All interactions touch-friendly

---

## Test Case 5: Invite Member via Shared Link - Desktop

**ID:** TE-92-TC-05  
**Title:** Invite a member using shared link (copy and share) - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- User: Primary user (admin)
- Group Plan: With available slots

**Steps:**
1. Navigate to Group Plan admin dashboard
2. Verify "Or share a link" section visible in invite section
3. Verify shared link displayed (e.g., vodafonetravel/groupplan/abc123xyz)
4. Click "Copy" button
5. Verify link copied to clipboard (confirmation message shows)
6. Share link with member via external channel (email, SMS, messaging, etc.)
7. Member clicks link and accesses invitation flow
8. Verify member can accept invitation through shared link
9. Upon acceptance, verify dashboard updates:
    - Member appears in group list with status changing from "Pending" to "Accepted"
    - Slot counter reflects active member
10. Verify member's device is now enrolled in Group Plan

**Expected Results:**
- Shared link can be copied
- Link works for member acceptance flow
- Dashboard updates when member accepts via link
- Member's device successfully enrolled

---

## Test Case 6: Add Another Device Modal - Desktop

**ID:** TE-92-TC-06  
**Title:** Add another device to Group Plan - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- User: Primary user (admin)
- Group Plan: Primary user has at least one device, more slots available

**Steps:**
1. Navigate to Group Plan admin dashboard
2. Locate "Add another device" row
3. Click "Add another device" clickable tab/button
4. Verify "Set up your device" modal opens with:
   - Modal title: "Set up your device"
   - Close [X] button (top right)
   - Device naming section
5. Verify initial view shows:
   - Header
   - Device naming input field (placeholder: "e.g. Mike's iPad")
   - Nickname field for admin to identify device in group list
   - "Continue" CTA button
6. Fill in device name (e.g., "My iPad")
7. Click "Continue" CTA button
8. Verify loading state displays:
   - QR generation spinner/loader with message "Preparing your eSIM"
9. Wait for QR code generation to complete
10. Verify QR generation informative message displays:
    - Message: "The QR code will be activated once user installs the eSIM"
    - Instructions to scan QR or enter installation code
    - "Go to Manage plan" button (navigates to My eSIMs detail page for QR code)
    - "Close CTA" (closes screen/modal)
11. Verify QR code displays with:
    - Generated QR code image
    - Instructions for member to scan
12. User can:
    - Scan QR code with new device
    - Or manually enter installation code
13. Upon successful eSIM installation on new device:
    - Verify dashboard updates with new device in devices section
    - New device appears as enrolled in your group list
    - Slot counter updates

**Expected Results:**
- Modal opens and device naming works
- QR code generates successfully
- Loading state displays during generation
- Member can scan QR or enter code manually
- Device successfully added to Group Plan
- Dashboard updates after installation

---

## Test Case 7: Add Another Device Modal - Mobile

**ID:** TE-92-TC-07  
**Title:** Add another device to Group Plan - Mobile  
**Preconditions:**
- Browser: Chrome/Safari Mobile
- Device: Mobile
- User: Primary user (admin)
- Group Plan: With available device slots

**Steps:**
1. Navigate to Group Plan admin dashboard on mobile
2. Click "Add another device" tab on mobile
3. Verify modal opens with responsive layout on mobile
4. Fill device name in input field
5. Click "Continue" button (touch-friendly size)
6. Verify QR code loads on mobile
7. Verify QR code scannable on mobile device
8. Member scans QR code with new device
9. Verify device successfully added after installation
10. Verify dashboard updates on mobile

**Expected Results:**
- Modal displays responsively on mobile
- QR code visible and scannable
- Device successfully added
- All interactions touch-friendly

---

## Test Case 8: Manage Member - Remove Member - Desktop

**ID:** TE-92-TC-08  
**Title:** Remove an invited or accepted member from Group Plan - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- User: Primary user (admin)
- Group Plan: Has at least one invited/accepted member in the group list

**Steps:**
1. Navigate to Group Plan admin dashboard (Sub-view 2 - Manage plan state with members)
2. Verify "Your group list" section visible showing:
    - List of enrolled devices and invited members
    - Each row shows: avatar, name/email, status, and Remove icon
3. Locate member to remove in group list
4. Click Remove icon (trash/delete icon) on member row
5. Verify removal confirmation modal/dialog displays:
    - Warning icon
    - Message: "Do you want to remove [Member name]?"
    - Explanation: "Your eSIM will be removed from the group plan"
    - "Yes, remove" CTA button
    - "Cancel" button
6. Click "Yes, remove" to confirm removal
7. Verify member removal processes
8. Verify confirmation message displays: "Member removed successfully"
9. Verify dashboard updates:
    - Member no longer appears in "Your group list"
    - Slot becomes available again
    - Slot counter updates (Y available increases)
    - Slot visualization updates (empty circle becomes available)
10. Verify member receives notification email:
    - Subject: Group Plan member removal
    - Message: Member has been removed from the group plan
    - Their eSIM is no longer active on the shared plan

**Expected Results:**
- Member removal confirmed via modal
- Member successfully removed from group
- Slot becomes available
- Dashboard updates
- Member receives removal notification email

---

## Test Case 9: Manage Member - Edit Nickname - Desktop

**ID:** TE-92-TC-09  
**Title:** Edit nickname of an enrolled member in Group Plan - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- User: Primary user (admin)
- Group Plan: Has at least one enrolled member

**Steps:**
1. Navigate to Group Plan admin dashboard (Sub-view 2)
2. Verify "Your group list" section displays member rows
3. Hover over or click member row to reveal edit options
4. Click on member name/nickname field to edit
5. Verify edit mode activates (field becomes editable)
6. Clear existing nickname
7. Enter new nickname (e.g., "Sarah's Phone")
8. Click outside field or "Save" button to confirm
9. Verify nickname updates in group list
10. Verify update persists on refresh
11. Verify member's device details also show updated nickname
12. Verify no issues with special characters or long names

**Expected Results:**
- Member nickname can be edited
- Changes save successfully
- Group list updates with new nickname
- Changes persist across sessions

---

## Test Case 10: View Group Data and Usage - Desktop

**ID:** TE-92-TC-10  
**Title:** View Group Plan data and usage information - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- User: Primary user (admin)
- Group Plan: Active with members and data usage

**Steps:**
1. Navigate to Group Plan admin dashboard (Sub-view 2)
2. Verify "Your group data" panel displays:
    - Total data available: "100GB - Expires in 30 days" (or similar)
    - Data usage: "20GB remaining" (or similar)
    - Progress bar showing data consumption
    - Progress bar labels: "0 GB on left, total on right"
3. Verify progress bar visually represents usage percentage
4. Verify color coding if data running low (e.g., yellow/red warning)
5. Verify expiry information clearly displayed
6. Verify top-up button visible if data low: "Top up" CTA button
7. Click "Top up" button (if available)
8. Verify top-up flow initiates or modal opens
9. Verify member invitations do not affect data display
10. Verify data usage updates in real-time or after refresh

**Expected Results:**
- Group data panel displays all required information
- Progress bar accurately reflects usage
- Expiry date clearly shown
- Top-up CTA available when needed
- Data information accurate and current

---

## Test Case 11: View and Manage Devices - Desktop

**ID:** TE-92-TC-11  
**Title:** View all devices in Group Plan and manage device status - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- User: Primary user (admin)
- Group Plan: Multiple devices enrolled

**Steps:**
1. Navigate to Group Plan admin dashboard (Sub-view 2)
2. Verify "Devices" section displays:
    - Slot counter: "X of 5 devices used - Y available"
    - Avatar row showing:
      - Filled circles for enrolled devices
      - Admin's device shows "You" label
      - Empty circles for available slots (not clickable)
3. Verify each enrolled device row in "Your group list" shows:
    - Device avatar/initials
    - Device name (e.g., "Mike's iPad", "Sarah's iPhone")
    - eSIM status (Active, Inactive, Not installed, etc.)
    - Member name (if device belongs to invited member)
    - Remove option for each device
4. Verify "Add another device" CTA visible and clickable when slots available
5. Verify "Add another device" CTA disabled when all slots full with warning: "All slots used. Remove someone to invite another."
6. Click on a device row to view device details (if applicable)
7. Verify device details page shows:
    - Device information
    - eSIM status
    - Installation/activation status
8. Verify device can be managed (activate, deactivate, remove)

**Expected Results:**
- All enrolled devices display correctly
- Slot visualization accurate
- Device management options available
- UI reflects slot capacity correctly

---

## Test Case 12: Slot Limit Enforcement - Desktop

**ID:** TE-92-TC-12  
**Title:** Verify 5-slot limit enforcement for Group Plan - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- User: Primary user (admin)
- Group Plan: All 5 slots filled with members/devices

**Steps:**
1. Navigate to Group Plan admin dashboard
2. Verify all 5 slots occupied:
    - Slot counter shows: "5 of 5 devices used - 0 available"
    - Avatar row shows 5 filled circles, no empty circles
3. Verify "Invite your group" section disabled or shows warning:
    - Email input field disabled
    - "Send invite" button disabled
    - Warning message: "All slots used. Remove someone to invite another."
4. Verify "Add another device" button disabled with warning
5. Verify member removal still available (to free up slots)
6. Attempt to invite new member via link (should show error)
7. Remove one member/device
8. Verify slot becomes available:
    - Slot counter updates: "4 of 5 devices used - 1 available"
    - Avatar row shows 4 filled circles, 1 empty circle
    - Email input re-enabled
    - "Send invite" button re-enabled
    - "Add another device" button re-enabled
9. Verify can now invite new member

**Expected Results:**
- 5-slot limit properly enforced
- UI properly indicates full capacity
- Invite/add device CTAs disabled when full
- CTAs re-enable when slots become available
- Warning messages display correctly

---

## Test Case 13: Manage eSIM Section - View Enrolled Devices - Desktop

**ID:** TE-92-TC-13  
**Title:** Expand and view "Your eSIMs" section showing all eSIMs enrolled in admin's account - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- User: Primary user (admin) with multiple eSIMs
- Group Plan: With enrolled eSIMs

**Steps:**
1. Navigate to Group Plan admin dashboard
2. Locate "Your eSIMs" accordion section at bottom
3. Section heading: "Your eSIMs" with sub-label: "Manage eSIMs for your devices"
4. Click to expand accordion
5. Verify accordion expands showing all eSIMs enrolled on admin's devices:
    - List all eSIMs enrolled in admin's account
    - Each row shows:
      - Device name (e.g., "This device", "My iPad")
      - eSIM status (Active, Inactive, etc.)
      - Available actions (Manage, View details, Activate, etc.)
6. Verify eSIM details include:
    - Current activation status
    - QR code image (can be viewed/shared)
    - Installation code
    - Message: "The following QR code has been emailed to you"
7. Verify can:
    - View QR code for each eSIM
    - Copy installation code
    - Activate/deactivate eSIM
8. Click to collapse accordion
9. Verify accordion collapses and section header only shows

**Expected Results:**
- Accordion expands/collapses correctly
- All enrolled eSIMs display
- eSIM details complete
- QR codes and installation codes available
- Management actions work

---

## Test Case 14: View "Your group list" Section - Desktop

**ID:** TE-92-TC-14  
**Title:** View complete "Your group list" showing all enrolled devices and invited members - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- User: Primary user (admin)
- Group Plan: With multiple enrolled members and devices

**Steps:**
1. Navigate to Group Plan admin dashboard (Sub-view 2 - with members)
2. Verify "Your group list" section displays:
    - Section heading: "Your group list"
    - Description: "Lists all enrolled devices and invited members"
3. Verify list shows all members including:
    - Avatar/initials
    - Name/email/label
    - OS (if feasible) - optional display
    - eSIM status (only for primary user)
    - Invitation status (Pending/Accepted for members)
    - Remove icon for each member/device
4. Verify "You" row (primary user) shows first:
    - Avatar with "You" label
    - Device name
    - No remove action for primary user
5. Verify member rows show:
    - Avatar with initials
    - Member name/email
    - Device name if assigned
    - Status: "Installed", "Pending", "Accepted", "Inactive", etc.
    - Remove icon to remove member
6. Verify device rows show:
    - Avatar with device icon
    - Device name
    - eSIM status (Active, Installed, Not installed)
    - Remove icon
7. Verify actions available:
    - Hover over row to reveal edit/remove options
    - Click remove icon to remove member/device
    - Edit nickname (if applicable)
8. Verify scrolling works if list is long
9. Verify click on member row (if applicable) opens member details

**Expected Results:**
- Complete group list displays all members/devices
- Proper status indicators for each member
- Remove actions available
- List organized logically
- All required information visible

---

## Test Case 15: Top-Up Data Journey - Desktop

**ID:** TE-92-TC-15  
**Title:** Complete top-up data flow for Group Plan - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- User: Primary user (admin)
- Group Plan: Low data or data near expiry

**Steps:**
1. Navigate to Group Plan admin dashboard
2. Verify data panel shows low data status
3. Verify banner displays: "Top up" CTA button
4. Click "Top up" button
5. Verify top-up flow/modal initiates
6. Verify options to purchase additional data:
    - Select data amount (e.g., 5GB, 10GB, 20GB)
    - Select duration extension
    - Show pricing
7. Select desired data package
8. Click "Continue" or "Purchase" CTA
9. Proceed to payment (if applicable)
10. Verify payment processes successfully
11. Verify success message: "Data top-up successful"
12. Verify admin dashboard updates:
    - "Your group data" panel shows new total
    - Expiry date updated if applicable
    - Progress bar resets/updates
13. Verify member receives notification (if applicable):
    - Email about plan data top-up
    - Updated data availability

**Expected Results:**
- Top-up flow works end-to-end
- Data successfully added to plan
- Dashboard updates immediately
- Payment processes correctly
- Notifications sent to members

---

## Test Case 16: Refund Flow - Desktop

**ID:** TE-92-TC-16  
**Title:** Initiate refund request for Group Plan (full plan only) - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- User: Primary user (admin)
- Group Plan: Full plan (not partial/data-only)
- Status: Eligible for refund (within refund window)

**Steps:**
1. Navigate to Group Plan admin dashboard
2. Locate refund option (may be in footer or actions menu)
3. Click "Request Refund" CTA button
4. Verify refund modal/page displays:
    - Title: "Request Refund"
    - Information about refund policy
    - Confirmation that all members will be removed
    - Refund amount to be credited
5. Review refund details:
    - Plan purchased amount
    - Refund amount (may include deductions if applicable)
    - Impact message: "All members will be removed from the group plan"
6. Verify checkbox: "I understand that all members will be removed"
7. Check confirmation checkbox
8. Click "Submit Refund Request" button
9. Verify processing message displays
10. Verify confirmation message: "Refund request submitted successfully"
11. Verify order number/refund reference provided
12. Verify action items:
    - Refund will be credited within X business days
    - All members will be notified
    - Group plan will be deactivated
13. Verify member notifications sent:
    - Each member receives email about plan refund
    - Explanation that group plan is no longer active
14. Verify admin dashboard updates:
    - Group plan no longer displayed in My eSIMs
    - Refund status visible in account/order history

**Expected Results:**
- Refund flow completes successfully
- Confirmation provided
- Members notified of refund
- Plan deactivated
- Refund processed within timeframe

---

## Test Case 17: Admin Dashboard Responsive Layout - Mobile

**ID:** TE-92-TC-17  
**Title:** Admin dashboard displays correctly on mobile with responsive layout - Mobile  
**Preconditions:**
- Browser: Chrome/Safari Mobile
- Device: Mobile (iPhone 12 or Android equivalent)
- User: Primary user (admin)
- Group Plan: With members

**Steps:**
1. Navigate to Group Plan admin dashboard on mobile
2. Verify page loads with responsive mobile layout
3. Verify all sections stack vertically:
    - Page header
    - Plan summary card
    - Devices section
    - Invite section
    - Add another device option
    - Your group list
    - Your eSIMs accordion
    - Footer
4. Verify no horizontal scroll required
5. Verify touch-friendly button and input sizes
6. Verify text readable without zooming
7. Verify images/avatars scale properly
8. Verify modals display correctly on mobile (full screen or proper overlay)
9. Verify input fields expand properly on mobile
10. Verify all CTAs accessible and clickable on mobile

**Expected Results:**
- Dashboard fully responsive on mobile
- No horizontal scroll
- Touch-friendly interface
- All functionality accessible on mobile

---

## Test Case 18: Access Admin Dashboard via Deep Link - Desktop

**ID:** TE-92-TC-18  
**Title:** Access Group Plan admin dashboard via direct link/deep link - Desktop  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- User: Primary user (admin) of specific Group Plan
- Deep link: Direct URL to Group Plan admin page

**Steps:**
1. Have direct deep link to Group Plan admin dashboard (e.g., /my-esims/group-plan/[planID]/manage)
2. User is already logged in
3. Paste/navigate to deep link in browser
4. Verify dashboard loads directly without navigation through My eSIMs
5. Verify correct Group Plan loads
6. Verify all dashboard content displays correctly
7. Verify page history allows back navigation to My eSIMs
8. Test with multiple Group Plans (if applicable)
9. Verify deep link works with bookmarks

**Expected Results:**
- Deep link loads dashboard directly
- Correct plan displayed
- No errors or missing content
- Navigation works properly

---

## Summary of Test Coverage

| Test Case | Scenario | Device | Focus |
|-----------|----------|--------|-------|
| TC-01 | Admin dashboard initial state (no members) | Desktop | Dashboard viewing |
| TC-02 | Admin dashboard initial state (no members) | Mobile | Mobile responsive |
| TC-03 | Invite member via email | Desktop | Member invitation |
| TC-04 | Invite member via email | Mobile | Mobile invitation |
| TC-05 | Invite member via shared link | Desktop | Shared link flow |
| TC-06 | Add another device modal | Desktop | Device management |
| TC-07 | Add another device modal | Mobile | Mobile device add |
| TC-08 | Remove member from group | Desktop | Member removal |
| TC-09 | Edit member nickname | Desktop | Member management |
| TC-10 | View group data and usage | Desktop | Data management |
| TC-11 | View and manage devices | Desktop | Device viewing |
| TC-12 | 5-slot limit enforcement | Desktop | Slot validation |
| TC-13 | Manage eSIM section | Desktop | eSIM management |
| TC-14 | View group list | Desktop | Group list display |
| TC-15 | Top-up data journey | Desktop | Top-up flow |
| TC-16 | Refund flow | Desktop | Refund process |
| TC-17 | Mobile responsive layout | Mobile | Mobile responsiveness |
| TC-18 | Access via deep link | Desktop | Deep linking |

**Total: 18 test cases** covering Primary User (Admin) View functionality

---

## Notes for Manual Execution

1. **Access Point**: Primary users access admin dashboard via "Manage plan" CTA on My eSIMs landing page (Group Plan card)
2. **Sub-views**: Dashboard has 2 distinct sub-views:
   - Sub-view 1 (Set up / Invite): No members invited yet
   - Sub-view 2 (Manage plan): At least one member invited
3. **Slot Limit**: Maximum 5 devices/members per Group Plan
4. **Email Invitations**: Members receive emails with invitation link and option to accept
5. **Shared Link**: Admin can share link for member self-service acceptance
6. **Device Management**: Add additional devices via QR code or installation code
7. **Member Management**: Edit nicknames, remove members, view status
8. **Data Management**: View usage, top-up data, check expiry
9. **Refund**: Full plan only, not partial refunds
10. **Notifications**: Members receive emails for invites, removals, top-ups, refunds

---

## Test Case 19: Localization E2E - English (EN) - Admin Dashboard

**ID:** TE-92-TC-19-EN  
**Title:** Complete admin dashboard experience in English and verify localized UI + emails  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- Language: English (EN)
- User: Primary user (admin)
- Group Plan: Purchased with available slots

**Steps:**
1. Select English (EN) from language selector in top-right nav
2. Click "Apply and close"
3. Verify homepage displays in English
4. Navigate to My eSIMs page (all in English)
5. Click "Manage plan" on Group Plan card
6. Verify admin dashboard loads in English:
   - Page header in English
   - All section headings in English
   - All button labels in English (Invite, Add device, Send invite, etc.)
   - All input placeholders in English
   - Help text and messages in English
7. Invite a member:
   - Fill email and optional nickname
   - Click "Send invite" button (text in English)
8. Verify invitation email sent in English:
   - Subject line in English
   - Email body in English
   - All instructions in English
9. Add another device:
   - Click "Add another device" (text in English)
   - Fill device name
   - Click "Continue" (text in English)
   - Verify QR code generation messages in English
10. Verify all UI elements display in English throughout flow:
    - Modal titles in English
    - Button labels in English
    - Help text in English
    - Confirmation messages in English

**Expected Results:**
- Complete admin flow succeeds in English
- All UI elements in English (no mixed languages)
- Invitation emails sent in English
- Device management workflow in English
- All user-facing text fully localized to English

---

## Test Case 20: Localization E2E - German (DE) - Admin Dashboard

**ID:** TE-92-TC-20-DE  
**Title:** Complete admin dashboard experience in German (Deutsch) and verify localized UI + emails  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- Language: Deutsch (DE)
- User: Primary user (admin)
- Group Plan: Purchased with available slots

**Steps:**
1. Select Deutsch (DE) from language selector
2. Click "Apply and close"
3. Verify all pages display in German
4. Navigate to My eSIMs page (all in German)
5. Click "Manage plan" on Group Plan card
6. Verify admin dashboard loads in German:
   - Page header in German
   - All section headings translated to German
   - All button labels in German (Einladen, Gerät hinzufügen, etc.)
   - All input placeholders in German
   - Help text and messages in German
7. Invite a member:
   - Fill email and nickname
   - Click "Send invite" button (text in German)
8. Verify invitation email sent in German:
   - Subject line in German
   - Email body in German
   - All instructions in German
9. Add another device:
   - Click "Add another device" (text in German)
   - Fill device name
   - Click "Continue" (text in German)
   - Verify QR code messages in German
10. Remove a member:
    - Locate member in group list
    - Click remove icon
    - Verify confirmation modal in German
    - Click "Yes, remove" (text in German)
    - Verify removal confirmation in German
11. Verify all UI elements in German throughout:
    - No English text visible
    - No mixed languages
    - All labels and messages in German

**Expected Results:**
- Complete admin flow succeeds in German
- All UI elements in German (no English or mixed languages)
- Invitation and removal emails in German
- All workflows completed in German
- No UI glitches or truncations

---

## Test Case 21: Localization E2E - French (FR) - Admin Dashboard

**ID:** TE-92-TC-21-FR  
**Title:** Complete admin dashboard experience in French (Français) and verify localized UI + emails  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- Language: Français (FR)
- User: Primary user (admin)
- Group Plan: Purchased with available slots

**Steps:**
1. Select Français (FR) from language selector
2. Click "Apply and close"
3. Verify all pages display in French
4. Navigate to My eSIMs page
5. Click "Manage plan" on Group Plan card
6. Verify admin dashboard loads in French:
   - All headings and labels in French
   - All button text in French
   - All input fields with French placeholders
7. Invite a member via email:
   - Fill email and nickname
   - Send invite (all text in French)
8. Verify invitation email in French
9. Invite another member via shared link:
   - Copy shared link
   - Verify link works
10. Add another device:
    - Complete device naming and setup (all in French)
11. Edit member nickname:
    - Change nickname (all in French)
12. Verify all UI elements in French:
    - No English text visible
    - Modals and dialogs in French
    - Error messages in French
    - Confirmation messages in French

**Expected Results:**
- Complete admin flow in French
- All UI in French
- Emails in French
- All operations successful
- No language mixing

---

## Test Case 22: Localization E2E - Spanish (ES) - Admin Dashboard

**ID:** TE-92-TC-22-ES  
**Title:** Complete admin dashboard experience in Spanish (Español) and verify localized UI + emails  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- Language: Español (ES)
- User: Primary user (admin)
- Group Plan: Purchased with available slots

**Steps:**
1. Select Español (ES) from language selector
2. Click "Apply and close"
3. Verify all pages display in Spanish
4. Navigate to My eSIMs and access admin dashboard
5. Verify dashboard loads in Spanish:
   - All section titles in Spanish
   - All buttons in Spanish
   - All input fields with Spanish placeholders
6. Invite member via email (all in Spanish)
7. Verify invitation email in Spanish
8. Add another device (all in Spanish)
9. Manage members:
   - Edit nickname (all in Spanish)
   - Remove member (all in Spanish)
   - Verify removal confirmation in Spanish
10. View group data and usage (all in Spanish)
11. Verify all UI elements in Spanish:
    - No English text
    - No mixed languages
    - Proper Spanish formatting

**Expected Results:**
- Complete admin flow in Spanish
- All UI in Spanish
- Emails in Spanish
- All operations successful

---

## Test Case 23: Localization E2E - Portuguese (PT) - Admin Dashboard

**ID:** TE-92-TC-23-PT  
**Title:** Complete admin dashboard experience in Portuguese (Português) and verify localized UI + emails  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- Language: Português (PT)
- User: Primary user (admin)
- Group Plan: Purchased with available slots

**Steps:**
1. Select Português (PT) from language selector
2. Click "Apply and close"
3. Verify all pages display in Portuguese
4. Navigate to My eSIMs and access admin dashboard
5. Verify dashboard loads in Portuguese:
   - All section titles in Portuguese
   - All buttons in Portuguese
   - All input fields with Portuguese placeholders
6. Invite member via email (all in Portuguese)
7. Verify invitation email in Portuguese
8. Add another device (all in Portuguese)
9. Manage members (all in Portuguese)
10. View data and usage (all in Portuguese)
11. Verify no English text visible
12. Verify all operations successful in Portuguese

**Expected Results:**
- Complete admin flow in Portuguese
- All UI in Portuguese
- Emails in Portuguese
- All operations successful

---

## Test Case 24: Localization E2E - Greek (EL) - Admin Dashboard

**ID:** TE-92-TC-24-EL  
**Title:** Complete admin dashboard experience in Greek (Ελληνικά) and verify localized UI + emails  
**Preconditions:**
- Browser: Chrome/Firefox (Desktop)
- Device: Desktop
- Language: Ελληνικά (EL)
- User: Primary user (admin)
- Group Plan: Purchased with available slots

**Steps:**
1. Select Ελληνικά (EL) from language selector
2. Click "Apply and close"
3. Verify all pages display in Greek
4. Navigate to My eSIMs and access admin dashboard
5. Verify dashboard loads in Greek:
   - All section titles in Greek
   - All buttons in Greek
   - All input fields with Greek placeholders
6. Invite member via email (all in Greek)
7. Verify invitation email in Greek
8. Add another device (all in Greek)
9. Manage members (all in Greek)
10. View group data (all in Greek)
11. Verify no English text visible
12. Verify all operations successful in Greek

**Expected Results:**
- Complete admin flow in Greek
- All UI in Greek
- Emails in Greek
- All operations successful

---

## Updated Summary of Test Coverage

| Test Case | Scenario | Device | Focus |
|-----------|----------|--------|-------|
| TC-01 | Admin dashboard initial state (no members) | Desktop | Dashboard viewing |
| TC-02 | Admin dashboard initial state (no members) | Mobile | Mobile responsive |
| TC-03 | Invite member via email | Desktop | Member invitation |
| TC-04 | Invite member via email | Mobile | Mobile invitation |
| TC-05 | Invite member via shared link | Desktop | Shared link flow |
| TC-06 | Add another device modal | Desktop | Device management |
| TC-07 | Add another device modal | Mobile | Mobile device add |
| TC-08 | Remove member from group | Desktop | Member removal |
| TC-09 | Edit member nickname | Desktop | Member management |
| TC-10 | View group data and usage | Desktop | Data management |
| TC-11 | View and manage devices | Desktop | Device viewing |
| TC-12 | 5-slot limit enforcement | Desktop | Slot validation |
| TC-13 | Manage eSIM section | Desktop | eSIM management |
| TC-14 | View group list | Desktop | Group list display |
| TC-15 | Top-up data journey | Desktop | Top-up flow |
| TC-16 | Refund flow | Desktop | Refund process |
| TC-17 | Mobile responsive layout | Mobile | Mobile responsiveness |
| TC-18 | Access via deep link | Desktop | Deep linking |
| TC-19 | Full E2E in English (EN) | Desktop | **Localization - EN** |
| TC-20 | Full E2E in German (DE) | Desktop | **Localization - DE** |
| TC-21 | Full E2E in French (FR) | Desktop | **Localization - FR** |
| TC-22 | Full E2E in Spanish (ES) | Desktop | **Localization - ES** |
| TC-23 | Full E2E in Portuguese (PT) | Desktop | **Localization - PT** |
| TC-24 | Full E2E in Greek (EL) | Desktop | **Localization - EL** |

**Total: 24 test cases** (18 core + 6 localization)

---

**Ready for Review**: Please provide feedback on test case structure, completeness, or any missing scenarios before automation.
