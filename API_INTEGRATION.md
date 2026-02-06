# API Integration for GenAI-Driven Provider Matching

## Overview
This document describes the API format expected by the frontend for the GenAI-driven provider matching feature.

## Endpoint: `/instant`

### Request Parameters
- `postcode` (string, required): UK postcode for location-based search
- `radius_miles` (number, required): Search radius in miles
- `target_count` (number, optional): Maximum number of results to return (default: 20)
- `prompt` (string, optional): Free-text description of what the user is looking for

### Response Format

```json
{
  "providers": [
    {
      "provider": {
        "provider_id": "string",
        "name": "string",
        "website": "string",
        "email": "string",
        "phone": "string",
        "address": "string",
        "postcode": "string",
        "provider_type": "FE_COLLEGE | TRAINING_PROVIDER | SIXTH_FORM | SCHOOL",
        "is_residential": 0 | 1,
        "is_specialist": 0 | 1,
        "s41_approved": 0 | 1
      },
      "score": 0.0,
      "distance_miles": 0.0,
      "match_reasons": [
        "Residential requested",
        "Vocational: Catering/Hospitality",
        "FE provider",
        "SEND specialist"
      ],
      "inferred_intent": {
        "target_settings": ["FE_COLLEGE", "TRAINING_PROVIDER"],
        "residential": "must" | "prefer" | "exclude" | "any",
        "vocational_areas": ["hospitality_catering", "it_computing"],
        "send_needs": ["autism", "adhd", "literacy"],
        "support_needs_free_text": "string",
        "confidence": 0.0,
        "notes": "string"
      },
      "quick_summary": "string",
      "why_it_matches": [
        "This provider offers residential placements",
        "Specializes in vocational training including catering",
        "Has dedicated autism support services"
      ],
      "badges": ["S41 Approved", "Specialist College"],
      "key_links": [
        {
          "label": "Main Website",
          "url": "https://example.com"
        }
      ],
      "who_to_contact": [
        {
          "role": "SEND Coordinator",
          "suggestion": "Contact for autism support information"
        }
      ],
      "open_days_hint": {
        "link": "https://example.com/open-days"
      }
    }
  ]
}
```

## Key Changes from Previous API Format

### 1. Simplified Request Parameters
- Removed `residential_mode` (now inferred from prompt)
- Removed `national_for_residential` (now handled by backend logic)
- Increased `target_count` from 10 to 20 for better results

### 2. New Response Fields

#### `match_reasons` (array of strings)
- Displayed as blue badges in the UI
- Examples: "Residential requested", "Vocational: Catering/Hospitality", "FE provider"
- Should be concise, user-friendly explanations

#### `inferred_intent` (object, optional)
- Displayed in a dedicated section showing what the system understood
- Fields are displayed with friendly formatting (underscores replaced with spaces)
- Helps users understand what the system extracted from their prompt

### 3. Provider Type Filtering
- Frontend expects backend to exclude `SCHOOL` type by default
- Should prioritize `FE_COLLEGE` and `TRAINING_PROVIDER`
- Backend should normalize provider_type values if inconsistent in DB

## Display Logic

### Match Reasons Badges
- Displayed at the top of the provider card
- Blue background (#E0F2FE) with blue text (#1E40AF)
- Visible immediately when viewing provider details

### Inferred Intent Section
- Only shown if `inferred_intent` object is present
- Displayed after the "Short overview" section
- Shows in a light gray box with formatted labels:
  - **Residential**: Capitalize value (e.g., "Must", "Prefer")
  - **Vocational interests**: Join array with commas, replace underscores with spaces
  - **SEND needs**: Join array with commas, replace underscores with spaces
  - **Looking for**: Join target_settings with commas, replace underscores with spaces

### Why It Matches
- Uses existing `why_it_matches` array
- Displayed as bullet points
- Should provide specific, actionable reasons

## Example Prompt → Response

**User Prompt:**
> "I want to do catering at a residential college with autism support"

**Expected Response:**
```json
{
  "providers": [
    {
      "provider": { ... },
      "score": 0.95,
      "distance_miles": 12.5,
      "match_reasons": [
        "Residential requested",
        "Vocational: Hospitality & Catering",
        "FE College",
        "SEND specialist",
        "Autism support"
      ],
      "inferred_intent": {
        "residential": "must",
        "vocational_areas": ["hospitality_catering"],
        "send_needs": ["autism"],
        "target_settings": ["FE_COLLEGE"],
        "confidence": 0.92
      },
      "why_it_matches": [
        "This college offers residential accommodation on-site",
        "Runs a Level 2 Hospitality & Catering vocational program",
        "Has a dedicated autism support team and quiet study spaces",
        "Rated 'Outstanding' for learner support by Ofsted"
      ]
    }
  ]
}
```

## Environment Configuration

### `.env` file
```
VITE_API_BASE=http://localhost:8000
```

The frontend will use `VITE_API_BASE` environment variable to determine the API base URL. There are no hardcoded port numbers in the frontend code.

## Testing

1. Ensure backend is running and accessible via `VITE_API_BASE`
2. Frontend will send GET request to `${VITE_API_BASE}/instant?postcode=...&radius_miles=...&target_count=...&prompt=...`
3. Response should match the format described above
4. Match reasons and inferred intent will be displayed automatically if present in response

## Error Handling

If the API call fails:
- Error is logged to console
- Provider list remains empty
- User sees "No providers yet — run a search" message
