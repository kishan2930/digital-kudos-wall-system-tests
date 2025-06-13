import { Before, After, setDefaultTimeout } from "@cucumber/cucumber";
import { CustomWorld } from "./world";

setDefaultTimeout(60 * 1000); // 60 seconds

Before(async function (this: CustomWorld, scenario) {
  this.scenario = scenario;
  await this.init();
});

After(async function (this: CustomWorld) {
  await this.destroy();
});
