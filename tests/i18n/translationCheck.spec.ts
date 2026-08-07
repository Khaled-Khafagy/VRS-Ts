import { test } from '../../fixtures/page-manager';
import { AppUrls } from '../../data/credentials';
import { TranslationCheckPage } from '../../Pages/TranslationCheckPage';
import { LocaleConfig, RouteConfig, ROUTES, TARGET_LOCALES } from './i18n.config';

// Checks that each route in ROUTES (tests/i18n/i18n.config.ts) renders translated content for each
// locale in TARGET_LOCALES, instead of falling back to English or leaving untranslated lines behind.
// To add a route, an authenticated page, or a language, edit the arrays in i18n.config.ts — nothing
// here needs to change.

/** Fetches the English baseline for a route, navigates the target locale to it, and asserts no untranslated content. */
async function checkRouteTranslation(translationCheckPage: TranslationCheckPage, route: RouteConfig, locale: LocaleConfig, authenticated: boolean) {
    const sourceLines = await translationCheckPage.fetchSourceLines(route, AppUrls.base, authenticated);
    await translationCheckPage.gotoRoute(route, AppUrls.base, locale.urlPrefix, authenticated);
    if (route.path !== undefined) {
        await translationCheckPage.verifyLocaleUrlApplied(locale.urlPrefix);
    }
    await translationCheckPage.verifyNoUntranslatedContent(sourceLines, locale, authenticated);
}

const guestRoutes = ROUTES.filter((route) => route.access === 'guest' || route.access === 'both' || !route.access);
const authenticatedRoutes = ROUTES.filter((route) => route.access === 'authenticated' || route.access === 'both');

test.describe('Guest', () => {
    for (const locale of TARGET_LOCALES) {
        test.describe(`Translations — ${locale.label}`, () => {
            test.use({ locale: locale.code });

            for (const route of guestRoutes) {
                test(`${route.label} is translated`, async ({ translationCheckPage }) => {
                    await checkRouteTranslation(translationCheckPage, route, locale, false);
                });
            }
        });
    }
});

test.describe('Authenticated', () => {
    for (const locale of TARGET_LOCALES) {
        test.describe(`Translations — ${locale.label}`, () => {
            test.use({ locale: locale.code });

            for (const route of authenticatedRoutes) {
                test(`${route.label} is translated`, async ({ translationCheckPage }) => {
                    await checkRouteTranslation(translationCheckPage, route, locale, true);
                });
            }
        });
    }
});
