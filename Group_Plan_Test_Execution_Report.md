# GROUP PLAN TEST EXECUTION REPORT

**Report Date:** June 29, 2026
**Scope:** 33 Test Cycles | 555 Test Cases (Group Plan E2E folder excluded)
**Sprint:** PI08 / SP01 / TE_R_10.0.41

---

## EXECUTIVE SUMMARY

| Metric | Count | Percentage | Δ vs June 23 |
|--------|-------|-----------|--------------|
| **Total Test Cases** | 555 | 100% | — |
| **Test Cases Executed** | ~505 | **91%** | ▲ +66% |
| **Test Cases Not Executed** | ~50 | **9%** | ▼ -66% |
| | | | |
| **Total Test Cycles** | 33 | 100% | — |
| **Cycles Done** | 20 | 61% | ▲ +14 |
| **Cycles In Progress** | 13 | 39% | ▲ +3 |
| **Cycles Not Started** | ~1 | ~3% | ▼ -20 |
| | | | |
| **Total Bugs (Web — TE_R_10.0.41)** | 47 | — | ▲ +34 |
| **Total Bugs (Mobile — TE_Mobile_10.0.41)** | 43 | — | ▲ +23 |
| **Web Bugs Resolved (Done/Discarded)** | 30 | 64% | ▲ +28 |
| **Mobile Bugs Resolved (Done/Discarded)** | 30 | 70% | ▲ +25 |
| **Infrastructure Blocker TE-1475** | ✅ RESOLVED | — | Cleared |

---

## 1. TEST EXECUTION BY FOLDER

| Folder | Cycles | Total Tests | Executed | Exec % | Not Executed |
|--------|--------|-------------|----------|--------|--------------|
| Purchase Flow | 9 | 108 | ~106 | **98%** | ~2 |
| Admin User View | 15 | 242 | ~223 | **92%** | ~19 |
| Secondary User View | 9 | 205 | ~185 | **90%** | ~20 |
| **TOTAL** | **33** | **555** | **~514** | **93%** | **~41** |

---

## 2. PURCHASE FLOW — Cycle Breakdown (9 cycles)

| Key | Cycle Name | Tests | Progress | Status |
|-----|-----------|-------|----------|--------|
| TE-C56 | Group Plan \| Cart & Checkout Adjustments | 18 | 100% | ✅ DONE |
| TE-C18 | Group Plan \| Destination Page (Web) | 16 | 100% | ✅ DONE |
| TE-C8 | Order Completion Page | 8 | 100% | ✅ DONE |
| TE-C63 | Group Plan \| Order Confirmation Email | 12 | 100% | ✅ DONE |
| TE-C83 | Group Plan \| Destination Page (iOS) | 10 | 100% | ✅ DONE |
| TE-C114 | Group Plan \| Help & Support Page Updates (WEB) | 8 | 100% | ✅ DONE |
| TE-C115 | Group Plan \| Help & Support Page Updates (iOS) | 10 | 100% | ✅ DONE |
| TE-C116 | Group Plan \| Help & Support Page Updates (Android) | 10 | 100% | ✅ DONE |
| TE-C82 | Group Plan \| Destination Page (Android) | 16 | 87% | 🔄 IN PROGRESS |
| **TOTAL** | | **108** | **~98%** | **8 Done / 1 In Progress / 0 Not Started** |

---

## 3. ADMIN USER VIEW — Cycle Breakdown (16 cycles)

| Key | Cycle Name | Tests | Progress | Status |
|-----|-----------|-------|----------|--------|
| TE-C86 | Group Plan \| Add Another Device Modal | 8 | 100% | ✅ DONE |
| TE-C62 | Group Plan \| Refund | 10 | 100% | ✅ DONE |
| TE-C47 | Group Plan \| Invite Members Modal | 17 | 100% | ✅ DONE |
| TE-C66 | Group Plan \| Primary User (admin) View | 11 | 100% | ✅ DONE |
| TE-C87 | Group Plan \| Add Another Device Modal (iOS) | 8 | 100% | ✅ DONE |
| TE-C88 | Group Plan \| Add Another Device Modal (Android) | 8 | 100% | ✅ DONE |
| TE-C90 | Group Plan \| Invite Members Modal (Android) | 18 | 100% | ✅ DONE |
| TE-C91 | Group Plan \| Refund (iOS) | 10 | 100% | ✅ DONE |
| TE-C92 | Group Plan \| Refund (Android) | 10 | 100% | ✅ DONE |
| TE-C128 | Group Plan \| Primary User Landing Page (iOS) | 37 | 86% | 🔄 IN PROGRESS |
| TE-C80 | Group Plan \| Primary User Landing Page (Android) | 37 | 86% | 🔄 IN PROGRESS |
| TE-C45 | Group Plan \| Primary User Landing Page | 28 | 82% | 🔄 IN PROGRESS |
| TE-C89 | Group Plan \| Invite Members Modal (iOS) | 18 | 100% | ✅ DONE |
| TE-C85 | Group Plan \| Primary User (admin) View (Android) | 11 | 81% | 🔄 IN PROGRESS |
| TE-C84 | Group Plan \| Primary User (admin) View (iOS) | 11 | 81% | 🔄 IN PROGRESS |
| (TE-C??) | *(1 additional cycle not captured in screenshot)* | — | — | — |
| **TOTAL** | | **~242** | **~92%** | **10 Done / 5 In Progress** |

