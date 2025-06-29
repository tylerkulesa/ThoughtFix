# Error Recovery Testing Plan for ThoughtFix Reframe Feature

## Overview
This document outlines comprehensive testing procedures for error recovery scenarios in the ThoughtFix reframe feature. The goal is to ensure the app handles errors gracefully and provides users with clear recovery options.

## Test Environment Setup

### Prerequisites
- ThoughtFix app running in development mode
- Access to network controls (WiFi/cellular)
- Browser developer tools (for web testing)
- Ability to modify environment variables (for API testing)

### Test Data
- **Valid thoughts**: "I'm terrible at everything", "Nobody likes me", "I'll never succeed"
- **Invalid inputs**: Empty string, single character "a", 1000+ character text
- **Special characters**: Emojis, Unicode, HTML tags, SQL injection attempts

## Test Scenarios

### 1. Network Error Testing

#### 1.1 Complete Network Disconnection
**Steps:**
1. Open ThoughtFix app
2. Enter valid thought: "I'm terrible at presentations"
3. Disconnect from WiFi/cellular completely
4. Tap "Reframe Thought" button
5. Observe error handling

**Expected Results:**
- ✅ Error message: "No internet connection. Please check your network and try again."
- ✅ Retry button appears with refresh icon
- ✅ Network status indicator shows offline state (red WiFi icon)
- ✅ App doesn't crash or freeze
- ✅ User can dismiss error or retry

**Recovery Test:**
1. Reconnect to network
2. Tap retry button
3. Verify reframe completes successfully

#### 1.2 Intermittent Network Issues
**Steps:**
1. Start reframe process
2. Disconnect network mid-request
3. Reconnect after 2-3 seconds
4. Observe behavior

**Expected Results:**
- ✅ Request fails gracefully
- ✅ Appropriate timeout error message
- ✅ Retry option available

#### 1.3 Slow Network Simulation
**Steps:**
1. Throttle network to slow 3G speeds
2. Submit reframe request
3. Observe loading states and timeouts

**Expected Results:**
- ✅ Loading spinner remains active
- ✅ Request eventually completes or times out appropriately
- ✅ No UI freezing during slow requests

### 2. Input Validation Testing

#### 2.1 Empty Input
**Steps:**
1. Leave thought input completely empty
2. Tap "Reframe Thought" button

**Expected Results:**
- ✅ Error message: "Please enter a thought to reframe."
- ✅ Input field highlights with red border
- ✅ Button remains disabled until valid input entered
- ✅ Error clears when user starts typing

#### 2.2 Minimal Input
**Steps:**
1. Enter single character: "a"
2. Tap "Reframe Thought" button

**Expected Results:**
- ✅ Error message: "Please enter a more detailed thought (at least 3 characters)."
- ✅ Character counter shows 1/1000
- ✅ Clear guidance on minimum requirements

#### 2.3 Maximum Length Input
**Steps:**
1. Enter 1001+ characters of text
2. Attempt to submit

**Expected Results:**
- ✅ Input limited to 1000 characters
- ✅ Character counter shows 1000/1000
- ✅ Error message: "Please keep your thought under 1000 characters."

#### 2.4 Special Characters
**Steps:**
1. Enter text with emojis: "I'm so sad 😢😭💔"
2. Enter HTML: "<script>alert('test')</script>"
3. Enter Unicode: "Iñtërnâtiônàlizætiøn"

**Expected Results:**
- ✅ All inputs accepted and processed safely
- ✅ No script execution or XSS vulnerabilities
- ✅ Unicode characters handled correctly

### 3. API Error Testing

#### 3.1 Invalid API Key
**Steps:**
1. Temporarily modify OpenAI API key to invalid value
2. Submit reframe request
3. Observe error handling

**Expected Results:**
- ✅ Error message: "AI service configuration error. Please contact support."
- ✅ No API key exposed in error messages
- ✅ Retry option available
- ✅ Graceful degradation

#### 3.2 Rate Limiting
**Steps:**
1. Submit multiple rapid requests to trigger rate limiting
2. Observe rate limit error handling

**Expected Results:**
- ✅ Error message: "Too many requests. Please wait a moment and try again."
- ✅ Retry button with appropriate delay
- ✅ Clear guidance on when to retry

#### 3.3 API Service Unavailable
**Steps:**
1. Simulate API endpoint returning 500/503 errors
2. Submit reframe request

**Expected Results:**
- ✅ Error message: "AI service temporarily unavailable. Please try again."
- ✅ Retry mechanism available
- ✅ No app crash

### 4. Database Error Testing

