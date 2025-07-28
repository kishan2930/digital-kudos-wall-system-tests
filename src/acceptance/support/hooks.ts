import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from "@cucumber/cucumber";
import { CustomWorld } from "./world";
import { Logger } from "./logger";

setDefaultTimeout(60 * 1000); // 60 seconds

BeforeAll(function() {
  Logger.testSuite("Digital Kudos Wall Acceptance Tests");
});

Before(async function (this: CustomWorld, scenario) {
  this.scenario = scenario;
  
  // Extract feature name from scenario
  const featureName = scenario.gherkinDocument?.feature?.name || "Unknown Feature";
  const scenarioName = scenario.pickle.name;
  
  // Log feature and scenario information with beautiful formatting
  Logger.feature(featureName);
  Logger.scenario(scenarioName);
  
  // Simple approach: Extract example values from data tables in steps
  const steps = scenario.pickle.steps || [];
  const exampleValues: Record<string, string> = {};
  let exampleFound = false;
  
  steps.forEach(step => {
    if (step.argument?.dataTable) {
      const dataTable = step.argument.dataTable;
      if (dataTable.rows && dataTable.rows.length >= 2) {
        const headers = dataTable.rows[0].cells.map(cell => cell.value);
        const values = dataTable.rows[1].cells.map(cell => cell.value);
        
        headers.forEach((header, index) => {
          if (values[index]) {
            exampleValues[header] = values[index];
            exampleFound = true;
          }
        });
      }
    }
    
    // Also extract values from step text that look like they might be examples
    const stepText = step.text;
    
    // Look for email patterns
    const emailMatch = stepText.match(/([a-zA-Z0-9@._-]+@[a-zA-Z0-9._-]*\.?[a-zA-Z]*)/);
    if (emailMatch && emailMatch[1] !== 'user@example.com') {
      exampleValues['email'] = emailMatch[1];
      exampleFound = true;
    }
    
    // Look for password patterns in quotes
    const passwordMatch = stepText.match(/"([^"]+)"/);
    if (passwordMatch && passwordMatch[1] && passwordMatch[1].length < 20) {
      // Check if it looks like a password (not an error message)
      if (!passwordMatch[1].includes(' ') || passwordMatch[1].length <= 12) {
        exampleValues['password'] = passwordMatch[1];
        exampleFound = true;
      }
    }
    
    // Look for error messages
    const errorMatch = stepText.match(/should be "([^"]*(?:must|required|invalid|format|character|number)[^"]*)"/i);
    if (errorMatch && errorMatch[1]) {
      exampleValues['error_message'] = errorMatch[1];
      exampleFound = true;
    }
  });
  
  // If we found example values, display them
  if (exampleFound && Object.keys(exampleValues).length > 0) {
    // Try to determine example index from scenario execution order
    // This is a rough estimation based on common patterns
    let exampleIndex = 1;
    let totalExamples = 3; // Default assumption for most scenario outlines
    
    // Try to detect index from email pattern
    if (exampleValues.email) {
      if (exampleValues.email.includes('invalid.email')) exampleIndex = 1;
      else if (exampleValues.email.includes('@example.com') && !exampleValues.email.includes('user@')) exampleIndex = 2;
      else if (exampleValues.email.includes('user@')) exampleIndex = 3;
    }
    
    // Try to detect index from password pattern
    if (exampleValues.password) {
      if (exampleValues.password === 'short') exampleIndex = 1;
      else if (exampleValues.password === 'nodigits') exampleIndex = 2;
      else if (exampleValues.password === '12345678') exampleIndex = 3;
    }
    
    Logger.exampleData(exampleValues, exampleIndex, totalExamples);
  }
  
  Logger.log(`Initializing test environment for scenario: ${scenarioName}`);
  
  try {
    await this.init();
    Logger.success("Test environment initialized successfully");
  } catch (error) {
    Logger.error(`Failed to initialize test environment: ${error}`);
    throw error;
  }
});

After(async function (this: CustomWorld, scenario) {
  const scenarioName = scenario.pickle.name;
  const testResult = scenario.result;
  
  if (testResult?.status === "PASSED") {
    Logger.success(`✨ Scenario completed successfully: ${scenarioName}`);
  } else if (testResult?.status === "FAILED") {
    Logger.error(`💥 Scenario failed: ${scenarioName}`);
    if (testResult.message) {
      Logger.error(`Error details: ${testResult.message}`);
    }
  } else {
    Logger.warning(`⏭️ Scenario skipped: ${scenarioName}`);
  }
  
  Logger.log("Cleaning up test environment...");
  
  try {
    await this.destroy();
    Logger.success("Test environment cleaned up successfully");
  } catch (error) {
    Logger.warning(`Cleanup warning: ${error}`);
  }
  
  Logger.divider();
});

AfterAll(function() {
  Logger.success("🎉 All acceptance tests completed!");
});
