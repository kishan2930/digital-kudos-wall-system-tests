import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";

Given("the login service is available", async function () {
  await this.loginDSL.checkServiceAvailability();
});

Given(
  "a user exists with email {string} and password {string}",
  async function (
   this:CustomWorld, email: string, password: string) {
    if (!this.loginDSL) {
      throw new Error("LoginDSL is not initialized");
    }
    await this.loginDSL.createTestUser(email, password);
  }
);

When("the user logs in with:", async function (dataTable: DataTable) {
  const credentials = dataTable.hashes()[0];
  await this.loginDSL.loginUser({
    email: credentials.Email,
    password: credentials.Password,
  });
});

Then("the login should be successful", async function () {
  const isSuccessful = await this.loginDSL.isLoginSuccessful();
  expect(isSuccessful).toBe(true);
});

Then("the user should be redirected to the kudos wall", async function () {
  const isKudosWallVisible = await this.loginDSL.isKudosWallVisible();
  expect(isKudosWallVisible).toBe(true);
});

Then("the login should be rejected", async function () {
  const isSuccessful = await this.loginDSL.isLoginSuccessful();
  expect(isSuccessful).toBe(false);
});

Then(
  "the login error should be {string}",
  async function (expectedError: string) {
    const errorMessage = await this.loginDSL.getLoginErrorMessage();
    expect(errorMessage).toBe(expectedError);
  }
);
