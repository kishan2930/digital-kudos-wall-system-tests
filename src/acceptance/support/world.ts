import { chromium, Browser, Page, BrowserContext } from "@playwright/test";
import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import { AccountRegistrationWebDriver } from "../drivers/web/account_registration_web_driver";
import { ITestCaseHookParameter } from "@cucumber/cucumber/lib/support_code_library_builder/types";
import { parseTag } from "../../types/test.types";
import { validateFeatureTags } from "../../types/feature.validator";
import { AccountRegistrationDriver } from "../drivers/account_registration_driver.interface";
import { AccountRegistrationDSL } from "../dsl/account_registration_dsl";
import { AccountRegistrationApiDriver } from "../drivers/api/account_registration_api_driver";

export class CustomWorld extends World {
  public dsl: AccountRegistrationDSL | null = null;
  protected page: Page | null = null;
  protected browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private driver?: AccountRegistrationDriver;
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
      this.browser = await chromium.launch();
      this.page = await this.browser.newPage();

      // Add the specific header that bypasses DataDome
      await this.page.setExtraHTTPHeaders({
        "user-agent": "avesta-ua",
      });

      this.driver = new AccountRegistrationWebDriver(this.page);
    } else if (isApiTest) {
      this.driver = new AccountRegistrationApiDriver();
    } else {
      throw new Error("Scenario must be tagged with either @ui or @api");
    }

    this.dsl = new AccountRegistrationDSL(this.driver);
  }

  async destroy() {
    if (this.driver) {
      await this.driver.cleanup();
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
