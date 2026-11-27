const { test, expect } = require('@playwright/test');

test('kasutaja saab lisada ülesande', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');

  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Õpi UI testimist');
  await input.press('Enter');

  await expect(page.getByText('Õpi UI testimist')).toBeVisible();
});

test('kasutaja saab märkida ülesande lõpetatuks', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');

  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Esimene test');
  await input.press('Enter');

  const task = page.getByRole('listitem').filter({
    hasText: 'Esimene test'
  });
  const checkbox = task.getByRole('checkbox');

  await checkbox.check();
  await expect(checkbox).toBeChecked();
});

test('kasutaja saab kustutada ülesande', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');

  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Kustutatav ülesanne');
  await input.press('Enter');

  const task = page.getByRole('listitem').filter({
    hasText: 'Kustutatav ülesanne'
  });

  await task.hover();
  await task.locator('button.destroy').click();

  await expect(page.getByText('Kustutatav ülesanne')).toHaveCount(0);
});

test('lisategevus: kaks ülesannet ja aktiivsete/lõpetatud filtrid', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/');

  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Ülesanne 1');
  await input.press('Enter');
  await input.fill('Ülesanne 2');
  await input.press('Enter');

  const todoItems = page.locator('.todo-list li');
  await expect(todoItems).toHaveCount(2);

  const task1 = todoItems.filter({ hasText: 'Ülesanne 1' });
  await task1.getByRole('checkbox').check();

  await page.getByRole('link', { name: 'Active' }).click();
  await expect(page.getByText('Ülesanne 2')).toBeVisible();
  await expect(page.getByText('Ülesanne 1')).toHaveCount(0);

  await page.getByRole('link', { name: 'Completed' }).click();
  await expect(page.getByText('Ülesanne 1')).toBeVisible();
  await expect(page.getByText('Ülesanne 2')).toHaveCount(0);
});