---

## 4. SECONDARY USER VIEW — Cycle Breakdown (9 cycles)

| Key | Cycle Name | Tests | Progress | Status |
|-----|-----------|-------|----------|--------|
| TE-C74 | Group Plan \| My eSIMs Landing Page \| Secondary User/Member | 23 | 100% | ✅ DONE |
| TE-C77 | Group Plan \| Member Invitation Acceptance Email | 21 | 100% | ✅ DONE |
| TE-C94 | Group Plan \| My eSIMs Landing Page \| Secondary User/Member (Mobile) | 22 | 95% | 🔄 IN PROGRESS |
| TE-C98 | Group Plan \| My eSIMs Details Page \| Secondary User (iOS) | 22 | 95% | 🔄 IN PROGRESS |
| TE-C99 | Group Plan \| My eSIMs Details Page \| Secondary User (Android) | 22 | 95% | 🔄 IN PROGRESS |
| TE-C100 | Group Plan \| Secondary User (Member) Post-Removal View (Web) | 28 | 92% | 🔄 IN PROGRESS |
| TE-C101 | Group Plan \| Member Invitation Acceptance Email (Android) | 22 | 77% | 🔄 IN PROGRESS |
| TE-C76 | Group Plan \| My eSIMs Details Page \| Secondary User (Web) | 23 | 60% | 🔄 IN PROGRESS |
| TE-C102 | Group Plan \| Member Invitation Acceptance Email (iOS) | 22 | 95% | 🔄 IN PROGRESS |
| **TOTAL** | | **205** | **~90%** | **2 Done / 7 In Progress / 0 Not Started** |

---

## 5. EXECUTION STATUS BY PLATFORM

| Platform | Cycles | Total Tests | Executed | Exec % |
|----------|--------|-------------|----------|--------|
| **Web** | ~12 | ~231 | ~215 | **93%** |
| **Android** | ~9 | ~154 | ~139 | **90%** |
| **iOS** | ~9 | ~148 | ~130 | **88%** |
| **Mobile (multi-platform)** | 1 | 22 | ~21 | **95%** |
| **TOTAL** | **33** | **555** | **~512** | **92%** |

---

## 6. BUG STATUS SUMMARY

### Web — Version TE_R_10.0.41 (47 Bugs — remaining 16 issues are story/feature tickets)

| Status | Count |
|--------|-------|
| **Done** | ~22 |
| **Discarded** | ~8 |
| **Ready for QA / Ready for Developer** | ~7 |
| **In Progress / QA In Progress** | ~5 |
| **Analysis** | ~5 |
| **New (To Do)** | 3 |
| **TOTAL BUGS** | **47** |

