@http_api @cookies
Feature: Using cookies

  Scenario: Request API with cookies enabled
    Given I mock GET http call to https://api.example.com/test with cookies
    And enable cookies
    When I GET https://api.example.com/test
    Then response status should be ok
    And response should have a TestCookie cookie
    And response TestCookie cookie should be secure
    And response TestCookie cookie domain should be api.example.com

  Scenario: Request API with cookies disabled
    Given I mock GET http call to https://api.example.com/test without cookies
    And disable cookies
    When I GET https://api.example.com/test
    Then response status should be ok
    And response should not have a TestCookie cookie

