# Standard Operating Procedure: Smoke Tests

**Status:** Mandatory  
**Version:** 1.0  
**Date:** {{CURRENT_DATE}}

## Purpose

This Standard Operating Procedure (SOP) defines the non-negotiable standards for implementing smoke tests in the Digital Kudos Wall project. These tests verify that the system is up and running correctly after deployment, providing quick feedback before running more comprehensive test suites.

## Scope

This SOP applies to all smoke tests implemented in the `digital-kudos-wall-system-tests` repository. These tests are executed in both Acceptance and E2E environments.

## Non-Negotiable Standards

### 1. Test Coverage Requirements

Smoke tests MUST:

- Verify core system availability
- Be minimal and focused
- Complete within 2-3 minutes maximum
- Cover only critical paths
- Run before acceptance and E2E tests

Critical paths that MUST be tested:

1. Application startup and health check
2. Main page loading
3. Basic authentication flow
4. Core API endpoints health
5. External system connectivity checks

### 2. Test Implementation

#### Test Structure

```typescript
export class SystemHealthSmokeTest {
  constructor(private readonly healthDriver: HealthCheckDriver, private readonly authDriver: AuthenticationDriver) {}

  async verifySystemHealth(): Promise<void> {
    // Health check
    await this.healthDriver.checkSystemHealth();

    // Auth check
    await this.authDriver.verifyAuthFlow();
  }
}
```

#### Driver Layer Interface

```typescript
export interface HealthCheckDriver {
  checkSystemHealth(): Promise<void>;
  checkDatabaseConnection(): Promise<void>;
  checkExternalServices(): Promise<void>;
}

export interface AuthenticationDriver {
  verifyAuthFlow(): Promise<void>;
  checkLoginPage(): Promise<void>;
  checkRegistrationPage(): Promise<void>;
}
```

### 3. Environment-Specific Requirements

#### Acceptance Environment

- MUST use external system stubs
- MUST verify stub availability
- MUST check configuration
- MUST validate environment variables

#### E2E Environment

- MUST use external system test instances
- MUST verify test instance health
- MUST validate connectivity
- MUST check environment configuration

### 4. Test Organization

#### Directory Structure

```
src/
  └── smoke/
      ├── drivers/
      │   ├── health.driver.ts
      │   └── auth.driver.ts
      ├── tests/
      │   ├── system-health.smoke.ts
      │   └── auth-flow.smoke.ts
      └── config/
          └── smoke.config.ts
```

### 5. Implementation Standards

#### Health Checks

- MUST implement timeout handling
- MUST provide clear error messages
- MUST log diagnostic information
- MUST verify all critical subsystems
- MUST be idempotent

Example:

```typescript
export class HealthCheckImplementation implements HealthCheckDriver {
  async checkSystemHealth(): Promise<void> {
    try {
      await this.checkWebServer();
      await this.checkDatabaseConnection();
      await this.checkExternalServices();
    } catch (error) {
      throw new SmokeTestError("System health check failed", {
        cause: error,
        diagnostics: await this.gatherDiagnostics(),
      });
    }
  }
}
```

#### Authentication Flow

- MUST verify login accessibility
- MUST check registration flow
- MUST validate session handling
- MUST test basic permissions
- MUST handle cleanup

### 6. Configuration Management

#### Environment Configuration

```typescript
export const SMOKE_CONFIG = {
  timeouts: {
    healthCheck: 30000,
    authFlow: 45000,
    apiCheck: 15000,
  },
  retries: {
    maxAttempts: 3,
    backoffMs: 1000,
  },
  endpoints: {
    health: "/health",
    auth: "/auth",
    api: "/api",
  },
};
```

### 7. Error Handling and Reporting

Error handling MUST:

- Provide clear failure messages
- Include diagnostic information
- Log relevant context
- Support debugging
- Handle timeouts gracefully

Example:

```typescript
export class SmokeTestError extends Error {
  constructor(
    message: string,
    public readonly details: {
      cause: Error;
      diagnostics: DiagnosticInfo;
    }
  ) {
    super(message);
    this.name = "SmokeTestError";
  }
}
```

## Execution Requirements

Smoke tests MUST:

1. Run first in the pipeline
2. Block subsequent test execution on failure
3. Complete within defined timeout
4. Run in all environments
5. Provide immediate feedback

## Review Process

All smoke tests MUST be reviewed for:

1. Minimal and focused scope
2. Quick execution time
3. Critical path coverage
4. Error handling
5. Clear diagnostics

## References

1. [Smoke Tests - Optivem Journal](https://journal.optivem.com/p/smoke-tests)
2. Clean Architecture principles
3. Continuous Deployment best practices
4. System reliability engineering practices
5. Test automation patterns
