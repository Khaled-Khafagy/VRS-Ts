# TE-93 E2E Test Cases: Secondary User (Member) Post-Removal View

Epic: TE-3 (Group Plan Features)  
Feature: TE-93 - Family Plan - My Account | Secondary User (Member) View  
Test Type: End-to-End (E2E)  
Scope: Secondary user complete journey - from invitation acceptance to post-removal view

**Based on:** Stories TE-48, TE-52, TE-466, TE-713 | Figma Designs | Acceptance Criteria

---

## Core E2E Test Cases

### TC-01: Member Invitation Acceptance - Accept Invitation & View Shared Plan (Desktop)
- **Type:** Positive
- **Device:** Desktop
- **Epic Link:** TE-3
- **Parent Feature:** TE-93
- **Related Stories:** TE-48 (Member Invitation Acceptance Page)
- **Steps:**
  1. Primary user invites secondary user to group plan via email
  2. Secondary user clicks invitation link in email
  3. Verify "You've been invited to a Travel together plan" page displays
  4. Verify plan details shown: Plan name, admin info (avatar + name + email)
  5. Verify two CTAs available: "Accept" and "Decline"
  6. Click "Accept" button
  7. Verify confirmation message: "Invitation accepted"
  8. Verify admin avatar and "Invited by" section displays with primary user info
  9. Verify redirect to "My Account" shows shared plan eSIMs
  10. Verify member can see all eSIMs from shared plan
- **Expected Result:**
  - Invitation page renders with clear plan details
  - Accept button successfully processes invitation
  - Success confirmation displayed
  - Member logged in and viewing shared plan eSIMs
  - "Invited by" information shows primary user details

### TC-02: Member Invitation Acceptance - Decline Invitation (Desktop)
- **Type:** Positive
- **Device:** Desktop
- **Epic Link:** TE-3
- **Parent Feature:** TE-93
- **Related Stories:** TE-48
- **Steps:**
  1. Primary user invites secondary user to group plan
  2. Secondary user clicks invitation link
  3. Verify "You've been invited to a Travel together plan" page displays
  4. Click "Decline" button
  5. Verify user is not added to group plan
  6. Verify member cannot access shared eSIMs
  7. Verify no plan data visible in member's account
- **Expected Result:**
  - Decline removes invitation
  - Member not added to group plan
  - Member redirected or shown confirmation
  - No shared plan access granted

### TC-03: Member Installation Flow - Install eSIM on Device (Desktop)
- **Type:** Positive
- **Device:** Desktop
- **Epic Link:** TE-3
- **Parent Feature:** TE-93
- **Related Stories:** TE-52, TE-466
- **Steps:**
  1. Secondary user accepts invitation to group plan
  2. Navigate to My eSIMs page
  3. Verify eSIM shows "Not installed" status badge
  4. Verify "Install on this device" button is enabled and clickable
  5. Click "Install on this device"
  6. Verify installation options displayed:
     - Scan QR Code (with QR code displayed)
     - Manual entry (SM-DP+ Address + Activation Code)
  7. Scan QR code (or enter manual details)
  8. Verify successful installation
  9. Verify eSIM status changes to "Installed"
  10. Verify "Activate your eSIM" button now visible and enabled
- **Expected Result:**
  - Installation page displays correctly with QR code and manual entry options
  - QR code is unique to member's ICCID
  - Installation completes successfully
  - eSIM status badge updates to "Installed"
  - Next step (Activation) becomes available

### TC-04: Member Activation Flow - Activate Installed eSIM (Desktop)
- **Type:** Positive
- **Device:** Desktop
- **Epic Link:** TE-3
- **Parent Feature:** TE-93
- **Related Stories:** TE-52
- **Steps:**
  1. Secondary user has installed eSIM (not activated)
  2. Navigate to My eSIMs page
  3. Verify eSIM shows "Installed" status badge
  4. Verify "Activate your eSIM" button is enabled
  5. Click "Activate your eSIM"
  6. Verify activation flow initiates (UI state changes to "Active")
  7. Verify eSIM status badge changes to "Active"
  8. Verify data plan details now visible:
     - Data allocation (e.g., "100GB")
     - Days remaining
     - Data usage (0 GB initially)
  9. Verify "Invited by" section visible with admin info
  10. Verify "Top-up" button available for active eSIM
