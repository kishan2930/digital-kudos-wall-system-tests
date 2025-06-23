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
  baseUrl: "http://frontend",
  apiUrl: "http://backend:3001",
};

const UAT_CONFIG: EnvironmentConfig = {
  baseUrl: process.env.CI_BASE_URL || "http://uat.digital-kudos-wall.com",
  apiUrl: process.env.APP_BACKEND_URL || "http://uat.digital-kudos-wall.com:3001",
};

const DEV_CONFIG: EnvironmentConfig = {
  baseUrl: process.env.CI_BASE_URL || "http://dev.digital-kudos-wall.com",
  apiUrl: process.env.APP_BACKEND_URL || "http://dev.digital-kudos-wall.com:3001",
};

const PROD_CONFIG: EnvironmentConfig = {
  baseUrl: "https://digital-kudos-wall.com",
  apiUrl: "https://api.digital-kudos-wall.com",
};

const getEnvironment = (): TestEnvironment => {
  const env = process.env.TEST_ENV?.toLowerCase();
  console.log(`Current TEST_ENV: ${env}`);
  console.log(`All environment variables:`, {
    TEST_ENV: process.env.TEST_ENV,
    CI_BASE_URL: process.env.CI_BASE_URL,
    APP_BACKEND_URL: process.env.APP_BACKEND_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  switch (env) {
    case TEST_ENV.UAT:
      console.log("Using UAT environment");
      return TEST_ENV.UAT;
    case TEST_ENV.DEV:
      console.log("Using DEV environment");
      return TEST_ENV.DEV;
    case TEST_ENV.PROD:
      console.log("Using PROD environment");
      return TEST_ENV.PROD;
    default:
      console.log("Using LOCAL environment (default)");
      return TEST_ENV.LOCAL;
  }
};

const getConfig = (): EnvironmentConfig => {
  const environment = getEnvironment();
  let config: EnvironmentConfig;

  switch (environment) {
    case TEST_ENV.UAT:
      config = UAT_CONFIG;
      break;
    case TEST_ENV.DEV:
      config = DEV_CONFIG;
      break;
    case TEST_ENV.PROD:
      config = PROD_CONFIG;
      break;
    default:
      config = DEFAULT_CONFIG;
  }

  console.log("Using configuration:", {
    environment,
    baseUrl: config.baseUrl,
    apiUrl: config.apiUrl,
  });

  return config;
};

export const CONFIG = getConfig();
