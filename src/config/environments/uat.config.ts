import { BaseConfig, defaultConfig } from "./base.config";

export const productionConfig: BaseConfig = {
  ...defaultConfig,
  timeout: {
    ...defaultConfig.timeout,
    default: 10000, // Stricter timeouts for production
  },
};
