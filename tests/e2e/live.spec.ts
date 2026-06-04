import { test } from '@playwright/test';

const describeLive =
  process.env.E2E_LIVE_API === 'true' ? test.describe : test.describe.skip;

describeLive('live API e2e', () => {
  test('live auth flow is optional and documented separately', async () => {
    // Use E2E_LIVE_API=true with a running TASKFLOW_API, or npm run check:live-api for scripted smoke.
  });
});
