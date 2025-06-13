import { TestType, TestDriver, isValidTestType, isValidTestDriver } from "./test.types";

type FeatureTag = `@${TestType}` | `@${TestDriver}`;

export const validateFeatureTags = (tags: string[]): FeatureTag[] => {
  const invalidTags = tags.filter((tag) => {
    const tagName = tag.startsWith("@") ? tag.substring(1) : tag;
    return !isValidTestType(tagName) && !isValidTestDriver(tagName);
  });

  if (invalidTags.length > 0) {
    throw new Error(
      `Invalid tags found: ${invalidTags.join(", ")}. Valid tags are: @e2e, @smoke, @acceptance, @ui, @api`
    );
  }

  return tags as FeatureTag[];
};

// Example usage in a feature file:
/*
Feature: Property Search
  @e2e @ui
  Scenario: Basic property search
    Given I am on the property search page
    When I search for properties in "Richmond"
    Then I should see a list of properties
*/
