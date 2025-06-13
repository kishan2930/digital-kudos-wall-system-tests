import { Page } from "@playwright/test";
import { AccountRegistrationPage } from "./account_registration.page";

export class PageFactory {
  static createAccountRegistrationPage(page: Page): AccountRegistrationPage {
    return new AccountRegistrationPage(page);
  }
}
