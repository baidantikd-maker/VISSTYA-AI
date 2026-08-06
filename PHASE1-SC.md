Phase 1 Success Criteria (Refined)
1. Metadata Analysis (15%)

Success Criteria

Extract real EXIF metadata where available.
Detect:
Capture timestamp
GPS coordinates
Camera make/model
Resolution
File format
Gracefully handle files with missing metadata.
Generate a metadata consistency score based on:
Presence of metadata
Internal consistency
Metadata completeness
Do not increase/decrease score based solely on whether the input is a URL or uploaded file.

Output Example

{
  "score": 12,
  "camera": "Canon EOS 90D",
  "gps": "27.7172,85.3240",
  "timestamp": "...",
  "resolution": "4032x3024",
  "issues": []
}
2. Vision Analysis (25%)

Success Criteria

Analyze uploaded image or sampled video frames.
Compare media contents with the user-entered claim.
Detect:
Scene
Objects
Weather cues
Time of day
Visible text (OCR if available)
Detect possible manipulation/artifacts when feasible.
Calculate a confidence score.
Return a claim consistency score.
For videos, mention temporal consistency based on sampled frames.
3. Weather Verification (25%)

Success Criteria

Convert location → latitude/longitude.
Fetch historical weather using the entered date.
Compare:
Vision weather cues
Historical weather
User claim
Never return hardcoded weather values.
Explain mismatches.
4. Evidence Corroboration (35%)

Success Criteria

Search trusted sources only.
Return:
Supporting sources
Conflicting sources
Publication dates
URLs
Produce a verdict such as:
Supported
Partially Supported
Conflicting
No Evidence
Never return fixed scores or hardcoded results.
5. Upload Support

Success Criteria

Support both:

Local file upload
Public media URL

Both inputs must execute the same backend verification pipeline.

The frontend should display:

Preview
Upload status
Final verification report
6. Trust Engine

Weights remain:

Module	Weight
Metadata	15
Vision	25
Weather	25
Evidence	35

Requirements:

Final score is always out of 100.
Display module-wise scores.
Display overall score.
Display badge.

Example:

Metadata: 13/15

Vision: 21/25

Weather: 19/25

Evidence: 31/35

Total: 84/100

Badge: Verified
7. AI Summary

The summary must explain:

Strongest supporting evidence.
Weakest evidence.
Conflicts.
Final reasoning.

Not just

"This image appears authentic."

Instead something like:

"The uploaded image is largely consistent with the reported flood in Shimla. Historical weather records indicate heavy rainfall on the claimed date, and multiple trusted sources reported the same event. Metadata appears internally consistent, although GPS information is absent, reducing confidence slightly."