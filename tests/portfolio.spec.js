import { test, expect } from '@playwright/test';

test.describe('Pruebas E2E - Portafolio Completo', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('1. Validar identidad, cabecera y secciones principales', async ({ page }) => {
    await expect(page.getByText('Martin Tonatiuh Hernandez Garfias')).toBeVisible();
    await expect(page.getByText('Frontend & QA Automation')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Proyectos & Soluciones Técnicas' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Calidad Funcional, Automatización & Desarrollo Frontend' })).toBeVisible();
  });

  test('2. Validar interacción con el modal de contacto', async ({ page }) => {
    const btnIniciar = page.getByRole('button', { name: 'Iniciar Proyecto' }).first();
    await btnIniciar.click();

    const modalTitle = page.getByRole('heading', { name: 'Platiquemos sobre tu Proyecto' });
    await expect(modalTitle).toBeVisible();

    const btnWhatsApp = page.getByRole('button', { name: 'Enviar por WhatsApp' });
    await btnWhatsApp.click();

    await expect(page.getByText('El nombre es obligatorio.')).toBeVisible();
    await expect(page.getByText('El correo electrónico es obligatorio.')).toBeVisible();

    const btnCerrar = page.getByLabel('Cerrar modal');
    await btnCerrar.click();
    await expect(modalTitle).not.toBeVisible();
  });

});
