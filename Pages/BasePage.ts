import { Page, Locator, test } from "@playwright/test";
import { healLocator } from '../utils/selfHealing';

export abstract class BasePage {
  protected page: Page;
  protected readonly btnAcceptCookies: Locator;

  /** Override in migrated subclasses, e.g. `protected readonly pageName = 'OrderSuccessfulPage';` — used to namespace healing snapshots. */
  protected readonly pageName: string = this.constructor.name;
  /** Override in migrated subclasses, e.g. `protected readonly sourceFilePath = __filename;` — the file the auto-heal codemod may patch. */
  protected readonly sourceFilePath: string = '';

  constructor(page: Page) {
    this.page = page;
    // OneTrust CMP button id — stable across locales, unlike its accessible name ("Accept All Cookies" in English only).
    this.btnAcceptCookies = this.page.locator('#onetrust-accept-btn-handler');
    // Registered here (not in navigateToUrl) so it also covers direct page.goto() calls, e.g. from TranslationCheckPage.
    void this.page.addLocatorHandler(
      this.btnAcceptCookies,
      async () => { await this.btnAcceptCookies.click(); }
    );
  }

  /**
   * Self-healing locator access: if `locator` no longer resolves, tries a stored
   * last-known-good descriptor, then looser alternates, then (if AI_HEAL is on)
   * an AI-assisted match — returning the first working Locator, or the original
   * locator unchanged if nothing heals (so the normal Playwright error surfaces).
   */
  protected async heal(key: string, locator: Locator): Promise<Locator> {
    return healLocator(this.page, {
      key,
      primary: locator,
      pageName: this.pageName,
      sourceFilePath: this.sourceFilePath,
      testTitle: test.info()?.title,
    });
  }

  async navigateToUrl(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async acceptCookies(customLocator?: Locator) {
    await test.step('Accept cookies', async () => {
      const button = customLocator || this.btnAcceptCookies;
      try {
        // Short timeout: this is a best-effort dismiss, not a required action — the banner only
        // shows once per session, so most calls correctly find nothing and should fail fast rather
        // than block for the full actionTimeout (60s) on every subsequent navigation.
        await button.waitFor({ state: 'visible', timeout: 5000 });
        await button.click();
      } catch {
        // Banner not present or already dismissed
      }
    });
  }

  /**
   * Domains that belong to the corporate Cloudflare Access gate in front of the whole preprod
   * environment (see tests/auth.setup.ts), not to the Vodafone ID / travel eSIM account itself.
   * Confirmed from a real saved playwright/.auth/user.json: Cloudflare Access's own cookies
   * (CF_AppSession/CF_Authorization/CF_Device) sit behind a Microsoft Entra/Azure AD corporate
   * login, which leaves its own cookie trail across these domains. Losing any of it forces an
   * interactive Microsoft login that the suite can't complete on its own.
   */
  private static readonly CORPORATE_SSO_GATE_DOMAINS = [
    'cloudflareaccess.com',
    'microsoftonline.com',
    'microsoftazuread-sso.com',
    'login.live.com',
  ];

  private static isCorporateSsoGateCookie(cookie: { name: string; domain: string }): boolean {
    // CF_AppSession / CF_Authorization / CF_Device — present even on the app's own domain
    // (vrs.preprod...), alongside the app's own session cookies, so this can't be a domain-only check.
    if (/^cf[_-]/i.test(cookie.name)) return true;
    const domain = cookie.domain.replace(/^\./, '').toLowerCase();
    return BasePage.CORPORATE_SSO_GATE_DOMAINS.some(gate => domain === gate || domain.endsWith(`.${gate}`));
  }

  /**
   * Clears the Vodafone ID / travel eSIM account's own session — cookies on every origin EXCEPT the
   * corporate Cloudflare/Microsoft SSO gate (see `CORPORATE_SSO_GATE_DOMAINS` above), plus
   * localStorage, sessionStorage and IndexedDB on the current origin.
   *
   * Works around a known bug: after signing up, a stale account session lets a later "login" succeed
   * silently without the credentials form ever being shown. Any test that needs to exercise a real
   * login after a sign-up (entering email/password, not just riding the leftover session) must call
   * this — and ideally sign out first — in between, or it'll silently skip exercising login at all.
   * A blanket `context.clearCookies()` would also wipe the corporate SSO gate itself, forcing an
   * interactive Microsoft login the suite can't complete unattended — so this preserves that gate.
   */
  async clearBrowserStorageAndCookies(): Promise<void> {
    await test.step('Clear the account session (keeping the corporate SSO gate) and site storage', async () => {
      const context = this.page.context();
      const allCookies = await context.cookies();
      const gateCookies = allCookies.filter(c => BasePage.isCorporateSsoGateCookie(c));
      await context.clearCookies();
      if (gateCookies.length) {
        await context.addCookies(gateCookies);
      }
      await this.page.evaluate(async () => {
        try { localStorage.clear(); } catch { /* storage may be inaccessible, e.g. sandboxed frame */ }
        try { sessionStorage.clear(); } catch { /* same as above */ }
        try {
          const idb = (window as unknown as { indexedDB?: IDBFactory }).indexedDB;
          const databases = await idb?.databases?.();
          if (databases && idb) {
            await Promise.all(databases.map(db => db.name
              ? new Promise<void>(resolve => {
                  const req = idb.deleteDatabase(db.name as string);
                  req.onsuccess = () => resolve();
                  req.onerror = () => resolve();
                  req.onblocked = () => resolve();
                })
              : Promise.resolve()));
          }
        } catch { /* IndexedDB not supported/accessible — best-effort only */ }
      });
    });
  }
}