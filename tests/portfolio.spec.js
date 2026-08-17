import { test, expect } from '@playwright/test';

test.describe('Pruebas E2E - Portafolio y Formulario de Contacto', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('1. Validar que el isotipo y nombre carguen correctamente', async ({ page }) => {
    await expect(page.getByText('Martin Tonatiuh Hernandez Garfias')).toBeVisible();
    await expect(page.getByText('Frontend & QA Automation')).toBeVisible();
  });

  test('2. Probar la apertura y validaciones del modal de contacto', async ({ page }) => {
    // Abrir modal con botón "Iniciar Proyecto"
    const btnIniciar = page.getByRole('button', { name: 'Iniciar Proyecto' });
    await btnIniciar.click();

    // Validar que el modal se muestre
    const modalTitle = page.getByRole('heading', { name: 'Platiquemos sobre tu Proyecto' });
    await expect(modalTitle).toBeVisible();

    // Intentar enviar sin datos para verificar validaciones de error
    const btnWhatsApp = page.getByRole('button', { name: 'Enviar a WhatsApp' });
    await btnWhatsApp.click();

    await expect(page.getByText('El nombre es obligatorio.')).toBeVisible();
    await expect(page.getByText('El correo electrónico es obligatorio.')).toBeVisible();

    // Llenar campos
    await page.getByLabel('Nombre Completo *').fill('Cliente Prueba QA');
    await page.getByLabel('Correo Electrónico *').fill('cliente@prueba.com');
    await page.getByLabel('Mensaje o Detalles del Proyecto *').fill('Necesito automatizar pruebas E2E y construir una UI.');

    // 📸 Captura de evidencia del modal completado
    await page.screenshot({ path: 'screenshots/04-formulario-contacto.png', fullPage: true });

    // Cerrar modal
    const btnCerrar = page.getByLabel('Cerrar modal');
    await btnCerrar.click();
    await expect(modalTitle).not.toBeVisible();
  });

});