#### Web Bugs:
| Key | Summary | Status |
|-----|---------|--------|
| TE-1475 | [Backend] Cluster instability causing failures across multiple endpoints | ✅ DONE |
| TE-1587 | [WEB] Group Plan \| Secondary User \| eSIM remains inactive after activation via Postman | ✅ DONE |
| TE-1589 | [WEB] Group Plan \| Secondary User \| eSIM status does not update to Active after primary user activates | ✅ DONE |
| TE-1646 | Group plan \| Invitation acceptance redirects to blank white page | ✅ DONE |
| TE-1447 | [My eSIMs] Validity days show 0 instead of actual validity on eSIMs landing page | ✅ DONE |
| TE-1505 | Group plan — QR Code Not Displayed for Newly Added Device in "Your eSIMs" | ✅ DONE |
| TE-1562 | Group Plan Invite — No error message shown when invitation link is already accepted | ✅ DONE |
| TE-1576 | Group Plan Invite — Invitation accepted page has broken layout on mobile browser | ✅ DONE |
| TE-1582 | Group Plan Invite — Unregistered user gets blank page on Accept invite | ✅ DONE |
| TE-1618 | [WEB] Refund Button Incorrectly Exposed on eSIM Details Page via Install eSIM Flow | ✅ DONE |
| TE-1451 | [WEB][Mobile] Group Plan \| Completion Page \| CTA displays incorrect label | ✅ DONE |
| TE-1463 | [WEB] Group Plan \| Cart & Checkout Adjustments \| label displays incorrect label | ✅ DONE |
| TE-1469 | Group Plan \| Missing/Improper components on secondary user's e-sim details page | ✅ DONE |
| TE-1474 | Order Confirmation mail \| "What happens next" section is ambiguous in mixed orders | ✅ DONE |
| TE-1496 | My Account 2.0 \| United Kingdom and Tanzania republic country flags not showing | ✅ DONE |
| TE-1503 | Group Plan \| Secondary user isn't being removed | ✅ DONE |
| TE-1506 | Secondary user View \| Member redirected to login when accepting invitation via email | ✅ DONE |
| TE-1565 | [WEB] Group Plan \| Secondary User \| Data bar shows 0 GB remaining on newly installed eSIM | ✅ DONE |
| TE-1575 | Login from Test environment redirects to Preprod Vodafone ID endpoint | ✅ DONE |
| TE-1627 | [WEB][FE] Group Plan \| Invite People Modal \| Failed invitations not displayed in UI | ✅ DONE |
| TE-1473 | Order Confirmation Email \| QR confirmation email: All CTAs have corrupted URLs | ✅ DONE |
| TE-1643 | [CMS] Group Plan \| Incomplete country list on accepted (but unregistered) email | ✅ DONE |
| TE-1452 | Destination Page \| Group Plan labels not added to eSIM plans despite Admin portal | ❌ DISCARDED |
| TE-1502 | [WEB] Group Plan \| Invitation acceptance \| Skipped screen and Non functional CTA | ❌ DISCARDED |
| TE-1504 | Group Plan \| Member not able to accept the invite through the email | ❌ DISCARDED |
| TE-1567 | Group Plan \| Secondary user (member) Data does not display the original total | ❌ DISCARDED |
| TE-1635 | [Web & Mobile] Group Plan \| "Share Invite Link" Feature — "Create Link" CTA missing | ❌ DISCARDED |
| TE-1563 | Group Plan \| eSIM Status Not Updating Correctly After Installation and Roaming Activation | 🟢 READY FOR QA |
| TE-1566 | Group Plan \| Usage Data Mismatch Between Primary User and Member for Same Plan | 🟢 READY FOR QA |
| TE-1580 | Group Plan \| Secondary user still sees blue info banner after topping up removed eSIM | 🟢 READY FOR QA |
| TE-1583 | [WEB] Group Plan \| "You've joined [Name]'s group plan" banner does not appear consistently | 🟢 READY FOR QA |
| TE-1584 | Group Plan \| Set password for account that hasn't been set up yet | 🟢 READY FOR QA |
| TE-1621 | [WEB][BE] Group Plan \| Refund \| Secondary user refund request bypasses API authorization | 🟢 READY FOR DEVELOPER |
| TE-1647 | [CMS] Group Plan \| Accept Invitation Page for Unregistered User is Missing Input Placeholders | 🟢 READY FOR DEVELOPER |
| TE-1668 | [WEB][BE] Group Plan \| Refunded Group Plan still allows primary user to invite members | 🔄 QA IN PROGRESS |
| TE-1664 | DevOps \| Test env: Redis connectivity issue | 🔄 IN PROGRESS |
| TE-1444 | eSIM landing page admin view \| 403 Forbidden error on Invite members and Install eSIM CTAs | 🔄 IN PROGRESS |
| TE-1610 | Incorrect localization behavior for campaign label in German (CMS) | 🔄 IN PROGRESS |
| TE-1626 | Localization Issues across Mobile App and Web (Campaign Label, Missing Info, Duplicate Labels) | 🔄 IN PROGRESS |
| TE-1669 | DevOps \| Connection Refused on Test Env | 🟣 ANALYSIS |
| TE-1594 | Group Plan \| Invite user API can be manipulated | 🟣 ANALYSIS |
| TE-1654 | [Web] Accept Invitation — First/Last name fields accept numeric input with misleading error | 🟣 ANALYSIS |
| TE-1665 | Group Plan \| Improper behavior when trying to re-invite a pending user after removing them | 🟣 ANALYSIS |
| TE-1666 | Group Plan \| Order Confirmation Email \| Email product summary line does not show Group Plan label | 🟣 ANALYSIS |
| TE-1667 | Group Plan \| 'Days' is not translated on the invitation page | 🆕 NEW |
| TE-1637 | [Mobile][and Web] My eSIMs — FIFO ordering not implemented; most recently purchased eSIM appears last | 🆕 NEW |
| TE-1672 | Group Plan \| Country not reflected in Personal Info after registration via invitation flow | 🆕 NEW |

