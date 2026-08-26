import { Page } from '@playwright/test';
import { HomePage } from '../../Pages/HomePage';
import { MyAccountPage } from '../../Pages/MyAccountPage';
import { RegionPlansPage } from '../../Pages/RegionPlansPage';
import { CartPage } from '../../Pages/CartPage';
import { CheckoutPage } from '../../Pages/CheckoutPage';
import { BillingDetails } from '../../data/credentials';
import { MyEsimsPage } from '../../Pages/MyEsimsPage';
import { generateGuestUserData } from '../../utils/testDataGenerator';

/** Adds the first Europe plan to cart and lands on the Cart page — shared first step for Cart/Checkout/Payment routes below. */
async function addPlanToCart(page: Page) {
    await new HomePage(page).navigateToRegionPlansPage('europe');
    await new RegionPlansPage(page).selectFirstPlan('Europe');
}

export interface LocaleConfig {
    /** BCP47 tag passed to Playwright's browser context (drives Accept-Language / navigator.language). */
    code: string;
    /** URL path prefix the site redirects to for this locale, e.g. '/es'. */
    urlPrefix: string;
    /** Human-readable name used in test titles and reports. */
    label: string;
    /**
     * 'cjk' enables an extra check that flags lines with too few CJK characters (catches text left in
     * Latin script). All other locales get diff-only checking against the English page's text.
     */
    checkMode: 'default' | 'cjk';
}

// ── Add a new language to test here. Nothing else needs to change. ─────────
export const TARGET_LOCALES: LocaleConfig[] = [
    // { code: 'es-ES', urlPrefix: '/es', label: 'Spanish', checkMode: 'default' },
    // { code: 'de-DE', urlPrefix: '/de', label: 'German', checkMode: 'default' },   
    // { code: 'fr-FR', urlPrefix: '/fr', label: 'French', checkMode: 'default' },
    // { code: 'el-GR', urlPrefix: '/el', label: 'Greek', checkMode: 'default' },
    // { code: 'pt-PT', urlPrefix: '/pt', label: 'Portuguese', checkMode: 'default' },
    // { code: 'zh-CN', urlPrefix: '/zh', label: 'Chinese', checkMode: 'cjk' },
    { code: 'ko-KR', urlPrefix: '/ko', label: 'Korean', checkMode: 'default' },
];

export interface RouteConfig {
    /**
     * URL path under the locale prefix, e.g. '/our-destinations'. Use '' for the homepage. Omit this
     * and provide `navigate` instead for pages with no direct URL (account panels reached via clicks).
     */
    path?: string;
    /** Human-readable name used in test titles and reports. */
    label: string;
    /**
     * Which session state to check this page under:
     * - 'guest'         (default) — not logged in.
     * - 'authenticated' — logs in first (fresh login per locale, using ValidLoginDetails).
     * - 'both'          — runs the check twice, once guest and once authenticated.
     */
    access?: 'guest' | 'authenticated' | 'both';
    /**
     * Required when there's no `path` (e.g. My Account panel, My eSIMs — reached only via UI clicks,
     * never a plain URL). Runs on the page (already logged in, if `access` required it) to land on the
     * target view; reuse existing Page Object methods here instead of raw locators. If both `path` and
     * `navigate` are given, `navigate` runs after the `path` goto (e.g. to open a panel on that page).
     * The `authenticated` flag lets an `access: 'both'` route branch its own flow (e.g. Payment: guest
     * fills a new-card form, logged-in users pick a saved card) — safe to ignore for routes that behave
     * the same either way.
     */
    navigate?: (page: Page, authenticated: boolean) => Promise<void>;
}

