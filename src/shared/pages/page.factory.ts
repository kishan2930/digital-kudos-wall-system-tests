import { Page } from "@playwright/test";
import { AccountRegistrationPage } from "../../acceptance/drivers/web/pages/account_registration.page";
import { HomePage } from "./home.page";

export class PageFactory {
  static createHomePage(page: Page): HomePage {
    return new HomePage(page);
  }

  static createAccountRegistrationPage(page: Page): AccountRegistrationPage {
    return new AccountRegistrationPage(page);
  }
}
