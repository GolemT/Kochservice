import { test, expect } from '@playwright/test';
import data from '../components/data.json';

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

test('See recipes', async ({ page }) => {
  await page.goto('localhost:3000/gericht?ID=5');

  // await expect(page.getByRole('heading', { name: 'Rezepte' })).toBeVisible();
  
  await expect(page.getByRole('heading', {name: 'Zebrakuchen' })).toBeVisible();
})

test('Inspect recipe', async ({ page }) => {
  await page.goto('localhost:3000/rezepte');
  
  await page.getByRole('link', { name: 'Zebrakuchen' }).click();

  await expect(page.getByRole('heading', { name: 'Zebrakuchen' })).toBeVisible();

  const document = await page.getByText('300g Mehl, 1 Pck. Backpulver', {});

  await expect(document).toBeVisible();
  await expect(document).toHaveText(data[5].ingredients);
})

test('check navbar', async ({ page }) => {
  await page.goto('localhost:3000/rezepte');

  await expect(page.getByRole('link', { name: "GolemT's Kochservice" })).toBeVisible();
  await expect(page.getByRole('img', { name: "menu" })).toBeVisible()
  await expect(page.getByRole('textbox', {})).toBeVisible()

  await expect(page.getByText('GolemT\'s Kochservice×')).toBeInViewport();

})
