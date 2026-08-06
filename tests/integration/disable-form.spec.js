import { expect, test } from '@playwright/test';

test.describe('WhatsApp Lead Widget with disableForm: true', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      // Clone and replace the trigger button to clear old event listeners
      const oldTrigger = document.querySelector('.wpp-lead-product-trigger');
      if (oldTrigger) {
        const newTrigger = oldTrigger.cloneNode(true);
        oldTrigger.replaceWith(newTrigger);
      }

      // Re-initialize widget with disableForm enabled
      window.initWhatsAppLeadWidget({
        phoneNumber: '5511999999999',
        disableForm: true,
        redirectMode: 'callback',
        onRedirect: (url) => window.__wppLeadRedirects.push(url)
      });
    });
  });

  test('clicking floating button redirects immediately to WhatsApp with simplified message', async ({ page }) => {
    const button = page.getByRole('button', { name: /abrir atendimento/i });
    await expect(button).toBeVisible();
    await button.click();

    // Panel should remain hidden
    const panel = page.locator('.wpp-lead-panel');
    await expect(panel).toBeHidden();

    // Verify GTM events
    const dataLayer = await page.evaluate(() => window.dataLayer);
    expect(dataLayer.map(e => e.event)).toEqual([
      'wpp_qualificacao_inicio',
      'wpp_qualificacao_concluida'
    ]);

    // Verify redirect
    const redirects = await page.evaluate(() => window.__wppLeadRedirects);
    expect(redirects.length).toBe(1);
    expect(redirects[0]).toContain('https://wa.me/5511999999999?text=Ola!%20Gostaria%20de%20atendimento.');
  });

  test('clicking product trigger redirects immediately with product context in the message', async ({ page }) => {
    await page.locator('.wpp-lead-product-trigger').click();

    // Panel should remain hidden
    const panel = page.locator('.wpp-lead-panel');
    await expect(panel).toBeHidden();

    // Verify GTM events
    const dataLayer = await page.evaluate(() => window.dataLayer);
    expect(dataLayer.map(e => e.event)).toEqual([
      'wpp_qualificacao_inicio',
      'wpp_qualificacao_concluida'
    ]);

    // Verify redirect
    const redirects = await page.evaluate(() => window.__wppLeadRedirects);
    expect(redirects.length).toBe(1);
    expect(redirects[0]).toContain('https://wa.me/5511999999999?text=Ola!%20Gostaria%20de%20atendimento%20sobre%20Anel%20de%20Diamante%20Vereda.');
  });
});
