# Test Cases — TE-1509: Partners page

**Parent:** TE-700 (Partners page) | **Environment:** Test | **Page:** `/ssg/vrs/partners-page`
**Automation:** `tests/features/Partners/partners.spec.ts` (one automated test per case, same TC-xx IDs)
**Sources:** TE-1509 acceptance criteria + Figma "Travel eSIM 2.0 - Web" (node 11174-160013)
**Common preconditions:** Guest user, desktop browser, Test environment reachable.

**Open questions for BA/design:**
- AC lists Mastercard, UEFA, AWIN, Ferryhopper; Figma shows Mastercard, UEFA, Trip.com, Ferryhopper, TAP Airlines.
- Company size options are not listed in the AC; Figma lists five (incl. "1000+ employees").
- Success copy: AC screenshot says "Sent Successfully!", Figma says "Message sent".
- Delivery of the request to Travel.partners@vodafone.com cannot be verified from the UI (manual check).

| ID | Title | Priority | Area |
|----|-------|----------|------|
| TC-01 | Partners page is accessible from the top navigation menu | P1 | Navigation |
| TC-02 | Partners page is accessible from the footer | P1 | Navigation |
| TC-03 | Hero banner shows headline, sub-copy, image and "Partner with us" CTA | P1 | Hero |
| TC-04 | Hero "Partner with us" CTA navigates to the "Become a Partner" section | P1 | Hero |
| TC-05 | Featured Partners section displays the active partners | P1 | Featured Partners |
| TC-06 | Each partner card shows image, name, short description and CTA | P1 | Featured Partners |
| TC-07 | Each partner CTA opens the partner site in a new tab | P1 | Featured Partners |
| TC-08 | "More partners coming soon" is displayed after the last partner | P2 | Featured Partners |
| TC-09 | Stats bar shows three values with labels | P2 | Stats |
| TC-10 | "Why partner with us" shows four value-proposition blocks | P2 | Why partner with us |
| TC-11 | Form shows all fields, all marked mandatory | P1 | Become a Partner form |
| TC-12 | Company size dropdown lists the designed options | P2 | Become a Partner form |
| TC-13 | "Send Message" is disabled on an untouched form | P1 | Become a Partner form |
| TC-14 | "Send Message" stays disabled while any mandatory field is missing | P1 | Become a Partner form |
| TC-15 | "Send Message" stays disabled until the Privacy Policy is accepted | P1 | Become a Partner form |
| TC-16 | "Send Message" is enabled once every field is completed and the Privacy Policy accepted | P1 | Become a Partner form |
| TC-17 | Privacy Policy link points to the Privacy & Cookie Policy | P3 | Become a Partner form |
| TC-18 | Successful submission shows the confirmation and "Send another message" resets the form | P1 | Submission |
| TC-19 | Failed submission shows the error state and "Try again" re-sends the request once back online | P1 | Submission |
| TC-20 | About section shows copy and image below the form | P2 | About |
| TC-21 | About section shows the three-step partnership process | P2 | About |
| TC-22 | FAQ section lists the questions | P2 | FAQ |
| TC-23 | FAQ questions expand and collapse | P2 | FAQ |
| TC-24 | Footer is displayed on the Partners page | P3 | Footer |

---

## TC-01 — Partners page is accessible from the top navigation menu
**Priority:** P1
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open the Home page | Top navigation menu shows a "Partners with us" link |
| 2 | Click "Partners with us" | The Partners page opens (URL contains `partners-page`) and the hero banner is displayed |

## TC-02 — Partners page is accessible from the footer
**Priority:** P1
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open the Home page and scroll to the footer | Footer "Help and Support" column shows a "Partner with us" link |
| 2 | Click "Partner with us" | The Partners page opens and the hero banner is displayed |

## TC-03 — Hero banner shows headline, sub-copy, image and CTA
**Priority:** P1
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open the Partners page | Hero banner is displayed |
| 2 | Check the hero content | Headline ("Let's connect the world together"), sub-copy communicating the partner value proposition, a related background image and a "Partner with us" CTA are all visible |

## TC-04 — Hero CTA navigates to the "Become a Partner" section
**Priority:** P1
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open the Partners page | Hero banner is displayed |
| 2 | Click the hero "Partner with us" CTA | URL ends with `#become-a-partner` and the "Become a Partner" section is scrolled into view |

## TC-05 — Featured Partners section displays the active partners
**Priority:** P1
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open the Partners page and go to "Featured Partners" | Section heading "Featured Partners" is displayed |
| 2 | Check the partner cards | Cards for Mastercard Cash Passport, UEFA Champions league and Ferryhopper are displayed (see open question on AWIN / Trip.com / TAP) |

## TC-06 — Each partner card shows image, name, short description and CTA
**Priority:** P1
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open the Partners page and go to "Featured Partners" | Partner cards are displayed |
| 2 | Inspect every card | Each card shows an image related to the partner, the partner name/header, a short description and a "Find out more" CTA |

## TC-07 — Each partner CTA opens the partner site in a new tab
**Priority:** P1
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open the Partners page and go to "Featured Partners" | Partner cards are displayed |
| 2 | Click "Find out more" on each card in turn | The partner's site opens in a **new tab** (link `target="_blank"`) and the Partners page stays open in the original tab |

## TC-08 — "More partners coming soon" is displayed after the last partner
**Priority:** P2
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open the Partners page and go to "Featured Partners" | Partner cards are displayed |
| 2 | Look after the last partner card | A "More partners coming soon" visual with its sub-copy is displayed after the last card |

