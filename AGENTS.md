# Test Automation Guidelines

## Stack
- Framework: Playwright (TypeScript)
- Page objects location: /Pages/
- Tests location: /tests/
- Data files: /data/ and /fixtures/

## Existing page objects
- BasePage.ts — base class, all pages extend this
- LoginOrSignup.ts
- LoginPage.ts
- CheckoutPage.ts
- CartPage.ts
- HomePage.ts
- PaymentPage.ts
- MyAccountPage.ts
- OrderSuccessPage.ts
- OurDestinationPage.ts
- RegionPlansPage.ts
## Rules for the agent
1. Always extend BasePage when creating a new page object
2. Check if a page object already exists before creating a new one
3. Follow the same class/method naming as existing pages
4. Locator priority order (always follow this):
   - First: getByRole() — e.g. page.getByRole('button', { name: 'Login' })
   - Second: getByLabel() — e.g. page.getByLabel('Email')
   - Third: getByPlaceholder() — e.g. page.getByPlaceholder('Enter email')
   - Fourth: getByText() — e.g. page.getByText('Submit')
   - Last resort only: CSS selectors or XPath — avoid unless nothing else works
   - Never use: data-testid, id, or className selectors
5. Test data goes in /data/ or /fixtures/ — not hardcoded in tests
6. Follow the same structure as guestCheckout.spec.ts for new tests
