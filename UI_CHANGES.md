# UI Changes for GenAI-Driven Provider Matching

## Summary of Changes

### 1. Simplified Search Form
- **Prompt is now the primary input** - Large textarea at the top with helpful placeholder
- **Removed complex controls** - Eliminated `residential_mode` and `national_for_residential` toggles
- **Kept essentials** - Only postcode, radius, and the free-text prompt
- **Better user guidance** - Enhanced help text explaining what to include in prompts

### 2. Match Explanation Display

#### Before
- Basic badges (S41 Approved, Specialist College)
- Generic "Why it matches" text
- No indication of what system understood from user input

#### After
- **Match Reasons Badges** - Blue badges showing specific match criteria
  - Example: "Residential requested", "Vocational: Catering/Hospitality", "FE provider"
- **Inferred Intent Section** - New dedicated section showing:
  - Residential preference (Must, Prefer, Exclude, Any)
  - Vocational interests (e.g., "hospitality catering", "it computing")
  - SEND needs detected (e.g., "autism", "adhd")
  - Target settings (e.g., "FE college", "training provider")
- **Enhanced Why It Matches** - More specific, actionable reasons

### 3. API Integration Changes

#### Request Changes
```javascript
// Before
url.searchParams.set("residential_mode", resMode);
url.searchParams.set("national_for_residential", String(resNational));
url.searchParams.set("target_count", "10");

// After
url.searchParams.set("target_count", "20");
// Prompt is the main parameter for GenAI matching
if (prompt.trim()) {
  url.searchParams.set("prompt", prompt);
}
```

#### Response Handling
```javascript
// Before
const allDossiers = [
  ...(data.instant_dossiers || []),
  ...(data.residential_results || []),
];

// After
const allDossiers = data.providers || [];
```

## Visual Changes

### Search Form (Before)
- Multiple toggles and dropdowns
- Residential mode selector (Exclude/Include/Only)
- National residential checkbox
- Prompt was secondary input

### Search Form (After)
- Clean, focused interface
- Large prompt textarea as primary input
- Simple postcode and radius controls
- No complex residential options

### Provider Details (New Features)

1. **Match Reasons Badges**
   ```
   [Residential requested] [Vocational: Catering] [FE provider] [Autism support]
   ```

2. **Inferred Intent Section**
   ```
   What we understood from your search
   ┌─────────────────────────────────────────────┐
   │ Residential: Must                            │
   │ Vocational interests: hospitality catering   │
   │ SEND needs: autism                           │
   │ Looking for: FE college, training provider   │
   └─────────────────────────────────────────────┘
   ```

3. **Enhanced Match Explanations**
   - More specific reasons based on inferred intent
   - Directly tied to user's prompt
   - Actionable information

## User Experience Improvements

### Before
1. User had to navigate multiple controls
2. Uncertain how to specify vocational interests
3. Residential options were confusing (mode vs national)
4. Unclear why results were ranked in a certain order

### After
1. User describes needs in natural language
2. System extracts and displays what it understood
3. Results show specific reasons for matching
4. Clear connection between prompt and results

## Example User Journey

1. **User enters prompt**: "I want to do catering at a residential college with autism support"

2. **System shows**:
   - Top results: Residential FE colleges with catering programs
   - Match badges: [Residential requested] [Vocational: Hospitality & Catering] [Autism support]
   - Inferred intent clearly displayed

3. **User can verify**:
   - Did system understand correctly?
   - Why is each college recommended?
   - What specific features match their needs?

## Technical Implementation

### Files Modified
1. `src/App.jsx`
   - Removed state variables: `resMode`, `resNational`
   - Updated `loadInstant()` to send simplified parameters
   - Updated UI to show prompt as primary input
   - Removed residential mode controls

2. `src/components/InstantDossierPanel.jsx`
   - Added display for `match_reasons` badges
   - Added new "Inferred Intent" section
   - Updated "Why it matches" description

### Files Created
1. `API_INTEGRATION.md` - Comprehensive API documentation
2. `README.md` - Updated with new features
3. `UI_CHANGES.md` - This file

### Environment Configuration
- Already uses `VITE_API_BASE` from environment
- No hardcoded ports in the codebase
- Works with any backend URL via `.env` file

## Screenshots

See PR description for screenshots showing:
1. Initial clean UI state
2. Prompt filled with example query
3. (Will be added) Results with match reasons and inferred intent

## Backend Integration Required

The frontend expects the backend API to:
1. Accept `prompt` parameter for GenAI intent extraction
2. Return `providers` array (not separate instant/residential arrays)
3. Include `match_reasons` array per provider
4. Include `inferred_intent` object (optional but recommended)
5. Exclude schools by default, prioritize FE colleges and training providers

See `API_INTEGRATION.md` for full API specification.