- **Expected Result:**
  - Activation completes successfully
  - eSIM status updates to "Active"
  - Data plan details displayed
  - Top-up action becomes available
  - Member can now use mobile data

### TC-05: Member Active eSIM - View My eSIMs with Active Plan (Desktop)
- **Type:** Positive
- **Device:** Desktop
- **Epic Link:** TE-3
- **Parent Feature:** TE-93
- **Related Stories:** TE-52, TE-466
- **Steps:**
  1. Secondary user has active eSIM in group plan
  2. Navigate to My eSIMs page
  3. Verify all active eSIMs displayed with status badges "Active"
  4. Verify each eSIM card shows:
     - Country/region flag or name
     - Status badge: "Active"
     - Data plan: "100GB" (or applicable size)
     - Days remaining: "Expires in 22 days"
     - Data usage: "0 GB used" / "100 GB remaining"
     - Progress bar showing data usage
  5. Verify "See details" button available
  6. Verify "Invited by" section visible with admin avatar + name + email
  7. Verify "Leave this plan" CTA button visible and enabled
  8. Verify "Top-up" action available
- **Expected Result:**
  - All eSIM cards display correctly with accurate data
  - "Invited by" clearly identifies admin
  - Leave plan button accessible
  - Top-up action available for active eSIM

### TC-06: Member Leave Plan - Voluntary Departure (Desktop)
- **Type:** Positive
- **Device:** Desktop
- **Epic Link:** TE-3
- **Parent Feature:** TE-93
- **Related Stories:** TE-713
- **Steps:**
  1. Secondary user has active eSIM(s) in group plan
  2. Navigate to My eSIMs page
  3. Click "Leave this plan" CTA
  4. Verify confirmation dialog displays:
     - Title: "Leave Travel together plan?"
     - Warning message about data access loss
     - Two options: "Leave plan" (red) and "Cancel" (white)
  5. Click "Leave plan" button
  6. Verify API call processes removal
  7. Verify success message: "You have left the Travel together plan"
  8. Verify member eSIMs transitioned to post-removal state
  9. Verify "Leave this plan" button is no longer visible
  10. Verify member can still view eSIM details (read-only)
- **Expected Result:**
  - Confirmation dialog prevents accidental departure
  - Removal processed successfully
  - Success message displayed
  - Member transitioned to post-removal view
  - Historical eSIM data remains accessible

### TC-07: Member Post-Removal - eSIM Not Installed State (Desktop)
- **Type:** Positive
- **Device:** Desktop
- **Epic Link:** TE-3
- **Parent Feature:** TE-93
- **Related Stories:** TE-713
- **Steps:**
  1. Secondary user removed from group plan (primary removed or self-removed)
  2. Secondary user logs in to My Account
  3. Navigate to My eSIMs page
  4. Verify eSIM displays with status badge "Not installed"
  5. Verify "Install on this device" button is DISABLED/GRAYED OUT
  6. Verify no installation actions available
  7. Verify eSIM card in inactive/disabled visual state
  8. Verify "Invited by" section still visible with admin info
  9. Verify data labels visible (for reference): "100GB", "0 GB used", "Expires in..."
  10. Verify "Leave this plan" button is NOT visible (already removed)
  11. Verify "See details" button available (read-only)
- **Expected Result:**
  - Removed member cannot install or reinstall eSIM
  - Read-only access to eSIM information maintained
  - "Invited by" remains visible for member context
  - "Leave plan" CTA not shown (already removed)

### TC-08: Member Post-Removal - eSIM Installed Not Activated (Desktop)
- **Type:** Positive
- **Device:** Desktop
- **Epic Link:** TE-3
- **Parent Feature:** TE-93
- **Related Stories:** TE-713
- **Steps:**
  1. Secondary user has installed (not activated) eSIM before removal
  2. Primary user removes secondary user from group plan
  3. Secondary user logs in to My Account
  4. Navigate to My eSIMs page
  5. Verify eSIM shows "Installed" status badge
  6. Verify "Activate your eSIM" button is DISABLED/GRAYED OUT
  7. Verify no activation action available
  8. Verify ICCID and installation details visible (read-only)
  9. Verify data usage shows "0 GB used" (never activated)
  10. Verify "Invited by" section shows admin info
  11. Verify data labels visible: "100GB", "0 GB remaining", expiry date