## TC-09 — Stats bar shows three values with labels
**Priority:** P2
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open the Partners page and scroll to the stats bar | Stats bar is displayed |
| 2 | Check the stats | Three CMS-driven values (e.g. 206+, 30+, 4+) are shown with the labels "Destinations covered", "Target markets" and "Multilingual support launched" |

## TC-10 — "Why partner with us" shows four value-proposition blocks
**Priority:** P2
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open the Partners page and scroll to "Why partner with us" | Section heading is displayed |
| 2 | Inspect the blocks | Four blocks are shown (Global reach that moves with your customers; A brand built on trust; Seamless integration, effortless experiences; Ready for what's next), each with an icon, a title and supporting copy |

## TC-11 — Form shows all fields, all marked mandatory
**Priority:** P1
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open the Partners page and scroll to "Become a Partner" | Section heading and introduction copy are displayed |
| 2 | Check the form | Fields First name, Last name, Company name, Email address, Company size (dropdown), Type of partnership (text input), Message (textarea), the "I accept Privacy Policy" checkbox, the response-time note and a "Send Message" CTA are displayed |
| 3 | Check every field label | Every field is marked mandatory with an asterisk (*) |

## TC-12 — Company size dropdown lists the designed options
**Priority:** P2
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open the Partners page and scroll to the form | Company size field shows the placeholder "Choose the size of your company" |
| 2 | Open the Company size dropdown | Options are listed: 1 - 10 employees, 11 - 50 employees, 51 - 200 employees, 201 - 1000 employees, 1000+ employees (per Figma) |

## TC-13 — "Send Message" is disabled on an untouched form
**Priority:** P1
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open the Partners page and scroll to the form | Form is empty |
| 2 | Check the "Send Message" CTA | The CTA is disabled |

## TC-14 — "Send Message" stays disabled while any mandatory field is missing
**Priority:** P1
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Fill every field except First name, tick the Privacy Policy checkbox | "Send Message" is disabled |
| 2 | Repeat step 1 leaving out, in turn: Last name, Company name, Email address, Company size, Type of partnership, Message | "Send Message" is disabled in every case |

## TC-15 — "Send Message" stays disabled until the Privacy Policy is accepted
**Priority:** P1
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Fill every field but leave the Privacy Policy checkbox unticked | "Send Message" is disabled |
| 2 | Tick the Privacy Policy checkbox | "Send Message" becomes enabled |

## TC-16 — "Send Message" is enabled once everything is completed
**Priority:** P1
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Fill every field with valid data and tick the Privacy Policy checkbox | "Send Message" is enabled |

## TC-17 — Privacy Policy link points to the Privacy & Cookie Policy
**Priority:** P3
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open the Partners page and scroll to the form | "I accept Privacy Policy" is displayed with a Privacy Policy link |
| 2 | Check the link target | The link points to the Privacy & Cookie Policy page (`/help-support/privacy-and-cookie-policy`) |

## TC-18 — Successful submission shows the confirmation; "Send another message" resets the form
**Priority:** P1 | **Note:** sends a real request to the partners mailbox on the Test environment
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Fill every field with valid data, tick the Privacy Policy checkbox | "Send Message" is enabled |
| 2 | Click "Send Message" | Success state is shown ("Message sent" / "Sent Successfully!") with a "Send another message" button |
| 3 | Click "Send another message" | The form is displayed again with all fields empty, the checkbox unticked and "Send Message" disabled |
| 4 | (Manual) Check the Travel.partners@vodafone.com mailbox | The request is received |

## TC-19 — Failed submission shows the error state; "Try again" re-sends the request
**Priority:** P1 | **Note:** the retry sends a real request to the partners mailbox on the Test environment
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Fill every field with valid data, tick the Privacy Policy checkbox | "Send Message" is enabled |
| 2 | Disable the network, then click "Send Message" | Error state is shown: red X icon, title "Something went wrong", the message "We're sorry, but your message could not be sent at this time. Please make sure your internet connection is stable and try again" and a "Try again" button |
| 3 | Re-enable the network and click "Try again" | The request is re-sent and the success state ("Message sent") is shown |

## TC-20 — About section shows copy and image below the form
**Priority:** P2
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open the Partners page and scroll below the form | "About Vodafone Travel eSIM Partnerships" heading, editorial copy and an accompanying image are displayed |
| 2 | Compare positions | The section is displayed below the form |

## TC-21 — About section shows the three-step partnership process
**Priority:** P2
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Scroll to the end of the About section | A three-step process is displayed as a numbered sequence (01, 02, 03) |
| 2 | Check each step | Every step has a short description |

## TC-22 — FAQ section lists the questions
**Priority:** P2
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Scroll to "Frequently Asked Questions" | Section heading is displayed |
| 2 | Check the questions | The four questions are listed (final copy per Figma): Who can partner with Vodafone Travel eSIM?; What types of partnership opportunities does Vodafone Travel offer?; What are the benefits of partnering with Vodafone Travel?; How do I apply to become a Vodafone Travel partner? |

## TC-23 — FAQ questions expand and collapse
**Priority:** P2
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click a FAQ question | It expands and shows its answer |
| 2 | Click the same question again | It collapses |
| 3 | Repeat for every question | Same behaviour for all questions |

## TC-24 — Footer is displayed on the Partners page
**Priority:** P3
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Scroll to the bottom of the Partners page | The standard site footer is displayed, including the legal links (e.g. Privacy Policy) |
