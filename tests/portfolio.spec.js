import { test, expect } from '@playwright/test';

test.describe('Pruebas E2E - Portafolio Completo', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('1. Validar identidad en cabecera y secciones principales', async ({ page }) => {
    await expect(page.getByRole('banner').getByText('Martin Tonatiuh Hernandez Garfias')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Proyectos & Soluciones Técnicas' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Martin Tonatiuh Hernandez Garfias' })).toBeVisible();
  });

  test('2. Validar apertura y cierre del modal de contacto', async ({ page }) => {
    const btnIniciar = page.getByRole('button', { name: 'Iniciar Proyecto' }).first();
    await btnIniciar.click();

    const modalTitle = page.getByRole('heading', { name: 'Platiquemos sobre tu Proyecto' });
    await expect(modalTitle).toBeVisible();

    const btnCerrar = page.getByLabel('Cerrar modal');
    await btnCerrar.click();
    await expect(modalTitle).not.toBeVisible();
  });

  test('3. Validar apertura y opciones del modal de descarga de CV', async ({ page }) => {
    const btnCV = page.getByRole('button', { name: /Descargar CV/i }).first();
    await btnCV.click();

    const modalCV = page.getByRole('heading', { name: 'Descargar CV Ejecutivo' });
    await expect(modalCV).toBeVisible();

    await expect(page.getByText('Versión en Español (PDF)')).toBeVisible();
    await expect(page.getByText('English Version (PDF)')).toBeVisible();

    const btnCerrar = page.getByLabel('Cerrar modal');
    await btnCerrar.click();
    await expect(modalCV).not.toBeVisible();
  });

});
