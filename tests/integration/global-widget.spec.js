import { expect, test } from '@playwright/test';

test('global widget opens, closes and toggles icon', async ({ page }) => {
  await page.goto('/');

  const button = page.getByRole('button', { name: /abrir atendimento/i });
  await expect(button).toBeVisible();
  await button.click();

  await expect(page.getByRole('button', { name: /fechar atendimento/i })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.wpp-lead-button-icon-close')).toHaveCSS('opacity', '1');
  await expect(page.getByText('Atendimento pelo WhatsApp')).toBeVisible();

  await page.getByRole('button', { name: /fechar atendimento/i }).click();
  await expect(page.getByRole('button', { name: /abrir atendimento/i })).toHaveAttribute('aria-expanded', 'false');
});

test('valid global submission records payload, GTM events and redirect URL', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /abrir atendimento/i }).click();
  await page.locator('input[name="name"]').fill('Joao Silva');
  await page.locator('input[name="whatsapp"]').fill('11999999999');
  await page.locator('select[name="subject"]').selectOption('Pedidos');
  await page.locator('input[name="lgpd"]').check();
  await page.getByRole('button', { name: /enviar/i }).click();

  await expect.poll(() => page.evaluate(() => window.__wppLeadSubmissions.length)).toBe(1);
  const result = await page.evaluate(() => ({
    submissions: window.__wppLeadSubmissions,
    redirects: window.__wppLeadRedirects,
    dataLayer: window.dataLayer
  }));

  expect(result.submissions[0].payload).toMatchObject({
    nome: 'Joao Silva',
    whatsapp: '5511999999999',
    assunto: 'Pedidos'
  });
  expect(result.redirects[0]).toContain('https://wa.me/5511999999999');
  expect(result.dataLayer.map((event) => event.event)).toEqual([
    'wpp_qualificacao_inicio',
    'wpp_qualificacao_concluida'
  ]);
});