- **Expected Result:**
  - Removed member cannot activate eSIM
  - Installation details remain visible for reference
  - Read-only mode enforced
  - "Invited by" context maintained

### TC-09: Member Post-Removal - eSIM Active with Data Usage (Desktop)
- **Type:** Positive
- **Device:** Desktop
- **Epic Link:** TE-3
- **Parent Feature:** TE-93
- **Related Stories:** TE-713
- **Steps:**
  1. Secondary user has active eSIM with data usage before removal
  2. Primary user removes secondary user from group plan
  3. Secondary user logs in to My Account
  4. Navigate to My eSIMs page
  5. Verify eSIM shows "Active" status badge (data remains active until expiry)
  6. Verify data usage displays accurately: e.g., "20 GB used" / "80 GB remaining"
  7. Verify expiry date shows remaining days: e.g., "Expires in 15 days"
  8. Verify data progress bar shows current usage (20/100 filled)
  9. Verify "Top-up" button is DISABLED/UNAVAILABLE
  10. Verify "Invited by" section shows admin info
  11. Verify "See details" button available (read-only access)
  12. Verify "Leave this plan" button NOT visible (already removed)
- **Expected Result:**
  - Removed member can see active eSIM with real-time usage data
  - Top-up action blocked with disabled button
  - Read-only access to all eSIM details
  - Data remains usable until bundle expiry
  - Historical usage data visible

### TC-10: Member Post-Removal - eSIM Details Page (Desktop)
- **Type:** Positive
- **Device:** Desktop
- **Epic Link:** TE-3
- **Parent Feature:** TE-93
- **Related Stories:** TE-713
- **Steps:**
  1. Secondary user removed from group plan
  2. Navigate to My eSIMs page
  3. Click "See details" on removed eSIM
  4. Verify details page loads with full eSIM information:
     - Country/Region name (e.g., "Democratic Republic of the Congo")
     - Status badge: "Active" / "Installed" / "Not installed"
     - Plan name displayed
  5. Verify read-only sections:
     - "Install on this device" section (disabled if not installed)
     - ICCID with copy button (functional)
     - QR Code (for reference only)
     - Manual entry details: SM-DP+ Address + Activation Code (with copy buttons)
  6. Verify "Activate your eSIM" section (if installed but not active) - DISABLED
  7. Verify data usage section:
     - "Your group data" panel showing: total data, expiry, usage, remaining
     - Progress bar showing usage
  8. Verify "Invited by" section with admin avatar, name, email
  9. Verify no Top-up, Refund, or Management buttons available
  10. Verify back button returns to My eSIMs list
- **Expected Result:**
  - Details page displays complete eSIM information
  - All elements in read-only mode
  - Copy functions work for ICCID and activation code
  - "Invited by" clearly shows member context
  - No action buttons available
  - Navigation back functions correctly

### TC-11: Member Post-Removal - Multiple eSIMs Display (Desktop)
- **Type:** Positive
- **Device:** Desktop
- **Epic Link:** TE-3
- **Parent Feature:** TE-93
- **Related Stories:** TE-466, TE-713
- **Steps:**
  1. Secondary user removed from group plan with 3+ eSIMs (multiple countries)
  2. Navigate to My eSIMs page
  3. Verify all removed eSIMs displayed:
     - eSIM 1: "Active" status (with data usage)
     - eSIM 2: "Installed" status (no usage)
     - eSIM 3: "Not installed" status
  4. Verify each eSIM card shows correct status badge
  5. Verify data usage accurate per eSIM
  6. Verify each eSIM shows "Invited by" admin info
  7. Verify all eSIMs in disabled/read-only state
  8. Verify "See details" available for all
  9. Verify no action buttons on any card
  10. Verify sorting/filtering by status works (if applicable)
- **Expected Result:**
  - Multiple eSIMs display with correct statuses
  - Each eSIM shows accurate data and expiry
  - Consistent read-only behavior across all cards
  - Navigation to details page works for all

