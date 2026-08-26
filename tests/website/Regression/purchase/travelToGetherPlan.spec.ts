import { test } from '../../../../fixtures/page-manager';
import { generateGuestUserData, pickRandomTravelTogetherPlanDestination } from '../../../../utils/testDataGenerator';
import { AppUrls, ValidLoginDetails, GuestUserData, PaymentDetails, BillingDetails, TravelTogetherPlanPromoCode } from '../../../../data/credentials';
import { emailTestTimeout } from '../../../../playwright.config';
import { TravelTogetherPlanPage } from '../../../../Pages/TravelTogetherPlanPage';

const CAROUSEL_DESTINATIONS = ['Europe Travel Together 100GB', 'Italy Travel Together 100GB', 'Mexico Travel Together 50GB', 'Turkey Travel Together 100GB', 'Albania Travel Together 100GB'];
const { TABLET_VIEWPORT, MOBILE_VIEWPORT } = TravelTogetherPlanPage;

test.describe('Travel Together Plan - Purchase Journey (TE-90)', () => {

    test('TC-01: Guest checkout - new user - Desktop',
        { tag: ['@regression', '@P1', '@travelTogetherPlan'] },
        async ({ homePage, regionPlansPage, cartPage, checkoutPage, emailVerificationPage, paymentPage, orderSuccessfulPage }) => {
            test.setTimeout(emailTestTimeout);
            const sentAt = Date.now();
            const guestData = generateGuestUserData();
            const dest = pickRandomTravelTogetherPlanDestination();
            await homePage.gotoHomepage(AppUrls.base);
            await homePage.navigateToRegionPlansPage(dest.slug, dest.tab);
            await regionPlansPage.verifyTravelTogetherPlanBannerVisible();
            await regionPlansPage.openGlobalPlanDetailsModal();
            await regionPlansPage.verifyGlobalPlanDetailsModal();
            await regionPlansPage.proceedFromModalToCart();
            await cartPage.verifyCartLoaded();
            await cartPage.expandAndVerifyWhatsIncluded();
            await cartPage.proceedToCheckoutFromCart();
            await checkoutPage.fillPersonalDetailsForNonExistingUser(guestData);
            await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(BillingDetails);
            await emailVerificationPage.handleOTPVerificationNonExistingUser(guestData.email, sentAt);
            await paymentPage.fillCardDetailsAndPay(PaymentDetails);
            await orderSuccessfulPage.verifyTravelTogetherPlanOrderSuccessForGuestUser();
        });

    test('TC-03: Guest checkout - existing account email - Desktop',
        { tag: ['@regression', '@P1', '@travelTogetherPlan'] },
        async ({ homePage, regionPlansPage, cartPage, checkoutPage, emailVerificationPage, loginPage, paymentPage, orderSuccessfulPage, myAccountPage: _myAccountPage }) => {
            const dest = pickRandomTravelTogetherPlanDestination();
            await homePage.gotoHomepage(AppUrls.base);
            await homePage.navigateToRegionPlansPage(dest.slug, dest.tab);
            await regionPlansPage.verifyTravelTogetherPlanBannerVisible();
            await regionPlansPage.selectTravelTogetherPlan(dest.heading);
            await cartPage.verifyCartLoaded();
            await cartPage.proceedToCheckoutFromCart();
            await checkoutPage.fillPersonalDetailsForExistingUser(GuestUserData);
            await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(BillingDetails);
            await emailVerificationPage.handleOTPVerificationExistingUser();
            await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
            await loginPage.fillLoginDetailsAndSubmit(ValidLoginDetails);
            await checkoutPage.proceedToPaymentAsLoggedInUser();
            await paymentPage.performPaymentWithCardForLoggedInUsers();
            await orderSuccessfulPage.verifyTravelTogetherPlanOrderSuccessForLoggedInUser();
        });

    test('TC-05: Logged-in user checkout - Desktop',
        { tag: ['@regression', '@P1', '@travelTogetherPlan'] },
        async ({ loginPage, homePage, regionPlansPage, cartPage, checkoutPage, paymentPage, orderSuccessfulPage, myAccountPage: _myAccountPage }) => {
            const dest = pickRandomTravelTogetherPlanDestination();
            await loginPage.navigateAndLogin(AppUrls.login, ValidLoginDetails);
            await homePage.navigateToRegionPlansPage(dest.slug, dest.tab);
            await regionPlansPage.verifyTravelTogetherPlanBannerVisible();
            await regionPlansPage.selectTravelTogetherPlan(dest.heading);
            await cartPage.verifyCartLoaded();
            await cartPage.proceedToCheckoutFromCart();
            await checkoutPage.proceedToPaymentAsLoggedInUser();
            await paymentPage.performPaymentWithCardForLoggedInUsers();
            await orderSuccessfulPage.verifyTravelTogetherPlanOrderSuccessForLoggedInUser();
        });

    test('TC-08: Promotional code application - Desktop',
        { tag: ['@regression', '@P2', '@travelTogetherPlan'] },
        async ({ homePage, regionPlansPage, cartPage, checkoutPage, emailVerificationPage, paymentPage, orderSuccessfulPage }) => {
            test.setTimeout(emailTestTimeout);
            const guestData = generateGuestUserData();
            const dest = pickRandomTravelTogetherPlanDestination();
            const sentAt = Date.now();
            await homePage.gotoHomepage(AppUrls.base);
            await homePage.navigateToRegionPlansPage(dest.slug, dest.tab);
            await regionPlansPage.verifyTravelTogetherPlanBannerVisible();
            await regionPlansPage.selectTravelTogetherPlan(dest.heading);
            await cartPage.verifyCartLoaded();
            await cartPage.applyPromoCode(TravelTogetherPlanPromoCode);
            await cartPage.verifyOrderSummaryVisible();
            const orderSummary = await cartPage.captureOrderSummary();
            await cartPage.proceedToCheckoutFromCart();
            await checkoutPage.fillPersonalDetailsForNonExistingUser(guestData);
            await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(BillingDetails);
            await emailVerificationPage.handleOTPVerificationNonExistingUser(guestData.email, sentAt);
            await paymentPage.fillCardDetailsAndPay(PaymentDetails);
            await orderSuccessfulPage.verifyTravelTogetherPlanOrderSuccessForGuestUser();
            await orderSuccessfulPage.verifyQRCodeEmailReceivedGroupPlan(guestData.email, sentAt);
            await orderSuccessfulPage.verifyReceiptEmailMatchesOrderSummary(guestData.email, sentAt, orderSummary);
        });

});

