# Phase 1 Backend Verification TODO

## Goal
Build a backend agent that accepts video/photo uploads or media URLs and executes a verification pipeline for:
- metadata consistency
- visual content validation against date/time/place/claim
- historical weather verification
- evidence corroboration
- final trust score, badge, summary

## Existing files and reuse decisions

### `verification.ts`
- Central orchestrator for the verification pipeline.
- Useful: overall module structure, types, `runTrustEngine()`, summary generation, and module outputs.
- Replace/Rewrite: `analyzeMetadata()` is too shallow and mocked, so implement actual metadata extraction.
- Keep and improve: `analyzeVision()` is directly useful because it relies on `gemini.ts`.
- Keep skeleton: `analyzeWeather()` and `analyzeEvidence()` are placeholders; keep structure but implement real verification logic.
- Keep: `VerificationInput`, `ModuleFindings`, `VerificationResult`, and pipeline orchestration.

### `gemini.ts`
- Useful: real media vision analysis integration, file upload handling, response parsing.
- Keep: direct reuse for vision module.
- Note: requires `ENV.geminiApiKey` and may need a local `env.ts` or environment loader.

### `mediaBytes.ts`
- Useful: shared media download utility with retry and MIME detection.
- Keep: reusable for metadata and vision modules.

### `scoring.ts`
- Useful: scoring caps, normalization, final trust label logic.
- Keep: reuse scoring logic and threshold config.

### `llm.ts`
- Optional usefulness: generic LLM wrapper for summaries or advanced analysis.
- Not essential for Phase 1 unless we want AI-generated summaries beyond Gemini output.
- Keep as a helper module for later but do not integrate it yet.

## Missing infrastructure
- There is no `env.ts` or config file in the current workspace.
- Need a simple environment loader or config file for API keys:
  - `GEMINI_API_KEY`
  - optional `OPENWEATHER_API_KEY`
  - optional `FORGE_API_KEY`

## Module-by-module plan

### 1. Metadata Analysis
- Implement proper metadata extraction for images and videos.
- Use `mediaBytes.ts` for downloads.
- Validate EXIF fields, timestamps, geolocation, file format, and MIME consistency.
- Return structured findings and a reliability score.
- Replace placeholder logic in `verification.ts`.

### 2. Vision Analysis
- Reuse `gemini.ts` for media analysis.
- Ensure `analyzeVision()` sends claim/date/location context to Gemini.
- Parse and normalize returned analysis.
- Keep this module largely as-is.

### 3. Weather Verification
- Implement real historical weather lookup by geocoding the claimed location.
- Use a weather API or fallback stub only if API key unavailable.
- Compare vision weather cues with actual weather conditions.
- Keep the module interface and replace the mocked internals.

### 4. Evidence Corroboration
- Replace the mocked news score logic with a real evidence lookup approach.
- Integrate with a news/fact-check API or search engine if possible.
- Keep the current function shape and score model.

### 5. Trust Engine
- Reuse `runTrustEngine()` and module orchestration.
- Keep `computeTotalWeighted()` and summary generation.
- Refine summary and badge text based on real module outputs.

## Recommended next step
- Create `env.ts` or environment loader.
- Start by rebuilding `analyzeMetadata()` in `verification.ts` with a true metadata module.
- Then implement `analyzeVision()` verification wiring, followed by weather and evidence.

## Notes
- No frontend files exist here, so the backend-only focus is already satisfied.
- The current codebase is lightweight and mostly reusable, but several modules are stubs.
- Phase 1 should keep the existing pipeline design and replace placeholder behavior with real verification logic.
