import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";
import { RegistrationDetails } from "../dsl/models/registration";

Given("the registration service is available", async function (this: CustomWorld) {
  if (!this.accountRegistrationDSL) {
    throw new Error("DSL not initialized");
  }
  await this.accountRegistrationDSL.verifyRegistrationServiceAvailable();
});

Given(
  "a user exists with name {string} and email {string}",
  async function (this: CustomWorld, name: string, email: string) {
    if (!this.accountRegistrationDSL) {
      throw new Error("DSL not initialized");
    }
    // Using a default password for test setup, as it's not relevant to the registration check itself
    await this.accountRegistrationDSL.ensureUserExists({ name, email, password: "TestUser123!" });
  }
);

When("a user registers with valid details:", async function (this: CustomWorld, dataTable: any) {
  if (!this.accountRegistrationDSL) {
    throw new Error("DSL not initialized");
  }
  const [registrationData] = dataTable.hashes();
  const details: RegistrationDetails = {
    name: registrationData.Name,
    email: registrationData.Email,
    password: registrationData.Password,
  };

  await this.accountRegistrationDSL.registerUser(details);
});

When("a user registers with details:", async function (this: CustomWorld, dataTable: any) {
  if (!this.accountRegistrationDSL) {
    throw new Error("DSL not initialized");
  }
  const [registrationData] = dataTable.hashes();
  const details: RegistrationDetails = {
    name: registrationData.Name,
    email: registrationData.Email,
    password: registrationData.Password,
  };

  await this.accountRegistrationDSL.registerUser(details);
});

Then("the registration should be successful", async function (this: CustomWorld) {
  if (!this.accountRegistrationDSL) {
    throw new Error("DSL not initialized");
  }
  const registrationResult = await this.accountRegistrationDSL.getRegistrationResult();
  expect(registrationResult.success).toBe(true);
});

Then("a confirmation should be sent to {string}", async function (this: CustomWorld, email: string) {
  if (!this.accountRegistrationDSL) {
    throw new Error("DSL not initialized");
  }
  const confirmationSent = await this.accountRegistrationDSL.verifyConfirmationSent(email);
  expect(confirmationSent).toBe(true);
});

Then("the registration should be rejected", async function (this: CustomWorld) {
  if (!this.accountRegistrationDSL) {
    throw new Error("DSL not initialized");
  }
  const registrationResult = await this.accountRegistrationDSL.getRegistrationResult();
  expect(registrationResult.success).toBe(false);
});

Then("the reason should be {string}", async function (this: CustomWorld, expectedReason: string) {
  if (!this.accountRegistrationDSL) {
    throw new Error("DSL not initialized");
  }
  const registrationResult = await this.accountRegistrationDSL.getRegistrationResult();
  expect(registrationResult.errorMessage).toBe(expectedReason);
});