test.describe('Travel Together Plan - Landing Page (/travel-together)', () => {

    // ── Content & UI — Desktop / Tablet / Mobile ──────────────────────────────
    for (const viewportCase of [
        { name: 'Desktop', viewport: null },
        { name: 'Tablet', viewport: TABLET_VIEWPORT },
        { name: 'Mobile', viewport: MOBILE_VIEWPORT },
    ]) {
        test.describe(`Content & UI - ${viewportCase.name}`, () => {
            if (viewportCase.viewport) {
                test.use({ viewport: viewportCase.viewport });
            }

            test(`LP-01: Hero section renders correctly - ${viewportCase.name}`,
                { tag: ['@regression', '@P1', '@travelTogetherPlanLanding'] },
                async ({ travelTogetherPlanPage }) => {
                    await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                    await travelTogetherPlanPage.verifyHeroSectionVisible();
                });

            test(`LP-02: Search section renders correctly - ${viewportCase.name}`,
                { tag: ['@regression', '@P1', '@travelTogetherPlanLanding'] },
                async ({ travelTogetherPlanPage }) => {
                    await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                    await travelTogetherPlanPage.verifySearchSectionVisible();
                    await travelTogetherPlanPage.verifyFindPlanButtonDisabled();
                });

            test(`LP-03: Featured plans carousel renders all destination cards - ${viewportCase.name}`,
                { tag: ['@regression', '@P1', '@travelTogetherPlanLanding'] },
                async ({ travelTogetherPlanPage }) => {
                    await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                    await travelTogetherPlanPage.verifyCarouselPlanCardsVisible(CAROUSEL_DESTINATIONS);
                });

            test(`LP-04: "How travel together works" section renders all steps - ${viewportCase.name}`,
                { tag: ['@regression', '@P2', '@travelTogetherPlanLanding'] },
                async ({ travelTogetherPlanPage }) => {
                    await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                    await travelTogetherPlanPage.verifyHowItWorksSectionVisible();
                });

            test(`LP-05: "Why choose travel together" feature cards render correctly - ${viewportCase.name}`,
                { tag: ['@regression', '@P2', '@travelTogetherPlanLanding'] },
                async ({ travelTogetherPlanPage }) => {
                    await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                    await travelTogetherPlanPage.verifyWhyChooseSectionVisible();
                });

            test(`LP-06: FAQ section renders with default "Overview" category - ${viewportCase.name}`,
                { tag: ['@regression', '@P2', '@travelTogetherPlanLanding'] },
                async ({ travelTogetherPlanPage }) => {
                    await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                    await travelTogetherPlanPage.verifyFaqSectionDefaultStateVisible();
                });

            test(`LP-19: No horizontal overflow at this viewport - ${viewportCase.name}`,
                { tag: ['@regression', '@P2', '@travelTogetherPlanLanding'] },
                async ({ travelTogetherPlanPage }) => {
                    await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                    await travelTogetherPlanPage.verifyNoHorizontalOverflow();
                });
        });
    }

    // ── Search-to-plan flow — Desktop ─────────────────────────────────────────
    test.describe('Search-to-plan flow - Desktop', () => {

        test('LP-07: Typing a valid destination enables the "Find a plan" button',
            { tag: ['@regression', '@P1', '@travelTogetherPlanLanding'] },
            async ({ travelTogetherPlanPage }) => {
                await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                await travelTogetherPlanPage.verifyFindPlanButtonDisabled();
                await travelTogetherPlanPage.searchForDestination('Europe');
                await travelTogetherPlanPage.verifyFindPlanButtonEnabled();
            });

        test('LP-08: Selecting a destination suggestion shows the matching plan inline',
            { tag: ['@regression', '@P1', '@travelTogetherPlanLanding'] },
            async ({ travelTogetherPlanPage }) => {
                await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                await travelTogetherPlanPage.searchForDestination('Europe');
                await travelTogetherPlanPage.selectSearchSuggestion('europe');
                await travelTogetherPlanPage.verifySearchResultCardVisible('Europe Travel Together 100GB');
            });

        test('LP-09: "Find a plan" button stays disabled with an empty search input',
            { tag: ['@regression', '@P2', '@travelTogetherPlanLanding'] },
            async ({ travelTogetherPlanPage }) => {
                await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                await travelTogetherPlanPage.verifyFindPlanButtonDisabled();
            });
    });

    test.describe('Search-to-plan flow - Mobile smoke', () => {
        test.use({ viewport: MOBILE_VIEWPORT });

        test('LP-08m: Selecting a destination suggestion shows the matching plan inline - Mobile',
            { tag: ['@regression', '@P2', '@travelTogetherPlanLanding'] },
            async ({ travelTogetherPlanPage }) => {
                await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                await travelTogetherPlanPage.searchForDestination('Europe');
                await travelTogetherPlanPage.selectSearchSuggestion('europe');
                await travelTogetherPlanPage.verifySearchResultCardVisible('Europe Travel Together 100GB');
            });
    });

    // ── Add-to-cart from carousel — Desktop ───────────────────────────────────
    test.describe('Add-to-cart from carousel - Desktop', () => {

        test('LP-10: Adding a carousel plan to cart opens the cart with that plan',
            { tag: ['@regression', '@P1', '@travelTogetherPlanLanding'] },
            async ({ travelTogetherPlanPage, cartPage }) => {
                await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                await travelTogetherPlanPage.addPlanToCartFromCarousel('Europe Travel Together 100GB');
                await cartPage.verifyCartLoaded();
            });

        test('LP-11: Carousel Next/Previous buttons page through the destination cards',
            { tag: ['@regression', '@P2', '@travelTogetherPlanLanding'] },
            async ({ travelTogetherPlanPage }) => {
                await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                await travelTogetherPlanPage.verifyCarouselPrevButtonDisabled();
                await travelTogetherPlanPage.verifyCarouselNextButtonEnabled();
                await travelTogetherPlanPage.clickCarouselNext();
                await travelTogetherPlanPage.verifyCarouselPrevButtonEnabled();
                await travelTogetherPlanPage.clickCarouselNextUntilEnd();
                await travelTogetherPlanPage.verifyCarouselNextButtonDisabled();
                await travelTogetherPlanPage.clickCarouselPreviousUntilStart();
                await travelTogetherPlanPage.verifyCarouselPrevButtonDisabled();
                await travelTogetherPlanPage.verifyCarouselNextButtonEnabled();
            });

        test('LP-12: Guest checkout end-to-end starting from a carousel "Add to cart" click',
            { tag: ['@regression', '@P1', '@travelTogetherPlanLanding'] },
            async ({ travelTogetherPlanPage, cartPage, checkoutPage, emailVerificationPage, paymentPage, orderSuccessfulPage }) => {
                test.setTimeout(emailTestTimeout);
                const sentAt = Date.now();
                const guestData = generateGuestUserData();
                await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                await travelTogetherPlanPage.addPlanToCartFromCarousel('Europe Travel Together 100GB');
                await cartPage.verifyCartLoaded();
                await cartPage.proceedToCheckoutFromCart();
                await checkoutPage.fillPersonalDetailsForNonExistingUser(guestData);
                await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(BillingDetails);
                await emailVerificationPage.handleOTPVerificationNonExistingUser(guestData.email, sentAt);
                await paymentPage.fillCardDetailsAndPay(PaymentDetails);
                await orderSuccessfulPage.verifyTravelTogetherPlanOrderSuccessForGuestUser();
            });
    });

    test.describe('Add-to-cart from carousel - Mobile smoke', () => {
        test.use({ viewport: MOBILE_VIEWPORT });

        test('LP-10m: Adding a carousel plan to cart opens the cart with that plan - Mobile',
            { tag: ['@regression', '@P2', '@travelTogetherPlanLanding'] },
            async ({ travelTogetherPlanPage, cartPage }) => {
                await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                await travelTogetherPlanPage.addPlanToCartFromCarousel('Europe Travel Together 100GB');
                await cartPage.verifyCartLoaded();
            });
    });

    // ── FAQ accordion interaction — Desktop ───────────────────────────────────
    test.describe('FAQ accordion interaction - Desktop', () => {

        test('LP-13: Expanding a FAQ question reveals its answer',
            { tag: ['@regression', '@P1', '@travelTogetherPlanLanding'] },
            async ({ travelTogetherPlanPage }) => {
                await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                await travelTogetherPlanPage.expandFaqQuestion('What is Travel Together?');
                await travelTogetherPlanPage.verifyFaqQuestionExpanded(
                    'What is Travel Together?',
                    'Travel Together is a group data plan where one person buys a single plan that includes five eSIMs.'
                );
            });

        test('LP-14: Collapsing an expanded FAQ question hides its answer',
            { tag: ['@regression', '@P2', '@travelTogetherPlanLanding'] },
            async ({ travelTogetherPlanPage }) => {
                await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                await travelTogetherPlanPage.expandFaqQuestion('What is Travel Together?');
                await travelTogetherPlanPage.verifyFaqQuestionExpanded(
                    'What is Travel Together?',
                    'Travel Together is a group data plan where one person buys a single plan that includes five eSIMs.'
                );
                await travelTogetherPlanPage.collapseFaqQuestion('What is Travel Together?');
                await travelTogetherPlanPage.verifyFaqQuestionCollapsed('What is Travel Together?');
            });

        test('LP-15: Switching FAQ category filter swaps the visible question set',
            { tag: ['@regression', '@P2', '@travelTogetherPlanLanding'] },
            async ({ travelTogetherPlanPage }) => {
                await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                await travelTogetherPlanPage.selectFaqCategory('Group');
                await travelTogetherPlanPage.verifyFaqCategorySelected('Group');
                await travelTogetherPlanPage.verifyFaqQuestionVisible('How do I share eSIMs with my group?');
            });
    });

    // ── Functional / non-functional ───────────────────────────────────────────
    test.describe('Functional / non-functional', () => {

        test('LP-16: No unhandled console errors on initial page load',
            { tag: ['@regression', '@P2', '@travelTogetherPlanLanding'] },
            async ({ page, travelTogetherPlanPage }) => {
                const consoleErrors: string[] = [];
                page.on('console', (msg) => {
                    if (msg.type() === 'error') consoleErrors.push(msg.text());
                });
                await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                await travelTogetherPlanPage.verifyHeroSectionVisible();
                await travelTogetherPlanPage.verifyNoConsoleErrors(consoleErrors);
            });

        test('LP-17: All content images have non-empty alt text',
            { tag: ['@regression', '@P2', '@travelTogetherPlanLanding'] },
            async ({ travelTogetherPlanPage }) => {
                await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                await travelTogetherPlanPage.verifyAllContentImagesHaveAltText();
            });

        test('LP-18: Hero "How It Works" CTA scrolls to the "How travel together works" section',
            { tag: ['@regression', '@P2', '@travelTogetherPlanLanding'] },
            async ({ travelTogetherPlanPage }) => {
                await travelTogetherPlanPage.gotoTravelTogetherPage(AppUrls.travelTogether);
                await travelTogetherPlanPage.clickHowItWorksCta();
                await travelTogetherPlanPage.verifyHowItWorksSectionScrolledIntoView();
            });
    });

});
