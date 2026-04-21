import { expect, test } from '@playwright/test';

test('product snippet opens widget with product context', async ({ page }) => {
  await page.goto('/');
  await page.locator('.wpp-lead-product-trigger').click();

  await expect(page.locator('.wpp-lead-product-bubble')).toContainText('Atendimento sobre');
  await expect(page.locator('.wpp-lead-product-bubble strong')).toHaveText('Anel de Diamante Vereda');
  await expect(page.locator('select[name="subject"]')).toHaveValue('__product__');
  await expect(page.locator('select[name="subject"]')).toBeDisabled();
  await page.locator('input[name="name"]').fill('Maria Souza');
  await page.locator('input[name="whatsapp"]').fill('11988887777');
  await page.locator('input[name="lgpd"]').check();
  await page.getByRole('button', { name: /enviar/i }).click();

  await expect.poll(() => page.evaluate(() => window.__wppLeadSubmissions.length)).toBe(1);
  const payload = await page.evaluate(() => window.__wppLeadSubmissions[0].payload);

  expect(payload.produto_interesse).toBe('Anel de Diamante Vereda');
  expect(payload.produto_id).toBe('123');
  expect(payload.assunto).toBeUndefined();
});

test('missing product attributes fall back to global subject menu', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const button = document.querySelector('.wpp-lead-product-trigger');
    button.removeAttribute('data-product-id');
  });

  await page.locator('.wpp-lead-product-trigger').click();
  await expect(page.locator('select[name="subject"]')).toBeVisible();
  await expect(page.locator('select[name="subject"]')).toBeEnabled();
  await expect(page.locator('select[name="subject"]')).toHaveValue('');
  await expect(page.locator('[data-role="product-question"]')).toBeHidden();
});