### TC-12: Member Post-Removal - Mobile Responsive (Mobile)
- **Type:** Positive
- **Device:** Mobile (iOS/Android)
- **Epic Link:** TE-3
- **Parent Feature:** TE-93
- **Related Stories:** TE-713
- **Steps:**
  1. Secondary user removed from group plan
  2. Access My Account on mobile device
  3. Navigate to My eSIMs page
  4. Verify responsive layout displays eSIM cards:
     - Single column layout on mobile
     - All text readable
     - Status badges visible
     - Data usage section visible
  5. Verify eSIM card dimensions appropriate for mobile
  6. Verify "Invited by" section visible on mobile
  7. Tap "See details" to open details page
  8. Verify details page mobile-responsive:
     - Scrollable content
     - ICCID copy button accessible
     - QR code visible and scannable
     - Data usage section scrollable
  9. Verify back button functional
  10. Verify all buttons and links disabled/grayed appropriately
- **Expected Result:**
  - Mobile layout displays correctly and is fully responsive
  - All content readable at mobile resolution
  - Touch targets appropriately sized
  - Navigation smooth and intuitive
  - Disabled state clear on mobile UI

---

## Localization E2E Test Cases (6 Languages)

### TC-13: Member Invitation Acceptance - English (EN) Localization (Desktop)
- **Type:** Positive
- **Device:** Desktop
- **Language:** English (EN)
- **Epic Link:** TE-3
- **Parent Feature:** TE-93
- **Steps:**
  1. Set app language to English (EN)
  2. Primary user invites secondary user to group plan
  3. Secondary user clicks invitation link
  4. Verify all UI text is in English:
     - "You've been invited to a Travel together plan"
     - Plan details section
     - "Accept" and "Decline" buttons
     - Success message: "Invitation accepted"
  5. Accept invitation and navigate to My Account
  6. Verify My eSIMs page in English:
     - "My eSIMs" heading
     - Status badges: "Not installed", "Installed", "Active"
     - "Install on this device", "Activate your eSIM", "See details" buttons
     - Data labels: "Expires in", "GB remaining", "Total data"
     - "Invited by" section
     - "Leave this plan" CTA
  7. Navigate to eSIM details page
  8. Verify all section headings and labels in English
  9. Verify email notifications in English (if sent)
- **Expected Result:**
  - Complete English localization
  - No mixed languages or fallback text
  - All UI elements display correctly in English

### TC-14: Member Complete Journey - German (DE) Localization (Desktop)
- **Type:** Positive
- **Device:** Desktop
- **Language:** German (DE)
- **Epic Link:** TE-3
- **Parent Feature:** TE-93
- **Steps:**
  1. Set app language to German (DE)
  2. Accept invitation to group plan
  3. Navigate through complete member journey:
     - My eSIMs page (verify status labels translated)
     - Installation flow (verify "Install on this device" in German)
     - Activation flow (verify "Activate your eSIM" in German)
     - Active eSIM view (verify data labels: "verbleibende Tage", "GB verwendet")
  4. Leave group plan
  5. Verify post-removal states with German localization:
     - Data labels in German
     - "Invited by" section in German
  6. Verify eSIM details page fully in German
  7. Verify date/time formatting per German locale
  8. Verify email notifications in German
- **Expected Result:**
  - Complete German localization throughout entire journey
  - No English fallback
  - German locale formatting applied correctly

### TC-15: Member Complete Journey - French (FR) Localization (Desktop)
- **Type:** Positive
- **Device:** Desktop
- **Language:** French (FR)
- **Epic Link:** TE-3
- **Parent Feature:** TE-93
- **Steps:**
  1. Set app language to French (FR)
  2. Accept invitation to group plan
  3. Navigate through complete member journey:
     - My eSIMs page (verify all labels in French)
     - Installation and activation flows (French translations)
     - Active eSIM with data usage (French labels)
  4. Leave group plan and verify post-removal French localization
  5. Verify eSIM details page in French
  6. Verify French date/time formatting
  7. Verify email notifications in French
  8. Verify no text truncation or layout issues with French text