#### 4.1 Supabase Connection Issues
**Steps:**
1. Temporarily break Supabase connection
2. Submit successful reframe (AI works, DB fails)
3. Observe behavior

**Expected Results:**
- ✅ Reframe displays successfully to user
- ✅ Warning about saving: "Reframe generated but not saved. Please try again to save."
- ✅ Option to retry saving
- ✅ Reframe remains visible even if save fails

#### 4.2 Authentication Issues
**Steps:**
1. Simulate expired auth token
2. Attempt to save reframe

**Expected Results:**
- ✅ Appropriate authentication error
- ✅ Option to re-authenticate
- ✅ Data preservation during auth flow

### 5. Usage Limit Testing

#### 5.1 Free User Limit Reached
**Steps:**
1. Use all 3 free reframes for the week
2. Attempt 4th reframe

**Expected Results:**
- ✅ Premium upgrade modal appears
- ✅ Clear explanation of limits
- ✅ Options to upgrade or wait for reset
- ✅ No confusing error messages

#### 5.2 Premium User Verification
**Steps:**
1. Test with premium user account
2. Verify unlimited usage

**Expected Results:**
- ✅ No usage limits enforced
- ✅ No upgrade prompts shown

### 6. UI/UX Error Recovery

#### 6.1 Error Message Clarity
**Criteria:**
- ✅ All error messages use plain language
- ✅ Specific actions users can take
- ✅ No technical jargon or error codes
- ✅ Appropriate tone (helpful, not blaming)

#### 6.2 Recovery Options
**Criteria:**
- ✅ Every error provides clear next steps
- ✅ Retry buttons work correctly
- ✅ Users can dismiss errors easily
- ✅ Multiple recovery paths when appropriate

#### 6.3 State Preservation
**Criteria:**
- ✅ User input preserved during errors
- ✅ Framework selection maintained
- ✅ Previous reframes remain visible
- ✅ No data loss during error states

## Testing Checklist

### Pre-Test Setup
- [ ] App running in development mode
- [ ] Network controls available
- [ ] Test data prepared
- [ ] Error logging enabled

### Network Error Tests
- [ ] Complete disconnection test
- [ ] Intermittent network test
- [ ] Slow network test
- [ ] Recovery after reconnection

### Input Validation Tests
- [ ] Empty input test
- [ ] Minimal input test
- [ ] Maximum length test
- [ ] Special characters test

### API Error Tests
- [ ] Invalid API key test
- [ ] Rate limiting test
- [ ] Service unavailable test

### Database Error Tests
- [ ] Connection failure test
- [ ] Authentication error test

### Usage Limit Tests
- [ ] Free user limit test
- [ ] Premium user verification

### UI/UX Tests
- [ ] Error message clarity
- [ ] Recovery options functionality
- [ ] State preservation verification

## Success Criteria

### Must Pass (P0)
- ✅ App never crashes due to errors
- ✅ All errors show user-friendly messages
- ✅ Users can always recover from errors
- ✅ No data loss during error states
- ✅ Network status clearly indicated

### Should Pass (P1)
- ✅ Specific error messages for different scenarios
- ✅ Multiple recovery options where appropriate
- ✅ Retry mechanisms work correctly
- ✅ Input validation prevents bad requests

### Nice to Have (P2)
- ✅ Offline mode with queued requests
- ✅ Progressive error recovery
- ✅ Error analytics and reporting

## Bug Reporting Template

```
**Error Type:** [Network/API/Database/Validation/UI]
**Severity:** [Critical/High/Medium/Low]
**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
**Actual Behavior:**
**Error Message Shown:**
**Recovery Options Available:**
**Device/Browser:**
**Network Conditions:**
**Screenshots/Logs:**
```

## Post-Test Actions

### If Tests Pass
- [ ] Document successful error handling
- [ ] Note any improvements for future versions
- [ ] Update user documentation if needed

### If Tests Fail
- [ ] Log all failures with detailed reproduction steps
- [ ] Prioritize fixes based on severity
- [ ] Implement fixes and retest
- [ ] Update error handling documentation

## Development Testing Features

The updated app includes several testing features for development:

1. **Network Status Indicator**: Shows online/offline state in header
2. **Test Network Error Button**: Simulates network failures (dev mode only)
3. **Retry Counters**: Shows how many times user has retried
4. **Enhanced Error Messages**: Specific messages for different error types
5. **Character Counter**: Helps users stay within limits
6. **Input Validation**: Real-time feedback on input issues

## Conclusion

This comprehensive error recovery testing ensures ThoughtFix provides a robust, user-friendly experience even when things go wrong. The app should gracefully handle all error scenarios while providing clear paths for users to recover and continue using the service.