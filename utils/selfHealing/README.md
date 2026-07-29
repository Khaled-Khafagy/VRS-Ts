# Self-healing locators

When a Page Object's locator no longer resolves (renamed text, removed `data-testid`, restructured DOM), `BasePage.heal()` tries to find a working replacement live, in the same test run, instead of failing immediately.

## How it works

`heal(key, locator)` runs a fast liveness check on the primary locator (`HEAL_FAST_CHECK_TIMEOUT_MS`, default 2000ms — much shorter than the suite's normal `expectTimeout`). If it resolves, the locator is returned unchanged and a descriptor snapshot of it is refreshed in the background. If it doesn't resolve, `heal()` tries, in order:

1. **Stored snapshot** — the last-known-good descriptor for that key, saved under `utils/selfHealing/snapshots/<PageName>.json`.
2. **Snapshot-derived alternates** — looser variants of the stored descriptor (partial text match, role without a name).
3. **AI-assisted match** (only if `AI_HEAL=true` and `ANTHROPIC_API_KEY` is set) — Claude is shown an ARIA snapshot of the page and asked for the single best-matching element. The suggestion is never trusted blindly: it's turned into a real Locator and re-checked for liveness before use.

If nothing heals, `heal()` returns the original locator unchanged so Playwright's normal timeout error surfaces at the `expect()`/`.click()` call site.

Every outcome is recorded as a `HealEvent` (`test-results/heal-events/<pid>.jsonl`), aggregated once per run by `reporters/self-healing-reporter.ts` (`onEnd()`), and printed to the console.

## Auto-patching source files

Set `AUTO_HEAL_PATCH=true` to have the reporter rewrite the healed locator's initializer directly in the Page Object's `.ts` source (via a `ts-morph` codemod — only that one property's expression is touched, with a `// healed on <date> — was: ...` comment). Off by default. Recommended: run a few times with it off to let the snapshot baseline populate and stabilize before trusting it to rewrite source.

## Migrating another Page Object

1. Add two class fields:
   ```ts
   protected readonly pageName = '<ClassName>';
   protected readonly sourceFilePath = __filename;
   ```
2. Wrap every `expect(this.xxxLocators.Y)` call:
   ```ts
   await expect(await this.heal('Y', this.xxxLocators.Y)).toBeVisible();
   ```
   The same works for `.click()`/`.fill()`: `await (await this.heal('Y', this.xxxLocators.Y)).click();`

## Known gaps (not needed for `OrderSuccessfulPage`, flagged for later migrations)

- **Iframe-nested locators** (e.g. `PaymentPage`'s card-entry fields): `heal()` works at runtime, but descriptor capture doesn't yet record the frame chain, so a rebuilt fallback Locator would look outside the iframe. Needs a `frameChain` hint passed to `heal()` before migrating pages with `frameLocator()` chains.
- **Inline locators not in a `xxxLocators` object** (e.g. `LoginPage`'s `this.page.locator('#login_btn')` built directly in a method): `heal()` works fine at runtime, but the auto-patch codemod only looks for properties inside a `*Locators` object literal — it won't rewrite an inline locator yet.
- **`page.evaluate(() => document.querySelector(...))` patterns** (e.g. `CheckoutPage`'s label-intercepted checkbox): permanently out of scope — `heal()` requires a real Playwright `Locator`, not a DOM query.

## Env vars

| Var | Default | Purpose |
|---|---|---|
| `AI_HEAL` | `false` | Enables the AI-assisted fallback layer (requires `ANTHROPIC_API_KEY`) |
| `ANTHROPIC_API_KEY` | — | Required for `AI_HEAL=true` |
| `AI_HEAL_MODEL` | `claude-haiku-4-5-20251001` | Model used for the single-shot match classification |
| `AI_HEAL_MIN_CONFIDENCE` | `0.6` | Minimum confidence to accept an AI-suggested match |
| `AUTO_HEAL_PATCH` | `false` | Rewrites source `.ts` files for successfully healed locators |
| `HEAL_FAST_CHECK_TIMEOUT_MS` | `2000` | Liveness-check timeout per strategy tried |
