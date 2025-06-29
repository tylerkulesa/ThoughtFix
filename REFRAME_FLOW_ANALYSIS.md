# ThoughtFix Reframe Flow Analysis & Test Plan

## Code Analysis Results

### ✅ **IMPLEMENTED CORRECTLY**

1. **Input Handling**: Text input accepts multi-line negative thoughts with proper validation
2. **Framework Selection**: Therapeutic framework selector with 9 different approaches
3. **Loading States**: Proper loading spinner with "AI is thinking..." text
4. **OpenAI Integration**: Configured to use GPT-3.5-turbo with framework-specific prompts
5. **Markdown Rendering**: Uses `react-native-markdown-display` for proper formatting
6. **Database Storage**: Saves thoughts to Supabase `thoughts` table
7. **Recent Reframes**: Shows last 3 reframes with scrollable markdown content
8. **Usage Limits**: Free users limited to 3 reframes per week
9. **Responsive Design**: Uses proper flex layouts and ScrollView containers

### ⚠️ **POTENTIAL ISSUES IDENTIFIED**

1. **OpenAI API Key**: Currently using client-side API calls (security risk)
2. **Error Handling**: Limited error recovery options for users
3. **Offline Handling**: No offline state management
4. **Long Response Handling**: Fixed height container (200px) may truncate responses
5. **Gender Integration**: Code references gender but current flow doesn't collect it
6. **Framework Persistence**: User's framework preference not saved to database

### 🔧 **IMPROVEMENTS NEEDED**

1. **Security**: Move OpenAI calls to Supabase Edge Function
2. **UI Polish**: Add "Reframe Another" button after successful response
3. **Better Error States**: More specific error messages and retry options
4. **Response Formatting**: Ensure consistent markdown rendering across devices

## Comprehensive Test Plan

### **Test 1: Basic Reframe Flow**
**Objective**: Verify core functionality works end-to-end

**Steps**:
1. Open app and navigate to main reframe screen
2. Enter negative thought: "I'm terrible at everything I do"
3. Select therapeutic framework (default CBT)
4. Tap "Reframe Thought" button
5. Observe loading state
6. Wait for AI response
7. Verify response appears with markdown formatting
8. Check "Recent Reframes" section updates

**Expected Results**:
- Input accepted without formatting issues
- Loading spinner appears with "AI is thinking..." text
- Response renders with proper markdown (bold text, etc.)
- Reframed thought appears at end in bold
- New entry appears in Recent Reframes
- No console errors

### **Test 2: Framework Selection**
**Objective**: Test different therapeutic approaches

**Steps**:
1. Enter same negative thought
2. Change framework to "Mindfulness-Based"
3. Generate reframe
4. Compare response style to CBT
5. Test 2-3 additional frameworks

**Expected Results**:
- Different frameworks produce different response styles
- Framework selection persists during session
- All frameworks generate appropriate responses

### **Test 3: Usage Limits (Free Users)**
**Objective**: Verify free user limitations work

**Steps**:
1. Generate 3 reframes as free user
2. Attempt 4th reframe
3. Verify premium upgrade modal appears
4. Test "Continue with Free" vs "Upgrade" options

**Expected Results**:
- First 3 reframes work normally
- 4th attempt shows premium modal
- Usage counter updates correctly
- Premium modal functions properly

### **Test 4: Error Handling**
**Objective**: Test various error scenarios

**Steps**:
1. Test with empty input
2. Test with very long input (1000+ characters)
3. Test with special characters/emojis
4. Simulate network failure
5. Test with invalid API key (if possible)

**Expected Results**:
- Empty input shows validation error
- Long input handled gracefully
- Special characters don't break formatting
- Network errors show user-friendly messages
- API errors handled without app crash

### **Test 5: Responsive Design**
**Objective**: Test UI across different screen sizes

**Device Sizes to Test**:
- Small phone (iPhone SE - 375x667)
- Standard phone (iPhone 14 - 390x844)
- Large phone (iPhone 14 Pro Max - 430x932)
- Tablet (iPad - 768x1024)
- Desktop web (1200x800)

**Check Points**:
- Text input scales properly
- Framework selector remains accessible
- Response cards don't overflow
- Buttons remain tappable
- Scrolling works smoothly
- No horizontal scrolling required

### **Test 6: Performance & Memory**
**Objective**: Ensure app performs well under load

**Steps**:
1. Generate 10+ reframes in succession
2. Monitor memory usage
3. Test scrolling performance in Recent Reframes
4. Test app backgrounding/foregrounding
5. Check for memory leaks

**Expected Results**:
- Smooth performance throughout
- Memory usage remains stable
- No crashes or freezes
- App resumes properly from background

### **Test 7: Data Persistence**
**Objective**: Verify data saves correctly

**Steps**:
1. Generate several reframes
2. Close and reopen app
3. Check Recent Reframes section
4. Verify data in Supabase dashboard
5. Test with poor network conditions

**Expected Results**:
- Reframes persist between sessions
- Data appears in Supabase database
- Offline reframes sync when connection restored

## Critical Test Scenarios

### **Scenario A: New User First Experience**
1. Fresh app install
2. Complete onboarding
3. Generate first reframe
4. Verify smooth experience

### **Scenario B: Heavy Usage Session**
1. Generate multiple reframes
2. Switch between frameworks
3. Test premium upgrade flow
4. Verify performance remains good

### **Scenario C: Edge Cases**
1. Very short input ("sad")
2. Very long input (paragraph)
3. Non-English characters
4. Emoji-heavy input
5. Network interruptions

## Success Criteria

### **PASS Requirements**:
- ✅ All basic functionality works without errors
- ✅ UI remains responsive on all tested devices
- ✅ Data saves correctly to database
- ✅ Error states provide helpful feedback
- ✅ Loading states appear appropriately
- ✅ Markdown formatting renders correctly
- ✅ No console errors during normal usage

### **FAIL Conditions**:
- ❌ App crashes during reframe generation
- ❌ Responses don't render or appear corrupted
- ❌ Data doesn't save to database
- ❌ UI breaks on any tested device size
- ❌ Critical errors appear in console
- ❌ Users can't complete basic reframe flow

## Recommended Testing Order

1. **Basic Flow Test** (most critical)
2. **Responsive Design Test** (UI/UX critical)
3. **Error Handling Test** (stability)
4. **Framework Selection Test** (feature completeness)
5. **Usage Limits Test** (business logic)
6. **Performance Test** (optimization)
7. **Data Persistence Test** (reliability)

## Post-Test Action Items

After completing tests, prioritize fixes in this order:
1. Any crash-causing bugs (P0)
2. Core flow blocking issues (P1)
3. UI/responsive design problems (P2)
4. Performance optimizations (P3)
5. Nice-to-have improvements (P4)

## Notes for Manual Testing

- Test on both iOS and Android if possible
- Use real devices when available (not just simulators)
- Test with different network conditions (WiFi, cellular, poor signal)
- Clear app data between major test scenarios
- Document any unexpected behaviors with screenshots
- Pay attention to accessibility (text size, contrast, touch targets)