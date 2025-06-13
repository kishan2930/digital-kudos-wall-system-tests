import { BaseConfig, defaultConfig } from "./base.config";

export const developmentConfig: BaseConfig = {
  ...defaultConfig,
  timeout: {
    ...defaultConfig.timeout,
    default: 15000, // Longer timeouts for development
  },
};
