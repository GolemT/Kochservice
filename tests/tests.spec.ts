import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Kochservice');
});

test('navigate to /recipe', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Rezepte → Eine Übersicht' }).click();

  await page.waitForLoadState()

  await expect(page.getByRole('heading', { name: 'Rezepte' })).toBeVisible();
});

test('See recipes', async ({ page }) => {
  await page.goto('/gericht?ID=5');

  // await expect(page.getByRole('heading', { name: 'Rezepte' })).toBeVisible();
  
  await expect(page.getByRole('heading', {name: 'Zebrakuchen' })).toBeVisible();
})

test('Inspect recipe', async ({ page }) => {
  await page.goto('/rezepte');
  
  await page.getByRole('link', { name: 'Zebrakuchen' }).click();

  await expect(page.getByRole('heading', { name: 'Zebrakuchen' })).toBeVisible();
})

test('check navbar', async ({ page }) => {
  await page.goto('/rezepte');

  await expect(page.getByRole('img', { name: "menu" })).toBeVisible()
  await expect(page.getByRole('textbox', {})).toBeVisible()
})