// ── Add a new route to check here. ──────────────────────────────────────────
// Keep this to top-level, high-traffic pages plus the region hubs — checking
// every one of the ~200 individual country pages across every locale is slow
// (those are covered separately by the aggregated country-pages test).
export const ROUTES: RouteConfig[] = [
    // { path: '', label: 'Homepage' },
    // { path: '/our-destinations', label: 'Our Destinations' },
    // { path: '/our-destinations/africa', label: 'Africa region' },
    // { path: '/our-destinations/asia', label: 'Asia region' },
    // { path: '/our-destinations/caribbean', label: 'Caribbean region' },
    // { path: '/our-destinations/europe', label: 'Europe region' },
    // { path: '/our-destinations/latin-america', label: 'Latin America region' },
    // { path: '/our-destinations/middle-east', label: 'Middle East region' },
    // { path: '/our-destinations/north-america', label: 'North America region' },
    // { path: '/our-destinations/oceania', label: 'Oceania region' },
    // { path: '/our-destinations/uefachampionsleague', label: 'Uefa Champions League' },
    { path: '/travel-together', label: 'travel Together plan page ' },

    // Login-required pages with no direct URL — reached via a click sequence instead of `path`.
    {
        label: 'My Account panel',
        access: 'authenticated',
        navigate: async (page: Page) => {
            await new HomePage(page).navigateToMyAccountTab();
        },
    },
    {
        label: 'My eSIMs',
        access: 'authenticated',
        navigate: async (page: Page) => {
            await new HomePage(page).navigateToMyAccountTab();
            await new MyAccountPage(page).clickEsimsTab();
        },
    },

    // Cart/Checkout/Payment need a plan in the cart first — addPlanToCart() (defined above) adds the
    // first Europe plan and lands on the Cart page; each route below then drives further from there.
    // Cart and Checkout look the same for guest vs logged-in, so one 'both' entry covers each. Payment
    // diverges (guest fills a new card form, logged-in users pick a saved card), so it's split into
    // two separate routes instead of branching inside one navigate function.
    // {
    //     // `path: ''` (homepage) is required here: unlike the authenticated-only routes above (where
    //     // `login()` itself loads a page before `navigate()` runs), a guest run of an `access: 'both'`
    //     // or `access: 'guest'` route with no `path` never navigates anywhere first, leaving the page on
    //     // about:blank when `navigate()` tries to click things.
    //     path: '',
    //     label: 'Cart page',
    //     access: 'both',
    //     navigate: addPlanToCart,
    // },
    // {
    //     path: '',
    //     label: 'Checkout page',
    //     access: 'both',
    //     navigate: async (page: Page) => {
    //         await addPlanToCart(page);
    //         await new CartPage(page).proceedToCheckoutFromCart();
    //     },
    // },
    // {
    //     // Guest fills a new-card form on this page; a logged-in user picks a saved card instead — hence
    //     // the `authenticated` branch here rather than two separate routes.
    //     path: '',
    //     label: 'Payment page',
    //     access: 'both',
    //     navigate: async (page: Page, authenticated: boolean) => {
    //         await addPlanToCart(page);
    //         await new CartPage(page).proceedToCheckoutFromCart();
    //         const checkoutPage = new CheckoutPage(page);
    //         if (authenticated) {
    //             await checkoutPage.proceedToPaymentAsLoggedInUser();
    //         } else {
    //             await checkoutPage.fillPersonalDetailsForNonExistingUser(generateGuestUserData());
    //             await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(BillingDetails);
    //         }
    //     },
    // },

    // A page that renders differently for guests vs logged-in users can be checked both ways:
    // { path: '', label: 'Homepage', access: 'both' },
    // Add more authenticated-only pages the same way, e.g.:
    {
        label: 'eSIM Details',
        access: 'authenticated',
        navigate: async (page: Page) => {
            await new HomePage(page).navigateToMyAccountTab();
            await new MyAccountPage(page).clickEsimsTab();
            await new MyEsimsPage(page).clickViewDetailsOnFirstNotInstalledEsim();
        },
    },

];

/**
 * Words/phrases that are expected to stay identical across locales — brand names, technical terms,
 * currency codes, and cognates (place names spelled the same in the target language) — and should
 * never be flagged as "untranslated". Matched case-sensitively, as a whole word/phrase anywhere in a
 * line (not just whole-line), and combined with stripping digits — so a single entry like 'Days'
 * also clears '5 Days', '50 Days', etc. without needing every numeric variant listed. Add a plain
 * word here as soon as you see it flagged for a country/region/plan name that's genuinely unchanged
 * in the target language.
 */
export const ALLOWLIST: string[] = [
    'Vodafone',
    'VRS',
    '5G',
    'FUP',
    'Blog',
    'Champions',
    'Days',
    'Unlimited',
    'Europe',
    'Luxembourg',
    "Hi, I'm Tobi, your virtual agent. How can I help you today?",
    // Note: plan/product card titles ("Europe 5GB", "Italy Travel Together 100GB", ...) aren't
    // translated anywhere on the site. Those are matched generically by PLAN_NAME_PATTERN in
    // utils/translationCompare.ts, so individual destination names don't need to be listed here.
];

/** Lines shorter than this are skipped entirely (numbers, prices, single symbols are too noisy to diff). */
export const MIN_LINE_LENGTH = 4;

/** For 'cjk' locales, lines at/above MIN_LINE_LENGTH need at least this fraction of CJK characters. */
export const CJK_RATIO_THRESHOLD = 0.3;
