import type { LaunchOptions } from 'playwright';

export type BrowserName = 'chromium' | 'firefox' | 'webkit';

export interface PlaywrightSettings {
  browserName: BrowserName;
  launchOptions: LaunchOptions;
  timeoutMs: number;
}

function isBrowserName(value: string): value is BrowserName {
  return ['chromium', 'firefox', 'webkit'].includes(value);
}

// These are Playwright library launch settings; Cucumber remains the test runner.
export function getPlaywrightSettings(
  environment: NodeJS.ProcessEnv,
): PlaywrightSettings {
  const browserName = environment.BROWSER ?? 'chromium';
  if (!isBrowserName(browserName)) {
    throw new Error(
      `Unsupported BROWSER "${browserName}". Use chromium, firefox, or webkit.`,
    );
  }

  const headlessValue = environment.HEADLESS ?? 'true';
  if (!['true', 'false'].includes(headlessValue.toLowerCase())) {
    throw new Error('HEADLESS must be either "true" or "false".');
  }

  const timeoutMs = Number(environment.TIMEOUT_MS ?? 30000);
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error('TIMEOUT_MS must be a positive number.');
  }

  return {
    browserName,
    launchOptions: { headless: headlessValue.toLowerCase() === 'true' },
    timeoutMs,
  };
}