- **Expected Result:**
  - Complete French localization
  - Proper French formatting and spacing
  - All email communications in French

### TC-16: Member Complete Journey - Spanish (ES) Localization (Desktop)
- **Type:** Positive
- **Device:** Desktop
- **Language:** Spanish (ES)
- **Epic Link:** TE-3
- **Parent Feature:** TE-93
- **Steps:**
  1. Set app language to Spanish (ES)
  2. Accept invitation and complete member journey:
     - Invitation acceptance in Spanish
     - My eSIMs with Spanish status labels
     - Installation/activation in Spanish
     - Active plan view with Spanish data labels
  3. Leave group plan with Spanish localization
  4. Verify post-removal view fully in Spanish
  5. Verify eSIM details page in Spanish
  6. Verify Spanish date formatting
  7. Verify email notifications in Spanish
- **Expected Result:**
  - Complete Spanish localization
  - Spanish locale formatting applied
  - No English text fallback

### TC-17: Member Complete Journey - Portuguese (PT) Localization (Desktop)
- **Type:** Positive
- **Device:** Desktop
- **Language:** Portuguese (PT)
- **Epic Link:** TE-3
- **Parent Feature:** TE-93
- **Steps:**
  1. Set app language to Portuguese (PT)
  2. Accept invitation and navigate journey:
     - Invitation page in Portuguese
     - My eSIMs page with Portuguese labels
     - Installation and activation flows in Portuguese
     - Active eSIM view with Portuguese data labels
  3. Leave group plan (Portuguese confirmation dialog)
  4. Verify post-removal view in Portuguese
  5. Verify eSIM details page fully in Portuguese
  6. Verify Portuguese date/time formatting
  7. Verify email notifications in Portuguese
- **Expected Result:**
  - Complete Portuguese localization throughout journey
  - Portuguese locale formatting
  - All communications in Portuguese

### TC-18: Member Complete Journey - Greek (EL) Localization (Desktop)
- **Type:** Positive
- **Device:** Desktop
- **Language:** Greek (EL)
- **Epic Link:** TE-3
- **Parent Feature:** TE-93
- **Steps:**
  1. Set app language to Greek (EL)
  2. Accept invitation and complete member journey:
     - Invitation acceptance in Greek
     - My eSIMs with Greek labels and status badges
     - Installation/activation flows in Greek
     - Active plan with Greek data labels
  3. Leave group plan (Greek confirmation dialog)
  4. Verify post-removal view in Greek:
     - All labels and messages in Greek
     - Greek character rendering correct
     - "Invited by" section in Greek
  5. Verify eSIM details page fully in Greek
  6. Verify Greek date formatting
  7. Verify Greek locale applied correctly (right-to-left or left-to-right handling if applicable)
  8. Verify email notifications in Greek
- **Expected Result:**
  - Complete Greek localization
  - Greek characters render correctly
  - Greek locale formatting applied
  - All UI elements properly translated

---

## Summary

- **Total Test Cases:** 18
  - **Invitation & Acceptance:** 2 (TC-01, TC-02)
  - **Installation & Activation:** 2 (TC-03, TC-04)
  - **Active Member States:** 3 (TC-05, TC-11, TC-10)
  - **Leave Plan Workflow:** 1 (TC-06)
  - **Post-Removal States:** 4 (TC-07, TC-08, TC-09, TC-10 Details)
  - **Localization (6 languages):** 6 (TC-13 to TC-18)

- **Core Coverage:**
  - Member invitation acceptance (accept/decline)
  - Installation flow (QR code + manual entry)
  - Activation flow (inactive → active transition)
  - Active eSIM states with data usage
  - Leave plan workflow with confirmation
  - Post-removal eSIM states (not installed, installed, active)
  - eSIM details page access
  - Multiple eSIMs handling
  - Mobile responsive design
  
- **Localization Coverage:** 6 languages (EN, DE, FR, ES, PT, EL)
  - Covers complete member journey per language
  - UI localization verification
  - Email notification localization
  - Locale-specific formatting

- **Devices:** Desktop (primary) + Mobile (responsive testing)
- **Test Cycles:** Will be created per feature: "secondary user member view E2E"
