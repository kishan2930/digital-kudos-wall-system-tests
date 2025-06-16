export const TEST_ENV = {
  LOCAL: "local",
  DEV: "dev",
  UAT: "uat",
  PROD: "prod",
} as const;

type TestEnvironment = (typeof TEST_ENV)[keyof typeof TEST_ENV];

interface EnvironmentConfig {
  baseUrl: string;
  apiUrl: string;
}

const DEFAULT_CONFIG: EnvironmentConfig = {
  baseUrl: "http://localhost:3000",
  apiUrl: "http://localhost:3001/api/v1",
};

const UAT_CONFIG: EnvironmentConfig = {
  baseUrl: process.env.CI_BASE_URL || "http://uat.digital-kudos-wall.com",
  apiUrl: process.env.APP_BACKEND_URL
    ? `${process.env.APP_BACKEND_URL}/api/v1`
    : "http://uat.digital-kudos-wall.com:3001/api/v1",
};

const DEV_CONFIG: EnvironmentConfig = {
  baseUrl: process.env.CI_BASE_URL || "http://dev.digital-kudos-wall.com",
  apiUrl: process.env.APP_BACKEND_URL
    ? `${process.env.APP_BACKEND_URL}/api/v1`
    : "http://dev.digital-kudos-wall.com:3001/api/v1",
};

const PROD_CONFIG: EnvironmentConfig = {
  baseUrl: "https://digital-kudos-wall.com",
  apiUrl: "https://api.digital-kudos-wall.com",
};

const getEnvironment = (): TestEnvironment => {
  const env = process.env.TEST_ENV?.toLowerCase();
  switch (env) {
    case TEST_ENV.UAT:
      return TEST_ENV.UAT;
    case TEST_ENV.DEV:
      return TEST_ENV.DEV;
    case TEST_ENV.PROD:
      return TEST_ENV.PROD;
    default:
      return TEST_ENV.LOCAL;
  }
};

const getConfig = (): EnvironmentConfig => {
  const environment = getEnvironment();
  switch (environment) {
    case TEST_ENV.UAT:
      return UAT_CONFIG;
    case TEST_ENV.DEV:
      return DEV_CONFIG;
    case TEST_ENV.PROD:
      return PROD_CONFIG;
    default:
      return DEFAULT_CONFIG;
  }
};

export const CONFIG = getConfig();
