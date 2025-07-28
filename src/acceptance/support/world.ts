import { chromium, Browser, Page, BrowserContext } from "@playwright/test";
import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import { AccountRegistrationWebDriver } from "../drivers/web/account_registration_web_driver";
import { ITestCaseHookParameter } from "@cucumber/cucumber/lib/support_code_library_builder/types";
import { parseTag } from "../../types/test.types";
import { validateFeatureTags } from "../../types/feature.validator";
import { AccountRegistrationDriver } from "../drivers/account_registration_driver.interface";
import { AccountRegistrationDSL } from "../dsl/account_registration_dsl";
import { AccountRegistrationApiDriver } from "../drivers/api/account_registration_api_driver";
import { LoginWebDriver } from "../drivers/web/login_web_driver";
import { LoginDSL } from "../dsl/login_dsl";
import { LoginDriver } from "../drivers/login_driver.interface";

export class CustomWorld extends World {
  public accountRegistrationDSL: AccountRegistrationDSL | null = null;
  public loginDSL: LoginDSL | null = null;
  protected page: Page | null = null;
  protected browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private accountRegistrationDriver?: AccountRegistrationDriver;
  private loginDriver?: LoginDriver;
  protected scenario?: ITestCaseHookParameter;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init(): Promise<void> {
    const tags = this.scenario?.pickle.tags.map((tag: { name: string }) => tag.name) || [];

    try {
      validateFeatureTags(tags);
    } catch (error) {
      console.error("Invalid tags in feature file:", error);
      throw error;
    }

    const testTags = tags.map(parseTag).filter((tag): tag is NonNullable<typeof tag> => tag !== null);
    const isUITest = testTags.some((tag) => tag.driver === "ui");
    const isApiTest = testTags.some((tag) => tag.driver === "api");

    if (isUITest) {
      this.browser = await chromium.launch({
        headless: false,
        slowMo: 1000, // Add a small delay to make actions more visible
      });
      this.page = await this.browser.newPage();

      // Add the specific header that bypasses DataDome
      await this.page.setExtraHTTPHeaders({
        "user-agent": "avesta-ua",
      });

      this.accountRegistrationDriver = new AccountRegistrationWebDriver(this.page);
      this.loginDriver = new LoginWebDriver(this.page);
    } else if (isApiTest) {
      this.accountRegistrationDriver = new AccountRegistrationApiDriver();
      // TODO: Add API driver for login when needed
    } else {
      throw new Error("Scenario must be tagged with either @ui or @api");
    }

    this.accountRegistrationDSL = new AccountRegistrationDSL(this.accountRegistrationDriver);
    if (this.loginDriver) {
      this.loginDSL = new LoginDSL(this.loginDriver);
    }
  }

  async destroy() {
    if (this.accountRegistrationDriver) {
      await this.accountRegistrationDriver.cleanup();
    }
    if (this.loginDriver) {
      await this.loginDriver.cleanup();
    }

    if (this.page) {
      await this.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(CustomWorld);
