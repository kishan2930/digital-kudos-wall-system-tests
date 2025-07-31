Feature: User Login
  As a registered user
  I want to log in to the Digital Kudos Wall
  So that I can view and give kudos to my colleagues

  Rule: Users must provide valid credentials to log in

    Background:
      Given the login service is available

    @ui
    Scenario: Successful login with valid credentials
      # Given a user exists with email "user@example.com" and password "SecurePass1!"
      When the user logs in with:
        | Email             | Password     |
        | teamlead@test.com | teamlead@123 |
      Then the login should be successful
      And the user should be redirected to the kudos wall

    @ui
    Scenario: Login attempt with incorrect credentials
      When the user logs in with:
        | Email             | Password    |
        | teamlead@test.com | WrongPass1! |
      Then the login should be rejected
      And the login error should be "Invalid email or password"

    @ui
    Scenario: Login attempt with non-existent email
      When the user logs in with:
        | Email                | Password     |
        | nonexistent@test.com | SecurePass1! |
      Then the login should be rejected
      And the login error should be "Invalid email or password"
