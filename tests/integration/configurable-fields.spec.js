import { expect, test } from '@playwright/test';

test('default without ?fields= renders only Nome/WhatsApp', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /abrir atendimento/i }).click();

  await expect(page.locator('input[name="cnpj"]')).toHaveCount(0);
  await expect(page.locator('input[name="razaoSocial"]')).toHaveCount(0);
  await expect(page.locator('input[name="email"]')).toHaveCount(0);
});

test('?fields=email,cnpj renders Email before CNPJ after WhatsApp', async ({ page }) => {
  await page.goto('/?fields=email,cnpj');
  await page.getByRole('button', { name: /abrir atendimento/i }).click();

  const names = await page.locator('form.wpp-lead-form :is(input,select)').evaluateAll(
    (elements) => elements.map((el) => el.name)
  );
  const whatsappIndex = names.indexOf('whatsapp');
  expect(names.indexOf('email')).toBe(whatsappIndex + 1);
  expect(names.indexOf('cnpj')).toBe(whatsappIndex + 2);
});

test('?fields=email,whatsapp,cnpj keeps WhatsApp fixed in 2nd position', async ({ page }) => {
  await page.goto('/?fields=email,whatsapp,cnpj');
  await page.getByRole('button', { name: /abrir atendimento/i }).click();

  const names = await page.locator('form.wpp-lead-form :is(input,select)').evaluateAll(
    (elements) => elements.map((el) => el.name)
  );
  expect(names[0]).toBe('name');
  expect(names[1]).toBe('whatsapp');
});

test('?fields=*email empty blocks submit without network/redirect', async ({ page }) => {
  await page.goto('/?fields=*email');
  await page.getByRole('button', { name: /abrir atendimento/i }).click();
  await page.locator('input[name="name"]').fill('Joao Silva');
  await page.locator('input[name="whatsapp"]').fill('11999999999');
  await page.locator('select[name="subject"]').selectOption('Cadastro');
  await page.locator('input[name="lgpd"]').check();
  await page.getByRole('button', { name: /enviar/i }).click();

  await expect(page.locator('.wpp-lead-errors')).toContainText(/e-mail/i);
  const result = await page.evaluate(() => ({
    submissions: window.__wppLeadSubmissions.length,
    redirects: window.__wppLeadRedirects.length
  }));
  expect(result.submissions).toBe(0);
  expect(result.redirects).toBe(0);
});

test('?fields=cnpj empty without * allows submit', async ({ page }) => {
  await page.goto('/?fields=cnpj');
  await page.getByRole('button', { name: /abrir atendimento/i }).click();
  await page.locator('input[name="name"]').fill('Joao Silva');
  await page.locator('input[name="whatsapp"]').fill('11999999999');
  await page.locator('select[name="subject"]').selectOption('Cadastro');
  await page.locator('input[name="lgpd"]').check();
  await page.getByRole('button', { name: /enviar/i }).click();

  await expect.poll(() => page.evaluate(() => window.__wppLeadRedirects.length)).toBe(1);
});

test('?fields=cnpj,email filled values appear in captured payload, razao_social absent', async ({ page }) => {
  await page.goto('/?fields=cnpj,email');
  await page.getByRole('button', { name: /abrir atendimento/i }).click();
  await page.locator('input[name="name"]').fill('Joao Silva');
  await page.locator('input[name="whatsapp"]').fill('11999999999');
  await page.locator('input[name="cnpj"]').fill('12.345.678/0001-99');
  await page.locator('input[name="email"]').fill('joao@teste.com');
  await page.locator('select[name="subject"]').selectOption('Cadastro');
  await page.locator('input[name="lgpd"]').check();
  await page.getByRole('button', { name: /enviar/i }).click();

  await expect.poll(() => page.evaluate(() => window.__wppLeadSubmissions.length)).toBe(1);
  const payload = await page.evaluate(() => window.__wppLeadSubmissions[0].payload);
  expect(payload.cnpj).toBe('12.345.678/0001-99');
  expect(payload.email).toBe('joao@teste.com');
  expect(payload.razao_social).toBeUndefined();
});

test('field labels "CNPJ"/"Razão Social"/"E-mail" are visible wrapping the inputs', async ({ page }) => {
  await page.goto('/?fields=cnpj,razaoSocial,email');
  await page.getByRole('button', { name: /abrir atendimento/i }).click();

  await expect(page.getByLabel('CNPJ')).toBeVisible();
  await expect(page.getByLabel('Razão Social')).toBeVisible();
  await expect(page.getByLabel('E-mail')).toBeVisible();
});
