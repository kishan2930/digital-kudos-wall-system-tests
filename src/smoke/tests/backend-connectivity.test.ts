import { test, expect } from "@playwright/test";
import { CONFIG } from "../../config/test.config";

test.describe("Backend Connectivity Diagnostics", () => {
  test("should verify backend health endpoint is accessible", async ({ request }) => {
    console.log(`Testing backend connectivity to: ${CONFIG.apiUrl}`);

    // Extract base URL without /api/v1
    const baseBackendUrl = CONFIG.apiUrl.replace("/api/v1", "");
    console.log(`Base backend URL: ${baseBackendUrl}`);

    try {
      const response = await request.get(`${baseBackendUrl}/health`);
      console.log(`Health endpoint response status: ${response.status()}`);

      if (response.ok()) {
        const healthData = await response.json();
        console.log(`Health endpoint response:`, healthData);
        expect(response.status()).toBe(200);
      } else {
        const errorText = await response.text();
        console.log(`Health endpoint error response:`, errorText);
        throw new Error(`Health endpoint returned ${response.status()}: ${errorText}`);
      }
    } catch (error) {
      console.error(`Failed to connect to health endpoint:`, error);
      throw error;
    }
  });

  test("should verify backend root endpoint shows environment info", async ({ request }) => {
    const baseBackendUrl = CONFIG.apiUrl.replace("/api/v1", "");
    console.log(`Testing root endpoint: ${baseBackendUrl}/`);

    try {
      const response = await request.get(`${baseBackendUrl}/`);
      console.log(`Root endpoint response status: ${response.status()}`);

      if (response.ok()) {
        const rootData = await response.json();
        console.log(`Root endpoint response:`, rootData);
        expect(response.status()).toBe(200);
      } else {
        const errorText = await response.text();
        console.log(`Root endpoint error response:`, errorText);
        throw new Error(`Root endpoint returned ${response.status()}: ${errorText}`);
      }
    } catch (error) {
      console.error(`Failed to connect to root endpoint:`, error);
      throw error;
    }
  });

  test("should check if test-support endpoints are available", async ({ request }) => {
    console.log(`Testing test-support endpoint: ${CONFIG.apiUrl}/test-support/cleanup`);

    try {
      // Try to access the test-support cleanup endpoint
      const response = await request.delete(`${CONFIG.apiUrl}/test-support/cleanup`);
      console.log(`Test-support cleanup response status: ${response.status()}`);

      if (response.status() === 200 || response.status() === 404) {
        // 200 means it worked, 404 means endpoint exists but no data to clean
        console.log(`Test-support endpoints are accessible`);
        expect([200, 404]).toContain(response.status());
      } else {
        const errorText = await response.text();
        console.log(`Test-support endpoint error response:`, errorText);
        console.log(`This might indicate NODE_ENV is not set to 'uat' or 'test'`);
        throw new Error(`Test-support endpoint returned ${response.status()}: ${errorText}`);
      }
    } catch (error) {
      console.error(`Failed to connect to test-support endpoint:`, error);
      console.error(`This suggests either:`);
      console.error(`1. Backend service is not running on the expected port`);
      console.error(`2. NODE_ENV is not set to 'uat' or 'test'`);
      console.error(`3. Network connectivity issue between test runner and backend`);
      throw error;
    }
  });
});
