# QA Action Points — Execution Plan

**Team:** VRS QA  
**Date:** May 2026  
**Total Action Points:** 11

---

## Phase 1 — Foundation (Weeks 1–2)
*Quick wins & zero-cost behavioral changes*

| #  | Action                                              | How                                                                                                  | Standard / Definition of Done                                                       |
|----|-----------------------------------------------------|------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| 08 | Attend all agile ceremonies & refinements           | Add all ceremonies to calendar; QA presence mandatory from next sprint                               | 100% attendance tracked per sprint; flag blockers in retro                          |
| 07 | Follow Test Process with internal review every step | Define a 2-step checklist (author → peer review) before any TC is closed                             | No TC merged/closed without a second QA sign-off; review logged in JIRA comment     |
| 03 | Mark automated TCs on JIRA                          | Add a label/custom field `automated: yes/no` to all existing TCs in backlog                          | 100% of TCs have the field populated before end of Phase 1                          |

---

## Phase 2 — Process Establishment (Weeks 3–6)
*Traceability & reporting baseline*

| #  | Action                                              | How                                                                                                  | Standard / Definition of Done                                                                   |
|----|-----------------------------------------------------|------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| 01 | Regression/Sanity TCs sourced from User Story TCs, no duplication | Audit existing suites; delete duplicate TCs; link regression set to parent User Story TC in JIRA | No standalone Regression TC without a linked User Story TC; duplication rate = 0           |
| 02 | TCs linked to releases, cycles, and iterations in JIRA | Restructure JIRA folders: Release → Sprint → Feature; enforce linking on TC creation             | Every TC in a Test Cycle is linked to a release version and a sprint iteration                  |
| 05 | Send Test Exit Report per sprint & per release      | Create a standard template (pass rate, blocked, automation %, risk); send within 24h of sprint close | Template agreed by Week 3; first report sent at end of first sprint in this phase              |

---

## Phase 3 — Automation Growth (Weeks 7–12)
*Coverage, pipeline, and backlog*

| #  | Action                                              | How                                                                                                  | Standard / Definition of Done                                                                    |
|----|-----------------------------------------------------|------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| 04 | Automation backlog for old stories                  | List all manual TCs with no automation counterpart; estimate effort; groom into sprint backlog        | Backlog exists in JIRA with story points; prioritised by business risk                           |
| 06 | Automation-first for all new stories                | Add "automation scenario drafted" as an AC item in Definition of Ready; QA writes spec at refinement  | No new story reaches Sprint Planning without an automation scenario defined                      |
| 10 | Create CI/CD Pipeline for automation runs           | Set up GitHub Actions / Azure DevOps pipeline; trigger on PR and nightly                             | Pipeline runs on every PR; nightly full regression; results published to Allure/Slack            |
| 09 | Adopt AI process from other teams                   | Schedule a knowledge-transfer session; identify which AI steps apply to your flow                     | At least one AI-assisted step (TC generation, analysis, reporting) piloted within the phase      |

---

## Phase 4 — Continuous Tracking (PI / Quarterly)
*Goals & governance*

| #  | Action                                              | How                                                                                                  | Standard / Definition of Done                                                                    |
|----|-----------------------------------------------------|------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| 11 | Track automation coverage with a PI goal            | Set baseline % from Phase 1 tagging; define target per PI (+15% per PI); review in PI retrospective  | Dashboard visible to all stakeholders; goal defined before PI start; reviewed at PI close        |

---

## Summary Timeline

```
Week 1–2    │  AP08, AP07, AP03   →  Behavioral changes + TC tagging
Week 3–6    │  AP01, AP02, AP05   →  Traceability + reporting
Week 7–12   │  AP04, AP06, AP09, AP10  →  Automation scaling
PI cadence  │  AP11               →  Ongoing measurement & goals
```

---

## Automation Coverage Goals (AP11)

| PI                  | Target                                |
|---------------------|---------------------------------------|
| Current PI baseline | Measure & document existing coverage  |
| PI + 1              | +15% automated                        |
| PI + 2              | +20% automated                        |
| Target state        | ≥ 70% of Regression suite automated   |

---

## Recommended First 3 Steps (Start Monday)

1. **AP03** — Populate the `automated` label on all JIRA TCs → unblocks the AP11 baseline measurement  
2. **AP05** — Agree on the Test Exit Report template with the team → deliver first report at end of this sprint  
3. **AP09** — Block 30 min with the other AI team for a knowledge-transfer session → low effort, high return  

---

## Test Exit Report — Suggested Template

| Field                  | Detail                              |
|------------------------|-------------------------------------|
| Sprint / Release       |                                     |
| Total TCs executed     |                                     |
| Pass rate              |                                     |
| Blocked / Failed       |                                     |
| Automation % this run  |                                     |
| Defects raised         |                                     |
| Risk / Notes           |                                     |
| Sign-off               |                                     |
