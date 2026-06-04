import { expect, test, type Page } from '@playwright/test';

const DEMO_EMAIL = 'taskflow.user@demo.dev';
const DEMO_PASSWORD = 'Password123!';

function mainNavLink(page: Page, label: string) {
  return page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: label, exact: true });
}

async function loginAsDemoUser(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(DEMO_EMAIL);
  await page.getByLabel('Password').fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible({ timeout: 15_000 });
}

test.describe('public routes', () => {
  test('home page renders', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Portfolio frontend')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'TaskFlow Web Client' })).toBeVisible();
  });

  test('login page renders', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByRole('form', { name: 'Sign in form' })).toBeVisible();
  });

  test('guest is redirected from dashboard to sign in', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });
});

test.describe('demo mode smoke', () => {
  test('demo login reaches dashboard summary', async ({ page }) => {
    await loginAsDemoUser(page);
    await expect(page.getByText('Signed in as')).toContainText(DEMO_EMAIL);
    await expect(page.getByText('Total projects')).toBeVisible();
    await expect(page.getByText('Total tasks')).toBeVisible();
  });

  test('projects page loads demo data', async ({ page }) => {
    await loginAsDemoUser(page);
    await mainNavLink(page, 'Projects').click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('Portfolio App')).toBeVisible({ timeout: 15_000 });
  });

  test('tasks page loads demo data', async ({ page }) => {
    await loginAsDemoUser(page);
    await mainNavLink(page, 'Tasks').click();
    await expect(page).toHaveURL(/\/tasks$/);
    await expect(page.getByRole('heading', { name: 'Tasks', exact: true })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('Implement authentication')).toBeVisible({ timeout: 15_000 });
  });

  test('dashboard route is reachable from navigation', async ({ page }) => {
    await loginAsDemoUser(page);
    await mainNavLink(page, 'Tasks').click();
    await mainNavLink(page, 'Dashboard').click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
    await expect(page.getByText('Tasks by status')).toBeVisible();
  });
});
