import dotenv from 'dotenv';
import path from 'node:path';
// import { getPlaywrightSettings } from '../playwright.config';

const testEnvironment = process.env.TEST_ENV ?? 'qa';
if (!['qa', 'uat'].includes(testEnvironment)) {
  throw new Error(`Unsupported TEST_ENV "${testEnvironment}". Use qa or uat.`);
}

const environmentFile = path.resolve(__dirname, `.env.${testEnvironment}`);
const dotenvResult = dotenv.config({ path: environmentFile });
if (dotenvResult.error) {
  throw new Error(
    `Could not load environment file "${environmentFile}": ${dotenvResult.error.message}`,
  );
}

const environmentValues = dotenvResult.parsed ?? {};
const BASE_URL =
  process.env.APP_BASE_URL ?? environmentValues.BASE_URL ?? process.env.BASE_URL;
const USERNAME =
  process.env.APP_USERNAME ?? environmentValues.USERNAME ?? process.env.USERNAME;
const PASSWORD =
  process.env.APP_PASSWORD ?? environmentValues.PASSWORD ?? process.env.PASSWORD;
if (!BASE_URL || !USERNAME || !PASSWORD) {
  throw new Error(
    `BASE_URL, USERNAME, and PASSWORD must be set in "${environmentFile}".`,
  );
}

export const config = {
  baseUrl: BASE_URL,
  username: USERNAME,
  password: PASSWORD,
  testEnvironment,
  ...getPlaywrightSettings(process.env),
};
