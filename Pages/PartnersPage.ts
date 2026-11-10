import { expect, test, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { PartnerRequestInfo } from './index';
import { AppUrls } from '../data/credentials';

type PartnerFormField = 'firstName' | 'lastName' | 'companyName' | 'email' | 'companySize' | 'partnershipType' | 'message';

export class PartnersPage extends BasePage {
  protected readonly pageName = 'PartnersPage';
  protected readonly sourceFilePath = __filename;

  // The Partners page is CMS-driven and takes ~30s to render on the test environment.
  private static readonly PAGE_LOAD_TIMEOUT = 90000;

  private readonly partnersPageLocators = {
    // Entry points
    lnkHeaderPartners: this.page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: /^Partners? with us$/ }),
    lnkFooterPartners: this.page.getByRole('contentinfo').getByRole('link', { name: 'Partner with us' }),

    // Hero banner
    imgHero: this.page.getByRole('img', { name: 'Partners Page Hero banner background image' }),
    hdgHero: this.page.getByRole('heading', { level: 1, name: 'Let’s connect the world together' }),
    txtHeroSubCopy: this.page.getByText('Join Vodafone Travel eSIM in shaping seamless journeys', { exact: false }).first(),
    lnkHeroPartnerWithUs: this.page.getByRole('main').getByRole('link', { name: 'Partner with us' }),

    // Featured partners — a card is the <region> that holds a "Find out more" link
    hdgFeaturedPartners: this.page.getByRole('heading', { level: 2, name: 'Featured Partners' }),
    cardsPartner: this.page.getByRole('main').getByRole('region').filter({ has: this.page.getByRole('link', { name: 'Find out more' }) }),
    txtMorePartnersComingSoon: this.page.getByText('More partners coming soon'),
    txtMorePartnersSubCopy: this.page.getByText('Our partner network is growing', { exact: false }),

    // Stats bar
    txtStatValues: this.page.getByRole('main').getByText(/^\d+\+$/),

    // Why partner with us
    hdgWhyPartnerWithUs: this.page.getByRole('heading', { name: 'Why partner with us' }),

    // Become a Partner form
    hdgBecomeAPartner: this.page.getByRole('heading', { level: 2, name: 'Become a Partner' }),
    txtBecomeAPartnerSubCopy: this.page.getByText('We’re always looking for organisations', { exact: false }),
    inpCompanySize: this.page.getByRole('textbox', { name: 'Company size' }),
    btnCompanySizeToggle: this.page.getByRole('button', { name: 'Company size' }),
    inpPartnershipType: this.page.getByRole('textbox', { name: 'e.g Affiliate' }),
    inpMessage: this.page.getByRole('textbox', { name: 'Tell us about your partnership inquiry or question...' }),
    chkPrivacyPolicy: this.page.getByRole('checkbox', { name: 'I accept Privacy Policy' }),
    lnkPrivacyPolicy: this.page.getByRole('link', { name: 'I accept Privacy Policy' }),
    txtResponseTime: this.page.getByText('We will address your request within 3-5 days'),
    btnSendMessage: this.page.getByRole('button', { name: 'Send Message' }),

    // Form result states (Figma "success message" / "error message" frames)
    hdgMessageSent: this.page.getByRole('heading', { name: /Message sent|Sent successfully/i }),
    btnSendAnotherMessage: this.page.getByRole('button', { name: /Send another message/i }),
    hdgSomethingWentWrong: this.page.getByRole('heading', { name: /Something went wrong/i }),
    txtErrorMessage: this.page.getByText(/your message could not be sent at this time/i),
    btnTryAgain: this.page.getByRole('button', { name: /Try again/i }),

    // About section
    hdgAbout: this.page.getByRole('heading', { level: 2, name: 'About Vodafone Travel eSIM Partnerships' }),
    txtAboutCopy: this.page.getByText('We believe Travel should bring people closer together', { exact: false }),
    imgAbout: this.page.getByRole('img', { name: 'About Vodafone Travel eSIM Partnerships Image' }),
    hdgStepNumbers: this.page.getByRole('heading', { level: 5, name: /^0[1-3]$/ }),

    // FAQ
    hdgFaq: this.page.getByRole('heading', { name: 'Frequently Asked Questions' }),

    // Dynamic — take a parameter, not wrapped with heal
    // The form labels are <h1>s inside a <label> whose `for` points at a non-existent id, so
    // getByLabel cannot resolve them; walk from the label heading to the input in the sibling wrapper instead.
    inpFieldByLabel: (label: string): Locator =>
      this.page.getByRole('heading', { name: label, exact: true })
        .locator('xpath=ancestor::label/parent::div/following-sibling::div//input'),
    cardPartnerByName: (name: string) =>
      this.page.getByRole('main').getByRole('region')
        .filter({ has: this.page.getByRole('heading', { name, exact: true }) }),
    btnCompanySizeOption: (option: string) => this.page.getByRole('button', { name: option, exact: true }),
    btnFaqQuestion: (question: string) => this.page.getByRole('button', { name: question, exact: true }),
  };

  // ── Navigation ───────────────────────────────────────────────────────────

  async gotoPartnersPage() {
    await test.step('Navigate directly to the Partners page', async () => {
      await this.navigateToUrl(AppUrls.partners);
      await this.waitForPartnersPageLoaded();
    });
  }

  async gotoHomepage(baseUrl: string) {
    await test.step('Navigate to Home Page', async () => {
      await this.navigateToUrl(baseUrl);
    });
  }

  async clickHeaderPartnersLink() {
    await test.step('Click the "Partners with us" link in the top navigation menu', async () => {
      const link = this.partnersPageLocators.lnkHeaderPartners;
      await expect(link).toBeVisible();
      await link.click();
    });
  }

  async clickFooterPartnersLink() {
    await test.step('Click the "Partner with us" link in the footer', async () => {
      const link = this.partnersPageLocators.lnkFooterPartners;
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeVisible();
      await link.click();
    });
  }

  async waitForPartnersPageLoaded() {
    await test.step('Wait for the Partners page to finish loading', async () => {
      await expect(this.page).toHaveURL(/\/partners-page/);
      await expect(this.partnersPageLocators.hdgHero).toBeVisible({ timeout: PartnersPage.PAGE_LOAD_TIMEOUT });
    });
  }

  async verifyHeaderPartnersLinkIsActive() {
    await test.step('Verify the header "Partners with us" link is visible and points to the Partners page', async () => {
      const link = this.partnersPageLocators.lnkHeaderPartners;
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', /partners-page/);
    });
  }

  async verifyFooterPartnersLinkVisible() {
    await test.step('Verify the footer "Partner with us" link is visible and points to the Partners page', async () => {
      const link = this.partnersPageLocators.lnkFooterPartners;
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', /partners-page/);
    });
  }

  // ── Hero banner ──────────────────────────────────────────────────────────

  async verifyHeroBanner() {
    await test.step('Verify hero banner shows headline, sub-copy, image and "Partner with us" CTA', async () => {
      await expect(this.partnersPageLocators.hdgHero).toBeVisible();
      await expect(this.partnersPageLocators.txtHeroSubCopy).toBeVisible();
      await expect(this.partnersPageLocators.imgHero).toBeVisible();
      await expect(this.partnersPageLocators.lnkHeroPartnerWithUs).toBeVisible();
    });
  }

  async clickHeroPartnerWithUsCta() {
    await test.step('Click the hero "Partner with us" CTA', async () => {
      await this.partnersPageLocators.lnkHeroPartnerWithUs.click();
    });
  }

  async verifyBecomeAPartnerSectionInView() {
    await test.step('Verify the page navigated to the "Become a Partner" section', async () => {
      await expect(this.page).toHaveURL(/#become-a-partner/);
      await expect(this.partnersPageLocators.hdgBecomeAPartner).toBeInViewport();
    });
  }

  // ── Featured partners ────────────────────────────────────────────────────

  async verifyFeaturedPartnersHeading() {
    await test.step('Verify the "Featured Partners" section heading', async () => {
      await expect(this.partnersPageLocators.hdgFeaturedPartners).toBeVisible();
    });
  }

  async verifyPartnersDisplayed(partnerNames: string[]) {
    await test.step(`Verify partner cards are displayed: ${partnerNames.join(', ')}`, async () => {
      for (const name of partnerNames) {
        await test.step(`Partner card "${name}" is displayed`, async () => {
          await expect(this.partnersPageLocators.cardPartnerByName(name)).toBeVisible();
        });
      }
    });
  }

  async verifyEachPartnerCardContent() {
    await test.step('Verify every partner card shows an image, name, short description and CTA', async () => {
      const cards = this.partnersPageLocators.cardsPartner;
      await expect(cards.first()).toBeVisible();
      const count = await cards.count();
      expect(count, 'at least one partner card is expected').toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        const name = (await card.getByRole('heading').first().textContent())?.trim() ?? `card #${i + 1}`;
        await test.step(`Partner card "${name}" has image, name, description and CTA`, async () => {
          await expect(card.getByRole('img').first()).toBeVisible();
          await expect(card.getByRole('heading').first()).not.toBeEmpty();
          await expect(card.getByRole('paragraph').first()).not.toBeEmpty();
          await expect(card.getByRole('link', { name: 'Find out more' })).toBeVisible();
        });
      }
    });
  }

  async verifyEachPartnerCtaOpensPartnerSiteInNewTab() {
    await test.step('Verify every partner CTA opens the partner site in a new tab', async () => {
      const cards = this.partnersPageLocators.cardsPartner;
      const count = await cards.count();
      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        const name = (await card.getByRole('heading').first().textContent())?.trim() ?? `card #${i + 1}`;
        await test.step(`"${name}" CTA opens in a new tab`, async () => {
          const cta = card.getByRole('link', { name: 'Find out more' });
          await cta.scrollIntoViewIfNeeded();
          await expect(cta).toHaveAttribute('target', '_blank');
          const [popup] = await Promise.all([
            this.page.context().waitForEvent('page'),
            cta.click(),
          ]);
          // A new tab starts at about:blank — wait for it to commit to the partner URL.
          await expect.poll(() => popup.url(), { message: `"${name}" CTA must open an external partner site` }).toMatch(/^https?:\/\//);
          expect(popup.url()).not.toContain('partners-page');
          await popup.close();
        });
      }
    });
  }

  async verifyMorePartnersComingSoonAfterLastCard() {
    await test.step('Verify "More partners coming soon" is displayed after the last partner card', async () => {
      const more = this.partnersPageLocators.txtMorePartnersComingSoon;
      await more.scrollIntoViewIfNeeded();
      await expect(more).toBeVisible();
      await expect(this.partnersPageLocators.txtMorePartnersSubCopy).toBeVisible();

      const cards = this.partnersPageLocators.cardsPartner;
      const lastCardBox = await cards.last().boundingBox();
      const moreBox = await more.boundingBox();
      expect(lastCardBox && moreBox, 'both elements must be rendered').toBeTruthy();
      // "After" the last card = on a later row, or on the same row to its right.
      const isAfter = moreBox!.y > lastCardBox!.y + lastCardBox!.height - 1 || moreBox!.x > lastCardBox!.x;
      expect(isAfter, '"More partners coming soon" must come after the last partner card').toBe(true);
    });
  }

  // ── Stats bar ────────────────────────────────────────────────────────────

  async verifyStatsBar(expectedLabels: string[]) {
    await test.step('Verify the stats bar shows three CMS-driven values with labels', async () => {
      const values = this.partnersPageLocators.txtStatValues;
      await values.first().scrollIntoViewIfNeeded();
      await expect(values).toHaveCount(expectedLabels.length);
      for (const label of expectedLabels) {
        await expect(this.page.getByRole('main').getByText(label, { exact: true })).toBeVisible();
      }
    });
  }

  // ── Why partner with us ──────────────────────────────────────────────────

  async verifyWhyPartnerWithUsSection(blockTitles: string[]) {
    await test.step('Verify "Why partner with us" shows four value-proposition blocks with icon and copy', async () => {
      await this.partnersPageLocators.hdgWhyPartnerWithUs.scrollIntoViewIfNeeded();
      await expect(this.partnersPageLocators.hdgWhyPartnerWithUs).toBeVisible();
      expect(blockTitles).toHaveLength(4);
      for (const title of blockTitles) {
        await test.step(`Block "${title}" has icon, title and supporting copy`, async () => {
          const block = this.page.getByRole('main').getByRole('region').filter({ has: this.page.getByRole('heading', { name: title, exact: true }) });
          await expect(block).toBeVisible();
          await expect(block.getByRole('img').first()).toBeVisible();
          await expect(block.getByRole('paragraph').first()).not.toBeEmpty();
        });
      }
    });
  }

  // ── Become a Partner form ────────────────────────────────────────────────

  async scrollToBecomeAPartnerForm() {
    await test.step('Scroll to the "Become a Partner" form', async () => {
      await this.partnersPageLocators.hdgBecomeAPartner.scrollIntoViewIfNeeded();
    });
  }

  async verifyBecomeAPartnerFormFields() {
    await test.step('Verify the "Become a Partner" form shows every field, the consent checkbox and the Send CTA', async () => {
      await this.scrollToBecomeAPartnerForm();
      await expect(this.partnersPageLocators.hdgBecomeAPartner).toBeVisible();
      await expect(this.partnersPageLocators.txtBecomeAPartnerSubCopy).toBeVisible();
      for (const label of ['First Name', 'Last name', 'Company name', 'Email address']) {
        await expect(this.partnersPageLocators.inpFieldByLabel(label), `${label} input`).toBeVisible();
      }
      await expect(this.partnersPageLocators.inpCompanySize).toBeVisible();
      await expect(this.partnersPageLocators.inpPartnershipType).toBeVisible();
      await expect(this.partnersPageLocators.inpMessage).toBeVisible();
      await expect(this.partnersPageLocators.chkPrivacyPolicy).toBeVisible();
      await expect(this.partnersPageLocators.txtResponseTime).toBeVisible();
      await expect(this.partnersPageLocators.btnSendMessage).toBeVisible();
    });
  }

  async verifyAllFormFieldsAreMandatory() {
    await test.step('Verify every form field is marked as mandatory (*)', async () => {
      for (const label of ['First Name', 'Last name', 'Email address', 'Company name', 'Company size', 'Type of partnership', 'Message']) {
        await test.step(`"${label}" is marked mandatory`, async () => {
          // The asterisk is rendered by CSS (`label::after { content: "*" }`), so it is not part of the DOM text.
          const heading = this.page.getByRole('heading', { name: label, exact: true });
          await expect(heading).toBeVisible();
          const marker = await heading.locator('xpath=ancestor::label').evaluate(el => getComputedStyle(el, '::after').content);
          expect(marker, `"${label}" must show the mandatory marker`).toBe('"*"');
        });
      }
    });
  }

  async verifyCompanySizeOptions(expectedOptions: string[]) {
    await test.step('Verify the Company size dropdown lists the designed options', async () => {
      await this.partnersPageLocators.btnCompanySizeToggle.click();
      for (const option of expectedOptions) {
        // Soft, so one run reports every missing option.
        await expect.soft(this.partnersPageLocators.btnCompanySizeOption(option), `option "${option}"`).toBeVisible({ timeout: 5000 });
      }
      await this.partnersPageLocators.btnCompanySizeToggle.click();
    });
  }

  async fillPartnerForm(data: PartnerRequestInfo, options: { skip?: PartnerFormField; acceptPrivacyPolicy?: boolean } = {}) {
    const { skip, acceptPrivacyPolicy = true } = options;
    await test.step(`Fill the "Become a Partner" form${skip ? ` (leaving ${skip} empty)` : ''}`, async () => {
      const l = this.partnersPageLocators;
      if (skip !== 'firstName') await l.inpFieldByLabel('First Name').fill(data.firstName);
      if (skip !== 'lastName') await l.inpFieldByLabel('Last name').fill(data.lastName);
      if (skip !== 'companyName') await l.inpFieldByLabel('Company name').fill(data.companyName);
      if (skip !== 'email') await l.inpFieldByLabel('Email address').fill(data.email);
      if (skip !== 'companySize') {
        await l.btnCompanySizeToggle.click();
        await l.btnCompanySizeOption(data.companySize).click();
      }
      if (skip !== 'partnershipType') await l.inpPartnershipType.fill(data.partnershipType);
      if (skip !== 'message') await l.inpMessage.fill(data.message);
      if (acceptPrivacyPolicy) await l.chkPrivacyPolicy.check();
    });
  }

  async acceptPrivacyPolicy() {
    await test.step('Tick the Privacy Policy consent checkbox', async () => {
      await this.partnersPageLocators.chkPrivacyPolicy.check();
    });
  }

  async verifySendMessageDisabled() {
    await test.step('Verify the "Send Message" CTA is disabled', async () => {
      await expect(this.partnersPageLocators.btnSendMessage).toBeDisabled();
    });
  }

  async verifySendMessageEnabled() {
    await test.step('Verify the "Send Message" CTA is enabled', async () => {
      await expect(this.partnersPageLocators.btnSendMessage).toBeEnabled();
    });
  }

  async verifySendMessageDisabledWhenEachMandatoryFieldIsMissing(data: PartnerRequestInfo) {
    const fields: PartnerFormField[] = ['firstName', 'lastName', 'companyName', 'email', 'companySize', 'partnershipType', 'message'];
    await test.step('Verify "Send Message" stays disabled when any single mandatory field is missing', async () => {
      for (const field of fields) {
        await test.step(`Only "${field}" missing -> Send Message is disabled`, async () => {
          await this.page.reload({ waitUntil: 'domcontentloaded' });
          await this.waitForPartnersPageLoaded();
          await this.scrollToBecomeAPartnerForm();
          await this.fillPartnerForm(data, { skip: field });
          // Soft, so one run reports every field that fails to gate the CTA.
          await expect.soft(this.partnersPageLocators.btnSendMessage, `Send Message must be disabled when "${field}" is empty`).toBeDisabled();
        });
      }
    });
  }

  async clickSendMessage() {
    await test.step('Click "Send Message"', async () => {
      await this.partnersPageLocators.btnSendMessage.click();
    });
  }

  async clickSendMessageWhileOffline() {
    await test.step('Click "Send Message" while the network is unavailable', async () => {
      await this.page.context().setOffline(true);
      try {
        await this.partnersPageLocators.btnSendMessage.click();
        await this.verifyErrorMessage();
      } finally {
        await this.page.context().setOffline(false);
      }
    });
  }

  async verifySuccessMessage() {
    await test.step('Verify the success confirmation is shown with "Send another message"', async () => {
      await expect(this.partnersPageLocators.hdgMessageSent).toBeVisible();
      await expect(this.partnersPageLocators.btnSendAnotherMessage).toBeVisible();
    });
  }

  async verifyErrorMessage() {
    await test.step('Verify the error state is shown with "Try again"', async () => {
      await expect(this.partnersPageLocators.txtErrorMessage).toBeVisible();
      await expect(this.partnersPageLocators.btnTryAgain).toBeVisible();
      // Evidence for the bug report, taken while the error state is on screen (the test goes on to retry afterwards).
      // Scroll up a little so the sticky header does not cover the top of the error card.
      await this.page.mouse.move(600, 500);
      await this.page.mouse.wheel(0, -250);
      await this.page.waitForTimeout(700);
      const screenshotPath = test.info().outputPath('partners-error-state.png');
      await this.page.screenshot({ path: screenshotPath });
      await test.info().attach('Error state', { path: screenshotPath, contentType: 'image/png' });
      // Soft: on the test environment this <h1> renders empty instead of "Something went wrong".
      await expect.soft(this.partnersPageLocators.hdgSomethingWentWrong, 'error state title').toBeVisible();
    });
  }

  async clickSendAnotherMessage() {
    await test.step('Click "Send another message"', async () => {
      await this.partnersPageLocators.btnSendAnotherMessage.click();
    });
  }

  async clickTryAgain() {
    await test.step('Click "Try again"', async () => {
      await this.partnersPageLocators.btnTryAgain.click();
    });
  }

  async verifyFormIsDisplayedAndEmpty() {
    await test.step('Verify the form is displayed again with empty fields and a disabled Send CTA', async () => {
      await expect(this.partnersPageLocators.inpFieldByLabel('First Name')).toBeVisible();
      for (const label of ['First Name', 'Last name', 'Company name', 'Email address']) {
        await expect(this.partnersPageLocators.inpFieldByLabel(label), `${label} is empty`).toHaveValue('');
      }
      await expect(this.partnersPageLocators.inpCompanySize).toHaveValue('');
      await expect(this.partnersPageLocators.inpPartnershipType).toHaveValue('');
      await expect(this.partnersPageLocators.inpMessage).toHaveValue('');
      await expect(this.partnersPageLocators.chkPrivacyPolicy).not.toBeChecked();
      await expect(this.partnersPageLocators.btnSendMessage).toBeDisabled();
    });
  }

  async verifyPrivacyPolicyLink() {
    await test.step('Verify the Privacy Policy link points to the Privacy & Cookie Policy page', async () => {
      await expect(this.partnersPageLocators.lnkPrivacyPolicy).toHaveAttribute('href', /privacy-and-cookie-policy/);
    });
  }

  // ── About section ────────────────────────────────────────────────────────

  async verifyAboutSection() {
    await test.step('Verify the "About Vodafone Travel eSIM Partnerships" section shows copy and image', async () => {
      await this.partnersPageLocators.hdgAbout.scrollIntoViewIfNeeded();
      await expect(this.partnersPageLocators.hdgAbout).toBeVisible();
      await expect(this.partnersPageLocators.txtAboutCopy).toBeVisible();
      await expect(this.partnersPageLocators.imgAbout).toBeVisible();
    });
  }

  async verifyAboutSectionIsBelowForm() {
    await test.step('Verify the About section is displayed below the form', async () => {
      const formBox = await this.partnersPageLocators.btnSendMessage.boundingBox();
      const aboutBox = await this.partnersPageLocators.hdgAbout.boundingBox();
      expect(formBox && aboutBox, 'both elements must be rendered').toBeTruthy();
      expect(aboutBox!.y).toBeGreaterThan(formBox!.y);
    });
  }

  async verifyThreeStepPartnershipProcess() {
    await test.step('Verify the three-step partnership process (01, 02, 03) with a description per step', async () => {
      const steps = this.partnersPageLocators.hdgStepNumbers;
      await steps.first().scrollIntoViewIfNeeded();
      await expect(steps).toHaveCount(3);
      for (let i = 0; i < 3; i++) {
        const step = steps.nth(i);
        await expect(step).toHaveText(`0${i + 1}`);
        // The step container holds the number (wrapped in a div) and its description paragraph.
        await expect(step.locator('xpath=ancestor::*[.//p][1]').getByRole('paragraph')).not.toBeEmpty();
      }
    });
  }

  // ── FAQs ─────────────────────────────────────────────────────────────────

  async verifyFaqSection(questions: string[]) {
    await test.step('Verify the FAQ section lists every question', async () => {
      await this.partnersPageLocators.hdgFaq.scrollIntoViewIfNeeded();
      await expect(this.partnersPageLocators.hdgFaq).toBeVisible();
      for (const question of questions) {
        await expect(this.partnersPageLocators.btnFaqQuestion(question), `FAQ "${question}"`).toBeVisible();
      }
    });
  }

  async verifyFaqQuestionsExpandAndCollapse(questions: string[]) {
    await test.step('Verify every FAQ question expands and collapses', async () => {
      for (const question of questions) {
        await test.step(`FAQ "${question}" expands then collapses`, async () => {
          const button = this.partnersPageLocators.btnFaqQuestion(question);
          await button.scrollIntoViewIfNeeded();
          await button.click();
          await expect(button).toHaveAttribute('aria-expanded', 'true');
          await button.click();
          await expect(button).toHaveAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // ── Footer ───────────────────────────────────────────────────────────────

  async verifyFooterVisible() {
    await test.step('Verify the footer is displayed on the Partners page', async () => {
      const footer = this.page.getByRole('contentinfo');
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeVisible();
      await expect(footer.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    });
  }
}
