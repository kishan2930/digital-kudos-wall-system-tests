import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from "@cucumber/cucumber";
import { CustomWorld } from "./world";
import { Logger } from "./logger";

setDefaultTimeout(60 * 1000); // 60 seconds

// Track scenario outline executions to properly number examples
const scenarioOutlineCounters = new Map<string, number>();

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
  
  // Check if this is truly a scenario outline by looking for specific patterns
  // Scenario outlines typically have "Scenario Outline:" in the original feature file
  // and contain examples that get parameterized
  const isScenarioOutline = scenarioName.includes('invalid email format') || 
                           scenarioName.includes('invalid password') ||
                           (scenario.pickle.steps || []).some(step => 
                             step.text.includes('<') && step.text.includes('>')
                           );
  
  if (isScenarioOutline) {
    const steps = scenario.pickle.steps || [];
    const exampleValues: Record<string, string> = {};
    let exampleFound = false;
    
    steps.forEach(step => {
      // Extract values from data tables
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
      
      // Extract values from step text for scenario outlines
      const stepText = step.text;
      
      // Only extract if step text contains template placeholders or specific values that suggest examples
      if (stepText.includes('<') && stepText.includes('>')) {
        // This step has placeholders, skip it
        return;
      }
      
      // Look for email patterns (but exclude common test emails used in regular scenarios)
      const emailMatch = stepText.match(/([a-zA-Z0-9@._-]+@[a-zA-Z0-9._-]*\.?[a-zA-Z]*)/);
      if (emailMatch && emailMatch[1] && 
          !emailMatch[1].includes('user@example.com') && 
          !emailMatch[1].includes('existing@example.com')) {
        exampleValues['email'] = emailMatch[1];
        exampleFound = true;
      }
      
      // Look for specific passwords that are clearly from examples (not regular test data)
      const passwordMatch = stepText.match(/"([^"]+)"/);
      if (passwordMatch && passwordMatch[1]) {
        const password = passwordMatch[1];
        // Only consider it an example if it's a short/simple password (like from examples)
        if (['short', 'nodigits', '12345678'].includes(password)) {
          exampleValues['password'] = password;
          exampleFound = true;
        }
      }
      
      // Look for error messages that suggest examples
      const errorMatch = stepText.match(/should be "([^"]*(?:must|required|invalid|format|character|number)[^"]*)"/i);
      if (errorMatch && errorMatch[1]) {
        exampleValues['error_message'] = errorMatch[1];
        exampleFound = true;
      }
    });
    
    // Only show example data if we found clear example values
    if (exampleFound && Object.keys(exampleValues).length > 0) {
      // Track this scenario outline's execution count
      const scenarioKey = `${featureName}:${scenarioName}`;
      const currentCount = (scenarioOutlineCounters.get(scenarioKey) || 0) + 1;
      scenarioOutlineCounters.set(scenarioKey, currentCount);
      
      // Determine total examples based on the type of scenario outline
      let totalExamples = 3; // default
      
      if (scenarioName.includes('invalid email format')) {
        totalExamples = 3; // invalid.email, @example.com, user@
      } else if (scenarioName.includes('invalid password')) {
        totalExamples = 3; // short, nodigits, 12345678
      }
      
      Logger.exampleData(exampleValues, currentCount, totalExamples);
    }
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
  // Clear the counters for next test run
  scenarioOutlineCounters.clear();
  Logger.success("🎉 All acceptance tests completed!");
});
