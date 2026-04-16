import { expect } from '@playwright/test';
import { test } from '../fixtures/page-manager';
import * as testData from '../data/testData.json';

test('Debug: Inspect region card structure', async ({ page }) => {
  await page.goto(testData.Environment.url);
  
  // Wait for page to load
  await page.waitForLoadState('domcontentloaded');
  
  // Try to accept cookies
  try {
    const cookieBtn = page.getByRole('button', { name: /accept|cookie/i });
    if (await cookieBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cookieBtn.click();
    }
  } catch (e) {
    console.log('Cookie banner not found');
  }

  // Wait a bit for content to fully render
  await page.waitForTimeout(2000);

  // Scroll to Popular Destinations
  const popDestHeading = page.getByText('Popular Destinations');
  await popDestHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Get the Europe heading and examine its parent structure
  console.log('\n=== EUROPE REGION CARD STRUCTURE ===');
  const europeHeading = await page.getByRole('heading', { level: 3, name: 'Europe' });
  
  // Try to get parents  
  const europeHeadingHandle = await page.locator('h3:text-is("Europe")').first();
  
  // Get the HTML of various parent levels
  const europeParent1 = europeHeadingHandle.locator('..');
  const europeParent2 = europeHeadingHandle.locator('../..');
  const europeParent3 = europeHeadingHandle.locator('../../..');
  
  const parent1Html = await europeParent1.evaluate((el) => {
    return {
      tag: el.tagName,
      class: el.className,
      children: el.children.length,
      html: el.outerHTML.substring(0, 300)
    };
  }).catch(() => ({ error: 'Could not access parent 1' }));
  
  console.log('Parent 1 (direct):', parent1Html);
  
  const parent2Html = await europeParent2.evaluate((el) => {
    return {
      tag: el.tagName,
      class: el.className,
      children: el.children.length
    };
  }).catch(() => ({ error: 'Could not access parent 2' }));
  
  console.log('Parent 2:', parent2Html);
  
  const parent3Html = await europeParent3.evaluate((el) => {
    return {
      tag: el.tagName,
      class: el.className,
      children: el.children.length
    };
  }).catch(() => ({ error: 'Could not access parent 3' }));
  
  console.log('Parent 3:', parent3Html);

  // Find the Explore link near Europe
  console.log('\n=== EUROPE EXPLORE LINK ===');  
  const exploreLinks = await page.locator('a[href*="europe"]').all();
  console.log(`Found ${exploreLinks.length} links with href containing "europe"`);
  
  const exploreEurope = page.locator('a[href="/our-destinations/europe"]');
  const exploreText = await exploreEurope.textContent();
  console.log(`Explore link text: "${exploreText}"`);
  
  const exploreParent = await exploreEurope.locator('..').evaluate((el) => ({
    tag: el.tagName,
    class: el.className,
  })).catch(() => ({ error: 'Could not access parent' }));
  
  console.log('Explore link parent:', exploreParent);

  expect(true).toBe(true);
});

