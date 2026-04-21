import { expect, test } from '@playwright/test';

test('successful webhook completes before redirect callback', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /abrir atendimento/i }).click();
  await page.locator('input[name="name"]').fill('Joao Silva');
  await page.locator('input[name="whatsapp"]').fill('11999999999');
  await page.locator('select[name="subject"]').selectOption('Cadastro');
  await page.locator('input[name="lgpd"]').check();
  await page.getByRole('button', { name: /enviar/i }).click();

  await expect.poll(() => page.evaluate(() => window.__wppLeadRedirects.length)).toBe(1);
  await expect.poll(() => page.evaluate(() => window.__wppLeadSubmissions.length)).toBe(1);
});

test('webhook error and timeout still redirect to WhatsApp', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.__wppLeadSubmissions = [];
    window.__wppLeadRedirects = [];
    window.__wppLeadMode = 'timeout';
  });

  await page.getByRole('button', { name: /abrir atendimento/i }).click();
  await page.locator('input[name="name"]').fill('Ana Lima');
  await page.locator('input[name="whatsapp"]').fill('11977776666');
  await page.locator('select[name="subject"]').selectOption('Duvida tecnica');
  await page.locator('input[name="lgpd"]').check();
  await page.getByRole('button', { name: /enviar/i }).click();

  await expect.poll(() => page.evaluate(() => window.__wppLeadRedirects.length)).toBe(1);
});

test('honeypot aborts webhook, conclusion event and redirect', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /abrir atendimento/i }).click();
  await page.locator('input[name="name"]').fill('Bot Spam');
  await page.locator('input[name="whatsapp"]').fill('11999999999');
  await page.locator('select[name="subject"]').selectOption('Pedidos');
  await page.locator('input[name="lgpd"]').check();
  await page.locator('input[name="company_url"]').evaluate((input) => {
    input.value = 'https://spam.test';
  });
  await page.getByRole('button', { name: /enviar/i }).click();

  const result = await page.evaluate(() => ({
    submissions: window.__wppLeadSubmissions.length,
    redirects: window.__wppLeadRedirects.length,
    events: window.dataLayer.map((event) => event.event)
  }));

  expect(result.submissions).toBe(0);
  expect(result.redirects).toBe(0);
  expect(result.events).toEqual(['wpp_qualificacao_inicio']);
});
