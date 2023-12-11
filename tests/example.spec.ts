import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('localhost:3000');

  await expect(page).toHaveTitle('Kochservice');
});

test('navigate to /recipe', async ({ page }) => {
  await page.goto('localhost:3000');

  await page.getByRole('link', { name: 'Rezepte → Eine Übersicht' }).click();

  await page.waitForLoadState()

  await expect(page.getByRole('heading', { name: 'Rezepte' })).toBeVisible();
});

// test('See recipes', async ({ page }) => {
//   await page.goto('localhost:3000/recipe')

//   // await expect(page.getByRole('heading', { name: 'Rezepte' })).toBeVisible();
  
//   await expect(page.getByText('Zebrakuchen')).toBeVisible();
// })

// test('Inspect recipe', async ({ page }) => {
//   await page.goto('localhost:3000/recipe');
  
//   await page.getByText('Zebrakuchen').click();

//   await expect(page.getByRole('heading', { name: 'Zebrakuchen' })).toBeVisible();
// })

// test('check navbar', async ({ page }) => {
//   await page.goto('localhost:3000/recipe');

//   await expect(page.getByRole('heading', {name: "GolemT's Kochservice" })).toBeVisible();
//   await expect(page.getByRole('img', {name: "menu" })).toBeVisible()
//   await expect(page.getByText('Search...')).toBeVisible()
// })
