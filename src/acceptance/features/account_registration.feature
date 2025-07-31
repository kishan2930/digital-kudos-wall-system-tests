Feature: Account Registration
  As a potential user
  I want to register for a new account
  So that I can access the digital kudos wall system

  Rule: Users must provide valid registration details to create an account

    Background:
      Given the registration service is available

    @ui
    Scenario Outline: Successful registration with valid credentials
      When a user registers with valid details:
        | Name      | Email            | Password     | IsTeamLeader   |
        | Test User | user@example.com | SecurePass1! | <isTeamLeader> |
      Then the registration should be successful
      And a confirmation should be sent to "user@example.com"

      Examples:
        | isTeamLeader |
        | true         |
        | false        |

    @ui
    Scenario: Registration attempt with existing email
      Given a user exists with name "Existing User" and email "existing@example.com"
      When a user registers with details:
        | Name         | Email                | Password     |
        | Another User | existing@example.com | SecurePass1! |
      Then the registration should be rejected
      And the reason should be "User with this email already exists"

  Rule: Email must be in a valid format

    @ui
    Scenario Outline: Registration with invalid email format
      When a user registers with details:
        | Name      | Email   | Password     |
        | Test User | <email> | SecurePass1! |
      Then the registration should be rejected
      And the reason should be "Invalid email format"

      Examples:
        | email         |
        | invalid.email |
        | @example.com  |
        | user@         |

  Rule: Password must meet security requirements

    @ui
    Scenario Outline: Registration with invalid password
      When a user registers with details:
        | Name      | Email            | Password   |
        | Test User | user@example.com | <password> |
      Then the registration should be rejected
      And the reason should be "<error_message>"

      Examples:
        | password | error_message                                        |
        | short    | Password must be at least 8 characters long          |
        | nodigits | Password must contain at least one number            |
        | 12345678 | Password must contain at least one special character |