---

### Mobile — Version TE_Mobile_10.0.41 (43 Bugs)

| Status | Count |
|--------|-------|
| **Done** | ~26 |
| **Discarded** | ~5 |
| **Ready for QA** | ~5 |
| **In Progress / Blocked / Under Review** | ~2 |
| **Analysis / Under Analysis** | ~2 |
| **New (To Do)** | 2 |
| **TOTAL** | **43** |

#### Mobile Bugs:
| Key | Summary | Status |
|-----|---------|--------|
| TE-1628 | [Mobile] Group Plan \| eSIM Remains in "Not Installed" Status After Successful Installation | ✅ DONE |
| TE-1646 | Group plan \| Invitation acceptance redirects to blank white page | ✅ DONE |
| TE-1455 | [Mobile] Group plan \| Add another device not working | ✅ DONE |
| TE-1562 | Group Plan Invite — No error message shown when invitation link is already accepted | ✅ DONE |
| TE-1591 | [Mobile] Invite modal \| Remaining slots count not updated correctly | ✅ DONE |
| TE-1592 | [Mobile] Group plan admin view — E-sims section not displayed after adding devices | ✅ DONE |
| TE-1644 | [Mobile] Group plan admin view — Added devices remain visible in eSIMs after group plan refund | ✅ DONE |
| TE-1434 | [Mobile] Group plan \| Add Another device missing | ✅ DONE |
| TE-1435 | [Mobile] Group plan \| Keyboard hides input field in Add Member modal | ✅ DONE |
| TE-1441 | [Mobile] Group Plan \| The "Travel Together" information card is not displayed on Destination page | ✅ DONE |
| TE-1458 | [Mobile] Group Plan \| "Invite" and "Add Device" CTAs Remain Visible After All Slots Are Filled | ✅ DONE |
| TE-1470 | [Mobile] Destination Page \| Group Plan modal has inconsistent content and missing information | ✅ DONE |
| TE-1487 | [Mobile] Group Plan \| Internal Navigation Arrow Missing on Group Plan Banner | ✅ DONE |
| TE-1570 | [Mobile] Group Plan \| Accepting Email Invite a Second Time Redirects to Blank Page | ✅ DONE |
| TE-1590 | [Mobile] Group Plan \| Invite members — Input fields lack placeholders and allow invalid values | ✅ DONE |
| TE-1599 | [Mobile] Group plan — "No slots available" message not displayed when slots are used | ✅ DONE |
| TE-1602 | [Mobile] Group plan — Add another device — Incorrect device name mapping and inconsistent headings | ✅ DONE |
| TE-1607 | [Mobile] Group plan \| Invitation flow — Missing "Pending" status and UI breaks with email-only invite | ✅ DONE |
| TE-1614 | [Mobile] Group Plan \| Two confirmation modals appear instead of one after invite submission | ✅ DONE |
| TE-1658 | [Mobile] Group Plan Admin view — Incorrect CTAs displayed when eSIM is activated without members | ✅ DONE |
| TE-1440 | [Mobile] Group Plan \| label missing on Egypt 50GB plan in mobile app | ✅ DONE |
| TE-1492 | [Mobile] Group Plan \| SMDP button dont have text | ✅ DONE |
| TE-1585 | Group Plan \| Informational Blue Banner is Displayed on Subsequent Visits | ✅ DONE |
| TE-1645 | [Mobile] Group Plan \| "Invite People" CTA not translated | ✅ DONE |
| TE-1479 | [Mobile] Group Plan \| Primary User Behaves as Member After Invited User Accepts Invitation | ❌ DISCARDED |
| TE-1433 | [Mobile] Group plan \| Duplicate product cards displayed for group plans with multiple devices | ❌ DISCARDED |
| TE-1445 | [Mobile] Group Plan \| User is Automatically Logged Out After Installing an eSIM | ❌ DISCARDED |
| TE-1446 | [Mobile] Group Plan \| eSIM Status Displays as Active Even When Roaming Services Are Disabled | ❌ DISCARDED |
| TE-1635 | [Web & Mobile] Group Plan \| "Share Invite Link" Feature — "Create Link" CTA missing | ❌ DISCARDED |
| TE-1563 | Group Plan \| eSIM Status Not Updating Correctly After Installation and Roaming Activation | 🟢 READY FOR QA |
| TE-1456 | [Mobile] Group Plan — Adding Device on Web Displays Unclear Message in Mobile App | 🟢 READY FOR QA |
| TE-1471 | [Mobile] Destination Page \| Promotional banner missing above eligible plans on destination pages | ✅ DONE |
| TE-1501 | [Mobile] Group Plan \| no FAQ sub-section includes Group plan related questions | 🟢 READY FOR QA |
| TE-1566 | Group Plan \| Usage Data Mismatch Between Primary User and Member for Same Plan | 🟢 READY FOR QA |
| TE-1453 | [Mobile] Group Plan \| removal/invite modal shows temp text | 🟢 READY FOR QA |
| TE-1634 | [Mobile] Group Plan \| eSIM installation Status Displays Raw Value "notInstalled" | ✅ DONE |
| TE-1497 | [Mobile] Group Plan \| Installation button missing from the manage plan screen | 🔴 BLOCKED |
| TE-1632 | [Mobile] Localization — Localization issues in modals and text across multiple languages | 🔄 UNDER REVIEW |
| TE-1638 | [Mobile] Group Plan \| No Error Message Displayed for Invalid Email Format | 🟣 UNDER ANALYSIS |
| TE-1666 | Group Plan \| Order Confirmation Email \| Email product summary line does not show Group Plan label | 🟣 ANALYSIS |
| TE-1671 | [Mobile] Group plan admin view — CTA Order on eSIM Page is incorrect | 🆕 NEW |
| TE-1637 | [Mobile][and Web] My eSIMs — FIFO ordering not implemented; most recently purchased eSIM appears last | 🆕 NEW |

