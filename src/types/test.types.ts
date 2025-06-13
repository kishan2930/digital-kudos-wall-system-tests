export const VALID_TEST_TYPES = ["e2e", "smoke", "acceptance"] as const;
export const VALID_TEST_DRIVERS = ["ui", "api"] as const;

export type TestType = (typeof VALID_TEST_TYPES)[number];
export type TestDriver = (typeof VALID_TEST_DRIVERS)[number];

export type TestTag = {
  type: TestType;
  driver: TestDriver;
};

export const createTestTag = (type: TestType, driver: TestDriver): TestTag => ({
  type,
  driver,
});

export const formatTag = (tag: TestTag): string => `@${tag.type}`;

export const formatDriverTag = (tag: TestTag): string => `@${tag.driver}`;

export const isValidTestType = (tag: string): tag is TestType => {
  return VALID_TEST_TYPES.includes(tag as TestType);
};

export const isValidTestDriver = (tag: string): tag is TestDriver => {
  return VALID_TEST_DRIVERS.includes(tag as TestDriver);
};

export const parseTag = (tag: string): TestTag | null => {
  const tagName = tag.startsWith("@") ? tag.substring(1) : tag;

  if (isValidTestType(tagName)) {
    return { type: tagName, driver: "ui" }; // Default to UI if not specified
  }

  if (isValidTestDriver(tagName)) {
    return { type: "acceptance", driver: tagName }; // Default to acceptance if not specified
  }

  return null;
};
