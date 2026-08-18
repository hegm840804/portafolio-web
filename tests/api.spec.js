import { test, expect } from '@playwright/test';

test.describe('Pruebas Automatizadas de API REST', () => {
  const BASE_URL = 'https://jsonplaceholder.typicode.com';

  test('1. Validar GET /posts/1 - Status 200 y Payload', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts/1`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('title');
    expect(typeof body.title).toBe('string');
  });

  test('2. Validar POST /posts - Status 201 Created', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/posts`, {
      data: {
        title: 'Prueba Automatizada QA',
        body: 'Validacion de endpoints con Playwright',
        userId: 1,
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.title).toBe('Prueba Automatizada QA');
  });

  test('3. Validar GET /posts/99999 - Manejo de error 404', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts/99999`);
    expect(response.status()).toBe(404);
  });
});