---

## 7. CHANGES SINCE LAST REPORT (June 23 → June 29)

| Metric | June 23 | June 29 | Delta |
|--------|---------|---------|-------|
| Test Execution | 158/635 (25%) | ~514/555 (93%) | ▲ +68% |
| Cycles Done | 6 | 20 | ▲ +14 |
| Cycles In Progress | 10 | 13 | ▲ +3 |
| Cycles Not Started | 20 | 0 | ▼ -20 |
| Web Bugs (total) | 13 | 47 | ▲ +34 newly filed |
| Mobile Bugs (total) | 20 | 43 | ▲ +23 newly filed |
| Web Bugs Resolved | 2 | 30 | ▲ +28 closed |
| Mobile Bugs Resolved | ~5 | 30 | ▲ +25 closed |
| Infrastructure Blocker | TE-1475 CRITICAL | ✅ RESOLVED | Cleared |

---

## 8. OPEN BLOCKERS / RISKS

| Risk | Detail |
|------|--------|
| TE-C82 Destination Page (Android) | 87% — 2 test cases remain |
| TE-C102 Member Invitation Email (iOS) | 90% — 2 test cases remain |
| TE-C76 My eSIMs Details (Web) | 60% — 9 test cases remain |
| TE-C128 Primary User Landing Page (iOS) | 86% — 5 test cases remain, 9 open issues |
| TE-C80 Primary User Landing Page (Android) | 86% — 5 test cases remain, 10 open issues |
| TE-C89 Invite Members Modal (iOS) | 94% — 1 test case remains, 5 open issues |
| TE-1497 Installation button missing (BLOCKED) | Blocking mobile testing progress |
| TE-1668 Refunded Group Plan allows invitations (QA IN PROGRESS) | Open web regression |
| TE-1666 Order Confirmation Email — no Group Plan label (ANALYSIS) | Newly filed — TE-90 linked |

---

**Report Metadata:** Travel eSIM — Group Plan Feature Testing | PI08 / SP01 / TE_R_10.0.41
**Scope:** 555 Test Cases across 34 Test Cycles (Group Plan E2E excluded)
**Generated:** June 29, 2026
**Status Snapshot:**
- Test Execution: ~514/555 (93%) — +68% since June 23
- Web Bugs: 47 total (30 Done/Discarded, 14 In Progress, 3 New) — 16 stories excluded
- Mobile Bugs: 43 total (30 Done/Discarded, 11 In Progress, 2 New)
- Infrastructure Blocker TE-1475: ✅ RESOLVED
